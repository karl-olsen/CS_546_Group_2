const mongoCollections = require('../config/mongoCollections');
const courses = mongoCollections.courses;
const error = require('../error');

async function createCourse(courseName, teacherIds) {
  const coursesCollection = await courses();

  error.str(courseName);
  error.arr(teacherIds, true);

  const newCourse = {
    name: courseName,
    teachers: teacherIds,
  };

  const insert = await coursesCollection.insertOne(newCourse);
  if (insert.insertedCount === 0) throw new Error('Could not add new course.');

  const newId = insert.insertedId;

  return newId;
}

module.exports = {
  createCourse,
};
