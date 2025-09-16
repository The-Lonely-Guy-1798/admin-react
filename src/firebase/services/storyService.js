// src/firebase/services/storyService.js

import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query,  
  where,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../config.js';
import { uploadImageToCloudinary } from '../utils/cloudinaryUtils.js';
import { deleteChaptersByStoryId } from './chapterService.js';

const COLLECTION_NAME = 'stories';

/**
 * Story data structure:
 * {
 *   title: string,
 *   description: string,
 *   category: 'fan-fiction' | 'original',
 *   status: 'draft' | 'published',
 *   coverImage: string (Cloudinary URL),
 *   createdAt: timestamp,
 *   updatedAt: timestamp,
 *   chapters: number (count of chapters),
 *   authorId: string (admin ID)
 * }
 */

/**
 * Create a new story
 * @param {Object} storyData - Story data object
 * @param {File} coverImageFile - Cover image file to upload
 * @returns {Promise<Object>} Created story with ID
 */
export const createStory = async (storyData, coverImageFile = null) => {
  try {
    let coverImageUrl = '';
    
    // Upload cover image to Cloudinary if provided
    if (coverImageFile) {
      coverImageUrl = await uploadImageToCloudinary(coverImageFile, 'stories');
    }

    const storyToCreate = {
  ...storyData,
  description: storyData.description || '',
  coverImage: coverImageUrl || null,
  chapters: 0,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  authorId: 'admin',
  category: storyData.category || 'Original',
  status: storyData.status || 'Draft'
};

    const docRef = await addDoc(collection(db, COLLECTION_NAME), storyToCreate);
    
    return {
      id: docRef.id,
      ...storyToCreate,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error creating story:', error);
    throw new Error(`Failed to create story: ${error.message}`);
  }
};

/**
 * Get all stories
 * @param {string} statusFilter - Optional status filter ('draft', 'published', or null for all)
 * @param {string} categoryFilter - Optional category filter ('fan-fiction', 'original', or null for all)
 * @returns {Promise<Array>} Array of stories
 */
export const getStories = async (statusFilter = null, categoryFilter = null) => {
  try {
    let q = query(collection(db, COLLECTION_NAME));
    
    // Apply filters if provided
    if (statusFilter) {
      q = query(q, where('status', '==', statusFilter));
    }
    
    if (categoryFilter) {
      q = query(q, where('category', '==', categoryFilter));
    }

    const querySnapshot = await getDocs(q);
    const stories = [];
    
    querySnapshot.forEach((doc) => {
      stories.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      });
    });

    // Sort stories by updatedAt in descending order (newest first)
    stories.sort((a, b) => {
      const aDate = a.updatedAt || new Date(0);
      const bDate = b.updatedAt || new Date(0);
      return bDate - aDate;
    });

    return stories;
  } catch (error) {
    console.error('Error fetching stories:', error);
    throw new Error(`Failed to fetch stories: ${error.message}`);
  }
};

/**
 * Get a single story by ID
 * @param {string} storyId - Story ID
 * @returns {Promise<Object>} Story object
 */
export const getStoryById = async (storyId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, storyId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate()
      };
    } else {
      throw new Error('Story not found');
    }
  } catch (error) {
    console.error('Error fetching story:', error);
    throw new Error(`Failed to fetch story: ${error.message}`);
  }
};

/**
 * Update a story
 * @param {string} storyId - Story ID
 * @param {Object} updateData - Data to update
 * @param {File} coverImageFile - Optional new cover image file
 * @returns {Promise<Object>} Updated story
 */
export const updateStory = async (storyId, updateData, coverImageFile = null) => {
  try {
    let coverImageUrl = updateData.coverImage;
    
    // Upload new cover image if provided
    if (coverImageFile) {
      coverImageUrl = await uploadImageToCloudinary(coverImageFile, 'stories');
    }

    const storyToUpdate = {
      ...updateData,
      coverImage: coverImageUrl,
      updatedAt: serverTimestamp()
    };

    const docRef = doc(db, COLLECTION_NAME, storyId);
    await updateDoc(docRef, storyToUpdate);
    
    // Return updated story
    return await getStoryById(storyId);
  } catch (error) {
    console.error('Error updating story:', error);
    throw new Error(`Failed to update story: ${error.message}`);
  }
};

/**
 * Delete a story and all its related chapters
 * @param {string} storyId - Story ID
 * @returns {Promise<void>}
 */
export const deleteStory = async (storyId) => {
  try {
    // Delete all related chapters first
    await deleteChaptersByStoryId(storyId);
    
    // Then delete the story
    const docRef = doc(db, COLLECTION_NAME, storyId);
    await deleteDoc(docRef);
    
    console.log(`Successfully deleted story ${storyId} and all its chapters`);
  } catch (error) {
    console.error('Error deleting story:', error);
    throw new Error(`Failed to delete story: ${error.message}`);
  }
};

/**
 * Update story chapter count
 * @param {string} storyId - Story ID
 * @param {number} chapterCount - New chapter count
 * @returns {Promise<void>}
 */
export const updateStoryChapterCount = async (storyId, chapterCount) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, storyId);
    // ✅ MODIFIED: ONLY update the chapter count. Do NOT touch the timestamp.
    await updateDoc(docRef, {
      chapters: chapterCount
    });
  } catch (error) {
    console.error('Error updating story chapter count:', error);
    throw new Error(`Failed to update story chapter count: ${error.message}`);
  }
};

/**
 * Get stories by status
 * @param {string} status - Story status ('draft' or 'published')
 * @returns {Promise<Array>} Array of stories
 */
export const getStoriesByStatus = async (status) => {
  return await getStories(status);
};

/**
 * Get stories by category
 * @param {string} category - Story category ('fan-fiction' or 'original')
 * @returns {Promise<Array>} Array of stories
 */
export const getStoriesByCategory = async (category) => {
  return await getStories(null, category);
}; 