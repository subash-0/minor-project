import ColorImage from "../models/ColorImage"
import ColorizedImage from "../models/ColorizedImage";
import fs from "fs";
import path from "path";
import { Request, Response } from "express";

import axios from "axios";

export const colorImage = async (req: Request, res: Response): Promise<void> => {
    const imageName = req?.file?.filename;
    const userId = req.user?.userId;
    const label = req.body.label;
    console.log("Image Name: ", imageName);

    try {
        const colorImage = await ColorImage.create({
            userId,
            imageName,
            label
        })

        const response = await axios.post(
            "http://127.0.0.1:3030/colorize",
            {
                'image': fs.createReadStream(path.join(__dirname, `../uploads/${colorImage.imageName}`))
            },
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                responseType: "arraybuffer", // Ensure binary data is received correctly
            }
        );

        // Define the path for the new colorized image
        // Define the full path for the colorized image
        const colorizedImagePath = path.join(__dirname, `../uploads/${colorImage.imageName}`).replace(/(\.\w+)?$/, "_colorized.jpg");

        // Write the received buffer to a file correctly
        fs.writeFileSync(colorizedImagePath, Buffer.from(response.data), "binary");

        // Extract only the filename
        const colorizedImageName = path.basename(colorizedImagePath);

        // Save the colorized image to the database (only storing the filename)
        await ColorizedImage.create({
            userId,
            coloredImage: colorizedImageName, // Store only the filename
            bwImage: colorImage._id
        });


        res.json({
            message: "Image uploaded and colorized successfully",
            original: imageName,
            colorized: colorizedImageName
        });

        // res.status(200).json({
        //     message: "Image uploaded successfully",
        //     data: colorImage
        // })


    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error
        })

    }


}



export const deleteImages = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        // Find the original black-and-white image
        const bwImage = await ColorImage.findById({ userId, _id: id });
        if (!bwImage) {
            res.status(404).json({ message: "Original image not found" });
            return;
        }

        // Find the colorized image entry
        const colorizedImage = await ColorizedImage.findOne({ userId, bwImage: bwImage._id });
        if (!colorizedImage) {
            res.status(404).json({ message: "Image not found"});
            return;
        }

        

        // Get file paths
        const bwImagePath = path.join(__dirname, `../uploads/${bwImage.imageName}`);
        const colorizedImagePath = path.join(__dirname, `../uploads/${colorizedImage.coloredImage}`);

        // Delete files from the filesystem
        if (fs.existsSync(bwImagePath)) fs.unlinkSync(bwImagePath);
        if (fs.existsSync(colorizedImagePath)) fs.unlinkSync(colorizedImagePath);

        // Remove entries from the database
        await ColorImage.findByIdAndDelete(bwImage._id);
        await ColorizedImage.findByIdAndDelete(colorizedImage._id);

        res.json({ message: "Both images deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};


export const searchHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const colorizedImages = await ColorizedImage.find({ userId }).populate("bwImage");
        if(!colorizedImages || colorizedImages.length === 0) {
            res.status(404);
            return;
        }
        res.json({ data: colorizedImages });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}

export const updateLabel = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        const { label } = req.body;

        const colorImage = await ColorImage.findOneAndUpdate({ userId, _id: id }, { label }, { new: true });
        if (!colorImage) {
            res.status(404).json({ message: "Image not found" });
            return;
        }

        res.json({ message: "Label updated successfully", data: colorImage });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}


export const searchOne = async (req: Request, res: Response): Promise<void> => {
     const userId = req.user?.userId;
        const { id } = req.params;
    try {
        const colorizedImage = await ColorizedImage.findOne({ userId, _id: id }).populate("bwImage");
        if (!colorizedImage) {
            res.status(404).json({ message: "Image not found" });
            return;
        }
        res.json({ data: colorizedImage });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}


