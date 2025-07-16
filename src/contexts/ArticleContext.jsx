import React, { createContext, useState, useContext } from 'react';

const ArticleContext = createContext();

const initialArticles = [
  { id: 1, cover: 'A', title: 'Bitcoin Hits New High', category: 'Finance & Crypto', status: 'Published', lastUpdated: 'Yesterday', content: '<p>Bitcoin surged to a new all-time high on Monday...</p>' },
  { id: 2, cover: 'B', title: 'Blockbuster Movie Review', category: 'Entertainment', status: 'Published', lastUpdated: '2 days ago', content: '<p>The latest blockbuster is a must-see...</p>' },
  { id: 3, cover: 'C', title: 'World Cup Finals Recap', category: 'Sports', status: 'Draft', lastUpdated: '3 days ago', content: '<p>A thrilling conclusion to the tournament...</p>' },
  { id: 4, cover: 'D', title: 'New AI Breakthroughs', category: 'Finance & Crypto', status: 'Draft', lastUpdated: '1 week ago', content: '<p>Researchers announce new AI models...</p>' },
];

export const ArticleProvider = ({ children }) => {
  const [articles, setArticles] = useState(initialArticles);

  const addArticle = (newArticle) => {
    const articleWithId = { ...newArticle, id: Date.now() };
    setArticles(prevArticles => [articleWithId, ...prevArticles]);
  };

  const deleteArticle = (articleId) => {
    setArticles(prevArticles => prevArticles.filter(article => article.id !== articleId));
  };
  
  // Add the update function here
  const updateArticle = (updatedArticle) => {
    setArticles(prevArticles => 
      prevArticles.map(article => 
        article.id === updatedArticle.id ? updatedArticle : article
      )
    );
  };

  return (
    <ArticleContext.Provider value={{ articles, addArticle, deleteArticle, updateArticle }}>
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticles = () => {
  return useContext(ArticleContext);
};