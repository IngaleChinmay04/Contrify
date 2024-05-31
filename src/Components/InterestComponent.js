import React, { useState } from "react";
import jsLogo from "../assets/js.png";
import pythonLogo from "../assets/python-logo-only.png";
import javaLogo from "../assets/java.png";
import rubyLogo from "../assets/ruby.png";
import goLogo from "../assets/Go-Logo_Blue.png";
import swiftLogo from "../assets/swift.png";
import phpLogo from "../assets/800px-PHP-logo.svg.png";
import rustLogo from "../assets/rust.png";
import cppLogo from "../assets/c++2.png";
import cSharpLogo from "../assets/1200px-Logo_C_sharp.svg.png";
import tickImage from "../assets/tick3.png";
import "../Pages/ChooseInterest.css";

const ProgrammingLanguageSelector = ({ onSelect }) => {
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const languages = [
    { id: 1, name: "JavaScript", logo: jsLogo },
    { id: 2, name: "Python", logo: pythonLogo },
    { id: 3, name: "Java", logo: javaLogo },
    { id: 4, name: "Ruby", logo: rubyLogo },
    { id: 5, name: "Go", logo: goLogo },
    { id: 6, name: "Swift", logo: swiftLogo },
    { id: 7, name: "PHP", logo: phpLogo },
    { id: 8, name: "Rust", logo: rustLogo },
    { id: 9, name: "Cpp", logo: cppLogo },
    { id: 10, name: "C#", logo: cSharpLogo },
  ];

  const handleLanguageSelect = (language) => {
    console.log("Selected language:", language);
    setSelectedLanguages((prevSelectedLanguages) => {
      if (prevSelectedLanguages.includes(language.id)) {
        return prevSelectedLanguages.filter((id) => id !== language.id);
      } else {
        return [...prevSelectedLanguages, language.id];
      }
    });
    onSelect(language);
  };

  return (
    <div className="programming-language-selector">
      {languages.map((language) => (
        <label key={language.id} className="language-item">
          <input
            type="checkbox"
            checked={selectedLanguages.includes(language.id)}
            onChange={() => handleLanguageSelect(language)}
          />
          <img src={language.logo} alt={language.name} />
          {selectedLanguages.includes(language.id) && (
            <img src={tickImage} alt="Tick" className="tick-image" />
          )}
        </label>
      ))}
    </div>
  );
};

export default ProgrammingLanguageSelector;
