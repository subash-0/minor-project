import mongoose from "mongoose";


const ColorizedImageSchema = new mongoose.Schema({
    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coloredImage: {
        type: String,
        required: true
    },
    bwImage: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'colorImage'
        
    },
   
}, {timestamps: true});


const ColorizedImage = mongoose.model("colorizedImage", ColorizedImageSchema);

export default ColorizedImage;