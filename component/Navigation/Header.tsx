import Link from 'next/link';
import {useRouter} from 'next/router';
import {useIntl} from 'react-intl';
import {Fragment, useContext, useEffect, useState} from 'react';

import AuthContext from '../../store/auth-context';
import {LogoutUser} from '../../store/auth-context';
import {GetLocalUserStatus} from '../../store/auth-context';

import GuestForm from './GuestForm';
import SideBarForm from '../AppUI/AppHome';
import GetPairs from '../utilities/getPairs';

const navigation = [
  {name: 'Solutions', href: '#'},
  {name: 'Pricing', href: '#'},
  {name: 'Docs', href: '#'},
  {name: 'Company', href: '#'},
];

const debug: boolean = false;

export default function Header() {
  const {formatMessage: fmt} = useIntl();
  const router = useRouter();
  const {locale, locales} = router;
  const home = '/' + locale;
  const auth = home + '/auth';

  const authContext = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  let pathname = router.pathname;

  const userStatus = GetLocalUserStatus();
  if (userStatus) {
    const token: any = userStatus.token;
    const displayName: any = userStatus.token;

    const {duration} = userStatus;
    authContext.isLoggedIn = true;
    authContext.token = token;
    authContext.displayName = displayName;
    authContext.authToken = userStatus.authToken;
  }
  if (debug) {
    console.log('HEADER');
    console.log(router.query);
    console.log(authContext);
  }

  useEffect(() => {
    setIsLoggedIn(authContext.isLoggedIn);
  }, [isLoggedIn, authContext.isLoggedIn]);

  const [isLogin, setIsLogin] = useState(true);

  const logoutHandler = () => {
    LogoutUser();
    authContext.logout();
    authContext.isLoggedIn = false;
    setIsLoggedIn(false);
    router.push(auth);
  };

  const boldClass =
    'inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50';
  const regularClass =
    'inline-block bg-indigo-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75';
  let signUpClass = regularClass;
  let signInClass = regularClass;
  let signIn = router.query.signIn;
  if ( pathname === '/auth' && !signIn ) {
    signIn = 'true';
  }
;  if (pathname === '/auth' && signIn && signIn === 'false') {
    signUpClass = boldClass;
    signInClass = regularClass;
  }
  if (pathname === '/auth' && signIn && signIn === 'true') {
    signUpClass = regularClass;
    signInClass = boldClass;
  }

  return (
    <Fragment>
      {!isLoggedIn  &&  (
        <GuestForm
          isLoggedIn={isLoggedIn}
          signInClass={signInClass}
          signUpClass={signUpClass}
        />
      )}
      {isLoggedIn &&  <SideBarForm />}
    </Fragment>
  );
}