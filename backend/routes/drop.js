const env = require('../env');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const courseData = require('../data/courses');
const userData = require('../data/users');
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');
const xss = require('xss');

async function getRole(userId) {
  const usersCollection = await users();
  let objId = ObjectId(userId);
  const user = await usersCollection.findOne({ _id: objId });

  if (!user) throw "User doesn't exist!";

  return user.role;
}

router.post('/', auth, async (req, res) => {
  const sanitizedBody = {};
  Object.keys(req.body).forEach((key) => {
    sanitizedBody[key] = xss(req.body[key]);
  });
  const { userId, courseId } = sanitizedBody;

  let role = await getRole(userId);
  let courseName = '';

  try {
    if (role.toLowerCase() == 'student') {
      courseName = await courseData.removeStudent(courseId, userId);
    } else {
      //user is a teacher
      courseName = await courseData.removeTeacher(courseId, userId);
    }

    let userName = await userData.drop(courseId, userId);

    res.status(200).json({ dropped: true });
    return;
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

module.exports = router;
