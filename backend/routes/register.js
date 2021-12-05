const express = require('express');
const router = express.Router();
const { doesEmailExist } = require('../data/users');
const userData = require('../data/users');
const error = require('../error');

//helper function to make sure that a given name doesn't have numbers or special characters (excluding hyphens and apostrophes)
function checkNameValidity(name)  {
  //regex of all lower and upper case characters, including those with diacritics, as well as hyphen and apostrophe symbols
  let validCharacters = /^[A-Za-zÀ-ÖØ-öø-ÿ-']+$/;
  //checks that all characters in the name are in the validCharacters regex
  if(name.match(validCharacters))
    return true;
  else
    return false;
}

router.post('/', async (req, res) => {
  try {
    const userBody = req.body;
    try {
      // Test all invalid scenarios; throw 400 if true
      error.str(userBody?.firstName);
      if(!checkNameValidity(userBody.firstName)) throw new Error('Invalid first name given!');
      error.str(userBody.lastName);
      if(!checkNameValidity(userBody.lastName)) throw new Error('Invalid last name given!');
      error.str(userBody?.email);
      error.str(userBody?.password);
      error.validPassword(userBody?.password);
      error.str(userBody?.role);
      error.validRole(userBody?.role);
      const exists = await doesEmailExist(userBody?.email);
      if (exists) throw new Error('Email already exists');
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    // Create a user
    await userData.createUser(
      userBody?.firstName,
      userBody?.lastName,
      userBody?.email,
      userBody?.password,
      userBody?.role
    );

    return res.status(200).json({ status: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
