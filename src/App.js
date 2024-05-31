import "./App.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/Login";
import SignUpPage from "./Pages/Signup";
import ChooseInterestPage from "./Pages/ChooseInterest";
import SkillPage from "./Pages/SkillPage";
import WelcomePage from "./Pages/Welcome";
import HomePage from "./Pages/HomePage";
import GlossaryPage from "./Pages/GlossaryPage";
import UserProfile from "./Pages/UserProfile";
import TutorialBlog from "./Pages/TutorialBlog";
import TutorialsPage from "./Pages/TutorialsPage";
import ExploreRepository from "./Pages/ExploreRepository";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import AboutUsPage from "./Pages/AboutUsPage";
import RepositoryInfo from "./Pages/RepositoryInfo";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/chooseInterest" element={<ChooseInterestPage />} />
        <Route path="/skillSelect" element={<SkillPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/homePage" element={<HomePage />} />
        <Route path="/glossary" element={<GlossaryPage />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/blog/:title" element={<TutorialBlog />} />
        <Route path="/tutorialPage" element={<TutorialsPage />} />
        <Route path="/exploreRepository" element={<ExploreRepository />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
        <Route path="/repo-details" element={<RepositoryInfo />} />
        <Route
          path="/resetpassword/:userId/:token"
          element={<ResetPassword />}
        />
      </Routes>
    </div>
  );
}

export default App;
