const express = require('express');
const router = express.Router();
const { submitAssignment } = require('../data/users');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const error = require('../error');

// adding in middleware such as multer().any() to the route below
// fixes the issue of userBody.studentId to be seen
// However it breaks the upload.js functionality as
// we don't get back the id anymore

router.post('/', auth, async (req, res) => {
  try {
    const userBody = req.body;
    // Hardcoding for testing this works
    // userBody.studentId = '61a22cb8908869bdcd6523f8';
    // userBody.assignmentId = '61a22cb5908869bdcd6523f7';
    let parsedStudentId;
    let parsedAssignmentId;
    let fileInfo;
    try {
      // Test all invalid scenarios; throw 400 if true
      error.str(userBody?.studentId);
      parsedStudentId = error.validId(userBody?.studentId);
      error.str(userBody?.assignmentId);
      parsedAssignmentId = error.validId(userBody?.assignmentId);

      // Perform actual upload
      await upload(req, res);
      fileInfo = req.file;
      if (!fileInfo) throw new Error('You must upload a file');
    } catch (e) {
      console.error(e);
      return res.status(400).json({ error: e.message });
    }
    // Saves the file id to the student's assignmentsId in mongo
    const state = await submitAssignment(parsedStudentId, parsedAssignmentId, fileInfo.id);
    const uploadedRes = {
      uploaded: state?.uploaded,
      overwrote: state?.overwrote,
      filename: fileInfo?.originalname,
      contentType: fileInfo?.contentType,
      uploadDate: fileInfo?.uploadDate,
    };
    return res.status(200).json(uploadedRes);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
