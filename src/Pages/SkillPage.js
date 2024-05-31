import React, { useState } from "react";
import SkillLevelSelector from "../Components/SkillSelector";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const SkillPage = () => {
  const location = useLocation();
  const { userId } = location.state || null;
  const [selectedSkillLevel, setSelectedSkillLevel] = useState(null);
  const navigate = useNavigate();

  const handleLevelSelect = (level) => {
    setSelectedSkillLevel(level);
  };

  const handleSignUpButtonClick = async () => {
    try {
      const response = await axios.post("http://localhost:4000/skillSelect", {
        userId,
        skillLevel: selectedSkillLevel,
      });

      if (!response.data || response.status !== 200) {
        throw new Error("Failed to select skill level");
      }

      navigate("/welcome", { state: { userId: userId } });
    } catch (error) {
      console.error("Error selecting skill level:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to select skill level. Please try again later!",
      });
    }
  };

  return (
    <div className="skill-container">
      <div className="skill-div">
        <h1 id="skill-text">Select your skill level:</h1>
        <SkillLevelSelector onSelect={handleLevelSelect} />
        <div className="button-container">
          <button onClick={handleSignUpButtonClick}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default SkillPage;
