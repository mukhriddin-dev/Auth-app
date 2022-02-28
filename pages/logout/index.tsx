import {LogoutUser} from '../../store/auth-context';
import {useRouter} from 'next/router';
import {useContext, useState} from 'react';
import AuthForm from '../../component/Auth/AuthForm';
import Loading from '../../component/UI/Loading';

import AuthContext from '../../store/auth-context';

const LogoutPage = () => {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  if (typeof window !== 'undefined') {
    LogoutUser();
    authContext.logout();
    authContext.isLoggedIn = false;
    router.replace('/auth?signIn=true', '/auth')
  }


  return <AuthForm  />
};

export default LogoutPage;
