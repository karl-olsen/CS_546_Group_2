const express = require('express');
const router = express.Router();
const { doesEmailExist } = require('../data/users');
const userData = require('../data/users');
const error = require('../error');
const xss = require('xss');

//helper function to make sure that a given name doesn't have numbers or special characters (excluding hyphens and apostrophes)
function checkNameValidity(name) {
  //regex of all lower and upper case characters, including those with diacritics, as well as hyphen and apostrophe symbols
  let validCharacters = /^[A-Za-zÀ-ÖØ-öø-ÿ-']+$/;
  //checks that all characters in the name are in the validCharacters regex
  if (name.match(validCharacters)) return true;
  else return false;
}

router.post('/', async (req, res) => {
  try {
    const userBody = req.body;
    const parsedFirstName = xss(userBody?.firstName);
    const parsedLastName = xss(userBody?.lastName);
    const parsedEmail = xss(userBody?.email);
    const parsedPassword = xss(userBody?.password);
    const parsedRole = xss(userBody?.role);
    try {
      // Test all invalid scenarios; throw 400 if true
      error.str(parsedFirstName);
      if (!checkNameValidity(parsedFirstName)) throw new Error('Invalid first name given!');
      error.str(parsedLastName);
      if (!checkNameValidity(parsedLastName)) throw new Error('Invalid last name given!');
      error.str(parsedEmail);
      error.str(parsedPassword);
      error.validPassword(parsedPassword);
      error.str(parsedRole);
      error.validRole(parsedRole);
      const exists = await doesEmailExist(parsedEmail);
      if (exists) throw new Error('Email already exists');
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    // Create a user
    await userData.createUser(parsedFirstName, parsedLastName, parsedEmail, parsedPassword, parsedRole);

    return res.status(200).json({ status: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
