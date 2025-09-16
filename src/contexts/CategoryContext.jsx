import React, { createContext, useState, useContext } from 'react';

const CategoryContext = createContext();

const initialCategories = [
  { id: 1, name: 'Original', type: 'Story', count: 25 },
  { id: 2, name: 'Fan-Fiction', type: 'Story', count: 18 },
  { id: 3, name: 'Finance & Crypto', type: 'Article', count: 7 },
  { id: 4, name: 'Entertainment', type: 'Article', count: 15 },
  { id: 5, name: 'Sports', type: 'Article', count: 9 },
  { id: 6, name: 'Sci-Fi', type: 'Story', count: 42 },
  { id: 7, name: 'Tech', type: 'Article', count: 11 },
];

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState(initialCategories);

  const addCategory = (category) => {
    const newCategory = { 
        ...category, 
        id: Date.now(), // Create a unique ID
        count: 0 
    };
    setCategories(prev => [newCategory, ...prev]);
  };

  const updateCategory = (updatedCategory) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      )
    );
  };

  const deleteCategory = (categoryId) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  return useContext(CategoryContext);
};