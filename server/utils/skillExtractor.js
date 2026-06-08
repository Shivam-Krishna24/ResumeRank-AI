const skillDictionary = require("./skillDictionary");

const extractSkills = (text) => {
  const foundSkills = [];

  const lowerText = text.toLowerCase();

  skillDictionary.forEach((skill) => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  return [...new Set(foundSkills)];
};

module.exports = extractSkills;