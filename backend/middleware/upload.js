const util = require('util');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const { mongoConfig } = require('../config/settings.json');

const storage = new GridFsStorage({
  url: mongoConfig.serverUrl + mongoConfig.database,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ['application/pdf', 'image/png', 'image/jpeg'];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-ezel-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: 'assignments',
      filename: `${Date.now()}-ezel-${file.originalname}`,
    };
  },
});

const uploadFiles = multer({ storage: storage }).single('file');
const uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;

/*
Example response
{
  fieldname: 'file',
  originalname: 'm.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  id: new ObjectId("619ee986c60655cdf5fa99a0"),
  filename: '1637804422748-ezel-m.jpg',
  metadata: null,
  bucketName: 'assignments',
  chunkSize: 261120,
  size: 150314,
  md5: undefined,
  uploadDate: 2021-11-25T01:40:23.111Z,
  contentType: 'image/jpeg'
}
*/
