import React, {useState, useEffect, useCallback} from 'react';
import {UserData} from '../models/UserData';

let logoutTimer;

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  expirationTime: '',
  displayName: '',
  appId: '',
  appSecret: '',
  appName: '',
  redirectUrl: '',
  asPath: '',
  oobCode: '',
  authToken: '',
  userData: new UserData(),
  login: (token, expirationTime, displayName) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

const retrieveStoredToken = () => {
  if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('af-token');
    const storedExpirationDate = localStorage.getItem('af-expirationTime');
    const storedDisplayName = localStorage.getItem('af-displayName');

    const remainingTime = calculateRemainingTime(storedExpirationDate);

    if (remainingTime <= 3600) {
      localStorage.removeItem('af-token');
      localStorage.removeItem('af-expirationTime');
      localStorage.removeItem('af-displayName');
      localStorage.removeItem('af-authToken')
      return null;
    }

    return {
      token: storedToken,
      duration: remainingTime,
      displayName: storedDisplayName,
    };
  } else {
    return null;
  }
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();

  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('af-token');
    localStorage.removeItem('af-expirationTime');
    localStorage.removeItem('af-displayName');
    localStorage.removeItem('af-authToken');

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, expirationTime, displayName, authToken) => {
    setToken(token);
    localStorage.setItem('af-token', token);
    localStorage.setItem('af-expirationTime', expirationTime);
    localStorage.setItem('af-displayName', displayName);
    localStorage.setItem('af-authToken', authToken);

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: null,
    isLoggedIn: false,
    displayName: null,
    userData: null,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

//===================================================
//   L O G I N   U S E R - store to localStorage
//===================================================
export const LoginUser = (token, expirationTime, displayName, userData, authToken) => {
  localStorage.setItem('af-token', token);
  localStorage.setItem('af-expirationTime', expirationTime);
  localStorage.setItem('af-displayName', displayName);
  localStorage.setItem('af-authToken', authToken);
  localStorage.setItem('af-userData', userData);
  return;
};

//===================================================
//   L O G O U T   U S E R - remove from   localStorage
//===================================================
export const LogoutUser = () => {
  localStorage.removeItem('af-token');
  localStorage.removeItem('af-expirationTime');
  localStorage.removeItem('af-displayName');
  localStorage.removeItem('af-authToken');
  localStorage.removeItem('af-userData');
  return;
};

//===================================================
//   G E T   U S E R   S T A T U S - from   localStorage
//===================================================
export const GetLocalUserStatus = () => {
  const tokenData = retrieveStoredToken();

  if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('af-token');
    const storedExpirationDate = localStorage.getItem('af-expirationTime');
    const storedDisplayName = localStorage.getItem('af-displayName');
    const storedAuthToken = localStorage.getItem('af-authToken');
    const storedUserData = localStorage.getItem('af-userData');

    const remainingTime = calculateRemainingTime(storedExpirationDate);

    if (remainingTime <= 3600) {
      localStorage.removeItem('af-token');
      localStorage.removeItem('af-expirationTime');
      localStorage.removeItem('af-displayName');
      localStorage.removeItem('af-authToken');
      localStorage.removeItem('af-userData');
      return null;
    }

    return {
      token: storedToken,
      duration: remainingTime,
      displayName: storedDisplayName,
      userData: storedUserData,
      authToken: storedAuthToken,
    };
  } else {
    return null;
  }
};

export default AuthContext;
