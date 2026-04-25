import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp|glb|gltf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    // Some 3D files might not have a standard mimetype, so we mostly rely on extname for .glb/.gltf
    // But we also accept standard image mimetypes
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
// @desc    Upload file
// @access  Private/Admin
router.post('/', upload.single('file'), (req, res) => {
    res.send({
        message: 'File Uploaded',
        filePath: `/${req.file.path.replace(/\\/g, '/')}`,
    });
});

export default router;
