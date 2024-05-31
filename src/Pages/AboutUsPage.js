import React from "react";
import "./AboutUsPage.css";
import aboutUsImage from "../assets/aboutUs2.png";
import team from "../assets/5495.jpg";

const AboutUsPage = () => {
  return (
    <div className="about-wrap">
      <h1 id="aboutUsText">Know About Us!</h1>
      <div className="about-us-div">
        <div className="about-us-img">
          <img src={aboutUsImage} alt="about-us" className="magicpattern" />
        </div>
        <div className="about-us-para">
          <span>About Us </span>
          <br />
          <p>
            Welcome to Open Source Navigator! We're passionate about fostering a
            thriving community of open-source enthusiasts and empowering
            aspiring developers to contribute meaningfully to the world of open
            source.
            <br />
            <br />
            <span>Our Mission</span> <br />
            <br /> At Open Source Navigator, our mission is to break
            down barriers and make open-source contribution accessible to
            everyone. We believe that collaboration, learning, and innovation
            are the cornerstones of progress, and we're committed to providing
            the tools and resources needed to help you embark on your
            open-source journey with confidence.
            <br />
            <br /> <span>What We Offer</span>
            <br />
            <br />
            <ul>
              <li>
                Comprehensive Guidance: Our platform offers comprehensive
                guidance and resources to help you navigate the complexities of
                open-source contribution. From understanding essential concepts
                to finding the right projects to contribute to, we're here to
                support you every step of the way.
              </li>
              <li>
                Personalized Recommendations: We understand that every
                developer's journey is unique. That's why we provide
                personalized recommendations tailored to your interests, skill
                level, and activity on GitHub. Whether you're a beginner looking
                for your first project or an experienced developer seeking new
                challenges, we've got you covered.
              </li>
              <li>
                Community Collaboration: Collaboration is at the heart of open
                source, and our platform is designed to foster a sense of
                community and collaboration. Connect with fellow developers,
                share insights, and learn from each other as you work together
                to create innovative solutions.
              </li>
            </ul>
          </p>
        </div>
      </div>
      <div className="team-div">
        <div className="team-text">
          <p>
            <span>Meet Our Team</span> <br /> <br />
            At Open Source Navigator, we're driven by a passionate and
            diverse team dedicated to making open-source contribution accessible
            to all. From our visionary founder to our talented developers and
            dedicated community managers, each member brings a unique set of
            skills and experiences to the table. Together, we're committed to
            providing you with the guidance, support, and resources you need to
            thrive in the open-source community. Get to know the faces behind
            our platform and join us on this exciting journey of collaboration
            and innovation.
            <br />
            <br />
            <p>
              Contact Us Have questions or feedback? We'd love to hear from you!
              Feel free to reach out to us at opensourcewebappteam@gmail.com or
              connect with us on social media.
            </p>
          </p>
        </div>
        <div className="team-img">
          <img src={team} alt="team" />
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
