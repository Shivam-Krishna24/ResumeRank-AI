const calculateMatchScore = (
  requiredSkills,
  candidateSkills
) => {

  const matchedSkills = requiredSkills.filter(
    (skill) =>
      candidateSkills.some(
        (candidateSkill) =>
          candidateSkill.toLowerCase() === skill.toLowerCase()
      )
  );

  const missingSkills = requiredSkills.filter(
    (skill) =>
      !candidateSkills.some(
        (candidateSkill) =>
          candidateSkill.toLowerCase() === skill.toLowerCase()
      )
  );

  const score =
    requiredSkills.length === 0
      ? 0
      : Math.round(
          (matchedSkills.length /
            requiredSkills.length) *
            100
        );

  return {
    matchedSkills,
    missingSkills,
    score
  };
};

module.exports = calculateMatchScore;