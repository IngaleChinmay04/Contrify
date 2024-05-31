import React from "react";
import { useState, useEffect } from "react";
import Card from "../Components/Card.js";
import "./Card.css";
import GlossaryData from "../Data/GlossaryData.json";
import "./GlossaryPage.css";
const GlossaryPage = () => {
  const [cardData, setCardData] = useState([]);

  useEffect(() => {
    setCardData(GlossaryData);
  }, []);

  return (
    <div className="glossary-page-container">
      <div className="glossary-container">
        <h1 id="glossary-heading"> Welcome to the Open Source Glossary</h1>
        <p>
          "Whether you're a newcomer to the world of open source or a seasoned
          developer, navigating the vast array of terminology can be
          overwhelming. Our comprehensive glossary is here to help you make
          sense of the jargon commonly encountered in the open-source
          community."
        </p>
      </div>
      <h2 style={{ margin: "20px", color: "white" }}>All Glossary Terms</h2>
      <div className="card-container">
        {cardData.map((card, index) => (
          <Card
            key={index}
            frontContent={card.frontContent}
            backContent={card.backContent}
          />
        ))}
      </div>
    </div>
  );
};

export default GlossaryPage;
