import React from "react";
import "./HomePage.css";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FaGithub } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { IoMdMenu } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { IoLogOut } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import userImage from "../assets/new.png";
import TutorialCard from "../Components/TutorialCard";
import { TiDocumentText } from "react-icons/ti";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaFolderOpen } from "react-icons/fa";
import { MdMenuBook } from "react-icons/md";
import RepoCard from "../Components/RepoCard";
import axiosInstance from "../axiosConfig";
import SkeletonRepoCard from "../Components/SkeletonCard";
import Swal from "sweetalert2";

function HomePage() {
  const location = useLocation();
  const { state } = location;
  const userId = state ? state.userId : null;
  const token = state ? state.token : null;

  const [recommendedRepos, setRecommendedRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    sidebarRef.current.classList.toggle("active");
  };

  const userProfileNav = () => {
    navigate("/userprofile", {
      state: { userId: userId, token: token },
    });
  };

  const handleLogout = async () => {
    try {
      const confirmed = await Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, log me out!",
      });

      if (confirmed.isConfirmed) {
        await axios.post("http://localhost:4000/logout", { token });
        const { value: rating } = await Swal.fire({
          title: "Rate your experience",
          text: "Please select one of the following emojis:",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Submit",
          cancelButtonText: "Skip",
          html: `
           <div>
           <div class = "rating-div">
           <input type="radio" id="bad" name="rating" value="😞 Bad">
           <label for="bad">😞 Bad</label>
         </div>
         <div class = "rating-div">
           <input type="radio" id="decent" name="rating" value="😐 Decent">
           <label for="decent">😐 Decent</label>
         </div>
         <div class = "rating-div">
           <input type="radio" id="loveit" name="rating" value="😍 Love it">
           <label for="loveit">😍 Love it</label>
         </div>
           </div>
          `,
          inputValidator: (value) => {
            if (!value) {
              return "You must select an option";
            }
          },
        });

        if (rating) {
          console.log("User rating:", rating);
        }

        navigate("/");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get(
          `http://localhost:4000/getData/${userId}`
        );
        if (response.status === 200) {
          const userData = response.data;
          setUserData(userData);
          console.log(userData.displayName);
          console.log(userData.interests);
          let recommendedRepos = [];
          const languages = userData.interests;

          for (const language of languages) {
            try {
              console.log(language);
              console.log(userData.skillLevel);
              let labelString = "";
              let labelString2 = "";
              let languageString = `language:${language}`;
              if (userData.skillLevel === "beginner") {
                labelString = ` is:issue "good first issue"`;
                labelString2 = ` is:issue "beginner friendly"`;
                console.log(labelString);
              } else if (userData.skillLevel === "intermediate") {
                labelString = ` is:issue "help wanted"`;
                console.log(labelString);
              } else {
                labelString = ` sort:stars&order=desc`;
                console.log(labelString);
              }

              const apiResponse = await axiosInstance.get(
                `https://api.github.com/search/repositories`,
                {
                  params: {
                    q: `${languageString} ${labelString} `,
                  },
                }
              );

              if (apiResponse.data.items.length > 0) {
                recommendedRepos = recommendedRepos.concat(
                  apiResponse.data.items.slice(0, 3)
                );
              }

              console.log(apiResponse);
            } catch (error) {
              console.error("Error fetching repos for", language, error);
            }
          }
          console.log(recommendedRepos);
          setRecommendedRepos(recommendedRepos);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  return (
    <div className="home-container">
      <div className="sidebar" ref={sidebarRef}>
        <div className="logo-content">
          <div className="logo">
            <FaGithub className="logo-icon" />
            <div className="logo-name">Contrify</div>
          </div>
        </div>
        <IoMdMenu id="btn" onClick={toggleSidebar} />
        <ul className="nav-list">
          <li>
            <CiSearch className="search" onClick={toggleSidebar} />
            <input type="text" placeholder="Search..." />
            <span className="tooltip">Search</span>
          </li>
          <li>
            <a href="#">
              <CiUser className="icon" />
              <span className="link-name">Dashboard</span>
            </a>
            <span className="tooltip">Dashboard</span>
          </li>

          <li>
            <Link to="/exploreRepository">
              <FaFolderOpen className="icon" />
              <span className="link-name">Explore Repositories</span>
            </Link>
            <span className="tooltip">Explore Repositories</span>
          </li>
          <li>
            <Link to="/tutorialPage">
              <TiDocumentText className="icon" />
              <span className="link-name">Learning Tutorials</span>
            </Link>
            <span className="tooltip">Learning Tutorials</span>
          </li>
          <li>
            <Link to="/glossary">
              <MdMenuBook className="icon" />
              <span className="link-name">Glossary</span>
            </Link>
            <span className="tooltip">Glossary</span>
          </li>
          <li>
            <Link to="/aboutus">
              <FaPeopleGroup className="icon" />
              <span className="link-name">About Us</span>
            </Link>
            <span className="tooltip">About Us</span>
          </li>
          <li>
            <Link to="/repo-details">
              <FaGithub className="icon" />
              <span className="link-name">GitHub repository</span>
            </Link>
            <span className="tooltip">GitHub repository</span>
          </li>
        </ul>
        <div className="profile-content">
          <div className="profile">
            <div className="profile-details">
              <img
                src={userData ? userData.uploadedImage : userImage}
                alt="user-profile-pic"
                onClick={userProfileNav}
              />
              <div className="name-job">
                <div className="name">
                  {userData ? userData.fullName : "Loading..."}
                </div>
                <div className="job">
                  {userData ? userData.currentRole : "Loading..."}
                </div>
              </div>
            </div>
            <IoLogOut id="log-out" onClick={handleLogout} />
          </div>
        </div>
      </div>
      <div className="dashboard">
        <h1 id="welcome-text">
          Welcome To Dashboard
          <br />
          Hello {userData ? userData.fullName : "Loading..."}
        </h1>
        <div className="tutorials-container">
          <h1 className="title-heading">Master Your Skills</h1>
          <div className="interest-cards">
            {userData &&
              userData.interests.map((interest, index) => (
                <TutorialCard
                  key={index}
                  language={interest}
                  appearance="color"
                  isHomepage={true}
                />
              ))}
          </div>
        </div>
        <div className="repos-div">
          <h1 className="title-heading">Recommended Repositories</h1>
          {loading ? (
            <div className="recommended-repos">
              <ul>
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                  <SkeletonRepoCard key={index} />
                ))}
              </ul>
            </div>
          ) : (
            <>
              <div className="repos-div">
                {recommendedRepos.length > 0 ? (
                  <div className="recommended-repos">
                    <ul>
                      {recommendedRepos.map((repo, index) => (
                        <RepoCard key={index} repo={repo} />
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="recommended-repos">
                    <ul>
                      {[1, 2, 3, 4, 5, 6].map((_, index) => (
                        <SkeletonRepoCard key={index} />
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
