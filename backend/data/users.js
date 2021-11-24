const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const courses = mongoCollections.courses;
const error = require('../error');
const bcrypt = require('bcrypt');
let { ObjectId } = require('mongodb');

async function doesEmailExist(email) {
  const usersCollection = await users();
  const user = await usersCollection.findOne({ email: email });
  if (!user) return false;
  return true;
}

async function hashPassword(plaintext) {
  const saltRounds = 16;
  return await bcrypt.hash(plaintext, saltRounds);
}

async function createUser(firstName, lastName, email, password, role) {
  error.str(firstName);
  error.str(lastName);
  error.str(email);
  error.validPassword(password);
  error.validRole(role);

  const parsedEmail = email.toLowerCase().trim();
  const parsedRole = role.toLowerCase().trim();

  if (await doesEmailExist(parsedEmail)) throw new Error('Email already exists.');

  const hashedPassword = await hashPassword(password);
  const usersCollection = await users();

  const newUser = {
    firstName: firstName,
    lastName: lastName,
    email: parsedEmail,
    password: hashedPassword,
    role: parsedRole,
    classes: [],
  };

  const insert = await usersCollection.insertOne(newUser);
  if (insert.insertedCount === 0) throw new Error('Could not add new user.');

  const newId = insert.insertedId;

  return newId;
}

async function checkUser(email, password) {
  if (arguments.length !== 2) throw new Error('This function takes 2 arguments.');
  error.str(email);
  error.validPassword(password);
  const parsedEmail = email.toLowerCase().trim();
  const usersCollection = await users();
  const user = await usersCollection.findOne({ email: parsedEmail });
  if (!user) throw new Error(`Either the username or password is invalid`);
  const compareToMatch = await bcrypt.compare(password, user?.password);
  if (!compareToMatch) throw new Error('Either the username or password is invalid');

  return { authenticated: true };
}

//Note: Takes in courseId and studentId as strings.
async function enroll(courseId, studentId) {
  //error check inputs
  error.str(courseId);
  error.str(studentId);

  //retrieve the users collection
  const userCollection = await users();

  //check if the provided studentId is a valid ObjectId
  if (!ObjectId.isValid(studentId)) throw 'Provided ID not proper format for ObjectID!';
  //convert the ID string to an ObjectID
  let objId = ObjectId(studentId);

  //retrieve the original user information
  let tempStudent = await userCollection.findOne({ _id: objId });

  //the above call will result in null if the given ID doesn't exist in the database
  if (tempStudent === null) throw 'User with that ID is not in database!';

  //if the student is already enrolled in the respective course, throw an error
  //NOTE: Shouldn't be necessary, as courses.js' addStudent() function SHOULD catch this case and throw an error first, but including just in case
  for (let course of tempStudent.classes) {
    if (course._id == courseId) throw 'Student is already enrolled in that course!';
  }

  //create new class Object to be added to the student's "classes" array
  const classInfo = {
    _id: courseId,
    grades: [],
    overallGrade: 0,
  };

  //push the new class Object to the tempStudent's classes array
  tempStudent.classes.push(classInfo);

  //"push" the updated course info to the same ID in the database
  const updatedInfo = await userCollection.updateOne({ _id: objId }, { $set: tempStudent });

  //check that the update succeeded
  if (updatedInfo.modifiedCount === 0) throw 'Failed to add course!';

  //upon successful add, return the name of the student for output
  return tempStudent.firstName + ' ' + tempStudent.lastName;
}

//Note: Takes in courseId and studentId as strings.
//NOTE: This is the function to add a course to a *TEACHER*
async function addCourseToTeacher(courseId, teacherId) {
  //error check inputs
  error.str(courseId);
  error.str(teacherId);

  //retrieve the users collection
  const userCollection = await users();

  //check if the provided teacherId is a valid ObjectId
  if (!ObjectId.isValid(teacherId)) throw 'Provided ID not proper format for ObjectID!';
  //convert the ID string to an ObjectID
  let objId = ObjectId(teacherId);

  //retrieve the original user information
  let tempTeacher = await userCollection.findOne({ _id: objId });

  //the above call will result in null if the given ID doesn't exist in the database
  if (tempTeacher === null) throw 'User with that ID is not in database!';

  //if the teacher is already teaching the respective course, throw an error
  for (let course of tempTeacher.classes) {
    if (course._id == courseId) throw 'Teacher is already teaching that course!';
  }

  //create new class Object to be added to the teacher's "classes" array
  const classInfo = {
    _id: courseId,
  };

  //push the new class Object to the tempTeacher's classes array
  tempTeacher.classes.push(classInfo);

  //"push" the updated course info to the same ID in the database
  const updatedInfo = await userCollection.updateOne({ _id: objId }, { $set: tempTeacher });

  //check that the update succeeded
  if (updatedInfo.modifiedCount === 0) throw 'Failed to add course to teacher!';

  //upon successful add, return the name of the teacher for output
  return tempTeacher.firstName + ' ' + tempTeacher.lastName;
}

