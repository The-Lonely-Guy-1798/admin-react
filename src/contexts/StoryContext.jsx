import React, { createContext, useState, useContext } from 'react';

const StoryContext = createContext();

const initialStories = [
  { id: 1, cover: 'S', title: 'The Last Voyager', category: 'Original', status: 'Published', chapters: 52, lastUpdated: '2 hours ago' },
  { id: 2, cover: 'S', title: 'Naruto: The Seventh Shadow', category: 'Fan-Fiction', status: 'Published', chapters: 150, lastUpdated: '1 day ago' },
  { id: 3, cover: 'S', title: 'City of Glass and Fire', category: 'Original', status: 'Draft', chapters: 5, lastUpdated: '5 days ago' },
  { id: 4, cover: 'A', title: 'Alpha Protocol', category: 'Fan-Fiction', status: 'Draft', chapters: 12, lastUpdated: '2 weeks ago' },
  { id: 5, cover: 'Z', title: 'Zodiac Academy', category: 'Original', status: 'Published', chapters: 88, lastUpdated: '3 months ago' },
];

export const StoryProvider = ({ children }) => {
  const [stories, setStories] = useState(initialStories);

  const addStory = (newStory) => {
    // In a real app, this would be an API call.
    // Here, we just add it to our state.
    const storyWithId = { ...newStory, id: Date.now() }; // Add a unique ID
    setStories(prevStories => [storyWithId, ...prevStories]);
  };

  const deleteStory = (storyId) => {
    setStories(prevStories => prevStories.filter(story => story.id !== storyId));
  };

  return (
    <StoryContext.Provider value={{ stories, addStory, deleteStory }}>
      {children}
    </StoryContext.Provider>
  );
};

// Custom hook to easily use the context
export const useStories = () => {
  return useContext(StoryContext);
};