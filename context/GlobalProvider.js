import React, { createContext, useContext, useEffect, useState } from "react";
import {AsyncStorage} from 'react-native';
import {callApiGetUserByUsername} from '../api/user';
const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = AsyncStorage.getItem('user');
    const fetchUser = async () => {

      try {
        
        const res = await callApiGetUserByUsername({ username: user?.username });
        if (res) {
          setIsLogged(true);
          setUser(res);
        } else {
          setIsLogged(false);
          setUser(null);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user?.username]);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
