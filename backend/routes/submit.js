const express = require('express');
const router = express.Router();
const { submitAssignment, deleteFileInstanceById } = require('../data/users');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, async (req, res) => {
  try {
    await upload(req, res);
    const fileInfo = req.file;
    if (!fileInfo) throw new Error('You must upload a file');
    const userBody = req.body;

    // Saves the file id to the student's assignmentsId in mongo (validates student info)
    const state = await submitAssignment(userBody?.studentId, userBody?.assignmentId, fileInfo?.id);

    const uploadedRes = {
      modifiedCount: state.modifiedCount,
      overwritten: state.overwritten,
      fileId: fileInfo.id,
      filename: fileInfo.originalname,
      contentType: fileInfo.contentType,
      uploadDate: fileInfo.uploadDate,
    };
    return res.status(200).json(uploadedRes);
  } catch (e) {
    // Failed to add to database, undo any upload.
    let reverted = false;
    if (e.message !== 'You must upload a file') {
      try {
        reverted = await deleteFileInstanceById(req.file?.id);
      } catch (e) {}
    }
    res.status(500).json({ error: e.message, uploadReverted: reverted });
  }
});

module.exports = router;
