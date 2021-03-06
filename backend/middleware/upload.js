const util = require('util');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const { mongoConfig } = require('../config/settings.json');
const error = require('../error');
const xss = require('xss');

const storage = new GridFsStorage({
  url: mongoConfig.serverUrl + mongoConfig.database,
  options: { useNewUrlParser: true, useUnifiedTopology: true },

  file: (req, file) => {
    const userBody = req.body;
    const parsedStudentId = xss(userBody?.studentId);
    const parsedAssignmentId = xss(userBody?.assignmentId);
    error.str(parsedStudentId);
    error.validId(parsedStudentId);
    error.str(parsedAssignmentId);
    error.validId(parsedAssignmentId);

    const match = ['application/pdf', 'image/png', 'image/jpeg'];

    if (match.indexOf(file.mimetype) === -1) {
      throw new Error(`You must upload PDF, PNG, or JPEG only.`);
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
