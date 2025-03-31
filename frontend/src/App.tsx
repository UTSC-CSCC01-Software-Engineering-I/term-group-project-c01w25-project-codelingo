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
import { AuthProvider } from "./app/context/AuthContext";
import PrivateRoute from "./app/context/PrivateRoute";
import McqPage from "./app/questions/mcqPage";
import PostGameReview from "./app/lobby/postGamePage";
import FillBlankPage from "./app/questions/fillBlankPage";

function App() {
  return (
    <>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/discussions"
                element={
                  <PrivateRoute>
                    <DiscussionsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/discussions/new-discussion"
                element={
                  <PrivateRoute>
                    <DiscussionFormPage />
                  </PrivateRoute>
                }
              />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/problems"
                element={
                  <PrivateRoute>
                    <ProblemPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/coding"
                element={
                  <PrivateRoute>
                    <CodingPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/mcq"
                element={
                  <PrivateRoute>
                    <McqPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/fill-in-the-blank"
                element={
                  <PrivateRoute>
                    <FillBlankPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/problems/generated"
                element={
                  <PrivateRoute>
                    <GeneratedProblemPage />
                  </PrivateRoute>
                }
              />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/reset-password" element={<ForgotPassword />} />
              <Route
                path="/lobby"
                element={
                  <PrivateRoute>
                    <Lobby />
                  </PrivateRoute>
                }
              />
              <Route
                path="/player-lobby/:code"
                element={
                  <PrivateRoute>
                    <PlayerLobby />
                  </PrivateRoute>
                }
              />
              <Route
                path="/join-lobby"
                element={
                  <PrivateRoute>
                    <JoinLobby />
                  </PrivateRoute>
                }
              />
              <Route
                path="/post-game/:code"
                element={
                  <PrivateRoute>
                    <PostGameReview />
                  </PrivateRoute>
                }
              />
              <Route
                path="/post-game"
                element={
                  <PrivateRoute>
                    <PostGameReview />
                  </PrivateRoute>
                }
              />
              <Route
                path="/solve-challenge"
                element={<PrivateRoute></PrivateRoute>}
              />
            </Routes>
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </>
  );
}

export default App;
