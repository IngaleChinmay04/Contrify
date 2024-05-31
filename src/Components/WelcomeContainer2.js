import React from "react";

function WelcomeContainer2({ onNext }) {
  return (
    <div className="WelcomeContainer">
      <h1 className="WelcomeText">Unleash Your Coding Potential!</h1>
      <p id="WelcomePara">
        🌟Benefits Awaiting You <br />
        Your Journey Includes:
        <br /> 1)Skill Enhancement: Contribute to meaningful projects and
        enhance your programming progress. <br />
        2)Community Collaboration: Connect with a diverse community of
        developers and share your expertise. <br />
        3)Innovation Ignited: Drive innovation by embracing challenges and
        exploring new technologies.
        <br />
        Exciting, isn't it? Click Next to continue your journey!
      </p>
      <div className="button-container">
        <button onClick={onNext}>Next</button>
      </div>
    </div>
  );
}

export default WelcomeContainer2;
