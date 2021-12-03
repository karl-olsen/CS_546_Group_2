const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const courses = mongoCollections.courses;
const assignmentsChunks = mongoCollections.assignmentsChunks;
const assignmentsFiles = mongoCollections.assignmentsFiles;
const error = require('../error');
const bcrypt = require('bcrypt');
let { ObjectId } = require('mongodb');

async function doesEmailExist(email) {
  error.str(email);
  const usersCollection = await users();
  const user = await usersCollection.findOne({ email: email });
  if (!user) return false;
  return true;
}

async function hashPassword(plaintext) {
  error.str(plaintext);
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

  return { userId: user._id };
}

//Note: Takes in courseId and studentId as strings.
async function enroll(courseId, studentId) {
  //error check inputs
  error.str(courseId);
  error.str(studentId);
  const parsedCourseId = error.validId(courseId);
  const parsedStudentId = error.validId(studentId);

  //retrieve the users collection
  const userCollection = await users();

  //retrieve the original user information
  let tempStudent = await userCollection.findOne({ _id: parsedStudentId });

  //the above call will result in null if the given ID doesn't exist in the database
  if (!tempStudent) throw 'User with that ID is not in database!';

  //if the student is already enrolled in the respective course, throw an error
  //NOTE: Shouldn't be necessary, as courses.js' addStudent() function SHOULD catch this case and throw an error first, but including just in case
  if (tempStudent.classes.some((e) => e.toString() === courseId)) throw 'Student is already enrolled in that course!';

  //create new class Object to be added to the student's "classes" array
  const classInfo = {
    _id: parsedCourseId,
    grades: [],
    overallGrade: 0,
  };

  //push the new class Object to the tempStudent's classes array
  tempStudent.classes.push(classInfo);

  //"push" the updated course info to the same ID in the database
  const updatedInfo = await userCollection.updateOne({ _id: parsedStudentId }, { $set: tempStudent });

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
  const parsedCourseId = error.validId(courseId);
  const parsedTeacherId = error.validId(teacherId);

  //retrieve the users collection
  const userCollection = await users();

  //retrieve the original user information
  let tempTeacher = await userCollection.findOne({ _id: parsedTeacherId });

  //the above call will result in null if the given ID doesn't exist in the database
  if (tempTeacher === null) throw 'User with that ID is not in database!';

  //if the teacher is already teaching the respective course, throw an error
  for (let course of tempTeacher.classes) {
    if (course._id === courseId) throw 'Teacher is already teaching that course!';
  }

  //create new class Object to be added to the teacher's "classes" array
  const classInfo = {
    _id: parsedCourseId,
  };

  //push the new class Object to the tempTeacher's classes array
  tempTeacher.classes.push(classInfo);

  //"push" the updated course info to the same ID in the database
  const updatedInfo = await userCollection.updateOne({ _id: parsedTeacherId }, { $set: tempTeacher });

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

async function getUser(id) {
  const parsedId = error.validId(id);
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: parsedId });
  if (!user) throw new Error('No user found');
  return user;
}

async function getCourse(id) {
  const parsedId = error.validId(id);
  const coursesCollection = await courses();
  const course = await coursesCollection.findOne({ _id: parsedId });
  if (!course) throw new Error('No course found');
  return course;
}

/**
 * Add grade for assignment
 * @param {string} studentId
 * @param {string} courseId
 * @param {string} assignmentId
 * @param {string} grade
 * @returns object
 */
async function addGrade(studentId, courseId, assignmentId, grade) {
  const parsedStudentId = error.validId(studentId);
  const parsedAssignmentId = error.validId(assignmentId);
  const parsedCourseId = error.validId(courseId);
  const parsedGrade = parseInt(grade);

  const userCollection = await users();
  const user = await getUser(studentId);
  if (!user) throw new Error('No user was found with the given id');
  const course = await getCourse(courseId);
  if (!course) throw new Error('No course was found with the given id');

  let classObj = user.classes.find((e) => e._id.toString() === courseId);
  if (!classObj) throw new Error('Student is not enrolled in the course');
  if (!course.assignments.some((e) => e._id.toString() === assignmentId)) throw new Error('No assignment found');
  if (!classObj.grades.some((e) => e._id.toString() === assignmentId))
    throw new Error('No assignment found for the user');
  if (grade < 0 || grade > 100) throw new Error('Grade should be betwenn 0 - 100');

  const updatedInfo = await userCollection.findOneAndUpdate(
    { _id: parsedStudentId },
    { $set: { 'classes.$[classId].grades.$[assign].grade': parsedGrade } },
    { arrayFilters: [{ 'classId._id': parsedCourseId }, { 'assign._id': parsedAssignmentId }] }
  );

  //check that the update succeeded
  if (updatedInfo.modifiedCount === 0) throw new Error('Failed to add grade for assignment');
  const overallGradeset = await setOverallGrade(studentId, courseId);
  if (!overallGradeset) throw new Error('Unable to calculate overall grade');
  return { gradeAdded: true };
}

/**
 * Calculate overall grade
 * @param {string} studentId
 * @param {string} courseId
 * @returns object
 */
