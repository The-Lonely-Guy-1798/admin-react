import React, { createContext, useState, useContext } from 'react';

const StoryContext = createContext();

const initialStories = [
  { id: 1, title: 'The Last Voyager', abstract: 'A sci-fi epic about the last human exploring the void.', category: 'Original', status: 'Published', chapters: 52, lastUpdated: '2025-07-17' },
  { id: 2, title: 'Naruto: The Seventh Shadow', abstract: 'A new adventure in the Hidden Leaf.', category: 'Fan-Fiction', status: 'Published', chapters: 150, lastUpdated: '2025-07-16' },
  { id: 3, title: 'City of Glass and Fire', abstract: 'Magic and mystery in a sprawling metropolis.', category: 'Original', status: 'Draft', chapters: 5, lastUpdated: '2025-07-12' },
  { id: 4, title: 'Alpha Protocol', abstract: 'A spy thriller with twists and turns.', category: 'Fan-Fiction', status: 'Draft', chapters: 12, lastUpdated: '2025-07-01' },
  { id: 5, title: 'Zodiac Academy', abstract: 'Students harness the power of the stars.', category: 'Original', status: 'Published', chapters: 88, lastUpdated: '2025-04-20' },
];

export const StoryProvider = ({ children }) => {
  const [stories, setStories] = useState(initialStories);

  const addStory = (newStory) => {
    const storyWithId = { 
        ...newStory, 
        id: Date.now(),
        lastUpdated: new Date().toISOString().slice(0, 10) 
    };
    setStories(prevStories => [storyWithId, ...prevStories]);
  };

  const deleteStory = (storyId) => {
    setStories(prevStories => prevStories.filter(story => story.id !== storyId));
  };

  // The new update function
  const updateStory = (updatedStory) => {
    setStories(prevStories => 
      prevStories.map(story => 
        story.id === updatedStory.id ? updatedStory : story
      )
    );
  };

  return (
    <StoryContext.Provider value={{ stories, addStory, deleteStory, updateStory }}>
      {children}
    </StoryContext.Provider>
  );
};

export const useStories = () => {
  return useContext(StoryContext);
};