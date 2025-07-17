import React, { createContext, useState, useContext } from 'react';

const ChapterContext = createContext();

// Updated with sequential, logical dates
const initialChapters = [
    // Chapters for Story ID 1 (The Last Voyager)
    { id: 101, storyId: 1, chapterNumber: 1, title: 'The Anomaly', status: 'Published', content: '<p>The first anomaly was detected near Orion\'s belt...</p>', lastUpdated: new Date('2025-07-10T11:00:00Z'), wordCount: 2500},
    { id: 102, storyId: 1, chapterNumber: 2, title: 'Ghost Signal', status: 'Published', content: '<p>A faint, repeating signal echoed from the void...</p>', lastUpdated: new Date('2025-07-12T15:30:00Z'), wordCount: 3100},
    { id: 103, storyId: 1, chapterNumber: 3, title: 'The Leviathan', status: 'Published', content: '<p>It wasn\'t a ship. It was a creature.</p>', lastUpdated: new Date('2025-07-14T18:00:00Z'), wordCount: 2800},
    { id: 104, storyId: 1, chapterNumber: 4, title: 'Echoes (Draft)', status: 'Draft', content: '<p>The creature\'s thoughts were a faint echo in the protagonist\'s mind.</p>', lastUpdated: new Date('2025-07-17T08:00:00Z'), wordCount: 1500},

    // Chapters for Story ID 2 (Naruto)
    { id: 201, storyId: 2, chapterNumber: 1, title: 'A New Beginning', status: 'Published', content: '<p>The village was quiet after the war...</p>', lastUpdated: new Date('2025-07-12T18:00:00Z'), wordCount: 4500},
];

export const ChapterProvider = ({ children }) => {
  const [chapters, setChapters] = useState(initialChapters);

  const addChapter = (newChapter) => {
    const chapterWithId = { ...newChapter, id: Date.now(), lastUpdated: new Date() };
    setChapters(prev => [chapterWithId, ...prev]);
  };

  const updateChapter = (updatedChapter) => {
    const chapterWithDate = { ...updatedChapter, lastUpdated: new Date() };
    setChapters(prev => 
      prev.map(chapter => 
        chapter.id === updatedChapter.id ? chapterWithDate : chapter
      )
    );
  };
  
  const deleteChapter = (chapterId) => {
    setChapters(prev => prev.filter(chapter => chapter.id !== chapterId));
  };
  
  return (
    <ChapterContext.Provider value={{ chapters, addChapter, updateChapter, deleteChapter }}>
      {children}
    </ChapterContext.Provider>
  );
};

export const useChapters = () => {
  return useContext(ChapterContext);
};