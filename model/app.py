import torch
import numpy as np
from flask import Flask, request, jsonify, send_file
from PIL import Image
import io
import torchvision.transforms as transforms
from skimage.color import rgb2lab, lab2rgb
from model import MainModel

from fastai.vision.learner import create_body
from torchvision.models import resnet18
import torchvision.models as models
from fastai.vision.models.unet import DynamicUnet



import warnings

# Suppress all FutureWarnings
warnings.filterwarnings("ignore", category=FutureWarning)

def build_res_unet(n_input=1, n_output=2, size=256):
    restnet_model=resnet18(weights=models.ResNet18_Weights.DEFAULT)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    body = create_body(restnet_model, n_in=n_input, cut=-2)
    net_G = DynamicUnet(body, n_output, (size, size)).to(device)
    return net_G



netG=build_res_unet()
netG.load_state_dict(torch.load('GeneratorModel.pth'))
netG.eval()


import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

app = Flask(__name__)

# Load the model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model=MainModel(netG)
model.load_state_dict(torch.load('final_model_with_gen.pth'))
model.eval()
model.to(device)

# Function to preprocess the image and convert it to LAB
def preprocess_image(image):  
    # Load the image and convert to RGB
    test_image = Image.open(image).convert("RGB")
    
    # Save original size (for later use in postprocessing)
    original_size = test_image.size  # (width, height)
    
    # Resize image to 256x256 for model input
    test_image = test_image.resize((256, 256), Image.BICUBIC)
    
    # Convert the image to a numpy array
    test_image = np.array(test_image)
    
    # Convert the image to Lab color space
    test_image_lab = rgb2lab(test_image).astype("float32")
    
    # Normalize the Lab channels
    test_image_lab = transforms.ToTensor()(test_image_lab)
    
    # Extract L channel (1st channel) and normalize
    L = test_image_lab[0:1, ...] / 50. - 1.
    
    # Extract a and b channels (2nd and 3rd channels) and normalize
    ab = test_image_lab[1:3, ...] / 110.
    
    # Return L, ab, and original size
    return L, ab, original_size


# Function to postprocess the model output (combine L and predicted ab, convert to RGB)
def postprocess_image(L, ab_pred, original_size):
    # Ensure L and ab_pred are on CPU and remove the batch dimension
    L = L.squeeze(0).cpu().numpy()  # Shape becomes (height, width)
    ab_pred = ab_pred.squeeze(0).cpu().numpy()  # Shape becomes (2, height, width)

    # Normalize L and ab_pred correctly
    L = np.clip(L * 50.0 + 50.0, 0, 100)  # Revert L normalization (from [-1, 1] to [0, 100])
    
    # Revert ab normalization from [-1, 1] to [-110, 110]
    ab_pred = ab_pred * 110.0
    
    # Concatenate the L and ab channels (ab_pred)
    predicted_lab = np.concatenate([L[np.newaxis, :, :], ab_pred], axis=0)  # Shape becomes (3, height, width)

    # Ensure predicted_lab shape is correct (3, height, width)
    if predicted_lab.shape[0] != 3:
        raise ValueError(f"Shape of predicted_lab should be (3, height, width), but got {predicted_lab.shape}")
    
    # Convert the LAB image to RGB (the last transpose is necessary for skimage lab2rgb)
    rgb_image = lab2rgb(predicted_lab.transpose(1, 2, 0))  # Convert LAB to RGB
    
    # Resize the image back to the original size
    rgb_image_resized = np.array(Image.fromarray((rgb_image * 255).astype(np.uint8)).resize(original_size, Image.BICUBIC))
    
    return rgb_image_resized


@app.route('/colorize', methods=['POST'])
def colorize():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file found'}), 400

    # Get the image from the POST request
    file = request.files['image']
    
    # Preprocess the image to get L and ab channels, along with original size
    L, ab, original_size = preprocess_image(file)

    # Predict the ab channels using the model
    with torch.no_grad():
        predicted_ab = model.net_G(L.unsqueeze(0).to(device))

    # Postprocess the result to convert to RGB and resize to original size
    predicted_image_rgb = postprocess_image(L, predicted_ab, original_size)

    # Convert the RGB result to a PIL image
    output_image = Image.fromarray(predicted_image_rgb)

    # Save the output image to a byte buffer
    img_byte_arr = io.BytesIO()
    output_image.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)

    # Return the colorized image as a response
    return send_file(img_byte_arr, mimetype='image/jpeg', as_attachment=True, download_name='colorized_image.jpg')

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0', port=3030)
