const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name : 'dxcuxhnlg',
    api_key : '313157759674424',
    api_secret: 'Qs7HLdTpip3TV9a7Jskw2vjYloc'
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        allowed_formats : ['jpg', 'png', 'jpeg', 'gif', 'webp'],
        public_id: (req, file) => {
            return `image-${Date.now()}`; 
          }

    }
});
module.exports = storage;