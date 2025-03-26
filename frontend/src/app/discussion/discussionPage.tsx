import React, { useState, useEffect } from 'react';
import DiscussionList, { Discussion } from './discussionList';
import Pagination from './pagination';
//import FilterSort, { Filter } from './filterSort';
import { useNavigate } from 'react-router-dom';
import { fetchDiscussions } from './discussionApi';
import '../styles/general.css';
import './discussion.css';
import background from "../../assets/landing.jpg";

const DiscussionsPage: React.FC = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  //const [filter, setFilter] = useState<Filter>({ sort: 'latest', tag: '' });

  const ITEMS_PER_PAGE = 8;

  const navigate = useNavigate();

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

  // const handleFilterChange = (newFilter: Filter) => {
  //   setFilter(newFilter);
  //   setCurrentPage(1);
  // };

  const handleCreateDiscussionClick = () => {
    navigate('/discussions/new-discussion');
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
        width: "100%",
        backgroundAttachment: "fixed",
        minHeight:"100vh",
        display: "flex",    // Enable flexbox
        flexDirection: "column", // Stack items vertically
        justifyContent: "center", // Center the content vertically
        alignItems: "center", // Center the content horizontally
      }}
    >
      <div className="flex flex-col justify-center items-center h-full">
        <>
          <h1 className="text-white text-6xl m-5 font-mono font-bold">Discussion Panel</h1>
          {/* Show filter only if there are discussions */}
          {discussions?.length > 0 && (
            //<FilterSort filter={filter} onFilterChange={handleFilterChange} />
            <DiscussionList discussions={currentDiscussions}/>
          )}
          {discussions?.length === 0 && (
            <p className="fade-in text-white font-thin italic m-5">
              No current discussions. Start a discussion below.
            </p>
          )}
        </>

        {/* Start a Discussion button (hidden when the form is shown) */}
          <button
              onClick={handleCreateDiscussionClick}
              className="fade-in text-white bg-gradient-to-r from-indigo-800
                        via-indigo-600 to-blue-500 hover:bg-gradient-to-br
                        focus:ring-3 focus:outline-none focus:ring-cyan-300
                        dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50
                        dark:shadow-lg dark:shadow-cyan-800/80 font-bold
                        rounded-2xl text-2xl px-10 py-6 w-full max-w-md text-center mb-6 transition-all duration-300"
            >
              Start Discussion
            </button>

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
