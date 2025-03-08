import { config } from '../../config.ts';
import { Discussion } from './discussionList.tsx'
const { apiURL } = config;

  
  interface Filter {
    sort: 'latest' | 'popular';
    tag: string;
  }
  
  interface CreateDiscussionResponse {
    id: number;
    title: string;
    author: string;
    createdAt: string;
    content: string;
  }
  
  // Fetch list of discussions
  // ?page=${page}&sort=${filter.sort}&tag=${filter.tag}
  export const fetchDiscussions = async (): Promise<Discussion[]> => {
    const response = await fetch(`${apiURL}/user/discussion`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };
  
  // Create new discussion
  export const createDiscussion = async (newDiscussion: { title: string; content: string }): Promise<CreateDiscussionResponse> => {
    const response = await fetch(`${apiURL}/user/discussion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newDiscussion),
      credentials: 'include'
    });
  
    if (!response.ok) {
      throw new Error('Failed to create discussion');
    }
  
    return response.json();
  };
  