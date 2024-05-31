import React, { useState } from "react";
import "../Pages/SkillPage.css";

const SkillLevelSelector = ({ onSelect }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    onSelect(level);
  };

  return (
    <div className="skill-level-selector">
      <div
        className={`level-container ${
          selectedLevel === "beginner" && "selected"
        }`}
        onClick={() => handleLevelSelect("beginner")}
      >
        Beginner
      </div>
      <div
        className={`level-container ${
          selectedLevel === "intermediate" && "selected"
        }`}
        onClick={() => handleLevelSelect("intermediate")}
      >
        Intermediate
      </div>
      <div
        className={`level-container ${
          selectedLevel === "advanced" && "selected"
        }`}
        onClick={() => handleLevelSelect("advanced")}
      >
        Advanced
      </div>
    </div>
  );
};

export default SkillLevelSelector;
