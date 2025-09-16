// src/firebase/services/chapterService.js

import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp,
  getDoc,
  runTransaction
} from 'firebase/firestore';
import { db } from '../config.js';
import { updateStoryChapterCount } from './storyService.js';

const COLLECTION_NAME = 'chapters';

/**
 * Chapter data structure:
 * {
 *   storyId: string,
 *   chapterNumber: number,
 *   title: string,
 *   content: string (HTML content),
 *   status: 'draft' | 'published',
 *   createdAt: timestamp,
 *   updatedAt: timestamp,
 *   wordCount: number,
 *   authorId: string (admin ID)
 * }
 */

/**
 * Create a new chapter
 * @param {Object} chapterData - Chapter data object
 * @returns {Promise<Object>} Created chapter with ID
 */
export const createChapter = async (chapterData) => {
  try {
    const chapterToCreate = {
      ...chapterData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      authorId: 'admin',
      wordCount: calculateWordCount(chapterData.content || '')
    };

    const docRef = await addDoc(collection(db, 'chapters'), chapterToCreate);
    
    // Update story chapter count
    await updateStoryChapterCountForStory(chapterData.storyId);
    
    // ✅ MODIFIED: Only update the story's timestamp if the new chapter is published
    if (chapterData.status === 'published') {
      const storyRef = doc(db, 'stories', chapterData.storyId);
      await updateDoc(storyRef, { updatedAt: serverTimestamp() });
    }
    
    return {
      id: docRef.id,
      ...chapterToCreate,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error creating chapter:', error);
    throw new Error(`Failed to create chapter: ${error.message}`);
  }
};

/**
 * Get all chapters for a story
 * @param {string} storyId - Story ID
 * @param {string} statusFilter - Optional status filter ('draft', 'published', or null for all)
 * @returns {Promise<Array>} Array of chapters
 */
export const getChaptersByStory = async (storyId, statusFilter = null) => {
  try {
    let q = query(
      collection(db, COLLECTION_NAME),
      where('storyId', '==', storyId)
    );
    
    // Apply status filter if provided
    if (statusFilter) {
      q = query(q, where('status', '==', statusFilter));
    }

    const querySnapshot = await getDocs(q);
    const chapters = [];
    
    querySnapshot.forEach((doc) => {
      chapters.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      });
    });

    // Sort chapters by chapter number in JavaScript
    chapters.sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));

    return chapters;
  } catch (error) {
    console.error('Error fetching chapters:', error);
    throw new Error(`Failed to fetch chapters: ${error.message}`);
  }
};

/**
 * Get all chapters (admin view)
 * @param {string} statusFilter - Optional status filter ('draft', 'published', or null for all)
 * @returns {Promise<Array>} Array of chapters
 */
export const getAllChapters = async (statusFilter = null) => {
  try {
    let q = query(collection(db, COLLECTION_NAME));
    
    // Apply status filter if provided
    if (statusFilter) {
      q = query(q, where('status', '==', statusFilter));
    }

    const querySnapshot = await getDocs(q);
    const chapters = [];
    
    querySnapshot.forEach((doc) => {
      chapters.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      });
    });

    // Sort chapters by updatedAt in descending order (newest first)
    chapters.sort((a, b) => {
      const aDate = a.updatedAt || new Date(0);
      const bDate = b.updatedAt || new Date(0);
      return bDate - aDate;
    });

    return chapters;
  } catch (error) {
    console.error('Error fetching all chapters:', error);
    throw new Error(`Failed to fetch all chapters: ${error.message}`);
  }
};

/**
 * Get a single chapter by ID
 * @param {string} chapterId - Chapter ID
 * @returns {Promise<Object>} Chapter object
 */
export const getChapterById = async (chapterId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, chapterId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate()
      };
    } else {
      throw new Error('Chapter not found');
    }
  } catch (error) {
    console.error('Error fetching chapter:', error);
    throw new Error(`Failed to fetch chapter: ${error.message}`);
  }
};

/**
 * Update a chapter
 * @param {string} chapterId - Chapter ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated chapter
 */
export const updateChapter = async (chapterId, updateData) => {
  try {
    const chapterRef = doc(db, 'chapters', chapterId);

    await runTransaction(db, async (transaction) => {
      const chapterDoc = await transaction.get(chapterRef);
      if (!chapterDoc.exists()) {
        throw new Error('Chapter not found');
      }
      const chapterData = chapterDoc.data();
      const oldStatus = chapterData.status; // Get the status before the update

      const chapterToUpdate = {
        ...updateData,
        updatedAt: serverTimestamp(),
        wordCount: updateData.content ? calculateWordCount(updateData.content) : undefined
      };
      
      Object.keys(chapterToUpdate).forEach(key => {
        if (chapterToUpdate[key] === undefined) delete chapterToUpdate[key];
      });

      transaction.update(chapterRef, chapterToUpdate);

      // ✅ NEW LOGIC: Update the parent story's timestamp if a chapter is published
      const newStatus = updateData.status;
      if (newStatus === 'published' && oldStatus !== 'published') {
        const storyRef = doc(db, 'stories', chapterData.storyId);
        transaction.update(storyRef, { updatedAt: serverTimestamp() });
      }

      // ✅ KEPT: We still log the content edit for the "All Updates" screen.
      if (updateData.content) {
        const editLogRef = doc(collection(db, 'storyEdits'));
        transaction.set(editLogRef, {
          storyId: chapterData.storyId,
          chapterId: chapterId,
          editedAt: serverTimestamp()
        });
      }
    });

    return await getChapterById(chapterId);

  } catch (error) { // ✅ FIX: Added the missing opening curly brace '{'
    console.error('Error updating chapter:', error);
    throw new Error(`Failed to update chapter: ${error.message}`);
  }
};

