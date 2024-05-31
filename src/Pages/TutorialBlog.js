import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TutorialData from "../Data/TutorialData.json";
import "./Tutorials.css";
import axios from "axios";

function TutorialBlog() {
  const { title } = useParams();
  const [tutorialData, setTutorialData] = useState(null);
  const [youtubeVideos, setYouTubeVideos] = useState([]);

  useEffect(() => {
    const languageData = TutorialData.languages.find(
      (item) => item.title === title
    );
    console.log(languageData.image);
    setTutorialData(languageData);

    if (languageData) {
      fetchYoutubeVideos(languageData.title);
    }
  }, [title]);

  const fetchYoutubeVideos = async (query) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?key=${process.env.REACT_APP_YT_API_KEY}&part=snippet&q=${query}+tutorial+programming language&maxResults=5&type=video`
      );
      const filteredVideos = response.data.items.filter(
        (video) =>
          video.snippet.duration !== "PT0S" &&
          video.snippet.liveBroadcastContent === "none"
      );

      setYouTubeVideos(filteredVideos);
    } catch (error) {
      console.error("Error Fetching Youtube Videos" + error);
      console.error("Error message:", error.response.data.error.message);
    }
  };

  if (!tutorialData) {
    return null;
  }

  return (
    <div className="wrap-blog">
      <div className="tutorial-blog">
        {tutorialData ? (
          <div className="blog-div">
            <h1 className="tutorial-text">Comprehensive Guide</h1>
            <h1>{tutorialData.title}</h1>
            <div className="language-image">
              <img src={tutorialData.meme} alt={tutorialData.title} />
            </div>
            <p>{tutorialData.about_desc}</p>
            <h2>Useful Links:</h2>
            <ul>
              <li>
                <a
                  href={tutorialData.links.tutorial}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tutorial
                </a>
              </li>
              <li>
                <a
                  href={tutorialData.links.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href={tutorialData.links.community}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Community
                </a>
              </li>
            </ul>
            <div className="videos-container">
              {youtubeVideos.map((video) => (
                <div key={video.id.videoId} className="video-item">
                  <iframe
                    width="600"
                    height="400"
                    src={`https://www.youtube.com/embed/${video.id.videoId}`}
                    title={video.snippet.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <br />
                  <span>{video.snippet.title}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default TutorialBlog;
