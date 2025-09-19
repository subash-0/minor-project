import torch
import numpy as np
from flask import Flask, request, jsonify, send_file
from PIL import Image
import io
import torchvision.transforms as transforms
from skimage.color import rgb2lab, lab2rgb
from model import MainModel
import os
from fastai.vision.learner import create_body
from torchvision.models import resnet18
import torchvision.models as models
from fastai.vision.models.unet import DynamicUnet
import warnings

# Suppress FutureWarnings
warnings.filterwarnings("ignore", category=FutureWarning)

# Device: automatically use GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Build the ResUNet generator
def build_res_unet(n_input=1, n_output=2, size=256):
    restnet_model = resnet18(weights=models.ResNet18_Weights.DEFAULT)
    body = create_body(restnet_model, n_in=n_input, cut=-2)
    net_G = DynamicUnet(body, n_output, (size, size)).to(device)
    return net_G

# Load generator model with CPU compatibility
netG = build_res_unet()
netG.load_state_dict(torch.load('GeneratorModel.pth', map_location=device))
netG.eval()

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

app = Flask(__name__)

# Load the main model with CPU compatibility
model = MainModel(netG)
model.load_state_dict(torch.load('final_model_with_gen.pth', map_location=device))
model.eval()
model.to(device)

# Preprocess image: convert to LAB
def preprocess_image(image):
    img = Image.open(image).convert("RGB")
    original_size = img.size
    img = img.resize((256, 256), Image.BICUBIC)
    img_arr = np.array(img)
    lab_arr = rgb2lab(img_arr).astype("float32")
    lab_tensor = transforms.ToTensor()(lab_arr)
    L = lab_tensor[0:1, ...] / 50. - 1.
    ab = lab_tensor[1:3, ...] / 110.
    return L, ab, original_size

# Postprocess: convert LAB -> RGB
def postprocess_image(L, ab_pred, original_size):
    L = L.squeeze(0).cpu().numpy()
    ab_pred = ab_pred.squeeze(0).cpu().numpy()
    L = np.clip(L * 50. + 50., 0, 100)
    ab_pred = ab_pred * 110.
    lab_out = np.concatenate([L[np.newaxis, :, :], ab_pred], axis=0)
    rgb_image = lab2rgb(lab_out.transpose(1, 2, 0))
    rgb_resized = np.array(Image.fromarray((rgb_image * 255).astype(np.uint8)).resize(original_size, Image.BICUBIC))
    return rgb_resized

# Flask route
@app.route('/colorize', methods=['POST'])
def colorize():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file found'}), 400

    file = request.files['image']
    L, ab, original_size = preprocess_image(file)

    with torch.no_grad():
        predicted_ab = model.net_G(L.unsqueeze(0).to(device))

    predicted_image_rgb = postprocess_image(L, predicted_ab, original_size)
    output_image = Image.fromarray(predicted_image_rgb)

    img_byte_arr = io.BytesIO()
    output_image.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)

    return send_file(img_byte_arr, mimetype='image/jpeg', as_attachment=True, download_name='colorized_image.jpg')

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port,debug=true)
