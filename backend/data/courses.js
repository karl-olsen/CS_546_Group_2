const mongoCollections = require('../config/mongoCollections');
const courses = mongoCollections.courses;
const users = mongoCollections.users;
const error = require('../error');
let { ObjectId } = require('mongodb');

async function createCourse(courseName, teacherId) {
  const coursesCollection = await courses();

  error.str(courseName);
  error.str(teacherId);
  // error.arr(teacherIds, true);

  // const parsedTeacherIds = teacherIds.map((id) => error.validId(id));
  const parsedTeacherId = error.validId(teacherId);

  const newCourse = {
    name: courseName,
    teachers: [parsedTeacherId],
    students: [],
    assignments: [],
  };

  const insert = await coursesCollection.insertOne(newCourse);
  if (insert.insertedCount === 0) throw new Error('Could not add new course.');

  const newId = insert.insertedId;

  return newId;
}

//Note: Takes in courseId and teacherId as strings.
//courseId's conversion to ObjectId occurs within the function
async function addTeacher(courseId, teacherId) {
  //error check inputs
  error.str(courseId);
  error.str(teacherId);
  const parsedCourseId = error.validId(courseId);
  const parsedTeacherId = error.validId(teacherId);

  //retrieve the courses collection
  const coursesCollection = await courses();

  //retrieve the original course information
  let tempCourse = await coursesCollection.findOne({ _id: parsedCourseId });

  //the above call will result in null if the given ID doesn't exist in the database
  if (!tempCourse) throw 'Course with that ID is not in database!';

  //if the teacher already teaches the respective course, throw an error
  if (tempCourse.teachers.some((e) => e.toString() === teacherId))
    throw new Error('Teacher is already assigned to that course!');

  //push the provided teacherId to the tempCourse's teachers array
  tempCourse.teachers.push(parsedTeacherId);

  //"push" the updated course info to the same ID in the database
  const updatedInfo = await coursesCollection.updateOne({ _id: parsedCourseId }, { $set: tempCourse });

  //check that the update succeeded
  if (updatedInfo.modifiedCount === 0) throw new Error('Failed to add teacher!');

  //upon successful add, return the name of the course for output
  return tempCourse.name;
}

//Note: Takes in courseId and studentId as strings.
//courseId's conversion to ObjectId occurs within the function
async function addStudent(courseId, studentId) {
  //error check inputs
  error.str(courseId);
  error.str(studentId);
  const parsedCourseId = error.validId(courseId);
  const parsedStudentId = error.validId(studentId);

  //retrieve the courses collection
  const coursesCollection = await courses();

  //retrieve the original course information
  let tempCourse = await coursesCollection.findOne({ _id: parsedCourseId });

  //the above call will result in null if the given ID doesn't exist in the database
  if (!tempCourse) throw 'Course with that ID is not in database!';

  //if the student already teaches the respective course, throw an error
  if (tempCourse.students.some((e) => e.toString() === studentId)) throw 'Student is already enrolled in that course!';

  //push the provided studentId to the tempCourse's students array
  tempCourse.students.push(parsedStudentId);

  //"push" the updated course info to the same ID in the database
  const updatedInfo = await coursesCollection.updateOne({ _id: parsedCourseId }, { $set: tempCourse });

  //check that the update succeeded
  if (updatedInfo.modifiedCount === 0) throw 'Failed to add student!';

  //upon successful add, return the name of the course for output
  return tempCourse.name;
}

