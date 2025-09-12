import mongoose from "mongoose";


const ColorImageSchema = new mongoose.Schema({
    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageName: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    
   
}, {timestamps: true});


const ColorImage = mongoose.model("colorImage", ColorImageSchema);

export default ColorImage;