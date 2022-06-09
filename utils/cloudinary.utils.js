const cloudinary = require('cloudinary').v2;
const Env = require('./env.utils');

cloudinary.config({
  cloud_name: Env.get('NEC_CLOUDINARY_NAME') || 'dfememj5d',
  api_key: Env.get('NEC_CLOUDINARY_KEY') || '624946163845349',
  api_secret: Env.get('NEC_CLOUDINARY_SECRET') || 'wwTNcmbb5XsgX7QLfH-aOBQ6eAk',
});

module.exports = {
  async uploadImage(image, folder) {
    try {
      const result = await cloudinary.uploader.upload(image, { folder });

      return result;
    } catch (error) {
      console.log('Cloudinary: ', error);
    }
  },
};