async function setOverallGrade(studentId, courseId) {
  error.str(studentId);
  const parsedStudentId = error.validId(studentId);
  error.str(courseId);
  const parsedCourseId = error.validId(courseId);

  const userCollection = await users();
  const user = await getUser(studentId);
  if (!user) throw new Error('No user was found with the given id');
  const course = await getCourse(courseId);
  if (!course) throw new Error('No course was found with the given id');

  let classObj = user.classes.find((e) => e._id.toString() === courseId);
  if (!classObj) throw new Error('Student is not enrolled in the course');

  let overallGrade = 0;
  if (classObj.grades.length === 0) {
    overallGrade = 0;
  } else {
    let sum = 0;
    let count = 0;
    for (const grade of classObj.grades) {
      //a grade being -1 indicates a recently-submitted assignment that hasn't been graded yet - omitting from overallGrade calculation
      if (grade.grade && grade.grade != -1) {
        sum += grade.grade;
        count += 1;
      }
    }
    if (count > 0) overallGrade = Math.round((sum / count) * 1e2) / 1e2;
  }

  if (classObj.overallGrade != overallGrade) {
    const updatedInfo = await userCollection.findOneAndUpdate(
      { _id: parsedStudentId, classes: { $elemMatch: { _id: parsedCourseId } } },
      { $set: { 'classes.$.overallGrade': overallGrade } }
    );
    if (updatedInfo.modifiedCount === 0) throw new Error('Failed to compute overall grade');
  }

  return { setOverallGrade: true };
}

/**
 * Determines if an existing file ID was stored for an assignment and
 * deletes old instances of previously saved files
 * @param {ObjectId} studentId
 * @param {ObjectId} assignmentId
 * @returns boolean
 */
async function submissionExists(studentId, assignmentId) {
  const parsedStudentId = error.validId(studentId);
  const parsedAssignmentId = error.validId(assignmentId);

  // Step 1: Find if student and assignment id exist with data object
  const userCollection = await users();

  const submissionQuery = await userCollection
    .aggregate([
      { $match: { _id: parsedStudentId } },
      { $match: { classes: { $elemMatch: { grades: { $elemMatch: { _id: parsedAssignmentId } } } } } },
      { $unwind: '$classes' },
      { $unwind: '$classes.grades' },
      {
        $project: {
          _id: 0,
          email: 1,
          submissionFile: '$classes.grades.submissionFile',
        },
      },
    ])
    .toArray();

  if (!submissionQuery || submissionQuery.length === 0)
    throw new Error('Cannot check submission state due to no matching student with given assignment id');

  // Step 2: If submission does not exist return false.
  // Otherwise, remove old submission from assignments bucket and return true
  const fileId = submissionQuery[0]?.submissionFile;
  if (!fileId) return false;

  // First we need to delete the file metadata
  const assignmentsFilesCollection = await assignmentsFiles();
  const filesQuery = await assignmentsFilesCollection.deleteMany({ _id: fileId });
  if (!filesQuery || filesQuery.deletedCount === 0) throw new Error(`Failed to delete assignment file metadata`);

  // Then delete the file metadata
  const assignmentsChunksCollection = await assignmentsChunks();
  const chunksQuery = await assignmentsChunksCollection.deleteMany({ files_id: fileId });
  if (!chunksQuery || chunksQuery.deletedCount === 0) throw new Error(`Failed to delete assignment chunks`);

  return true;
}

/**
 * Deletes all instances of file data given a fileId
 * (chunks and metadata included)
 * @param {ObjectId} fileId
 * @returns boolean
 */
async function deleteFileInstanceById(fileId) {
  const parsedFileId = error.validId(fileId);

  // First we need to delete the file metadata
  const assignmentsFilesCollection = await assignmentsFiles();
  const filesQuery = await assignmentsFilesCollection.deleteMany({ _id: parsedFileId });
  if (!filesQuery || filesQuery.deletedCount === 0) return false;

  // Then delete the file metadata
  const assignmentsChunksCollection = await assignmentsChunks();
  const chunksQuery = await assignmentsChunksCollection.deleteMany({ files_id: parsedFileId });
  if (!chunksQuery || chunksQuery.deletedCount === 0) return false;

  return true;
}

/**
 * Updates database with new submission file ID
 * Also overwrites existing submission fileIDs when applicable
 * @param {ObjectId} studentId
 * @param {ObjectId} assignmentId
 * @param {ObjectId} fileId
 * @returns { overwritten: boolean, modifiedCount: number }
 */
