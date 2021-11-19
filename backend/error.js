const { ObjectId } = require('mongodb');

const arr = (array, allowEmpty) => {
  if (!array) throw new Error('Input array argument is undefined or null, please provide input.');
  if (!Array.isArray(array)) throw new Error('Input argument is not of type array, please provide array only.');
  if (!allowEmpty && array.length === 0)
    throw new Error('Array input has an empty array present. Please ensure all arrays contain at least 1 element');
};

const num = (elem) => {
  if (!elem && elem !== 0) throw new Error('Input number argument is not defined.');
  if (typeof elem !== 'number') throw new Error('Input argument is not of type number.');
};

const obj = (obj, emptyAllowed) => {
  if (!obj) throw new Error('Input object is undefined or null. Please provide input.');

  if (typeof obj !== 'object' || obj.constructor !== Object) throw new Error('Input must be of type object.');

  if (!emptyAllowed && Object.keys(obj).length < 1) throw new Error('Input object must contain at least one key');
};

const str = (string) => {
  if (!string) throw new Error('Input string is undefined or null, please provide input.');
  if (typeof string !== 'string') throw new Error(' Input must be of type string.');
  if (string.length === 0) throw new Error('Input string must be greater than 0 in length.');
  if (!string.trim().length) throw new Error(' Input string contained only whitespace.');
};

const validId = (id) => {
  if (!id) throw new Error('You must provide an ID string.');
  const placeholderObjId = ObjectId();
  if (typeof id !== 'string' && typeof id !== typeof placeholderObjId)
    throw new Error('You must provide an ID that is a string or ObjectID');
  if (typeof id === 'string' && id.length === 0) throw new Error('Input string must be greater than 0 in length.');
  if (typeof id === 'string' && !id.trim().length) throw new Error('Input string contained only whitespace.');
  let parsed = undefined;
  if (typeof id === 'string') {
    try {
      parsed = ObjectId(id);
    } catch (e) {
      throw new Error('Input string ID is unable to convert into an ObjectID');
    }
  }
  return parsed ? parsed : id;
};

const validPassword = (string) => {
  str(string);

  if (string.length < 6) throw new Error('Password must be at least 6 characters.');
};

const validRole = (role) => {
  str(role);

  const parsed = role.toLowerCase().trim();

  if (parsed !== 'student' || parsed !== 'teacher') throw new Error("Roles must be 'student' or 'teacher' only.");
};

const validDate = (dateString) => {
  const isDateString = (dateString) => {
    const regex = /^\d\d[/]\d\d[/]\d\d\d\d$/;
    return regex.test(dateString);
  };

  // regex for date string
  if (!isDateString(dateString)) throw new Error('You must provide a date in the format of MM/DD/YYYY');

  let monthNum = 0;
  let dayNum = 0;
  let yearNum = 0;

  // Citation
  // https://stackoverflow.com/questions/1779013/check-if-string-contains-only-digits
  const isNumString = (num) => {
    return /^\d+$/.test(num);
  };

  const splitDate = dateString.split('/');

  const month = splitDate[0];
  const day = splitDate[1];
  const year = splitDate[2];

  str(month);
  if (!isNumString(month)) throw new Error('Cannot convert month with non digits chars.');
  monthNum = parseInt(month);
  if (!monthNum) throw new Error('Cannot convert month string into number.');

  // Check if valid month
  if (monthNum < 1 || monthNum > 12) throw new Error('Month must be between 1 through 12.');

  str(day);
  if (!isNumString(day)) throw new Error('Cannot convert day with non digits chars.');
  dayNum = parseInt(day);
  if (!dayNum) throw new Error('Cannot convert day string into number.');

  str(year);
  if (!isNumString(year)) throw new Error('Cannot convert year with non digits chars.');
  yearNum = parseInt(year);
  if (!yearNum) throw new Error('Cannot convert year string into number.');

  const isValidDate = (mm, dd, yyyy) => {
    const d = new Date(`${mm}-${dd}-${yyyy}`);
    if (d.getDate() !== dd) throw new Error(`There are not ${dd} days in the month ${mm} in ${yyyy}.`);
  };

  const isToday = (mm, dd, yyyy) => {
    const providedDate = new Date(`${mm}-${dd}-${yyyy}`);
    const today = new Date();

    return (
      providedDate.getDate() === today.getDate() &&
      providedDate.getMonth() === today.getMonth() &&
      providedDate.getFullYear() === today.getFullYear()
    );
  };

  isValidDate(monthNum, dayNum, yearNum);

  if (!isToday(monthNum, dayNum, yearNum)) throw new Error('You cannot leave a review on days that are not today!');
};

module.exports = {
  arr,
  num,
  obj,
  str,
  validId,
  validDate,
  validPassword,
  validRole,
};
