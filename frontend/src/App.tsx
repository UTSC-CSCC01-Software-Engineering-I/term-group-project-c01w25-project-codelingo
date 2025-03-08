import "./App.css";
import Navbar from "./app/shared-components/Navbar";
import Landing from "./app/home/landing";
import About from "./app/home/about";
import Contact from "./app/home/contact";
import DiscussionsPage from "./app/discussion/discussionPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
