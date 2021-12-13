const bcrypt = require('bcrypt');
const connection = require('../config/mongoConnection');
const data = require('../data');
const mongo = require('mongodb');
const { ObjectId } = require('mongodb');
const fs = require('fs');

async function main() {
  const db = await connection.connectToDb();
  await db.dropDatabase();

  //Add teachers
  const teacher1 = await data.users.createUser(
    'Kevin',
    'Malone',
    'KevinMalone@dunddermifflin.com',
    'password11',
    'teacher'
  );

  //Add courses along with teachers
  const course1 = await data.courses.createCourse('Web Programming', teacher1.toString());

  //add course to the teacher in user collection
  await data.users.addCourseToTeacher(course1.toString(), teacher1.toString());

  //Assignments for course1
  const course1Assignment1 = await data.courses.createAssignment(
    'Quiz',
    'MongoDB Quiz',
    'Test your MongoDB knowledge',
    course1.toString()
  );

  //Create student and enroll in courses
  const student1 = await data.users.createUser(
    'Angela',
    'Martin',
    'AngelaMartin@dunddermifflin.com',
    'password1',
    'student'
  );
  await data.users.enroll(course1.toString(), student1.toString());
  await data.courses.addStudent(course1.toString(), student1.toString());

  // const one = new ObjectId();

  // // User should submit as assignment
  // await data.users.submitAssignment(
  //   student1.toString(),
  //   course1Assignment1.toString(),
  //   one.toString(),
  //   course1.toString()
  // );

  //Add Grades to student1
  // await data.users.addGrade(student1.toString(), course1.toString(), course1Assignment1.toString(), '97');

  console.log('Seeded');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    connection.closeConnection();
  });
