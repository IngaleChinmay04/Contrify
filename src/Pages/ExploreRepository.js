import React, { useState } from "react";
import "./ExploreRepository.css";
import RepoCard from "../Components/RepoCard";
import axios from "axios";
import axiosInstance from "../axiosConfig";
import SkeletonRepoCard from "../Components/SkeletonCard";

const ExploreRepository = () => {
  const [language, setLanguage] = useState("");
  const [contributionLabel, setContributionLabel] = useState("");
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const contributionLabels = [
    { value: "", label: "All" },
    { value: "good first issue", label: "Good First Issue" },
    { value: "beginner friendly", label: "Beginner Friendly" },
    { value: "help wanted", label: "Help Wanted" },
    { value: "bug", label: "Bug" },
    { value: "documentation", label: "Documentation" },
    { value: "enhancement", label: "Enhancement" },
    { value: "question", label: "Question" },
    { value: "wontfix", label: "Won't Fix" },
    { value: "hacktoberfest", label: "Hacktoberfest" },
    { value: "critical", label: "Critical" },
    { value: "low priority", label: "Low Priority" },
    { value: "security", label: "Security" },
    { value: "feature", label: "Feature" },
    { value: "help needed", label: "Help Needed" },
  ];

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleContributionLabelChange = (event) => {
    setContributionLabel(event.target.value);
  };

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);
    try {
      // ` label:${contributionLabel}`
      const query = ` is:issue "${contributionLabel}"`;
      let languageString = `language:${language}`;
      const labelString = contributionLabel ? query : "";
      const response = await axiosInstance.get(
        `https://api.github.com/search/repositories`,
        {
          params: {
            q: `${languageString} ${labelString}`,
          },
        }
      );
      console.log("API response:", response.data);
      setRepos(response.data.items);
    } catch (error) {
      setError(error || "Error occurred !!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="explore-container">
      <div className="repository-container">
        <h1 id="intro-text">Explore the World of Repositories!!</h1>
        <p>
          "Explore a world of open-source innovation with our curated selection
          of repositories. From beginner-friendly projects to advanced
          challenges, find the perfect repository to expand your skills and
          contribute to the community."
        </p>
        <h1 id="filter-text">Apply Filters and Find Your Match</h1>
        <div className="input-div">
          <div className="input-group">
            <input
              type="text"
              name=""
              placeholder=" "
              className="textbox"
              value={language}
              onChange={handleLanguageChange}
            />
            <label className="form-label">Programming Language</label>
          </div>

          <label htmlFor="contributionLabel" className="label-text">
            Contribution Label:
          </label>
          <select
            id="contributionLabel"
            value={contributionLabel}
            onChange={handleContributionLabelChange}
            className="select-box"
          >
            {contributionLabels.map((label) => (
              <option
                key={label.value}
                value={label.value}
                className="option-box"
              >
                {label.label}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleSubmit} disabled={!language}>
          Search Repository
        </button>
        <div className="repos-div">
          {isLoading ? (
            <div className="repos-div">
              <ul>
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                  <SkeletonRepoCard key={index} />
                ))}
              </ul>
            </div>
          ) : null}
          {error ? (
            <p style={{ color: "red" }}>Error: {error.message}</p>
          ) : null}
          {repos.length > 0 ? (
            <ul>
              {repos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </ul>
          ) : (
            <p>
              No repositories found. Try adjusting your search criteria or using
              external resources like https://github.com/topics/good-first-issue
              for finding beginner-friendly open-source projects.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExploreRepository;
