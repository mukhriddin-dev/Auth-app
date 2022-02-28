import {useRouter} from 'next/router';
import {useState, useContext, useEffect} from 'react';
import {useIntl} from 'react-intl';
import ErrorModal from '../UI/ErrorModal';
import AppModal from '../UI/AppModal';
import Loading from '../UI/Loading';
import AuthContext from '../../store/auth-context';

const debug: boolean = false;

export default function VerifyEmailForm(props: any) {
  const router = useRouter();
  let loc = props.lang;
  if (!loc) {
    loc = router.locale;
  }
  const home = '/' + loc;
  const auth = home + '/auth';

  const [verifyEmail, setVerifyEmail] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState(true);

  const {formatMessage: fmt} = useIntl();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const signIn = router.query.singIn;
    if (debug) {
      console.log(router);
      console.log(authContext);
    }
    if (signIn && signIn === 'true') {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
    let app_id: any = router.query.app_id;
    if (app_id) {
      authContext.appId = app_id;
    }
    let app_secret: any = router.query.app_secret;
    if (app_secret) {
      authContext.appSecret = app_secret;
    }
    let redirect_url: any = router.query.redirect_url;
    if (redirect_url) {
      authContext.redirectUrl = redirect_url;
      let as_Path = router.asPath;
      authContext.asPath = as_Path;
    }
    let app_name: any = router.query.app_name;
    if (app_name) {
      authContext.appName = app_name;
    }
    if (debug) {
      console.log('Verify Email Form');
      console.log('=================');
      console.log('oobCode: ' + props.oobCode);
      console.log(router.asPath);
      console.log(authContext);
    }

    if (props.oobCode) {
      setVerifyEmail(true);
      setIsLoading(true);

      const verifyEmailHandler = async () => {
        let url = '/api/verifyEmail';
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            oobCode: props.oobCode,
            requestMethod: 'POST',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (debug) {
          console.log('DATA');
          console.log(data);
        }
        if (!data || data.statusCode !== 200) {
          throw new Error('E-INVALID-RESPONSE');
        }
        setEmailSent(true);
        setIsLoading(false);
      };

      verifyEmailHandler().catch((error) => {
        console.log(error);
        setEmailError(true);
        setIsLoading(false);
      });
    }
  }, [props.oobCode]);

  if (isLoading) {
    return <Loading />;
  }

  //===================================================
  //   R E S E T    P A S S W O R D
  //===================================================
  const submitHandler = async (event: any) => {
    //event.preventDefault();
    router.push(auth + '?singIn=true');
  };

  const inputClass =
    'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';
  const errorClass =
    'appearance-none block w-full px-3 py-2 border border-red-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';

  return (
    <div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={submitHandler}
          >
            {verifyEmail === true &&
              emailError === false &&
              isLoading === false &&
              emailSent === true && (
                <AppModal
                  title={fmt({id: 'verifyEmailTitle'})}
                  buttonText={fmt({id: 'gobackToSignin'})}
                  message={fmt({id: 'verifyEmailMessage'})}
                  closeModal={submitHandler}
                  cancelButton={false}
                />
              )}

            {verifyEmail === true &&
              emailError === true &&
              isLoading === false && (
                <ErrorModal
                  title={fmt({id: 'verifyEmailErrorTitle'})}
                  buttonText={fmt({id: 'gobackToSignin'})}
                  message={fmt({id: 'verifyEmailErrorMessage'})}
                  closeModal={submitHandler}
                />
              )}
          </form>
        </div>
      </div>
    </div>
  );
}
