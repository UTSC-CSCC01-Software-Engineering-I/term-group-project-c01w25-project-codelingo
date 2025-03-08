import "./App.css";
import Navbar from "./app/shared-components/Navbar";
import Landing from "./app/home/landing";
import About from "./app/home/about";
import Contact from "./app/home/contact";
import DiscussionsPage from "./app/discussion/discussionPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./app/registration/registrationPage";
import Login from "./app/login/loginPage";
import ProblemPage from "./app/questions/problemPage";
import GeneratedProblemPage from "./app/questions/generatedProblemPage";
import DiscussionFormPage from './app/discussion/discussionFormPage';
import VerifyEmail from "./app/registration/verifyEmail";
import ForgotPassword from "./app/login/forgotPasswordPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/discussions" element={<DiscussionsPage />} />
          <Route path="/discussions/new-discussion" element={<DiscussionFormPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/problems" element={<ProblemPage />} />
          <Route path="/problems/generated" element={<GeneratedProblemPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ForgotPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
