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

//Route to get all courses in the database
router.get('/all', auth, async (req, res) => {
  try {
    let allCourses = await courseData.getAllCourses();

    res.status(200).json(allCourses);
    return;
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: e.message });
  }
});

router.get('/single/:id', auth, async (req, res) => {
  try {
    let result = await courseData.getCourse(req.params.id);

    res.status(200).json(result);
    return;
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: e.message });
  }
});

//Route to get all courses the user is enrolled in or teaching
router.get('/:id', auth, async (req, res) => {
  try {
    let result = await userData.getCourses(req.params.id);

    res.status(200).json(result);
    return;
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: e.message });
  }
});

//Route to create new course when given a Course Name and a Teacher ID
router.post('/', auth, async (req, res) => {
  const sanitizedBody = {};
  Object.keys(req.body).forEach((key) => {
    sanitizedBody[key] = xss(req.body[key]);
  });
  const { userId, courseName } = sanitizedBody;

  let role = await getRole(userId);

  try {
    if (role.toLowerCase() !== 'teacher') throw 'Course creation can ONLY be called by users with Teacher role!';

    //create new course with the userId being the first teacher in the course. Also store the new course's ID as a string
    let newCourseId = (await courseData.createCourse(courseName, userId)).toString();

    //add new course to the teacher's Classes array
    await userData.addCourseToTeacher(newCourseId, userId);

    const newCourse = {
      added: true,
      courseName: courseName,
    };
    res.status(200).json(newCourse);

    return;
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

//Route for a teacher to add themselves as a teacher for a given course
router.patch('/', auth, async (req, res) => {
  const sanitizedBody = {};
  Object.keys(req.body).forEach((key) => {
    sanitizedBody[key] = xss(req.body[key]);
  });
  const { userId, courseId } = sanitizedBody;

  let role = await getRole(userId);

  try {
    if (role.toLowerCase() !== 'teacher') throw 'Teachers can ONLY be added to courses if they have the teacher role!';

    let courseName = await courseData.addTeacher(courseId, userId);
    let teacherName = await userData.addCourseToTeacher(courseId, userId);

    res.status(200).json({ added: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
