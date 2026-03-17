const { Readable } = require('stream');

const cloudinary = require('../config/cloudinary');

const uploadBuffer = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });

    Readable.from(buffer).pipe(uploadStream);
  });

const uploadMultipleImages = async (files, folder = 'marketnest/products') => {
  if (!files || files.length === 0) {
    return [];
  }

  const uploads = files.map((file) =>
    uploadBuffer(file.buffer, {
      folder,
      resource_type: 'image',
    })
  );

  const results = await Promise.all(uploads);
  return results.map((result) => result.secure_url);
};

module.exports = {
  uploadMultipleImages,
};