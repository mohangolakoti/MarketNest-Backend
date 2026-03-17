const cloudinary = require('../config/cloudinary');

const uploadImage = async (filePath, folder = 'marketnest') =>
  cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: 'image',
  });

const deleteImage = async (publicId) => cloudinary.uploader.destroy(publicId);

module.exports = {
  uploadImage,
  deleteImage,
};