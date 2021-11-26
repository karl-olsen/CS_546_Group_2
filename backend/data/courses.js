const mongoCollections = require('../config/mongoCollections');
const courses = mongoCollections.courses;
const users = mongoCollections.users;
const error = require('../error');
let { ObjectId } = require('mongodb');

async function createCourse(courseName, teacherIds) {
  const coursesCollection = await courses();

  error.str(courseName);
  error.arr(teacherIds, true);

  const parsedTeacherIds = teacherIds.map((id) => error.validId(id));

  const newCourse = {
    name: courseName,
    teachers: parsedTeacherIds,
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
  if (tempCourse.teachers.includes(parsedTeacherId)) throw 'Teacher is already assigned to that course!';

  //push the provided teacherId to the tempCourse's teachers array
  tempCourse.teachers.push(parsedTeacherId);

  //"push" the updated course info to the same ID in the database
  const updatedInfo = await coursesCollection.updateOne({ _id: parsedCourseId }, { $set: tempCourse });

  //check that the update succeeded
  if (updatedInfo.modifiedCount === 0) throw 'Failed to add teacher!';

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
  if (tempCourse.students.includes(parsedStudentId)) throw 'Student is already enrolled in that course!';

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

  //Make sure there's at least 1 student in the course's "students" array
  if (tempCourse.students.length == 0) throw 'Cannot remove a student from a course with no students!';

  //boolean to track if the student was found in the course's "students" array
  let found = false;

  //find the course in the user's "classes" array
  for (let student of tempCourse.students) {
    //once the student has been found
    //NOTE: Students are only stored as IDs
    if (student == studentId) {
      found = true;
      //edge case: user is dropping the only student enrolled
      if (tempCourse.students.length == 1) tempCourse.students.pop();
      //otherwise, remove the student from the array
      else {
        let ind = tempCourse.students.indexOf(student);
        tempCourse.students.splice(ind, 1);
      }
    }
  }

  //Throw an error when trying to drop a student that the course didn't have enrolled
  if (found == false) throw 'Student was not enrolled in that course!';

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

// async function addEmptyGradeToAllEnrolled(courseId, assignmentId) {
//   if (!assignmentId || !courseId) throw new Error('Missing arguments to create empty grade');
//   const newGrade = {
//     _id: assignmentId,
//     submissionFile: null,
//     grade: -1,
//   };

//   const userCollection = await users();
//   const userClassesArr = await userCollection.find({ 'classes._id': courseId }).toArray();
//   if (!userClassesArr || userClassesArr.length === 0)
//     throw new Error('Unable to find any matching courses to apply empty grade');

//   console.log(userClassesArr);

//   const userClassesArr.forEach((user) => {
//     if (user?.role === 'student') {
//       user?.classes.forEach((course) => {
//         if (course._id === courseId) return;
//       });
//     }
//   });
// }

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

  // await addEmptyGradeToAllEnrolled(parsedCourseID, assignmentId);

  return assignmentId;
}

module.exports = {
  createCourse,
  addTeacher,
  addStudent,
  removeStudent,
  removeTeacher,
  createAssignment,
};
