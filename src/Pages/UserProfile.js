import React, { useRef, useState, useEffect } from "react";
import "./UserProfile.css";
import { FaGithub, FaTimes } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { FaUserEdit } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import SkillLevelSelector from "../Components/SkillSelector";

function UserProfile() {
  const location = useLocation();
  const { state } = location;
  const userId = state ? state.userId : null;
  const token = state ? state.token : null;

  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [currentSpace, setCurrentSpace] = useState("");
  const [contactNumber, setContactNumber] = useState(0);
  const [githubProfileLink, setGithubProfileLink] = useState("");
  const [linkedinProfileLink, setLinkedinProfileLink] = useState("");

  const fileInputRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleEditClick = () => {
    setUploadedImage(null);
  };

  const [selectedGender, setSelectedGender] = useState("");

  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value);
  };
  // Interest part
  const [selectedInterest, setSelectedInterest] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const interestList = [
    "JavaScript",
    "Python",
    "Java",
    "Cpp",
    "PHP",
    "GO Lang",
    "Ruby",
    "Rust",
    "Swift",
    "App Developement",
    "Flutter",
  ];
  const [selectedSkillLevel, setSelectedSkillLevel] = useState(null);
  const handleLevelSelect = (level) => {
    setSelectedSkillLevel(level);
  };

  const handleInterestChange = (e) => {
    setSelectedInterest(e.target.value);
    if (e.target.value && !selectedInterests.includes(e.target.value)) {
      setSelectedInterests([...selectedInterests, e.target.value]);
      setSelectedInterest("");
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    const updatedInterests = selectedInterests.filter(
      (interest) => interest !== interestToRemove
    );
    setSelectedInterests(updatedInterests);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/userProfile/${userId}`
        );
        if (response.status === 200) {
          const userData = response.data;
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setDisplayName(userData.displayName);
          setSelectedGender(userData.selectedGender);

          setCurrentRole(userData.currentRole);
          setCurrentSpace(userData.currentSpace);
          setContactNumber(userData.contactNumber);
          setGithubProfileLink(userData.githubProfileLink);
          setLinkedinProfileLink(userData.linkedinProfileLink);
          if (userData.uploadedImage) {
            setUploadedImage(userData.uploadedImage);
          }
          setSelectedInterests([...userData.interests]);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();

    return () => {};
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Sending interests:", selectedInterests);

      const response = await axios.put(
        `http://localhost:4000/updateProfile/${userId}`,
        {
          displayName: displayName,
          firstName: firstName,
          lastName: lastName,
          currentRole: currentRole,
          currentSpace: currentSpace,
          contactNumber: contactNumber,
          githubProfileLink: githubProfileLink,
          linkedinProfileLink: linkedinProfileLink,
          selectedGender: selectedGender,
          interests: selectedInterests,
          uploadedImage,
          skillLevel: selectedSkillLevel,
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Profile updated successfully",
        });
        console.log("Profile updated successfully");
        navigate("/homepage", {
          state: { userId: userId, token: token },
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update profile. Please try again later!",
      });
    }
  };

  return (
    <div className="user-profile-container">
      <div className="user-details-container">
        <h1 id="title-text">User Profile</h1>
        <hr id="line" />
        <div className="two-section-container">
          <div className="section1">
            <div className="circular-input-container">
              <div className="circular-input" onClick={handleClick}>
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="uploaded-image"
                  />
                ) : (
                  <FaUserEdit
                    style={{ fontSize: "80px", marginLeft: "20px" }}
                  />
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleFileInputChange}
                />
              </div>
              {uploadedImage && (
                <div className="edit-icon-container" onClick={handleEditClick}>
                  <CiEdit className="edit-icon" />
                </div>
              )}
            </div>
            <div className="input-group">
              <input
                type="text"
                name=""
                placeholder=" "
                className="textbox"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <label className="form-label">Display Name</label>
            </div>
            <div className="gender-container">
              <label htmlFor="gender" className="labelText">
                Gender:
              </label>
              <select
                id="gender"
                value={selectedGender}
                onChange={handleGenderChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Prefer Not to say</option>
              </select>
            </div>
            <div className="input-group">
              <input
                type="text"
                name=""
                placeholder=" "
                className="textbox"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
              />
              <label className="form-label">Current Role</label>
            </div>
            <div className="input-group">
              <input
                type="text"
                name=""
                placeholder=" "
                className="textbox"
                value={currentSpace}
                onChange={(e) => setCurrentSpace(e.target.value)}
              />
              <label className="form-label">Current Institute/Workspace</label>
            </div>
          </div>
          <hr />
          <div className="section2">
            <div className="input-group">
              <input
                type="text"
                name=""
                placeholder=" "
                className="textbox"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <label className="form-label">First Name</label>
            </div>
            <div className="input-group">
              <input
                type="text"
                name=""
                placeholder=" "
                className="textbox"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <label className="form-label">Last Name</label>
            </div>
            <div className="input-group">
              <input
                type="tel"
                name=""
                placeholder=" "
                className="textbox"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
              <label className="form-label">Contact Number</label>
            </div>
            <label className="labelText">Social Profiles</label>
            <div className="input-group" style={{ display: "flex" }}>
              <input
                type="text"
                name=""
                placeholder=" "
                className="textbox"
                value={githubProfileLink}
                onChange={(e) => setGithubProfileLink(e.target.value)}
              />
              <label className="form-label">
                <FaGithub
                  style={{
                    marginRight: "10px",
                    fontSize: "25px",
                  }}
                />
                Github Profile Link
              </label>
            </div>
            <div className="input-group" style={{ display: "flex" }}>
              <input
                type="text"
                name=""
                placeholder=" "
                className="textbox"
                value={linkedinProfileLink}
                onChange={(e) => setLinkedinProfileLink(e.target.value)}
              />
              <label className="form-label">
                <FaLinkedin
                  style={{
                    marginRight: "10px",
                    fontSize: "25px",
                  }}
                />
                LinkedIn Profile Link
              </label>
            </div>
            <div className="interests-container">
              <div className="interests-dropdown">
                <label htmlFor="interests" className="labelText">
                  Select Interests:
                </label>
                <select
                  value={selectedInterest}
                  onChange={handleInterestChange}
                >
                  <option value="">Select Interest</option>
                  {interestList.map((interest, index) => (
                    <option key={index} value={interest}>
                      {interest}
                    </option>
                  ))}
                </select>
              </div>
              <div className="selected-interests">
                {selectedInterests.map((interest, index) => (
                  <div key={index} className="selected-interest">
                    <span>{interest}</span>
                    <FaTimes
                      onClick={() => handleRemoveInterest(interest)}
                      className="remove-icon"
                    />
                  </div>
                ))}
              </div>
            </div>
            <SkillLevelSelector onSelect={handleLevelSelect} />
          </div>
        </div>
        <button onClick={handleSubmit}>Save</button>
      </div>
    </div>
  );
}

export default UserProfile;
