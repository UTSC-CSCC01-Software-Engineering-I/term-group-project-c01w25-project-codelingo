import React, { useState, useEffect } from 'react';
import DiscussionList, { Discussion } from './discussionList';
import Pagination from './pagination';
import FilterSort, { Filter } from './filterSort';
import { fetchDiscussions, createDiscussion } from './discussionApi';
import './discussionPage.css';
import background from "../../assets/landing.jpg";

const DiscussionsPage: React.FC = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filter, setFilter] = useState<Filter>({ sort: 'latest', tag: '' });
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newDiscussion, setNewDiscussion] = useState<{ title: string; content: string }>({
    title: '',
    content: '',
  });

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const loadDiscussions = async () => {
      try {
        const data = await fetchDiscussions();
        console.log(data);
        setDiscussions(data);
        console.log(discussions);
        setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
      } catch (error) {
        console.error('Failed to fetch discussions:', error);
      }
    };

    loadDiscussions();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilter: Filter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleCreateDiscussionClick = () => {
    setShowCreateForm(true);
  };

  const handleBackToDiscussions = () => {
    setShowCreateForm(false);
    setNewDiscussion({ title: '', content: '' });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDiscussion((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDiscussion(newDiscussion);
      setShowCreateForm(false);
      setNewDiscussion({ title: '', content: '' });
      // Re-fetch discussions
      const data = await fetchDiscussions();
      setDiscussions(data);
      setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Failed to create discussion:', error);
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentDiscussions = discussions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div
      className="discussions-page"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100%",
      }}
    >
      <div className="flex flex-col justify-center items-center h-full">
        {/* Only show these elements when the form is not shown */}
        {!showCreateForm && (
        <>
          <h1 className="text-white text-6xl m-5 font-mono font-bold">Discussion Panel</h1>
          {/* Show filter only if there are discussions */}
          {discussions?.length > 0 && (
            //<FilterSort filter={filter} onFilterChange={handleFilterChange} />
            <DiscussionList discussions={currentDiscussions}/>
          )}
          {discussions?.length === 0 && (
            <p className="text-white font-thin italic m-5">
              No current discussions. Start a discussion below.
            </p>
          )}
        </>
        )}

        {/* Start a Discussion button (hidden when the form is shown) */}
        {!showCreateForm && (
          <button onClick={handleCreateDiscussionClick} className="m-5">
            Start a Discussion
          </button>
        )}

        {/* Display the quote above the form */}
        {showCreateForm && (
          <h2 className="text-white text-3xl font-thick italic text-center mt-10 mb-5">
            "The important thing is not to stop questioning."
          </h2>
        )}

        {/* New discussion form */}
        {showCreateForm && (
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
            <div className="flex flex-col justify-center items-center mt-5">
              <button type="submit">
                Submit
              </button>
              <button
                type="button"
                onClick={handleBackToDiscussions}
              >
                Back to Discussions
              </button>
            </div>
          </form>
        )}

        {discussions.length > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default DiscussionsPage;