/**
 * Delete all chapters for a story
 * @param {string} storyId - Story ID
 * @returns {Promise<void>}
 */
export const deleteChaptersByStoryId = async (storyId) => {
  try {
    // Get all chapters for this story
    const chapters = await getChaptersByStory(storyId);
    
    // Delete each chapter
    const deletePromises = chapters.map(chapter => {
      const docRef = doc(db, COLLECTION_NAME, chapter.id);
      return deleteDoc(docRef);
    });
    
    await Promise.all(deletePromises);
    
    console.log(`Deleted ${chapters.length} chapters for story ${storyId}`);
  } catch (error) {
    console.error('Error deleting chapters for story:', error);
    throw new Error(`Failed to delete chapters for story: ${error.message}`);
  }
};

/**
 * Delete a chapter
 * @param {string} chapterId - Chapter ID
 * @returns {Promise<void>}
 */
export const deleteChapter = async (chapterId) => {
  try {
    // Get chapter first to get storyId
    const chapter = await getChapterById(chapterId);
    
    // Delete the chapter
    const docRef = doc(db, COLLECTION_NAME, chapterId);
    await deleteDoc(docRef);
    
    // Update story chapter count
    await updateStoryChapterCountForStory(chapter.storyId);
  } catch (error) {
    console.error('Error deleting chapter:', error);
    throw new Error(`Failed to delete chapter: ${error.message}`);
  }
};

/**
 * Get next chapter number for a story
 * @param {string} storyId - Story ID
 * @returns {Promise<number>} Next chapter number
 */
export const getNextChapterNumber = async (storyId) => {
  try {
    const chapters = await getChaptersByStory(storyId);
    if (chapters.length === 0) {
      return 1;
    }
    
    const maxChapterNumber = Math.max(...chapters.map(ch => ch.chapterNumber));
    return maxChapterNumber + 1;
  } catch (error) {
    console.error('Error getting next chapter number:', error);
    throw new Error(`Failed to get next chapter number: ${error.message}`);
  }
};

/**
 * Reorder chapters for a story
 * @param {string} storyId - Story ID
 * @param {Array} chapterOrders - Array of {id, chapterNumber} objects
 * @returns {Promise<void>}
 */
export const reorderChapters = async (storyId, chapterOrders) => {
  try {
    await runTransaction(db, async (transaction) => {
      for (const { id, chapterNumber } of chapterOrders) {
        const docRef = doc(db, COLLECTION_NAME, id);
        transaction.update(docRef, {
          chapterNumber,
          updatedAt: serverTimestamp()
        });
      }
    });
  } catch (error) {
    console.error('Error reordering chapters:', error);
    throw new Error(`Failed to reorder chapters: ${error.message}`);
  }
};

/**
 * Get chapters by status
 * @param {string} status - Chapter status ('draft' or 'published')
 * @returns {Promise<Array>} Array of chapters
 */
export const getChaptersByStatus = async (status) => {
  return await getAllChapters(status);
};

/**
 * Publish multiple chapters
 * @param {Array} chapterIds - Array of chapter IDs
 * @returns {Promise<void>}
 */
export const publishChapters = async (chapterIds) => {
  try {
    await runTransaction(db, async (transaction) => {
      for (const chapterId of chapterIds) {
        const docRef = doc(db, COLLECTION_NAME, chapterId);
        transaction.update(docRef, {
          status: 'published',
          updatedAt: serverTimestamp()
        });
      }
    });
  } catch (error) {
    console.error('Error publishing chapters:', error);
    throw new Error(`Failed to publish chapters: ${error.message}`);
  }
};

/**
 * Helper function to calculate word count
 * @param {string} content - HTML content
 * @returns {number} Word count
 */
const calculateWordCount = (content) => {
  if (!content) return 0;
  
  // Remove HTML tags and count words
  const textContent = content.replace(/<[^>]*>/g, '');
  const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
  return words.length;
};

/**
 * Helper function to update story chapter count
 * @param {string} storyId - Story ID
 * @returns {Promise<void>}
 */
const updateStoryChapterCountForStory = async (storyId) => {
  try {
    const chapters = await getChaptersByStory(storyId);
    await updateStoryChapterCount(storyId, chapters.length);
  } catch (error) {
    console.error('Error updating story chapter count:', error);
    // Don't throw error as this is a helper function
  }
}; 