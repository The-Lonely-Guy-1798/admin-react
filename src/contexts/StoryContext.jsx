import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  getStories, 
  createStory, 
  updateStory, 
  deleteStory, 
  getStoryById 
} from '../firebase/services/storyService.js';
import toast from 'react-hot-toast';

const StoryContext = createContext();

export const StoryProvider = ({ children }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load stories from Firebase on component mount
  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedStories = await getStories();
      setStories(fetchedStories);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to load stories: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addStory = async (newStoryData, coverImageFile = null) => {
    try {
      setLoading(true);
      const createdStory = await createStory(newStoryData, coverImageFile);
      setStories(prevStories => [createdStory, ...prevStories]);
      toast.success('Story created successfully!');
      return createdStory;
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to create story: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStoryById = async (storyId, updateData, coverImageFile = null) => {
    try {
      setLoading(true);
      const updatedStory = await updateStory(storyId, updateData, coverImageFile);
      setStories(prevStories => 
        prevStories.map(story => 
          story.id === storyId ? updatedStory : story
        )
      );
      toast.success('Story updated successfully!');
      return updatedStory;
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to update story: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteStoryById = async (storyId) => {
    try {
      setLoading(true);
      await deleteStory(storyId);
      setStories(prevStories => prevStories.filter(story => story.id !== storyId));
      toast.success('Story deleted successfully!');
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to delete story: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getStoryByIdFromContext = async (storyId) => {
    try {
      // First check if story is already in context
      const existingStory = stories.find(story => story.id === storyId);
      if (existingStory) {
        return existingStory;
      }
      
      // If not found, fetch from Firebase
      const story = await getStoryById(storyId);
      return story;
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to fetch story: ${err.message}`);
      throw err;
    }
  };

  const getStoriesByStatus = (status) => {
    return stories.filter(story => story.status === status);
  };

  const getStoriesByCategory = (category) => {
    return stories.filter(story => story.category === category);
  };

  const searchStories = (searchTerm) => {
    if (!searchTerm) return stories;
    
    const searchTermLower = searchTerm.toLowerCase();
    return stories.filter(story => 
  story.title.toLowerCase().includes(searchTermLower) ||
  (story.description || '').toLowerCase().includes(searchTermLower)
);
  };

  const refreshStories = () => {
    loadStories();
  };

  return (
    <StoryContext.Provider value={{ 
      stories, 
      loading,
      error,
      addStory, 
      deleteStory: deleteStoryById, 
      updateStory: updateStoryById,
      getStoryById: getStoryByIdFromContext,
      getStoriesByStatus,
      getStoriesByCategory,
      searchStories,
      refreshStories
    }}>
      {children}
    </StoryContext.Provider>
  );
};

export const useStories = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStories must be used within a StoryProvider');
  }
  return context;
};