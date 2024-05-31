import "./Tutorials.css";
import TutorialCard from "../Components/TutorialCard";
import TutorialData from "../Data/TutorialData.json";

function TutorialsPage() {
  const languageTitles = TutorialData.languages.map(
    (language) => language.title
  );

  return (
    <div className="wrap">
      <div className="tutorial-display">
        <h1 className="tutorial-text">
          Explore Tutorials and Upskill Yourself
        </h1>
        <div className="tutorial-cards">
          {languageTitles.map((title, index) => (
            <TutorialCard key={index} language={title} appearance="image" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TutorialsPage;
