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

async function getRole(userId) {
  const usersCollection = await users();
  let objId = ObjectId(userId);
  const user = await usersCollection.findOne({ _id: objId });

  if (!user) throw "User doesn't exist!";

  return user.role;
}

router.post('/', auth, async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    let role = await getRole(userId);
    let coursename = null;
    if (role.toLowerCase() === 'student') {
      courseName = await courseData.addStudent(courseId, userId);
    }
    if (role.toLowerCase() === 'teacher') {
      courseName = await courseData.addTeacher(courseId, userId);
    }

    //update the relevant info in the Course and User collections, respectively
    let studentName = await userData.enroll(courseId, userId);

    const newEnroll = {
      enrolled: true,
      studentName: studentName,
      courseName: courseName,
    };

    res.status(200).json(newEnroll);
    return;
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

module.exports = router;
