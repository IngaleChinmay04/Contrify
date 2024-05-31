import React, { useState, useEffect } from "react";
import "../Pages/Tutorials.css";
import { Link } from "react-router-dom";
import TutorialData from "../Data/TutorialData.json";
import { Typewriter } from "react-simple-typewriter";

function TutorialCard({ language, appearance, isHomepage }) {
  const [tutorialData, setTutorialData] = useState(null);
  const [randomImage, setRandomImage] = useState(null);

  useEffect(() => {
    const languageData = TutorialData.languages.find(
      (item) => item.title === language
    );
    setTutorialData(languageData);
    if (languageData && languageData.image && languageData.image.length > 0) {
      const randomIndex = Math.floor(Math.random() * languageData.image.length);
      setRandomImage(languageData.image[randomIndex]);
    }
  }, [language]);

  if (!tutorialData) {
    return null;
  }

  let cardStyle;
  if (appearance === "image" && randomImage) {
    cardStyle = {
      backgroundImage: `url(${randomImage})`,
    };
  } else if (appearance !== "image") {
    cardStyle = { backgroundColor: appearance };
  } else {
    cardStyle = {};
  }

  return (
    <div className={`language-card ${appearance}`} style={cardStyle}>
      {isHomepage ? (
        <span>
          <Typewriter
            words={[tutorialData.title]}
            loop={false}
            cursor={true}
            cursorStyle="|"
            typeSpeed={400}
            deleteSpeed={150}
            delaySpeed={1000}
          />
        </span>
      ) : (
        <span>{tutorialData.title}</span>
      )}

      <hr />
      <p>{tutorialData.intro_desc}</p>
      <p id="guide-link">
        Click to know more:
        <Link
          to={`/blog/${tutorialData.title}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Read Here
        </Link>
      </p>
    </div>
  );
}

export default TutorialCard;
