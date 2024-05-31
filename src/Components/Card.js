import React, { useState, useRef, useEffect } from "react";
import "../Pages/Card.css";
import axios from "axios";

const Card = ({ frontContent, backContent }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef(null);

  const handleClick = () => {
    if (isExpanded) {
      setIsFlipped(false);
      setIsExpanded(false);
    } else {
      const parentElement = cardRef.current.parentElement;
      if (parentElement && parentElement.querySelector) {
        const expandedCard = parentElement.querySelector(".card.expanded");
        if (expandedCard) {
          const innerCard = expandedCard.querySelector(".card-inner");
          if (innerCard) {
            innerCard.classList.remove("flipped");
          }
          expandedCard.classList.remove("expanded");
        }
      }

      setIsFlipped(true);
      setIsExpanded(true);
    }
  };
  useEffect(() => {
    if (frontContent) {
      fetchYoutubeVideos(frontContent);
    }
  }, [frontContent]);

  const [youtubeVideos, setYouTubeVideos] = useState([]);
  const fetchYoutubeVideos = async (query) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?key=${process.env.REACT_APP_YT_API_KEY}&part=snippet&q=${query}+tutorial+programming language&maxResults=2&type=video`
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

  return (
    <div
      ref={cardRef}
      className={`card ${isFlipped ? "flipped" : ""} ${
        isExpanded ? "expanded" : ""
      }`}
      onClick={handleClick}
    >
      <div className="card-inner">
        <div className="card-front">
          <h2>{frontContent}</h2>
        </div>
        <div className="card-back">
          <h2 id="back-card-text">{frontContent}</h2>
          <div>
            {backContent}{" "}
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
        </div>
      </div>
    </div>
  );
};

export default Card;
