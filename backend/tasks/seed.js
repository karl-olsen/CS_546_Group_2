const connection = require('../config/mongoConnection');
const data = require('../data');
const mongo = require('mongodb');
const { ObjectId } = require('mongodb');
const fs = require('fs');


async function main() {
  const db = await connection.connectToDb();
  await db.dropDatabase();

  //const x = await users.create('mike');
  const usersCollection = await db.collection('users');
  const coursesCollection = await db.collection('courses');

  const usersArray = [];
  const courseArray = [];

  const createUser = (firstName, lastName, email, role) => {
    return {
      _id: new ObjectId(),
      firstName, firstName,
      lastName, lastName,
      email, email,
      role, role,
      classes: []
    }
  }

  const addClass = (user, overallGrade) => {
    const newClass = {
      _id: new ObjectId(),
      overallGrade: overallGrade,
      grades: []
    }
    user.classes.push(newClass);
    return newClass;
  }

  const addGrades = (classObj, submissionFile, grade) => {
    const newGrade = {
      _id: new ObjectId(),
      submissionFile: submissionFile,
      grade: grade
    }
    classObj.grades.push(newGrade);
  }

  const createCourse = (name) => {
    const newCourse = {
      _id: new ObjectId(),
      name: name,
      teachers: [],
      students: [],
      assignments: []
    }
    return newCourse;
  }

  const createAssignment = (type, name, description) => {
    const newAssignment = {
      _id: new ObjectId(),
      type, type,
      name: name,
      description, description
    }
    return newAssignment;
  }

  let bucket = new mongo.GridFSBucket(db);
  let file1 = fs.createReadStream('./tasks/Assignment 1.txt')
    .pipe(bucket.openUploadStream('Assignment 1.txt'))
  let file2 = fs.createReadStream('./tasks/Assignment 2.txt')
    .pipe(bucket.openUploadStream('Assignment 2.txt'))
  let file3 = fs.createReadStream('./tasks/Assignment 3.txt')
    .pipe(bucket.openUploadStream('Assignment 3.txt'))
  let file4 = fs.createReadStream('./tasks/Assignment 4.txt')
    .pipe(bucket.openUploadStream('Assignment 4.txt'))

  const user1 = createUser("Angela", "Martin", "AngelaMartin@dunddermifflin.com", "student");
  const class1foruser1 = addClass(user1, 97);
  addGrades(class1foruser1, file1.id, 97);

  const user2 = createUser("Stanley", "Hudson", "StanleyHudson@dunddermifflin.com", "student");
  const class1foruser2 = addClass(user2, 87);
  const class2foruser2 = addClass(user2, 90);
  const class3foruser2 = addClass(user2, 67);
  addGrades(class1foruser2, file1.id, 97);
  addGrades(class2foruser2, file3.id, 89);
  addGrades(class3foruser2, file2.id, 90);

  const user3 = createUser("Phyllis", "Vance", "PhyllisVance@dunddermifflin.com", "student");
  const class1foruser3 = addClass(user3, 87);
  const class2foruser3 = addClass(user3, 90);
  const class3foruser3 = addClass(user3, 67);
  addGrades(class1foruser3, file1.id, 97);
  addGrades(class1foruser3, file2.id, 45);
  addGrades(class2foruser3, file1.id, 90);
  addGrades(class2foruser3, file2.id, 89);
  addGrades(class3foruser3, file1.id, 90);

  const user4 = createUser("Meredith", "Palmer", "MeredithPalmer@dunddermifflin.com", "student");
  addClass(user4, 87);

  const user5 = createUser("Toby", "Flenderson", "TobyFlenderson@dunddermifflin.com", "student");
  const class1foruser5 = addClass(user5, 87);
  const class2foruser5 = addClass(user5, 90);
  const class3foruser5 = addClass(user5, 67);
  const class4foruser5 = addClass(user5, 37);
  addClass(user5, 10);
  addClass(user5, 20);
  addGrades(class1foruser5, file1.id, 97);
  addGrades(class2foruser5, file1.id, 90);
  addGrades(class2foruser5, file2.id, 89);
  addGrades(class3foruser5, file1.id, 90);
  addGrades(class4foruser5, file1.id, 90);

  const user6 = createUser("Creed", "Bratton", "CreedBratton@dunddermifflin.com", "student");
  const class1foruser6 = addClass(user6, 20);
  const class2foruser6 = addClass(user6, 30);
  addGrades(class1foruser6, file1.id, 10);
  addGrades(class1foruser6, file2.id, 16);
  addGrades(class2foruser6, file1.id, 10);
  addGrades(class2foruser6, file2.id, 19);

  const user7 = createUser("Gabe", "Lewis", "GabeLewis@dunddermifflin.com", "student");
  const class1foruser7 = addClass(user7, 90);
  const class2foruser7 = addClass(user7, 90);
  const class3foruser7 = addClass(user7, 90);
  const class4foruser7 = addClass(user7, 100);
  const class5foruser7 = addClass(user7, 100);
  const class6foruser7 = addClass(user7, 100);
  addGrades(class1foruser7, file1.id, 90);
  addGrades(class1foruser7, file2.id, 100);
  addGrades(class1foruser7, file3.id, 90);
  addGrades(class1foruser7, file4.id, 100);
  addGrades(class2foruser7, file1.id, 80);
  addGrades(class2foruser7, file2.id, 70);
  addGrades(class2foruser7, file3.id, 100);
  addGrades(class2foruser7, file4.id, 100);
  addGrades(class3foruser7, file1.id, 90);
  addGrades(class4foruser7, file1.id, 100);
  addGrades(class5foruser7, file1.id, 100);
  addGrades(class6foruser7, file1.id, 100);

  const user8 = createUser("Roy", "Anderson", "RoyAnderson@dunddermifflin.com", "student");

  const user9 = createUser("Darryl", "Philbin", "DarrylPhilbin@dunddermifflin.com", "student");
  const class1foruser9 = addClass(user9, 87);
  const class2foruser9 = addClass(user9, 90);
  addGrades(class2foruser9, file1.id, 90);

  const user10 = createUser("Oscar", "Martinez", "OscarMartinez@dunddermifflin.com", "student");
  const class1foruser10 = addClass(user10, 87);
  const class2foruser10 = addClass(user10, 90);
  const class3foruser10 = addClass(user10, 55);
  const class4foruser10 = addClass(user10, 65);
  const class5foruser10 = addClass(user10, 78);
  const class6foruser10 = addClass(user10, 99);
  addGrades(class2foruser10, file1.id, 40);
  addGrades(class3foruser10, file1.id, 70);
  addGrades(class4foruser10, file1.id, 80);
  addGrades(class5foruser10, file1.id, 88);
  addGrades(class6foruser10, file1.id, 12);

  const user11 = createUser("Kevin", "Malone", "KevinMalone@dunddermifflin.com", "teacher");
  const user12 = createUser("Andy", "Bernard", "AndyBernard@dunddermifflin.com", "teacher");
  const user13 = createUser("Michael", "Scott", "MichaelScott@dunddermifflin.com", "teacher");
  const user14 = createUser("Dwight", "Schrute", "DwightSchrute@dunddermifflin.com", "teacher");
  const user15 = createUser("Jim", "Halpert", "JimHalpert@dunddermifflin.com", "teacher");
  const user16 = createUser("Pam", "Beesly", "PamBeesly@dunddermifflin.com", "teacher");
  const user17 = createUser("Ryan", "Howard", "RyanHoward@dunddermifflin.com", "teacher");
  const user18 = createUser("Nellie", "Bertram", "NellieBertram@dunddermifflin.com", "teacher");
  const user19 = createUser("Holly", "Flax", "HollyFlax@dunddermifflin.com", "teacher");
  const user20 = createUser("Erin", "Hannon", "ErinHannon@dunddermifflin.com", "teacher");

  const course1 = createCourse("Web Programming");
  const course1Assignment1 = createAssignment("Quiz", "MongoDB Quiz", "Test your MongoDB knowledge");
  const course1Assignment2 = createAssignment("Assignment", "HTML Assignment", "Submit HTML page");
  const course1Assignment3 = createAssignment("Quiz", "NodeJS Quiz", "Test your NodeJS knowledge")
  const course1Assignment4 = createAssignment("Assignment", "MongoDB", "Create collections and query");
  course1.assignments.push(course1Assignment1);
  course1.assignments.push(course1Assignment2);
  course1.assignments.push(course1Assignment3);
  course1.assignments.push(course1Assignment4);
  course1.teachers.push(user11._id);
  course1.students.push(user1._id);
  course1.students.push(user2._id);
  course1.students.push(user3._id);
  course1.students.push(user4._id);

  const course2 = createCourse("Data Structures");
  course2.teachers.push(user12._id);
  course2.students.push(user4._id);
  course2.students.push(user2._id);
  course2.students.push(user5._id);
  course2.students.push(user6._id);

  const course3 = createCourse("Advanced Algorithms");
  const course3Assignment1 = createAssignment("Assignment", "Merge Sort", "Submit merge sort implementation");
  const course3Assignment2 = createAssignment("Assignment", "Quick Sort", "Submit quick sort implementation");
  const course3Assignment3 = createAssignment("Assignment", "Djikstra", "Submit Djikstra algo implementation")
  const course3Assignment4 = createAssignment("Assignment", "Matrix chain multiplication", "Implement MCM");
  course3.assignments.push(course3Assignment1);
  course3.assignments.push(course3Assignment2);
  course3.assignments.push(course3Assignment3);
  course3.assignments.push(course3Assignment4);
  course3.teachers.push(user13._id);
  course3.students.push(user5._id);
  course3.students.push(user6._id);
  course3.students.push(user2._id);
  course3.students.push(user1._id);

  const course4 = createCourse("CyberSecurity");
  const course4Assignment1 = createAssignment("Assignment", "Mid-term", "Paper on cybersecurity");
  const course4Assignment2 = createAssignment("Assignment", "Finals", "Paper on ransomwares");
  course4.assignments.push(course4Assignment1);
  course4.assignments.push(course4Assignment2);
  course4.teachers.push(user14._id);
  course4.students.push(user1._id);
  course4.students.push(user2._id);
  course4.students.push(user3._id);
  course4.students.push(user4._id);
  course4.students.push(user5._id);
  course4.students.push(user6._id);
  course4.students.push(user7._id);
  course4.students.push(user8._id);

  const course5 = createCourse("Distribted Systems");
  const course5Assignment1 = createAssignment("Assignment", "FTP Protocol", "Implement FPT Protocol on AWS");
  course5.assignments.push(course5Assignment1);
  course5.teachers.push(user15._id);
  course5.students.push(user8._id);
  course5.students.push(user10._id);

  const course6 = createCourse("Artifical Intelligence");
  const course6Assignment1 = createAssignment("Assignment", "Linear Regression", "Linear Regression problems");
  course6.assignments.push(course6Assignment1);
  course6.teachers.push(user16._id);
  course6.students.push(user1._id);
  course6.students.push(user5._id);
  course6.students.push(user2._id);
  course6.students.push(user3._id);

  const course7 = createCourse("Machine Learning");
  const course7Assignment1 = createAssignment("Quiz", "ML Basics", "Machine Learning Basics");
  const course7Assignment2 = createAssignment("Assignment", "ML Libraries", "Machine Learning Libraries");
  course7.assignments.push(course7Assignment1);
  course7.assignments.push(course7Assignment2);
  course7.teachers.push(user17._id);
  course7.students.push(user9._id);
  course7.students.push(user7._id);

  const course8 = createCourse("Knowledge Discovery and Data Mining");
  const course8Assignment1 = createAssignment("Quiz", "Data Cleansing", "Data Cleaning");
  const course8Assignment2 = createAssignment("Assignment", "Data Mining using R", "Problem statement");
  const course8Assignment3 = createAssignment("Quiz", "Mid-term", "KDD Mid-term");
  const course8Assignment4 = createAssignment("Quiz", "Final", "KDD Final");
  course8.assignments.push(course8Assignment1);
  course8.assignments.push(course8Assignment2);
  course8.assignments.push(course8Assignment3);
  course8.assignments.push(course8Assignment4);
  course8.teachers.push(user18._id);
  course8.students.push(user1._id);
  course8.students.push(user8._id);
  course8.students.push(user9._id);
  course8.students.push(user10._id);

  const course9 = createCourse("DBMS I");
  const course9Assignment1 = createAssignment("Assignment", "Mid-term", "DBMS Mid-term");
  const course9Assignment2 = createAssignment("Assignment", "Final", "DBMS Final");
  const course9Assignment3 = createAssignment("Assignment", "JOIN clause", "Solve using Join");
  const course9Assignment4 = createAssignment("Assignment", "HAVING clause", "Solve using having");
  course9.assignments.push(course9Assignment1);
  course9.assignments.push(course9Assignment2);
  course9.assignments.push(course9Assignment3);
  course9.assignments.push(course9Assignment4);
  course9.teachers.push(user19._id);
  course9.students.push(user1._id);
  course9.students.push(user9._id);
  course9.students.push(user8._id);
  course9.students.push(user6._id);
  course9.students.push(user4._id);
  course9.students.push(user2._id);

  const course10 = createCourse("Applied Modeling");
  course10.teachers.push(user20._id);

  usersArray.push(user1);
  usersArray.push(user2);
  usersArray.push(user3);
  usersArray.push(user4);
  usersArray.push(user5);
  usersArray.push(user6);
  usersArray.push(user7);
  usersArray.push(user8);
  usersArray.push(user9);
  usersArray.push(user10);
  usersArray.push(user11);
  usersArray.push(user12);
  usersArray.push(user13);
  usersArray.push(user14);
  usersArray.push(user15);
  usersArray.push(user16);
  usersArray.push(user17);
  usersArray.push(user18);
  usersArray.push(user19);
  usersArray.push(user20);

  courseArray.push(course1);
  courseArray.push(course2);
  courseArray.push(course3);
  courseArray.push(course4);
  courseArray.push(course5);
  courseArray.push(course6);
  courseArray.push(course7);
  courseArray.push(course8);
  courseArray.push(course9);
  courseArray.push(course10);


  await usersCollection.insertMany(
    usersArray
  );

  await coursesCollection.insertMany(
    courseArray
  );

  console.log('Seeded');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    //connection.closeConnection();
  });
