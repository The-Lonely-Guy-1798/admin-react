// src/firebase/services/articleService.js

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
  getDoc
} from 'firebase/firestore';
import { db } from '../config.js';
import { uploadImageToCloudinary } from '../utils/cloudinaryUtils.js';

const COLLECTION_NAME = 'articles';

/**
 * Article data structure:
 * {
 *   title: string,
 *   description: string,
 *   content: string (HTML content),
 *   category: 'entertainment' | 'sports' | 'finance' | 'crypto' | 'other',
 *   status: 'draft' | 'published',
 *   coverImage: string (Cloudinary URL),
 *   createdAt: timestamp,
 *   updatedAt: timestamp,
 *   wordCount: number,
 *   authorId: string (admin ID)
 * }
 */

/**
 * Create a new article
 * @param {Object} articleData - Article data object
 * @param {File} coverImageFile - Cover image file to upload
 * @returns {Promise<Object>} Created article with ID
 */
export const createArticle = async (articleData, coverImageFile = null) => {
  try {
    let coverImageUrl = '';
    
    // Upload cover image to Cloudinary if provided
    if (coverImageFile) {
      coverImageUrl = await uploadImageToCloudinary(coverImageFile, 'articles');
    }

    const articleToCreate = {
      ...articleData,
      coverImage: coverImageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      authorId: 'admin', // Since only admin can create articles
      wordCount: calculateWordCount(articleData.content || '')
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), articleToCreate);
    
    return {
      id: docRef.id,
      ...articleToCreate,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error creating article:', error);
    throw new Error(`Failed to create article: ${error.message}`);
  }
};

/**
 * Get all articles
 * @param {string} statusFilter - Optional status filter ('draft', 'published', or null for all)
 * @param {string} categoryFilter - Optional category filter
 * @returns {Promise<Array>} Array of articles
 */
export const getArticles = async (statusFilter = null, categoryFilter = null) => {
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
    const articles = [];
    
    querySnapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      });
    });

    // Sort articles by updatedAt in descending order (newest first)
    articles.sort((a, b) => {
      const aDate = a.updatedAt || new Date(0);
      const bDate = b.updatedAt || new Date(0);
      return bDate - aDate;
    });

    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw new Error(`Failed to fetch articles: ${error.message}`);
  }
};

/**
 * Get a single article by ID
 * @param {string} articleId - Article ID
 * @returns {Promise<Object>} Article object
 */
export const getArticleById = async (articleId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, articleId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate()
      };
    } else {
      throw new Error('Article not found');
    }
  } catch (error) {
    console.error('Error fetching article:', error);
    throw new Error(`Failed to fetch article: ${error.message}`);
  }
};

/**
 * Update an article
 * @param {string} articleId - Article ID
 * @param {Object} updateData - Data to update
 * @param {File} coverImageFile - Optional new cover image file
 * @returns {Promise<Object>} Updated article
 */
export const updateArticle = async (articleId, updateData, coverImageFile = null) => {
  try {
    let coverImageUrl = updateData.coverImage;
    
    // Upload new cover image if provided
    if (coverImageFile) {
      coverImageUrl = await uploadImageToCloudinary(coverImageFile, 'articles');
    }

    const articleToUpdate = {
      ...updateData,
      coverImage: coverImageUrl,
      updatedAt: serverTimestamp(),
      wordCount: updateData.content ? calculateWordCount(updateData.content) : undefined
    };

    // Remove undefined values
    Object.keys(articleToUpdate).forEach(key => {
      if (articleToUpdate[key] === undefined) {
        delete articleToUpdate[key];
      }
    });

    const docRef = doc(db, COLLECTION_NAME, articleId);
    await updateDoc(docRef, articleToUpdate);
    
    // Return updated article
    return await getArticleById(articleId);
  } catch (error) {
    console.error('Error updating article:', error);
    throw new Error(`Failed to update article: ${error.message}`);
  }
};

/**
 * Delete an article
 * @param {string} articleId - Article ID
 * @returns {Promise<void>}
 */
export const deleteArticle = async (articleId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, articleId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting article:', error);
    throw new Error(`Failed to delete article: ${error.message}`);
  }
};

/**
 * Get articles by status
 * @param {string} status - Article status ('draft' or 'published')
 * @returns {Promise<Array>} Array of articles
 */
export const getArticlesByStatus = async (status) => {
  return await getArticles(status);
};

/**
 * Get articles by category
 * @param {string} category - Article category
 * @returns {Promise<Array>} Array of articles
 */
export const getArticlesByCategory = async (category) => {
  return await getArticles(null, category);
};

/**
 * Get published articles (public view)
 * @param {string} categoryFilter - Optional category filter
 * @param {number} limit - Optional limit for pagination
 * @returns {Promise<Array>} Array of published articles
 */
export const getPublishedArticles = async (categoryFilter = null, limit = null) => {
  try {
    let q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', 'published')
    );
    
    if (categoryFilter) {
      q = query(q, where('category', '==', categoryFilter));
    }

    const querySnapshot = await getDocs(q);
    let articles = [];
    
    querySnapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      });
    });

    // Sort articles by updatedAt in descending order (newest first)
    articles.sort((a, b) => {
      const aDate = a.updatedAt || new Date(0);
      const bDate = b.updatedAt || new Date(0);
      return bDate - aDate;
    });

    // Apply limit if specified
    if (limit) {
      articles = articles.slice(0, limit);
    }

    return articles;
  } catch (error) {
    console.error('Error fetching published articles:', error);
    throw new Error(`Failed to fetch published articles: ${error.message}`);
  }
};

/**
 * Search articles by title or content
 * @param {string} searchTerm - Search term
 * @param {string} statusFilter - Optional status filter
 * @returns {Promise<Array>} Array of matching articles
 */
export const searchArticles = async (searchTerm, statusFilter = null) => {
  try {
    // Note: Firestore doesn't have full-text search, so we'll get all articles and filter
    // For production, consider using Algolia or similar for better search
    const articles = await getArticles(statusFilter);
    
    const searchTermLower = searchTerm.toLowerCase();
    return articles.filter(article => 
      article.title.toLowerCase().includes(searchTermLower) ||
      article.description.toLowerCase().includes(searchTermLower) ||
      (article.content && article.content.toLowerCase().includes(searchTermLower))
    );
  } catch (error) {
    console.error('Error searching articles:', error);
    throw new Error(`Failed to search articles: ${error.message}`);
  }
};

/**
 * Get article statistics
 * @returns {Promise<Object>} Article statistics
 */
export const getArticleStats = async () => {
  try {
    const allArticles = await getArticles();
    
    const stats = {
      total: allArticles.length,
      published: allArticles.filter(a => a.status === 'published').length,
      draft: allArticles.filter(a => a.status === 'draft').length,
      byCategory: {}
    };

    // Count by category
    allArticles.forEach(article => {
      if (!stats.byCategory[article.category]) {
        stats.byCategory[article.category] = 0;
      }
      stats.byCategory[article.category]++;
    });

    return stats;
  } catch (error) {
    console.error('Error getting article stats:', error);
    throw new Error(`Failed to get article stats: ${error.message}`);
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