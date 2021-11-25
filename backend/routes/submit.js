const express = require('express');
const router = express.Router();
const { submitAssignment } = require('../data/users');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const error = require('../error');
const { getRole } = require('../data/users');

router.post('/', auth, async (req, res) => {
  try {
    const userBody = req.body;
    let parsedStudentId;
    let parsedAssignmentId;
    let fileInfo;
    try {
      // Test all invalid scenarios; throw 400 if true
      error.str(userBody?.studentId);
      parsedStudentId = error.validId(userBody?.studentId);
      error.str(userBody?.assignmentId);
      parsedAssignmentId = error.validId(userBody?.assignmentId);

      // Ensure the user is a student
      const userRole = await getRole(parsedStudentId);
      if (!userRole || userRole !== 'student') throw new Error('Students are only allowed to upload assignments');

      // Perform actual upload
      await upload(req, res);
      console.log(req.file);
      fileInfo = req.file;
      if (!fileInfo) throw new Error('You must upload a file');
    } catch (e) {
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
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
