import React from "react";
import moment from "moment";
import "../Pages/RepoCard.css";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";

const convertToApiUrl = (url) => {
  const apiBaseUrl = "https://api.github.com/repos";
  const repoPath = url.replace("https://github.com/", "");
  return `${apiBaseUrl}/${repoPath}`;
};

const RepoCard = ({ repo }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    window.open(repo.html_url, "_blank");
    // navigate(`/repo-details?url=${encodeURIComponent(repo.html_url)}`);
    // const apiUrl = convertToApiUrl(repo.html_url);
    // navigate(`/repo-details?url=${encodeURIComponent(apiUrl)}`);
  };

  const lastActivity = moment(repo.pushed_at).fromNow();

  return (
    <div className="repo-card">
      <span>{repo.name}</span>
      <hr />
      <div className="data-div">
        <label>Language: {repo.language}</label>
        <label>Stars: {repo.stargazers_count}</label>
        <label>Open Issues: {repo.open_issues_count}</label>
        <label>Forks: {repo.forks_count}</label>
        <label>Last Activity: {lastActivity}</label>
      </div>
      <button onClick={handleClick}>View Repository</button>
    </div>
  );
};

export default RepoCard;
