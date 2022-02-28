import React, { useState, useEffect, useCallback } from "react";

const debug = true;

let logoutTimer: any;

type AuthContextObj = {
  token: any;
  isLoggedIn: boolean;
  expirationTime: any;
  userData: any;
  idToken: any;
//  login: (token: any, expirationTime: any ) => void;
 // logout: () => void;
  loginUser: (token: any, expirationTime: any ) => void;
};

const AuthContext: any = React.createContext<AuthContextObj>({
  token: "",
  isLoggedIn: false,
  expirationTime: new Date(),
  userData: null,
  idToken: "",
  // login: (token: any, expirationTime: any) => {},
  // logout: () => {},
  loginUser: (token: any, expirationTime: any) => {},

});

const calculateRemainingTime = (expirationTime: any) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

const retrieveStoredToken = () => {
  if (debug) {
    console.log("retrieve stored token");
  }
  if (process.browser) {
    const storedToken = localStorage.getItem("token");
    const storedExpirationDate = localStorage.getItem("expirationTime");

    if (storedExpirationDate) {
      const remainingTime = calculateRemainingTime(storedExpirationDate);
      if (remainingTime <= 3600) {
        localStorage.removeItem("token");
        localStorage.removeItem("expirationTime");
        return null;
      }
      return {
        token: storedToken,
        duration: remainingTime,
      };
    }
    return null;
  } else {
    return null;
  }
};

export const AuthContextProviderNew: any = (props: any) => {
  /*
  console.log(props);
  const tokenData = retrieveStoredToken();
  if (debug) {
    console.log(tokenData);
  }

  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  } 

  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token: any, expirationTime: any) => {
    if (debug) {
      console.log("TOKEN: " + token + "  exp: " + expirationTime);
    }
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (debug) {
      console.log("USE EFFECT");
      console.log(tokenData);
    }
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);
  */

  const loginUser = (token: any, expirationTime: any ) => {
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);
    // const remainingTime = calculateRemainingTime(expirationTime);
    // logoutTimer = setTimeout(logoutHandler, remainingTime);
    return;
    
  };

  const contextValue: any = {
    token: '123',
    isLoggedIn: false,
    expirationTime: new Date(),
    userData: null,
    idToken: '',
//    login: loginHandler,
 //   logout: logoutHandler,
    loginUser: loginUser
  };

  console.log(contextValue);

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