async function submitAssignment(studentId, assignmentId, fileId) {
  const parsedStudentId = error.validId(studentId);
  const parsedAssignmentId = error.validId(assignmentId);
  const parsedFileId = error.validId(fileId);

  // 1: Ensure the user is a student
  const userObj = await getUser(parsedStudentId);
  if (!userObj || userObj?.role !== 'student') throw new Error('Students are only allowed to upload assignments');

  // 2: Ensure assignment is in a course
  const coursesCollection = await courses();
  const courseQuery = await coursesCollection.findOne({ 'assignments._id': parsedAssignmentId });
  if (!courseQuery) throw new Error('No course found for provided assignment id');

  let modified = false;
  let overwritten = false;
  let matchedIndex = 0;

  for (let i = 0; i < userObj.classes.length; i++) {
    let currClass = userObj.classes[i];
    if (currClass._id.toString() === courseQuery._id.toString()) {
      // Check that the student's enrolled course matches the assignment's course
      matchedIndex = i;
      for (let j = 0; j < currClass.grades.length; j++) {
        // Check if assignment already has a submission
        let currGrade = currClass.grades[j];
        if (currGrade._id.toString() === parsedAssignmentId.toString()) {
          // Delete all necessary old file data from assignments collection
          overwritten = await submissionExists(parsedStudentId, parsedAssignmentId);
          currGrade.submissionFile = parsedFileId;
        }
      }
      modified = true;
    }
  }

  // 3: Ensure student is enrolled in course
  if (!modified) throw new Error('Unable to add new submission due to no student enrolled');

  // 4: If we didn't overwrite a previous submission,
  // Push a new grade entry into the sub-document
  if (!overwritten) {
    const newGrade = {
      _id: parsedAssignmentId,
      submissionFile: parsedFileId,
      grade: -1,
    };

    userObj.classes[matchedIndex].grades.push(newGrade);
  }

  // 5: Update the student's classes array
  const userCollection = await users();
  const submissionResult = await userCollection.updateOne(
    { _id: parsedStudentId },
    { $set: { classes: userObj.classes } }
  );
  if (!submissionResult.matchedCount && !submissionResult.modifiedCount) {
    throw new Error(`Unable to update classes for student submission`);
  }

  return { overwritten, modifiedCount: submissionResult.modifiedCount };
}

/**
 * Fetch grade of a student by assignmentId
 * @param {string} assignmentId
 * @param {string} studentId
 * @returns object
 */
async function fetchGrade(assignmentId, studentId) {
  const parsedAssignmentId = error.validId(assignmentId);
  const user = await getUser(studentId);
  if (!user) throw new Error('No user was found with the given id');
  const errorMSg = 'No assignments found for the given assignment id';

  if (user && !user.classes) throw new Error(errorMSg);
  for (const classObj of user.classes) {
    const assignment = classObj.grades.find((e) => e._id.toString() === assignmentId);
    if (!assignment) throw new Error(errorMSg);
    const response = {
      status: 'success',
      grade: assignment.grade,
    };
    return response;
  }
}

/**
 * Fetch all grades for the assignment
 * @param {string} assignmentId
 * @returns array
 */
async function fetchAllGrades(assignmentId) {
  const userCollection = await users();
  const parsedAssignmentId = error.validId(assignmentId);
  const grades = await userCollection
    .aggregate([
      { $match: { classes: { $elemMatch: { grades: { $elemMatch: { _id: parsedAssignmentId } } } } } },
      { $unwind: '$classes' },
      { $unwind: '$classes' },
      { $unwind: '$classes.grades' },
      { $unwind: '$classes.grades' },
      { $match: { 'classes.grades._id': parsedAssignmentId } },
      { $project: { _id: 0, firstName: 1, lastName: 1, grade: '$classes.grades.grade' } },
    ])
    .toArray();
  if (grades.length === 0) throw new Error('No grades found for the assignment');
  const response = {
    status: 'success',
    grades: grades,
  };
  return response;
}

/**
 * Fetch minimum, maximum and average for a given assignment
 * @param {string} assignmentId
 * @returns object
 */
async function fetchGradeMetrics(assignmentId) {
  const userCollection = await users();
  const parsedAssignmentId = error.validId(assignmentId);

  let grades = await userCollection
    .aggregate([
      { $match: { classes: { $elemMatch: { grades: { $elemMatch: { _id: parsedAssignmentId } } } } } },
      { $unwind: '$classes' },
      { $unwind: '$classes' },
      { $unwind: '$classes.grades' },
      { $match: { 'classes.grades._id': parsedAssignmentId } },
      { $project: { _id: 0, grade: '$classes.grades.grade' } },
      { $sort: { grade: 1 } },
    ])
    .toArray();

  if (grades.length === 0) throw new Error('No assignment found with the given id');

  grades = grades.filter((value) => Object.keys(value).length !== 0);
  if (grades.length === 0) throw new Error('Assignments are yet to be graded');

  let sum = 0;
  for (const grade of grades) {
    sum += grade.grade;
  }
  const average = Math.round((sum / grades.length) * 1e2) / 1e2;
  const response = {
    status: 'success',
    grades: {
      min: grades[0].grade,
      max: grades[grades.length - 1].grade,
      average: average,
    },
  };
  return response;
}

module.exports = {
  getUser,
  createUser,
  checkUser,
  enroll,
  addCourseToTeacher,
  drop,
  getCourses,
  doesEmailExist,
  submitAssignment,
  hashPassword,
  addGrade,
  deleteFileInstanceById,
  fetchGrade,
  fetchAllGrades,
  fetchGradeMetrics,
  setOverallGrade
};
