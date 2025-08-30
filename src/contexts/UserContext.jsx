import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

const initialUsers = [
  { id: 1, email: 'reader.one@example.com', signUpDate: '2025-07-09', storiesRead: 12, articlesRead: 34, status: 'Active', type: 'new' },
  { id: 2, email: 'another.fan@example.com', signUpDate: '2025-07-08', storiesRead: 5, articlesRead: 10, status: 'Active', type: 'new' },
  { id: 3, email: 'test.user@example.com', signUpDate: '2025-07-05', storiesRead: 0, articlesRead: 1, status: 'Active', type: 'returning' },
  { id: 4, email: 'banned.user@example.com', signUpDate: '2025-06-20', storiesRead: 25, articlesRead: 50, status: 'Banned', type: 'returning' },
  { id: 5, email: 'old.reader@example.com', signUpDate: '2025-01-15', storiesRead: 150, articlesRead: 200, status: 'Active', type: 'returning' },
];

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(initialUsers);

  // Function to toggle a user's status between Active and Banned
  const toggleUserStatus = (userId) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, status: user.status === 'Active' ? 'Banned' : 'Active' }
          : user
      )
    );
  };

  return (
    <UserContext.Provider value={{ users, toggleUserStatus }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  return useContext(UserContext);
};