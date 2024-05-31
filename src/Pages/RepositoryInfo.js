import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RepositoryInfo.css";
import "./MarkdownContent.css";
import { useLocation } from "react-router-dom";

function RepositoryInfo() {
  const [repoInfo, setRepoInfo] = useState(null);
  const [readmeContent, setReadmeContent] = useState(null);
  const [summary, setSummary] = useState(null);
  const [issues, setIssues] = useState([]);
  const [codeFiles, setCodeFiles] = useState([]);
  const [codeExplanations, setCodeExplanations] = useState({});
  const [issueExplanations, setIssueExplanations] = useState({});
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [loadingExplanations, setLoadingExplanations] = useState({});
  const [visibleExplanations, setVisibleExplanations] = useState({});
  const [pullRequests, setPullRequests] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [activeTab, setActiveTab] = useState("info");

  // const location = useLocation();
  // const params = new URLSearchParams(location.search);
  // const repoUrl = params.get("url");
  // const repoUrl = "https://api.github.com/repos/hriteshMaikap/test1";
  const repoUrl = "https://api.github.com/repos/maitrix-org/Pandora";
  console.log(repoUrl);
  const explainIssue = (repoUrl, issueNumber, issueDetails) => {
    if (!issueExplanations[issueNumber]) {
      setLoadingExplanations((prev) => ({
        ...prev,
        [`issue-${issueNumber}`]: true,
      }));
      axios
        .post("http://localhost:5000/explain-issue", { repoUrl, issueNumber })
        .then((response) => {
          const { explanation } = response.data;
          setIssueExplanations((prev) => ({
            ...prev,
            [issueNumber]: explanation,
          }));
          setVisibleExplanations((prev) => ({
            ...prev,
            [`issue-${issueNumber}`]: true,
          }));
          setLoadingExplanations((prev) => ({
            ...prev,
            [`issue-${issueNumber}`]: false,
          }));
        })
        .catch((error) => {
          console.error("Error explaining issue:", error);
          setLoadingExplanations((prev) => ({
            ...prev,
            [`issue-${issueNumber}`]: false,
          }));
        });
    } else {
      toggleExplanationVisibility(`issue-${issueNumber}`);
    }
  };

  const explainCodeFile = (repoUrl, filePath) => {
    if (!codeExplanations[filePath]) {
      setLoadingExplanations((prev) => ({
        ...prev,
        [`code-${filePath}`]: true,
      }));
      axios
        .post("http://localhost:5000/explain-code-file", { repoUrl, filePath })
        .then((response) => {
          const { explanation } = response.data;
          setCodeExplanations((prev) => ({
            ...prev,
            [filePath]: explanation,
          }));
          setVisibleExplanations((prev) => ({
            ...prev,
            [`code-${filePath}`]: true,
          }));
          setLoadingExplanations((prev) => ({
            ...prev,
            [`code-${filePath}`]: false,
          }));
        })
        .catch((error) => {
          console.error(`Error explaining code file "${filePath}":`, error);
          setLoadingExplanations((prev) => ({
            ...prev,
            [`code-${filePath}`]: false,
          }));
        });
    } else {
      toggleExplanationVisibility(`code-${filePath}`);
    }
  };

  //   const explainCodeFile = (filePath) => {
  //     axios
  //       .post("/explain-code-file", { filePath })
  //       .then((response) => {
  //         const { explanation } = response.data;
  //         setCodeExplanations((prev) => ({
  //           ...prev,
  //           [filePath]: explanation,
  //         }));
  //       })
  //       .catch((error) => {
  //         console.error(`Error explaining code file "${filePath}":`, error);
  //       });
  //   };

  const fetchRepoInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/repo-info?url=${encodeURIComponent(repoUrl)}`
      );
      setRepoInfo(response.data.repoInfo);
      const decodedReadmeContent = atob(response.data.readmeContent);
      setReadmeContent(decodedReadmeContent);
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error fetching repository information:", error);
    }
  };

  // Function to fetch issues for the repository
  const fetchRepositoryIssues = async () => {
    try {
      const response = await axios.get("http://localhost:5000/repo-issues", {
        params: { repoUrl },
      });
      setIssues(response.data);
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  // Function to fetch code explanations for the repository
  const fetchCodeExplanations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/repo-code-explainer",
        {
          params: { repoUrl },
        }
      );
      setCodeFiles(response.data);
    } catch (error) {
      console.error("Error fetching code explanations:", error);
    }
  };

  useEffect(() => {
    if (repoUrl) {
      fetchRepoInfo();
      fetchRepositoryIssues();
      fetchCodeExplanations();
    }

    // axios
    //   .get("/repo-issues")
    //   .then((response) => {
    //     setIssues(response.data);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching issues:", error);
    //   });

    axios
      .get("http://localhost:5000/code-files", {
        params: { repoUrl },
      })
      .then((response) => {
        setCodeFiles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching code files:", error);
      });
  }, [repoUrl]);

  const toggleExplanationVisibility = (key) => {
    setVisibleExplanations((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleShowSummary = () => {
    setSummaryLoading(true);
    setTimeout(() => {
      setSummaryVisible(true);
      setSummaryLoading(false);
    }, 5000);
  };

  const toggleSummaryVisibility = () => {
    setSummaryVisible(!summaryVisible);
  };

  const renderMarkdown = (markdown) => {
    const html = markdown
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>")
      .replace(/\*\*(.*)\*\*/gim, "<b>$1</b>")
      .replace(/\*(.*)\*/gim, "<i>$1</i>")
      .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
      .replace(/\n$/gim, "<br />");
    return { __html: html };
  };

  return (
    <div id="repository-info">
      <div className="container">
        <h1 id="git-text">GitHub Repository Information</h1>
        {repoInfo ? (
          <div>
            <div className="tab-container">
              <button
                className={activeTab === "info" ? "active-tab" : ""}
                onClick={() => setActiveTab("info")}
              >
                Info
              </button>
              <button
                className={activeTab === "issues" ? "active-tab" : ""}
                onClick={() => setActiveTab("issues")}
              >
                Issues
              </button>
              <button
                className={activeTab === "code" ? "active-tab" : ""}
                onClick={() => setActiveTab("code")}
              >
                Code Files
              </button>
            </div>
            {activeTab === "info" && (
              <div className="tab-content">
                <h1>{repoInfo.name}</h1>
                <p>{repoInfo.description}</p>
                <p>
                  URL: <a href={repoInfo.html_url}>{repoInfo.html_url}</a>
                </p>
                <p>Stars: {repoInfo.stargazers_count}</p>
                <p>Watchers: {repoInfo.watchers_count}</p>
                <p>Forks: {repoInfo.forks_count}</p>
                <p>Language: {repoInfo.language}</p>
                <p>License: {repoInfo.license?.name}</p>
                <div className="readme-content">
                  <h3>README</h3>
                  <div
                    dangerouslySetInnerHTML={renderMarkdown(readmeContent)}
                  ></div>
                  {summary && (
                    <div>
                      {!summaryVisible ? (
                        <div>
                          <button onClick={handleShowSummary}>
                            Show Summary
                          </button>
                          {summaryLoading && <p>Loading...</p>}
                        </div>
                      ) : (
                        <div>
                          <h3>Summary</h3>
                          <div
                            dangerouslySetInnerHTML={renderMarkdown(summary)}
                          ></div>
                          <button onClick={toggleSummaryVisibility}>
                            {summaryVisible ? "Minimize" : "Expand"} Summary
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* <div className="recent-activity">
                  <h3>Recent Activity</h3>
                  <ul>
                    {pullRequests.map((pr) => (
                      <li key={pr.id}>
                        <a href={pr.html_url}>{pr.title}</a> by {pr.user.login}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="contributors">
                  <h3>Contributors</h3>
                  <ul>
                    {contributors.map((contributor) => (
                      <li key={contributor.id}>
                        <a href={contributor.html_url}>{contributor.login}</a>
                      </li>
                    ))}
                  </ul>
                </div> */}
              </div>
            )}
            {activeTab === "issues" && (
              <div className="tab-content">
                <h3>Issues</h3>
                {issues.length > 0 ? (
                  <ul>
                    {issues.map((issue) => (
                      <li key={issue.number}>
                        <h4>{issue.title}</h4>
                        <p>Number: {issue.number}</p>
                        <p>State: {issue.state}</p>
                        <p>Created At: {issue.created_at}</p>
                        <p>Updated At: {issue.updated_at}</p>
                        {issueExplanations[issue.number] ? (
                          <>
                            {visibleExplanations[`issue-${issue.number}`] && (
                              <>
                                <h5>Issue Explained:</h5>
                                <div
                                  dangerouslySetInnerHTML={renderMarkdown(
                                    issueExplanations[issue.number]
                                  )}
                                ></div>
                              </>
                            )}
                            <button
                              onClick={() =>
                                toggleExplanationVisibility(
                                  `issue-${issue.number}`
                                )
                              }
                            >
                              {visibleExplanations[`issue-${issue.number}`]
                                ? "Minimize"
                                : "Expand"}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                explainIssue(repoUrl, issue.number, issue)
                              }
                            >
                              Explain Issue
                            </button>
                            {loadingExplanations[`issue-${issue.number}`] && (
                              <p>Loading...</p>
                            )}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No issues found.</p>
                )}
              </div>
            )}
            {activeTab === "code" && (
              <div className="tab-content">
                <h3>Code Files</h3>
                {codeFiles.length > 0 ? (
                  <ul>
                    {codeFiles.map((filePath) => (
                      <li key={filePath}>
                        <h4>{filePath}</h4>
                        {codeExplanations[filePath] ? (
                          <>
                            {visibleExplanations[`code-${filePath}`] && (
                              <>
                                <h5>Code Explained:</h5>
                                <div
                                  dangerouslySetInnerHTML={renderMarkdown(
                                    codeExplanations[filePath]
                                  )}
                                ></div>
                              </>
                            )}
                            <button
                              onClick={() =>
                                toggleExplanationVisibility(`code-${filePath}`)
                              }
                            >
                              {visibleExplanations[`code-${filePath}`]
                                ? "Minimize"
                                : "Expand"}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => explainCodeFile(repoUrl, filePath)}
                            >
                              Explain Code
                            </button>
                            {loadingExplanations[`code-${filePath}`] && (
                              <p>Loading...</p>
                            )}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No code files found.</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default RepositoryInfo;
