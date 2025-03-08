import React from 'react';

export interface Discussion {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  content: string;
}

interface DiscussionListProps {
  discussions: Discussion[];
}

const DiscussionList: React.FC<DiscussionListProps> = ({ discussions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 w-full max-w-6xl">
      {discussions?.map((discussion) => (
        <div
          key={discussion.id}
          className="bg-white shadow-lg rounded-2xl p-6 transform transition duration-300 hover:scale-105 hover:shadow-2xl"
        >
          <h2 className="text-xl font-bold text-gray-800">{discussion.title}</h2>
          <p className="text-sm text-gray-500">By {discussion.author}</p>
          <p className="text-sm text-gray-400">{new Date(discussion.createdAt).toLocaleDateString()}</p>
          <div className="mt-4">
            <a
              href={`/discussion/${discussion.id}`}
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-blue-600 transition duration-200"
            >
              View Details
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiscussionList;
