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
import CodingPage from "./app/questions/codingPage";
import GeneratedProblemPage from "./app/questions/generatedProblemPage";
import DiscussionFormPage from "./app/discussion/discussionFormPage";
import VerifyEmail from "./app/registration/verifyEmail";
import ForgotPassword from "./app/login/forgotPasswordPage";
import Lobby from "./app/lobby/lobbyPage";
import PlayerLobby from "./app/lobby/playerLobby";
import { SocketProvider } from "./socketContext";
import JoinLobby from "./app/lobby/joinLobby";
import PostGame from "./app/lobby/postGamePage"
import McqPage from "./app/questions/mcqPage";

function App() {
  return (
    <>
      <SocketProvider>
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
            <Route path="/coding" element={<CodingPage />} />
            <Route path="/problems/generated" element={<GeneratedProblemPage />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/reset-password" element={<ForgotPassword />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/player-lobby/:code" element={<PlayerLobby />} />
            <Route path="/join-lobby" element={<JoinLobby />} />
            <Route path="/mcq" element={<McqPage />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </>
  );
}

export default App;