//Note: Takes in courseId and studentId as strings.
async function removeStudent(courseId, studentId) {
  //error check inputs
  error.str(courseId);
  error.str(studentId);

  //retrieve the courses and users collections
  const coursesCollection = await courses();

  const parsedCourseId = error.validId(courseId);
  const parsedStudentId = error.validId(studentId);

  //retrieve the original course information
  let tempCourse = await coursesCollection.findOne({ _id: parsedCourseId });

  //the above call will result in null if the given ID doesn't exist in the database
  if (!tempCourse) throw 'Course with that ID is not in database!';

  //if the student isn't enrolled in the course they're dropping, throw an error
  if (!tempCourse.students.some((e) => e.toString() === studentId))
    throw new Error('Cannot drop student from a course they are not enrolled in!');

  //find the course in the user's "classes" array
  for (let student of tempCourse.students) {
    //once the student has been found
    //NOTE: checking both string and ObjectId form due to discrepancies in format from seed versions
    if (student == studentId || student == parsedStudentId) {
      //edge case: user is dropping the only student enrolled
      if (tempCourse.students.length == 1) tempCourse.students.pop();
      //otherwise, remove the student from the array
      else {
        let ind = tempCourse.students.indexOf(student);
        tempCourse.students.splice(ind, 1);
      }
    }
  }

  //"push" the updated course info to the same ID in the database
  const updatedInfo = await coursesCollection.updateOne({ _id: parsedCourseId }, { $set: tempCourse });

  //check that the update succeeded
  if (updatedInfo.modifiedCount === 0) throw 'Failed to remove student from course!';

  //upon successful removal, return the name of the course for output
  return tempCourse.name;
}

//Note: Takes in courseId and assignmentId as strings.
async function removeAssignment(courseId, assignmentId) {
  //error check inputs
  error.str(courseId);
  error.str(assignmentId);

  //retrieve the courses collection
  const coursesCollection = await courses();

  //check if the provided studentId is a valid ObjectId
  if (!ObjectId.isValid(courseId)) throw 'Provided ID not proper format for ObjectID!';
  //convert the ID string to an ObjectID
  let objId = ObjectId(courseId);

  //retrieve the original course information
  let tempCourse = await coursesCollection.findOne({ _id: objId });

  //the above call will result in null if the given ID doesn't exist in the database
  if (tempCourse === null) throw 'Course with that ID is not in database!';

  //Make sure there's at least 1 assignment in the course's "assignments" array
  if (tempCourse.assignments.length == 0) throw 'Cannot remove an assignment from a course with no assignments!';

  //boolean to track if the assignment was found in the course's "assignments" array
  let found = false;

  //find the course in the user's "classes" array
  for (let assignment of tempCourse.assignments) {
    assignmentIdStr = assignment._id.toString();
    if (assignmentIdStr == assignmentId) {
      found = true;
      //edge case: user is dropping the only assignment created
      if (tempCourse.assignments.length == 1) tempCourse.assignments.pop();
      //otherwise, remove the assignment from the array
      else {
        let ind = tempCourse.assignments.indexOf(assignment);
        tempCourse.assignments.splice(ind, 1);
      }
    }
  }

  //Throw an error when trying to drop a student that the course didn't have enrolled
  if (found == false) throw 'Assignment does not exist!';

  //"push" the updated course info to the same ID in the database
  const updatedInfo = await coursesCollection.updateOne({ _id: objId }, { $set: tempCourse });

  //check that the update succeeded
  if (updatedInfo.modifiedCount === 0) throw 'Failed to remove assignment!';

  //upon successful removal, return the name of the course for output
  return tempCourse.name;
}

//Note: Takes in courseId and assignmentId as strings.
async function editAssignmentDescription(courseId, assignmentId, newDescription) {
  //error check inputs
  error.str(courseId);
  error.str(assignmentId);
  error.str(newDescription);

  //retrieve the courses collection
  const coursesCollection = await courses();

  //check if the provided studentId is a valid ObjectId
  if (!ObjectId.isValid(courseId)) throw 'Provided ID not proper format for ObjectID!';
  //convert the ID string to an ObjectID
  let objId = ObjectId(courseId);

  //retrieve the original course information
  let tempCourse = await coursesCollection.findOne({ _id: objId });

  //the above call will result in null if the given ID doesn't exist in the database
  if (tempCourse === null) throw 'Course with that ID is not in database!';

  //Make sure there's at least 1 assignment in the course's "assignments" array
  if (tempCourse.assignments.length == 0) throw 'Cannot remove an assignment from a course with no assignments!';

  //boolean to track if the assignment was found in the course's "assignments" array
  let found = false;

  //find the course in the user's "classes" array
  let ind = null;
  for (let assignment of tempCourse.assignments) {
    assignmentIdStr = assignment._id.toString();
    if (assignmentIdStr == assignmentId) {
      found = true;
      //edge case: user is dropping the only assignment created
      ind = tempCourse.assignments.indexOf(assignment);
    }
  }

  //Throw an error when trying to drop a student that the course didn't have enrolled
  if (found == false) throw 'Assignment does not exist!';

  tempCourse.assignments[ind].description = newDescription;

  //"push" the updated course info to the same ID in the database
  const updatedInfo = await coursesCollection.updateOne({ _id: objId }, { $set: tempCourse });

  //check that the update succeeded
  if (updatedInfo.modifiedCount === 0) throw 'Failed to remove student from course!';

  //upon successful removal, return the name of the course for output
  return tempCourse.name;
}

