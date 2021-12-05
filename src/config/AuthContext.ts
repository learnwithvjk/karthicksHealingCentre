import React from 'react';

export const AuthContext = React.createContext({
  isLoading: true,
  userName: null,
  userToken: null,
});
