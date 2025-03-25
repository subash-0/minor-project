import { Router } from "express";

import { colorImage,deleteImages,searchHistory ,updateLabel,searchOne} from "../controllers/colorImage.controller";
import { authenticate } from "../middleware/authondicate";
import upload from "../middleware/multer";

const router = Router();

router.post('/color-image',authenticate,upload,colorImage);
router.delete('/delete-image/:id',authenticate,deleteImages);
router.get('/search-history',authenticate,searchHistory);
router.put('/update-label/:id',authenticate,updateLabel);
router.get('/search-one/:id',authenticate,searchOne);

export default router;