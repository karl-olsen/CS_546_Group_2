const bcrypt = require('bcrypt');
const connection = require('../config/mongoConnection');
const data = require('../data');
const mongo = require('mongodb');
const { ObjectId } = require('mongodb');
const fs = require('fs');

async function main() {
  const db = await connection.connectToDb();
  await db.dropDatabase();
  console.log('Note this will take a little while because of the password hashing ! :)');

  //Add teachers
  const teacher1 = await data.users.createUser(
    'Kevin',
    'Malone',
    'KevinMalone@dunddermifflin.com',
    'password11',
    'teacher'
  );
  const teacher2 = await data.users.createUser(
    'Andy',
    'Bernard',
    'AndyBernard@dunddermifflin.com',
    'password12',
    'teacher'
  );
  const teacher3 = await data.users.createUser(
    'Michael',
    'Scott',
    'MichaelScott@dunddermifflin.com',
    'password13',
    'teacher'
  );
  const teacher4 = await data.users.createUser(
    'Dwight',
    'Schrute',
    'DwightSchrute@dunddermifflin.com',
    'password14',
    'teacher'
  );
  const teacher5 = await data.users.createUser(
    'Jim',
    'Halpert',
    'JimHalpert@dunddermifflin.com',
    'password15',
    'teacher'
  );
  const teacher6 = await data.users.createUser(
    'Pam',
    'Beesly',
    'PamBeesly@dunddermifflin.com',
    'password16',
    'teacher'
  );
  const teacher7 = await data.users.createUser(
    'Ryan',
    'Howard',
    'RyanHoward@dunddermifflin.com',
    'password17',
    'teacher'
  );
  const teacher8 = await data.users.createUser(
    'Nellie',
    'Bertram',
    'NellieBertram@dunddermifflin.com',
    'password18',
    'teacher'
  );
  const teacher9 = await data.users.createUser(
    'Holly',
    'Flax',
    'HollyFlax@dunddermifflin.com',
    'password19',
    'teacher'
  );
  const teacher10 = await data.users.createUser(
    'Erin',
    'Hannon',
    'ErinHannon@dunddermifflin.com',
    'password20',
    'teacher'
  );

  //Add courses along with teachers
  const course1 = await data.courses.createCourse('Web Programming', teacher1.toString());
  const course2 = await data.courses.createCourse('Data Structures', teacher2.toString());
  const course3 = await data.courses.createCourse('Advanced Algorithms', teacher3.toString());
  const course4 = await data.courses.createCourse('CyberSecurity', teacher4.toString());
  const course5 = await data.courses.createCourse('Distribted Systems', teacher5.toString());
  const course6 = await data.courses.createCourse('Artifical Intelligence', teacher6.toString());
  const course7 = await data.courses.createCourse('Machine Learning', teacher7.toString());
  const course8 = await data.courses.createCourse('Knowledge Discovery and Data Mining', teacher8.toString());
  const course9 = await data.courses.createCourse('DBMS I', teacher9.toString());
  const course10 = await data.courses.createCourse('Applied Modeling', teacher10.toString());

  //add course to the teacher in user collection
  await data.users.addCourseToTeacher(course1.toString(), teacher1.toString());
  await data.users.addCourseToTeacher(course2.toString(), teacher2.toString());
  await data.users.addCourseToTeacher(course3.toString(), teacher3.toString());
  await data.users.addCourseToTeacher(course4.toString(), teacher4.toString());
  await data.users.addCourseToTeacher(course5.toString(), teacher5.toString());
  await data.users.addCourseToTeacher(course6.toString(), teacher6.toString());
  await data.users.addCourseToTeacher(course7.toString(), teacher7.toString());
  await data.users.addCourseToTeacher(course8.toString(), teacher8.toString());
  await data.users.addCourseToTeacher(course9.toString(), teacher9.toString());
  await data.users.addCourseToTeacher(course10.toString(), teacher10.toString());

  //Assignments for course1
  const course1Assignment1 = await data.courses.createAssignment(
    'Quiz',
    'MongoDB Quiz',
    'Test your MongoDB knowledge',
    course1.toString()
  );
  const course1Assignment2 = await data.courses.createAssignment(
    'Assignment',
    'HTML Assignment',
    'Submit HTML page',
    course1.toString()
  );
  const course1Assignment3 = await data.courses.createAssignment(
    'Quiz',
    'NodeJS Quiz',
    'Test your NodeJS knowledge',
    course1.toString()
  );
  const course1Assignment4 = await data.courses.createAssignment(
    'Assignment',
    'MongoDB',
    'Create collections and query',
    course1.toString()
  );

  //Assignments for course3
  const course3Assignment1 = await data.courses.createAssignment(
    'Assignment',
    'Merge Sort',
    'Submit merge sort implementation',
    course3.toString()
  );
  const course3Assignment2 = await data.courses.createAssignment(
    'Assignment',
    'Quick Sort',
    'Submit quick sort implementation',
    course3.toString()
  );
  const course3Assignment3 = await data.courses.createAssignment(
    'Assignment',
    'Djikstra',
    'Submit Djikstra algo implementation',
    course3.toString()
  );
  const course3Assignment4 = await data.courses.createAssignment(
    'Assignment',
    'Matrix chain multiplication',
    'Implement MCM',
    course3.toString()
  );

  // //Assignments for course4
  const course4Assignment1 = await data.courses.createAssignment(
    'Assignment',
    'Mid-term',
    'Paper on cybersecurity',
    course4.toString()
  );
  const course4Assignment2 = await data.courses.createAssignment(
    'Assignment',
    'Finals',
    'Paper on ransomwares',
    course4.toString()
  );

  //Assignments for course5
  const course5Assignment1 = await data.courses.createAssignment(
    'Assignment',
    'FTP Protocol',
    'Implement FPT Protocol on AWS',
    course5.toString()
  );

  //Assignments for course6
  const course6Assignment1 = await data.courses.createAssignment(
    'Assignment',
    'Linear Regression',
    'Linear Regression problems',
    course6.toString()
  );

  // //Assignments for course7
  const course7Assignment1 = await data.courses.createAssignment(
    'Quiz',
    'ML Basics',
    'Machine Learning Basics',
    course7.toString()
  );
  const course7Assignment2 = await data.courses.createAssignment(
    'Assignment',
    'ML Libraries',
    'Machine Learning Libraries',
    course7.toString()
  );

  //Assignments for course8
  const course8Assignment1 = await data.courses.createAssignment(
    'Quiz',
    'Data Cleansing',
    'Data Cleaning',
    course8.toString()
  );
  const course8Assignment2 = await data.courses.createAssignment(
    'Assignment',
    'Data Mining using R',
    'Problem statement',
    course8.toString()
  );
  const course8Assignment3 = await data.courses.createAssignment(
    'Quiz',
    'Mid-term',
    'KDD Mid-term',
    course8.toString()
  );
  const course8Assignment4 = await data.courses.createAssignment('Quiz', 'Final', 'KDD Final', course8.toString());

  //Assignments for course9
  const course9Assignment1 = await data.courses.createAssignment(
    'Assignment',
    'Mid-term',
    'DBMS Mid-term',
    course9.toString()
  );
  const course9Assignment2 = await data.courses.createAssignment(
    'Assignment',
    'Final',
    'DBMS Final',
    course9.toString()
  );
  const course9Assignment3 = await data.courses.createAssignment(
    'Assignment',
    'JOIN clause',
    'Solve using Join',
    course9.toString()
  );
  const course9Assignment4 = await data.courses.createAssignment(
    'Assignment',
    'HAVING clause',
    'Solve using having',
    course9.toString()
  );

  //Assignments for course10
  const course10Assignment1 = await data.courses.createAssignment(
    'Assignment',
    'Mid-term',
    'Applied Modelling Mid-Term',
    course10.toString()
  );
  const course10Assignment2 = await data.courses.createAssignment(
    'Assignment',
    'Final',
    'Applied Modelling Final',
    course10.toString()
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
  await data.users.enroll(course2.toString(), student1.toString());
  await data.users.enroll(course3.toString(), student1.toString());
  await data.courses.addStudent(course1.toString(), student1.toString());
  await data.courses.addStudent(course2.toString(), student1.toString());
  await data.courses.addStudent(course3.toString(), student1.toString());

  const student2 = await data.users.createUser(
    'Stanley',
    'Hudson',
    'StanleyHudson@dunddermifflin.com',
    'password2',
    'student'
  );
  await data.users.enroll(course4.toString(), student2.toString());
  await data.users.enroll(course2.toString(), student2.toString());
  await data.users.enroll(course3.toString(), student2.toString());
  await data.courses.addStudent(course4.toString(), student2.toString());
  await data.courses.addStudent(course2.toString(), student2.toString());
  await data.courses.addStudent(course3.toString(), student2.toString());

  const student3 = await data.users.createUser(
    'Phyllis',
    'Vance',
    'PhyllisVance@dunddermifflin.com',
    'password3',
    'student'
  );
  await data.users.enroll(course3.toString(), student3.toString());
  await data.users.enroll(course5.toString(), student3.toString());
  await data.courses.addStudent(course3.toString(), student3.toString());
  await data.courses.addStudent(course5.toString(), student3.toString());

  const student4 = await data.users.createUser(
    'Meredith',
    'Palmer',
    'MeredithPalmer@dunddermifflin.com',
    'password4',
    'student'
  );
  await data.users.enroll(course4.toString(), student4.toString());
  await data.courses.addStudent(course4.toString(), student4.toString());

  const student5 = await data.users.createUser(
    'Toby',
    'Flenderson',
    'TobyFlenderson@dunddermifflin.com',
    'password5',
    'student'
  );
  await data.users.enroll(course6.toString(), student5.toString());
  await data.users.enroll(course7.toString(), student5.toString());
  await data.users.enroll(course8.toString(), student5.toString());
  await data.users.enroll(course9.toString(), student5.toString());
  await data.courses.addStudent(course6.toString(), student5.toString());
  await data.courses.addStudent(course7.toString(), student5.toString());
  await data.courses.addStudent(course8.toString(), student5.toString());
  await data.courses.addStudent(course9.toString(), student5.toString());

  const student6 = await data.users.createUser(
    'Creed',
    'Bratton',
    'CreedBratton@dunddermifflin.com',
    'password6',
    'student'
  );

  const student7 = await data.users.createUser('Gabe', 'Lewis', 'GabeLewis@dunddermifflin.com', 'password7', 'student');
  await data.users.enroll(course1.toString(), student7.toString());
  await data.users.enroll(course7.toString(), student7.toString());
  await data.users.enroll(course6.toString(), student7.toString());
  await data.users.enroll(course8.toString(), student7.toString());
  await data.courses.addStudent(course1.toString(), student7.toString());
  await data.courses.addStudent(course7.toString(), student7.toString());
  await data.courses.addStudent(course6.toString(), student7.toString());
  await data.courses.addStudent(course8.toString(), student7.toString());

  const student8 = await data.users.createUser(
    'Roy',
    'Anderson',
    'RoyAnderson@dunddermifflin.com',
    'password8',
    'student'
  );
  await data.users.enroll(course2.toString(), student8.toString());
  await data.users.enroll(course3.toString(), student8.toString());
  await data.users.enroll(course4.toString(), student8.toString());
  await data.courses.addStudent(course2.toString(), student8.toString());
  await data.courses.addStudent(course3.toString(), student8.toString());
  await data.courses.addStudent(course4.toString(), student8.toString());

  const student9 = await data.users.createUser(
    'Darryl',
    'Philbin',
    'DarrylPhilbin@dunddermifflin.com',
    'password9',
    'student'
  );
  await data.users.enroll(course2.toString(), student9.toString());
  await data.users.enroll(course3.toString(), student9.toString());
  await data.users.enroll(course4.toString(), student9.toString());
  await data.users.enroll(course9.toString(), student9.toString());
  await data.users.enroll(course6.toString(), student9.toString());
  await data.courses.addStudent(course2.toString(), student9.toString());
  await data.courses.addStudent(course3.toString(), student9.toString());
  await data.courses.addStudent(course4.toString(), student9.toString());
  await data.courses.addStudent(course9.toString(), student9.toString());
  await data.courses.addStudent(course6.toString(), student9.toString());

  const student10 = await data.users.createUser(
    'Oscar',
    'Martinez',
    'OscarMartinez@dunddermifflin.com',
    'password10',
    'student'
  );
  await data.users.enroll(course9.toString(), student10.toString());
  await data.courses.addStudent(course9.toString(), student10.toString());

  //Add Grades to student1
  await data.users.addGrade(student1.toString(), course1.toString(), course1Assignment1.toString(), '97');
  await data.users.addGrade(student1.toString(), course3.toString(), course3Assignment2.toString(), '86');
  await data.users.addGrade(student1.toString(), course3.toString(), course3Assignment1.toString(), '75');

  //Add Grades to student2
  await data.users.addGrade(student2.toString(), course4.toString(), course4Assignment1.toString(), '100');
  await data.users.addGrade(student2.toString(), course4.toString(), course4Assignment2.toString(), '85');
  await data.users.addGrade(student2.toString(), course3.toString(), course3Assignment1.toString(), '97');

  //Add Grades to student3
  await data.users.addGrade(student3.toString(), course5.toString(), course5Assignment1.toString(), '60');
  await data.users.addGrade(student3.toString(), course3.toString(), course3Assignment4.toString(), '40');

  //Add Grades to student4
  await data.users.addGrade(student4.toString(), course4.toString(), course4Assignment1.toString(), '100');

  //Add Grades to student5
  await data.users.addGrade(student5.toString(), course6.toString(), course6Assignment1.toString(), '80');
  await data.users.addGrade(student5.toString(), course7.toString(), course7Assignment1.toString(), '70');
  await data.users.addGrade(student5.toString(), course7.toString(), course7Assignment2.toString(), '99');
  await data.users.addGrade(student5.toString(), course9.toString(), course9Assignment1.toString(), '100');

  //Add Grades to student7
  await data.users.addGrade(student7.toString(), course1.toString(), course1Assignment1.toString(), '100');
  await data.users.addGrade(student7.toString(), course7.toString(), course7Assignment2.toString(), '100');
  await data.users.addGrade(student7.toString(), course6.toString(), course6Assignment1.toString(), '100');
  await data.users.addGrade(student7.toString(), course8.toString(), course8Assignment1.toString(), '100');

  //Add Grades to student8
  await data.users.addGrade(student8.toString(), course3.toString(), course3Assignment3.toString(), '100');
  await data.users.addGrade(student8.toString(), course4.toString(), course4Assignment2.toString(), '100');

  //Add Grades to student9
  await data.users.addGrade(student9.toString(), course3.toString(), course3Assignment3.toString(), '100');
  await data.users.addGrade(student9.toString(), course4.toString(), course4Assignment1.toString(), '100');
  await data.users.addGrade(student9.toString(), course9.toString(), course9Assignment2.toString(), '100');
  await data.users.addGrade(student9.toString(), course6.toString(), course6Assignment1.toString(), '100');

  //Add Grades to student9
  await data.users.addGrade(student10.toString(), course9.toString(), course9Assignment3.toString(), '100');
  await data.users.addGrade(student10.toString(), course9.toString(), course9Assignment4.toString(), '100');

  console.log('Seeded');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    connection.closeConnection();
  });
