const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: 'dxcuxhnlg',
    api_key: '313157759674424',
    api_secret: 'Qs7HLdTpip3TV9a7Jskw2vjYloc'
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        // Added document formats along with image formats
        allowed_formats: [
            // Images
            'jpg', 'png', 'jpeg', 'gif', 'webp', 
            // Documents
            'pdf', 'doc', 'docx', 'ppt', 'pptx', 
            'xls', 'xlsx', 'txt', 'csv', 'rtf'
        ],
        public_id: (req, file) => {
            // Generate unique ID based on file type and timestamp
            const fileType = file.mimetype.split('/')[0]; // 'image' or 'application'
            return `${fileType}-${Date.now()}`;
        }
    }
});

module.exports = storage;