import express from 'express';
import protect from '../middleware/auth.js';
import {
    uploadDocuments,
    getUserDocuments,
    getDocumentById,
    deleteDocument
} from '../controller/documentController.js';
import upload from '../config/multer.js';
const router = express.Router();

router.use(protect);

router.post('/upload', upload.single('File') , uploadDocuments);
router.get('/' , getUserDocuments);
router.get('/:id' , getDocumentById);
router.delete('/:id' , deleteDocument);
 
export default router;
