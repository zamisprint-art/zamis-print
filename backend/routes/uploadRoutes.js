import path from 'path';
import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Handle 3D models (.glb, .gltf) as 'raw' resource type in Cloudinary
        const is3DModel = file.originalname.match(/\.(glb|gltf)$/i);
        
        return {
            folder: 'zamis-print',
            resource_type: is3DModel ? 'raw' : 'auto',
            public_id: `${file.fieldname}-${Date.now()}`,
        };
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp|glb|gltf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    // Some 3D files might not have a standard mimetype, so we mostly rely on extname for .glb/.gltf
    const mimetype = /image\/jpeg|image\/png|image\/webp|model\/gltf-binary|model\/gltf\+json|application\/octet-stream/.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images and 3D Models only!'));
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// @route   POST /api/upload
// @desc    Upload file to Cloudinary
// @access  Private/Admin
router.post('/', upload.single('file'), (req, res) => {
    res.send({
        message: 'File Uploaded to Cloudinary',
        filePath: req.file.path, // Cloudinary returns the secure URL in req.file.path
    });
});

export default router;
