import React from 'react';

interface Discussion {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  commentCount: number;
}

interface DiscussionListProps {
  discussions: Discussion[];
}

const DiscussionList: React.FC<DiscussionListProps> = ({ discussions }) => {
  return (
    <div className="discussion-list">
      {discussions.map((discussion) => (
        <div key={discussion.id} className="discussion-item">
          <h2>{discussion.title}</h2>
          <p>Author: {discussion.author}</p>
          <p>Date: {new Date(discussion.createdAt).toLocaleDateString()}</p>
          <p>Comments: {discussion.commentCount}</p>
          <a href={`/discussion/${discussion.id}`}>View Details</a>
        </div>
      ))}
    </div>
  );
};

export default DiscussionList;