//Note: Takes in courseId and userId as strings.
async function drop(courseId, userId) {
  //error check inputs
  error.str(courseId);
  error.str(userId);

  //retrieve the users collection
  const userCollection = await users();

  //check if the provided userId is a valid ObjectId
  if (!ObjectId.isValid(userId)) throw 'Provided ID not proper format for ObjectID!';
  //convert the ID string to an ObjectID
  let objId = ObjectId(userId);

  //retrieve the original user information
  let tempUser = await userCollection.findOne({ _id: objId });

  //the above call will result in null if the given ID doesn't exist in the database
  if (tempUser === null) throw 'User with that ID is not in database!';

  //Make sure there's at least 1 course in the user's "classes" array
  if (tempUser.classes.length == 0) throw "'Cannot drop a course from a user that doesn't have any courses!";

  //boolean to track if the course was found in the user's "classes" array
  let found = false;

  //find the course in the user's "classes" array
  for (let course of tempUser.classes) {
    //once the course has been found
    if (course._id === courseId) {
      found = true;
      //edge case: user is dropping the only class they're enrolled in
      if (tempUser.classes.length == 1) tempUser.classes.pop();
      //otherwise, remove the course from the array
      else {
        let ind = tempUser.classes.indexOf(course);
        tempUser.classes.splice(ind, 1);
      }
    }
  }

  //Throw an error when trying to drop a course that the user wasn't involved in
  if (found == false) throw 'User was not enrolled-in or teaching that course!';

  //"push" the updated course info to the same ID in the database
  const updatedInfo = await userCollection.updateOne({ _id: objId }, { $set: tempUser });

  //check that the update succeeded
  if (updatedInfo.modifiedCount === 0) throw 'Failed to drop course!';

  //upon successful add, return the name of the student for output
  return tempUser.firstName + ' ' + tempUser.lastName;
}

async function getCourses(userId) {
  //error check input
  error.str(userId);

  //retrieve the user collection
  const userCollection = await users();

  //check if the provided userId is a valid ObjectId
  if (!ObjectId.isValid(userId)) throw 'Provided ID not proper format for ObjectID!';
  //convert the ID string to an ObjectID
  let objId = ObjectId(userId);

  //retrieve the user's information
  let tempUser = await userCollection.findOne({ _id: objId });

  //the above call will result in null if the given ID doesn't exist in the database
  if (!tempUser) throw 'User with that ID is not in database!';

  //retrieve course collection
  const courseCollection = await courses();

  let courseList = [];

  //loop through each course that the user is teaching or enrolled in
  for (let course of tempUser.classes) {
    let courseId = course._id;

    //check that the courseId is a valid ObjectId
    if (!ObjectId.isValid(userId)) throw 'Student has a course whose ID is not proper format for ObjectID!';
    //convert the ID string to an ObjectID
    let courseObjId = ObjectId(courseId);
    let foundCourse = await courseCollection.findOne({ _id: courseObjId });

    //the above call will result in null if the given ID doesn't exist in the respective database
    if (!foundCourse) throw 'Student has a course whose ID is not in the course database!';

    courseList.push(foundCourse.name);
  }

  return courseList;
}

async function addGrade(studentId, assignmentId, grade) {
  error.str(studentId);
  error.validId(studentId);
  error.str(assignmentId);
  error.validId(assignmentId);
  error.str(grade);

  const userCollection = await users();
  const courseCollection = await courses();
}

async function submitAssignment(assignmentId, file) {}

// const main = async () => {
//   await createUser('Christian', 'Paz', 'cszablewskipaz@gmail.com', 'password123', 'teacher')
// }

// main()

module.exports = {
  createUser,
  checkUser,
  enroll,
  addCourseToTeacher,
  drop,
  getCourses,
  hashPassword,
};
