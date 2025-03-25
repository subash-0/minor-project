# Image Colorization using AI

## Overview
This project focuses on converting black-and-white images into vibrant color using an AI-driven approach. The system utilizes a convolutional neural network (CNN) based autoencoder and a conditional Generative Adversarial Network (cGAN) to generate realistic colorized images.

## Folder Structure
```
minor-project/
│── model/           # Contains AI models and training scripts
│── minor-backend/   # Backend (PHP, MySQL, authentication, and APIs)
│── minor/           # Frontend (React.js, Tailwind CSS, Vite)
```

## Features
- **User Authentication**: Secure login and signup system to record user-specific data.
- **AI Model**: 
  - Encoder: ResNet-based feature extraction.
  - Decoder: Custom-built architecture.
  - cGAN Model: Includes a generator and discriminator for improved colorization quality.
- **Data Processing**: Preprocessing pipeline to handle grayscale image input and prepare it for training.
- **Training & Evaluation**: 
  - Implements an autoencoder and cGAN for colorization.
  - Utilizes Optuna for hyperparameter tuning.
  - Returns both training and testing loss metrics.
- **Storage Management**: Stores both original and colorized images in a database.
  - Automatically deletes grayscale images if an error occurs during colorization.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Vite
- **Backend**: PHP, MySQL
- **AI Frameworks**: PyTorch, scikit-image
- **Authentication**: JWT-based system

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js & npm
- Python (with PyTorch, scikit-image, and Optuna)
- MySQL Database
- PHP (for backend API)

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/image-colorization.git
   cd image-colorization
   ```
2. Install dependencies in each folder:
   ```sh
   cd minor
   npm install
   cd ../minor-backend
   npm install
   ```
3. Start the frontend:
   ```sh
   cd ../minor
   npm run dev
   ```
4. Set up the backend:
   - Configure the `.env` file for database credentials.
   - Start the PHP backend server.
5. Run the AI model:
   ```sh
   cd ../model
   python train.py  # Train the model
   python infer.py --input path/to/image.jpg  # Test colorization
   ```

## Usage
- Users can upload a grayscale image.
- The system processes the image and returns a colorized version.
- Users can download the output or compare with the original.

## Future Enhancements
- Improve the cGAN model for better color accuracy.
- Add real-time image preview during colorization.
- Deploy as a cloud-based web application.

## Contributors
- Subash kumar yadav
- Ritesh sahani
- Md. Astafar Alam
- Reshmi Jha

## Samples
![Project Sample](https://shorturl.at/RApdi)