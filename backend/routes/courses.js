const env = require('../env')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()
const courseData = require('../data/courses')
const userData = require('../data/users')
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');

async function getRole(userId)  {
    const usersCollection = await users();
    let objId = ObjectId(userId);
    const user = await usersCollection.findOne({ _id: objId });

    if(!user) throw "User doesn't exist!";
    
    return user.role;
}

//Route to get all courses the user is enrolled in or teaching
router.get('/', auth, async (req, res) => {
    //should NOT need to check role - can be accessed equally by Students and Teachers

    const { userId } = req.body

    try {
        let result = await userData.getCourses(userId);

        res.status(200).json(result);
        return;
    } catch(e) {
        console.log(e);
        res.sendStatus(400);
    }
});

//Route to create new course when given a Course Name and array of Teacher IDs
router.post('/', auth, async (req, res) => {
    
    const { userId, courseName, teacherIds } = req.body

    let role = await getRole(userId);

    try {        
        if(role.toLowerCase() !== 'teacher') throw 'Course creation can ONLY be called by users with Teacher role!';

        await courseData.createCourse(courseName, teacherIds);

        res.sendStatus(200);
        console.log('Course ' + courseName + ' has been added with teacher ID: ' + teacherIds + '!');
        return;
    } catch(e) {
        console.log(e);
        res.sendStatus(400);
    }
});

//Route for a teacher to add themselves as a teacher for a given course
router.patch('/', auth, async (req, res) => {
    const {  userId, courseId } = req.body

    let role = await getRole(userId);

    try {
        if(role.toLowerCase() !== 'teacher') throw 'Teachers can ONLY be added to courses if they have the teacher role!';

        let courseName = await courseData.addTeacher(courseId, userId);
        let teacherName = await userData.addCourse(courseId, userId);

        res.sendStatus(200);
        console.log(teacherName + ' has been added to teach ' + courseName + '!');
    } catch(e) {
        console.log(e);
        res.sendStatus(400);
    }
});
  
module.exports = router;