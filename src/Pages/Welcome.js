import React, { useEffect } from "react";
import { useState } from "react";
import "./Welcome.css";
import "../index.css";
import WelcomeContainer from "../Components/WelcomeContainer";
import WelcomeContainer2 from "../Components/WelcomeContainer2";
import WelcomeContainer3 from "../Components/WelcomeContainer3";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function WelcomePage() {
  const location = useLocation();
  const { userId } = location.state || null;
  const [currentContainer, setCurrentContainer] = useState(1);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:4000/getData/${userId}`
        );
        if (response.status === 200) {
          console.log(response.data);
          setUserData(response.data);
        }
      } catch (e) {
        console.log(e.message);
      }
    }
    fetchData();
  }, [userId]);

  const handleButtonClick = () => {
    if (currentContainer < 3) {
      setCurrentContainer((prev) => prev + 1);
    } else {
      navigate("/homePage", { state: { userId: userId } });
    }
  };
  return (
    <div className="welcome-container">
      {currentContainer === 1 && userData && (
        <WelcomeContainer onNext={handleButtonClick} userData={userData} />
      )}
      {currentContainer === 2 && (
        <WelcomeContainer2 onNext={handleButtonClick} />
      )}
      {currentContainer === 3 && (
        <WelcomeContainer3 onNext={handleButtonClick} />
      )}
    </div>
  );
}

export default WelcomePage;
