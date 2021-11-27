const env = require('../env')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()
const courseData = require('../data/courses')
const userData = require('../data/users')
const mongoCollections = require('../config/mongoCollections')
const users = mongoCollections.users
let { ObjectId } = require('mongodb')
const error = require('../error')

async function getUserIDbyEmail(email) {
    const parsedEmail = email.toLowerCase().trim()

    const usersCollection = await users()
    const user = await usersCollection.findOne({ email: parsedEmail })
    if (!user) throw new Error(`Either the username or password is invalid`)

    return user._id
}

// route to GET all assignments for a specific course
// :id is courseID
router.get('/:id', auth, async (req, res) => {

    const id = req.params.id

    const userId = await getUserIDbyEmail(req.email)
    const userIdStr = userId.toString()

    try {
        const courses = await userData.getCourses(userIdStr)
        courses.forEach((elem) => {
            const elemIdStr = elem._id.toString()
            if (elemIdStr == id) {
                res.status(200).json(elem.assignments)
            }
        })
        return
    } catch (e) {
        console.log(e)
        res.sendStatus(400)
    }
})

// route to POST a new assignment for a specific course
// :id is courseID
router.post('/:id', auth, async (req, res) => {
    const id = req.params.id
    const { type, name, description } = req.body

    const userId = await getUserIDbyEmail(req.email)
    const userIdStr = userId.toString()
    const user = await userData.getUser(userIdStr)

    if (user.role !== "teacher") {
        res.sendStatus(403)
        return
    }

    try {
        const newCourse = await courseData.createAssignment(type, name, description, id)
        res.status(200).json(newCourse)
        return
    } catch (e) {
        console.log(e)
        res.sendStatus(400)
    }
})

// route to patch an assignment description for a specific course
// :id is assignment id
router.patch('/:id', auth, async (req, res) => {
    const id = req.params.id
    const { courseId, description } = req.body

    const userId = await getUserIDbyEmail(req.email)
    const userIdStr = userId.toString()
    const user = await userData.getUser(userIdStr)

    if (user.role !== "teacher") {
        res.sendStatus(403)
        return
    }

    try {
        await courseData.editAssignmentDescription(courseId, id, description)
        res.status(200).json({ edited: true })
        return
    } catch (e) {
        console.log(e)
        res.sendStatus(400)
    }
})

// route to delete an assignment description for a specific course
// :id is assignment id
router.delete('/:id', auth, async (req, res) => {
    const id = req.params.id
    const { courseId } = req.body

    const userId = await getUserIDbyEmail(req.email)
    const userIdStr = userId.toString()
    const user = await userData.getUser(userIdStr)

    if (user.role !== "teacher") {
        res.sendStatus(403)
        return
    }

    try {
        await courseData.removeAssignment(courseId, id)
        res.status(200).json({ deleted: true })
        return
    } catch (e) {
        console.log(e)
        res.sendStatus(400)
    }
})

/**
 * Fetch grade for a student with assignmentId
 * Route: GET
 * Params: assignmentId
 * Query: id
 */
router.get('/grades/:assignmentId', auth, async (req, res) => {
    const assignmentId = req.params.assignmentId;
    const studentId = req.query.id;
    try {
        try {
            error.str(assignmentId);
            error.str(studentId);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
        const response = await userData.fetchGrade(assignmentId, studentId);
        res.status(200).json(response);
    } catch (e) {
        if (e.message === 'No assignments found for the given id') {
            res.status(404).json({ error: e.message });
        } else {
            res.status(500).json({ error: e.message });
        }
    }

})

/**
 * Fetch all grades for given assignment
 * Route: GET
 * Params: assignmentId
 */
router.get('/grades/all/:assignmentId', auth, async (req, res) => {
    const assignmentId = req.params.assignmentId;
    try {
        try {
            error.str(assignmentId);
        } catch (e) {
            return res.status(400).json({ e: e.message });
        }
        const response = await userData.fetchAllGrades(assignmentId);
        res.status(200).json({ "status": "success", "grades": response });
    } catch (error) {
        if (error.message === 'No grades found for the assignment') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }

    }
})

module.exports = router
