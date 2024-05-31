import React from "react";

function WelcomeContainer({ onNext, userData }) {
  let welcomeName = userData.fullName || "Loading...";
  return (
    <div className="WelcomeContainer">
      <h1 className="WelcomeText">Welcome {welcomeName} !! </h1>
      <p id="WelcomePara">
        We’re thrilled to have you join our vibrant community of developers,
        learners, and contributors. <br />
        Key Features: <br />
        1)Discover Repositories: Find projects that match your interests and
        skill level. <br />
        2)Personalized Recommendations: Get tailored suggestions based on your
        coding profile. <br />
        3)Connect and Collaborate: Engage with fellow developers and share your
        insights. <br />
        Ready to explore? Click Next to unveil more exciting features!
      </p>
      <div className="button-container">
        <button onClick={onNext}>Next</button>
      </div>
    </div>
  );
}

export default WelcomeContainer;
