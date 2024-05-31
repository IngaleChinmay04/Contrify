import React from "react";
import ProgrammingLanguageSelector from "../Components/InterestComponent";
import "./ChooseInterest.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

import axios from "axios";

const ChooseInterestPage = () => {
  const location = useLocation();
  const { userId } = location.state || null;
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const navigate = useNavigate();
  const language = selectedLanguages.map((language) => language.name);

  const handleLanguageSelect = (language) => {
    setSelectedLanguages([...selectedLanguages, language]);
  };

  const handleNextButtonClick = async () => {
    console.log(language);
    console.log(userId);
    try {
      const response = await axios.post(
        "http://localhost:4000/chooseInterest",
        {
          userId,
          interests: language,
        }
      );

      if (!response.data || response.status !== 200) {
        throw new Error("Failed to choose interests");
      }

      navigate("/skillSelect", { state: { userId: userId } });
    } catch (error) {
      console.log(`Error : ${error}`);
      if (error.response) {
        console.log(`Error status: ${error.response.status}`);
      } else if (error.request) {
        console.log("Error making request");
      } else {
        console.log(`Error message: ${error.message}`);
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to choose interests. Please try again later!",
      });
    }
  };

  return (
    <div className="interest-container">
      <div className="choose-div">
        <h1 id="interest-text">Choose your programming languages interests</h1>
        <div className="language-div">
          <ProgrammingLanguageSelector onSelect={handleLanguageSelect} />
        </div>
        <div className="button-container">
          <button onClick={handleNextButtonClick}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default ChooseInterestPage;
