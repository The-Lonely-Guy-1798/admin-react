import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  getArticles, 
  createArticle, 
  updateArticle, 
  deleteArticle, 
  getArticleById 
} from '../firebase/services/articleService.js';
import toast from 'react-hot-toast';

const ArticleContext = createContext();

export const ArticleProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load articles from Firebase on component mount
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedArticles = await getArticles();
      setArticles(fetchedArticles);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to load articles: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addArticle = async (newArticleData, coverImageFile = null) => {
    try {
      setLoading(true);
      const createdArticle = await createArticle(newArticleData, coverImageFile);
      setArticles(prevArticles => [createdArticle, ...prevArticles]);
      toast.success('Article created successfully!');
      return createdArticle;
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to create article: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateArticleById = async (articleId, updateData, coverImageFile = null) => {
    try {
      setLoading(true);
      const updatedArticle = await updateArticle(articleId, updateData, coverImageFile);
      setArticles(prevArticles => 
        prevArticles.map(article => 
          article.id === articleId ? updatedArticle : article
        )
      );
      toast.success('Article updated successfully!');
      return updatedArticle;
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to update article: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteArticleById = async (articleId) => {
    try {
      setLoading(true);
      await deleteArticle(articleId);
      setArticles(prevArticles => prevArticles.filter(article => article.id !== articleId));
      toast.success('Article deleted successfully!');
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to delete article: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getArticleByIdFromContext = async (articleId) => {
    try {
      // First check if article is already in context
      const existingArticle = articles.find(article => article.id === articleId);
      if (existingArticle) {
        return existingArticle;
      }
      
      // If not found, fetch from Firebase
      const article = await getArticleById(articleId);
      return article;
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to fetch article: ${err.message}`);
      throw err;
    }
  };

  const getArticlesByStatus = (status) => {
    return articles.filter(article => article.status === status);
  };

  const getArticlesByCategory = (category) => {
    return articles.filter(article => article.category === category);
  };

  const searchArticles = (searchTerm) => {
    if (!searchTerm) return articles;
    
    const searchTermLower = searchTerm.toLowerCase();
    return articles.filter(article => 
      article.title.toLowerCase().includes(searchTermLower) ||
      article.description.toLowerCase().includes(searchTermLower) ||
      (article.content && article.content.toLowerCase().includes(searchTermLower))
    );
  };

  const refreshArticles = () => {
    loadArticles();
  };

  return (
    <ArticleContext.Provider value={{ 
      articles, 
      loading,
      error,
      addArticle, 
      deleteArticle: deleteArticleById, 
      updateArticle: updateArticleById,
      getArticleById: getArticleByIdFromContext,
      getArticlesByStatus,
      getArticlesByCategory,
      searchArticles,
      refreshArticles
    }}>
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticles = () => {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error('useArticles must be used within an ArticleProvider');
  }
  return context;
};