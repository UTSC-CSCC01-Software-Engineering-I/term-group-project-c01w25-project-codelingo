interface Discussion {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    commentCount: number;
  }
  
  interface Filter {
    sort: 'latest' | 'popular';
    tag: string;
  }
  
  interface ApiResponse {
    discussions: Discussion[];
    totalPages: number;
  }
  
  interface CreateDiscussionResponse {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    commentCount: number;
  }
  
  // Fetch list of discussions
  export const fetchDiscussions = async (page: number, filter: Filter): Promise<ApiResponse> => {
    const response = await fetch(`/api/discussions?page=${page}&sort=${filter.sort}&tag=${filter.tag}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };
  
  // Create new discussion
  export const createDiscussion = async (newDiscussion: { title: string; content: string }): Promise<CreateDiscussionResponse> => {
    const response = await fetch('/api/discussions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newDiscussion),
    });
  
    if (!response.ok) {
      throw new Error('Failed to create discussion');
    }
  
    return response.json();
  };
  