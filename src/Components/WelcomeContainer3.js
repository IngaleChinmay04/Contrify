import React from "react";

function WelcomeContainer3({ onNext }) {
  return (
    <div className="WelcomeContainer">
      <h1 className="WelcomeText">Lets get started!!</h1>
      <p id="WelcomePara">
        🎉 Your Next Steps <br />
        You're moments away from an enriching coding experience! Let's set the
        stage for your open-source journey.
        <br /> What's Next: <br />
        1)Complete Your Profile: Tailor your experience by sharing your skills
        and preferences. <br />
        2)Explore Repositories: Dive into the world of open-source projects that
        align with your passion. <br />
        3)Personalized Recommendations: Receive handpicked suggestions to
        kickstart your coding adventure.
      </p>
      <div className="button-container">
        <button onClick={onNext}>Next</button>
      </div>
    </div>
  );
}

export default WelcomeContainer3;