//Note: Takes in courseId and teacherId as strings.
async function removeTeacher(courseId, teacherId) {
  //error check inputs
  error.str(courseId);
  error.str(teacherId);

  //retrieve the courses collection
  const coursesCollection = await courses();

  //check if the provided teacherId is a valid ObjectId
  if (!ObjectId.isValid(courseId)) throw 'Provided ID not proper format for ObjectID!';
  //convert the ID string to an ObjectID
  let objId = ObjectId(courseId);

  //retrieve the original course information
  let tempCourse = await coursesCollection.findOne({ _id: objId });

  //the above call will result in null if the given ID doesn't exist in the database
  if (tempCourse === null) throw 'Course with that ID is not in database!';

  //Make sure there's at least 1 teacher in the course's "teachers" array
  if (tempCourse.teachers.length == 0) throw 'Cannot remove a teacher from a course with no teachers!';

  //boolean to track if the teacher was found in the course's "teachers" array
  let found = false;

  //find the course in the user's "classes" array
  for (let teacher of tempCourse.teachers) {
    //once the teacher has been found
    //NOTE: Teachers are only stored as IDs
    if (teacher == teacherId) {
      found = true;
      //edge case: user is dropping the only teacher enrolled
      if (tempCourse.teachers.length == 1) tempCourse.teachers.pop();
      //otherwise, remove the teacher from the array
      else {
        let ind = tempCourse.teachers.indexOf(teacher);
        tempCourse.teachers.splice(ind, 1);
      }
    }
  }

  //Throw an error when trying to drop a teacher that wasn't teaching the course
  if (found == false) throw 'Teacher was not teaching in that course!';

  //"push" the updated course info to the same ID in the database
  const updatedInfo = await coursesCollection.updateOne({ _id: objId }, { $set: tempCourse });

  //check that the update succeeded
  if (updatedInfo.modifiedCount === 0) throw 'Failed to remove teacher from course!';

  //upon successful removal, return the name of the course for output
  return tempCourse.name;
}

async function getCourse(id) {
  error.str(id);
  const parsedId = error.validId(id);
  const coursesCollection = await courses();
  const course = await coursesCollection.findOne({ _id: parsedId });
  if (!course) throw new Error('No course found');
  return course;
}

async function createAssignment(type, name, description, courseId) {
  error.str(type);
  error.str(name);
  error.str(description);
  error.str(courseId);
  const parsedCourseID = error.validId(courseId);
  const coursesCollection = await courses();
  const course = await getCourse(courseId);
  if (!course) throw new Error('Course does not exist when trying to create assignment');
  const assignmentId = new ObjectId();

  const newAssignment = {
    _id: assignmentId,
    type,
    name,
    description,
  };

  const updatedInfo = await coursesCollection.updateOne(
    { _id: parsedCourseID },
    { $push: { assignments: newAssignment } }
  );
  if (updatedInfo.modifiedCount === 0) throw new Error('Failed to add assignment to the course!');

  return assignmentId;
}

async function getAllCourses() {
  const coursesCollection = await courses();

  let result = [];

  //loop through each course in the collection
  await coursesCollection.find().forEach(function (course) {
    //create a temporary object with the course's ID (in string format) and name, and add that to the array to be returned
    let tempObj = { courseId: course._id.toString(), courseName: course.name };
    result.push(tempObj);
  });

  return result;
}

module.exports = {
  getCourse,
  createCourse,
  addTeacher,
  addStudent,
  removeStudent,
  removeTeacher,
  createAssignment,
  removeAssignment,
  editAssignmentDescription,
  getAllCourses,
};
