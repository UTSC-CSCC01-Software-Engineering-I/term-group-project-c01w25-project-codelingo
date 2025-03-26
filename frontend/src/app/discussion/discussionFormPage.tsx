import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDiscussion } from './discussionApi';
import { useLocation } from 'react-router-dom';
import '../styles/general.css';
import './discussion.css';
import background from "../../assets/landing.jpg";

const DiscussionForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { previousPage, problemTitle, problemDescription } = location.state || {};
  const [newDiscussion, setNewDiscussion] = useState({
    title: problemTitle || '',
    content: problemDescription || '',
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDiscussion((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDiscussion(newDiscussion);
      navigate('/discussions');
    } catch (error) {
      console.error('Failed to create discussion:', error);
    }
  };

  const handleBackToDiscussions = () => {
    navigate('/discussions');
  };

  const handleBackToProblem = () => {
    if (previousPage) {
        navigate(-1);
    }
    navigate('/problems');
  };

  return (
    <div className="discussions-page"
        style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100%",
            backgroundAttachment: "fixed",
            minHeight:"100vh",
            display: "flex",    // Enable flexbox
            flexDirection: "column", // Stack items vertically
            justifyContent: "center", // Center the content vertically
            alignItems: "center", // Center the content horizontally
        }}
    >
        <h2 className="fade-in text-white text-3xl font-thick italic text-center mt-10 mb-5">
            "The important thing is not to stop questioning."
        </h2>
        <form onSubmit={handleSubmitForm}>
            <label className="text-white font-thin italic">Title:</label>
            <input
                type="text"
                name="title"
                value={newDiscussion.title}
                onChange={handleFormChange}
                required
            />
            <label className="text-white font-thin italic">Content:</label>
            <textarea
                name="content"
                value={newDiscussion.content}
                onChange={handleFormChange}
                required
            />
            <div className="flex justify-center gap-5 m-10">
                <button
                type="button"
                onClick={handleBackToDiscussions}
                className="flex-1 p-3 m-10">
                    Back to Discussions
                </button>
                <button type="submit" className="flex-1 p-3 m-10">
                    Submit
                </button>
                <button type="button" onClick={handleBackToProblem} className="flex-1 p-3 m-10">
                    Back to Problem
                </button>
            </div>
        </form>
    </div>
  );
};

export default DiscussionForm;
