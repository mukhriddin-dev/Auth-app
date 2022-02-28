import {useRouter} from 'next/router';
import { useContext, useEffect, } from 'react';

import AuthContext from '../../store/auth-context';
import GetPairs from '../utilities/getPairs';

import Header from './Header';
import Footer from './Footer';
import Loading from '../UI/Loading';

const Layout = (props: any) => {

  const router = useRouter();
  const authContext = useContext(AuthContext);
  useEffect(() => {
    let query: any = null;
    if ( router.isReady) {
      query = router.query;
    } else {
      const url = new URL(router.asPath, 'http://dummy.com');
      query = GetPairs(Array.from(url.searchParams.entries()));
    }
    let app_id: any = query.app_id;
    if (app_id) {
      authContext.appId = app_id;
    }
    let app_secret: any = query.app_secret;
    if (app_secret) {
      authContext.appSecret = app_secret;
    }
    let redirect_url: any = query.redirect_url;
    if (redirect_url) {
      authContext.redirectUrl = redirect_url;
    }
    let app_name: any = query.app_name;
    if (app_name) {
      authContext.appName = app_name;
    }
    if (authContext.redirectUrl && authContext.isLoggedIn) {
      let redirectPath = authContext.redirectUrl + "/?auth_token=" + authContext.authToken;
      router.push(redirectPath);
    } 
  }, [router.query]);

  if ( authContext.redirectUrl && authContext.isLoggedIn ) {
    return <Loading />
  }

  return (
    <div>
      <Header />
      <main>{props.children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
