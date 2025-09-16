import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  getAllChapters, 
  getChaptersByStory, 
  createChapter, 
  updateChapter, 
  deleteChapter, 
  getChapterById,
  getNextChapterNumber
} from '../firebase/services/chapterService.js';
import toast from 'react-hot-toast';

const ChapterContext = createContext();

export const ChapterProvider = ({ children }) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load chapters from Firebase on component mount
  useEffect(() => {
    loadChapters();
  }, []);

  const loadChapters = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedChapters = await getAllChapters();
      setChapters(fetchedChapters);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to load chapters: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addChapter = async (newChapterData) => {
    try {
      setLoading(true);
      const createdChapter = await createChapter(newChapterData);
      setChapters(prevChapters => [createdChapter, ...prevChapters]);
      toast.success('Chapter created successfully!');
      return createdChapter;
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to create chapter: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateChapterById = async (chapterId, updateData) => {
    try {
      setLoading(true);
      const updatedChapter = await updateChapter(chapterId, updateData);
      setChapters(prevChapters => 
        prevChapters.map(chapter => 
          chapter.id === chapterId ? updatedChapter : chapter
        )
      );
      toast.success('Chapter updated successfully!');
      return updatedChapter;
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to update chapter: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteChapterById = async (chapterId) => {
    try {
      setLoading(true);
      await deleteChapter(chapterId);
      setChapters(prevChapters => prevChapters.filter(chapter => chapter.id !== chapterId));
      toast.success('Chapter deleted successfully!');
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to delete chapter: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getChapterByIdFromContext = async (chapterId) => {
    try {
      // First check if chapter is already in context
      const existingChapter = chapters.find(chapter => chapter.id === chapterId);
      if (existingChapter) {
        return existingChapter;
      }
      
      // If not found, fetch from Firebase
      const chapter = await getChapterById(chapterId);
      return chapter;
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to fetch chapter: ${err.message}`);
      throw err;
    }
  };

  const getChaptersByStoryId = async (storyId) => {
    try {
      const storyChapters = await getChaptersByStory(storyId);
      return storyChapters;
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to fetch chapters for story: ${err.message}`);
      throw err;
    }
  };

  const getChaptersByStatus = (status) => {
    return chapters.filter(chapter => chapter.status === status);
  };

  const getNextChapterNumberForStory = async (storyId) => {
    try {
      return await getNextChapterNumber(storyId);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to get next chapter number: ${err.message}`);
      throw err;
    }
  };

  const searchChapters = (searchTerm) => {
    if (!searchTerm) return chapters;
    
    const searchTermLower = searchTerm.toLowerCase();
    return chapters.filter(chapter => 
      chapter.title.toLowerCase().includes(searchTermLower) ||
      (chapter.content && chapter.content.toLowerCase().includes(searchTermLower))
    );
  };

  const refreshChapters = () => {
    loadChapters();
  };

  return (
    <ChapterContext.Provider value={{ 
      chapters, 
      loading,
      error,
      addChapter, 
      updateChapter: updateChapterById, 
      deleteChapter: deleteChapterById,
      getChapterById: getChapterByIdFromContext,
      getChaptersByStoryId,
      getChaptersByStatus,
      getNextChapterNumberForStory,
      searchChapters,
      refreshChapters
    }}>
      {children}
    </ChapterContext.Provider>
  );
};

export const useChapters = () => {
  const context = useContext(ChapterContext);
  if (!context) {
    throw new Error('useChapters must be used within a ChapterProvider');
  }
  return context;
};