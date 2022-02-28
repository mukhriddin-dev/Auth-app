import {useRouter} from 'next/router';
import {useState, useRef, useContext, useEffect} from 'react';
import {useIntl} from 'react-intl';
import Link from 'next/link';

import AuthContext from '../../store/auth-context';
import {LoginUser} from '../../store/auth-context';
import {UserData} from '../../models/UserData';
import AppModal from '../UI/AppModal';
import ErrorModal from '../UI/ErrorModal';
import Loading from '../UI/Loading';
import GetPairs from '../utilities/getPairs';

const debug: boolean = false;

export default function AuthForm() {
  const router = useRouter();
  const loc = router.locale;
  const home = '/' + loc;
  const auth = home + '/auth';
  const forgotpassword = home + '/forgotpassword';

  const authContext = useContext(AuthContext);

  useEffect(() => {
    let query: any = null;
    if ( router.isReady) {
      query = router.query;
    } else {
      const url = new URL(router.asPath, 'http://dummy.com');
      query = GetPairs(Array.from(url.searchParams.entries()));
    }
    let signIn = query.signIn;
    if ( !signIn ) {
      signIn = 'true';
    }
    if (signIn && signIn === 'true') {
      setIsLogin(true);
    } else {
      setIsLogin(false);
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
      let as_Path = router.asPath;
      authContext.asPath = as_Path;
    }
    let app_name: any = query.app_name;
    if (app_name) {
      authContext.appName = app_name;
    }
  }, [router.query]);

  if (authContext.isLoggedIn) {
    router.replace(home);
  }

  const {formatMessage: fmt} = useIntl();

  let phoneInputRef = useRef<HTMLInputElement>(null);

  const [token, setToken] = useState();
  const [forgotPassword, setForgotPassword] = useState<boolean>();

  const [errorMessage, setErrorMessage] = useState<string>();

  const [enteredName, setEnteredName] = useState('');
  const [nameIsValid, setNameIsValid] = useState<boolean>();
  const [nameBlur, setNameBlur] = useState<boolean>(false);

  const [enteredEmail, setEnteredEmail] = useState('');
  const [emailIsValid, setEmailIsValid] = useState<boolean>(false);
  const [emailBlur, setEmailBlur] = useState<boolean>(false);

  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false);
  const [passwordBlur, setPasswordBlur] = useState<boolean>(false);

  const [formIsValid, setFormIsValid] = useState(false);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [userRegistered, setUserRegistered] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
    setEnteredEmail('');
    setEnteredPassword('');
    setEnteredName('');
    setEmailBlur(false);
    setPasswordBlur(false);
    setNameBlur(false);
    setUserRegistered(false);
    setError(false);
  };


  //===================================================
  //   V A L I D A T I O N
  //===================================================

  //
  // Validate name
  //
  const nameChangeHandler = (event: any) => {
    setError(false);
    if (event.target.value.trim().length > 0) {
      setNameIsValid(true);
    }
    if (nameIsValid && nameBlur) {
      setNameBlur(false);
    }
    setEnteredName(event.target.value);
  };

  //
  // Validate eMail
  //
  const emailChangeHandler = (event: any) => {
    setError(false);
    setEmailIsValid(
      event.target.value.includes('@') && event.target.value.trim().length > 5
    );
    if (emailIsValid && emailBlur) {
      setEmailBlur(false);
    }
    setEnteredEmail(event.target.value);
    if (emailIsValid && passwordIsValid) {
      setFormIsValid(true);
    }
  };

  //
  // Validate Password
  //
  const passwordChangeHandler = (event: any) => {
    setError(false);
    setFormIsValid(
      enteredEmail.includes('@') && event.target.value.trim().length > 7
    );
    if (event.target.value.trim().length > 7) {
      setPasswordIsValid(true);
    }
    if (passwordIsValid && emailBlur) {
      setPasswordBlur(false);
    }
    setEnteredPassword(event.target.value);
    if (emailIsValid && passwordIsValid) {
      setFormIsValid(true);
    }
  };

  //===================================================
  //   O N   B L U R (cursor out of focus)
  //===================================================

  //
  // Validate Name
  //
  const validateNameHandler = () => {
    if (enteredName && enteredName.trim().length > 0) {
      setNameIsValid(true);
    } else {
      setNameIsValid(false);
    }
    setNameBlur(true);
  };

  //
  // Validate eMail
  //
  const validateEmailHandler = () => {
    if (
      enteredEmail &&
      enteredEmail.trim().includes('@') &&
      enteredEmail.trim().length > 5
    ) {
      setEmailIsValid(true);
    } else {
      setEmailIsValid(false);
    }
    setEmailBlur(true);
    if (debug) {
      console.log(
        'entered value ' + enteredEmail + ' ' + emailIsValid + ' ' + emailBlur
      );
    }

    if (emailIsValid && passwordIsValid) {
      setFormIsValid(true);
    }
  };

  //
  // Validate password
  //
  const validatePasswordHandler = () => {
    if (enteredPassword && enteredPassword.trim().length > 7) {
      setPasswordIsValid(true);
    } else {
      setPasswordIsValid(false);
    }
    setPasswordBlur(true);
    if (emailIsValid && passwordIsValid) {
      setFormIsValid(true);
    }
  };

  //===================================================
  //   L O G I N   U S E R
  //===================================================
  const loginUser = (
    token: string,
    expirationTime: string,
    displayName: string,
    userData: UserData,
    authToken: string,
  ) => {
    authContext.isLoggedIn = true;
    authContext.token = token;
    authContext.userData = userData;
    authContext.authToken = authToken;
    LoginUser(token, expirationTime, displayName, userData, authToken);
    return;
  };

  if (isLoading) {
    return <Loading />;
  }

  //===================================================
  //   P R O C E S S    F O R M
  //===================================================
  const submitHandler = async (event: any) => {
    event.preventDefault();

    // optional: Add validation
    if (emailIsValid && passwordIsValid) {
      setFormIsValid(true);
    }
    if (!formIsValid) {
      return;
    }

    setIsLoading(true);
    let url;
    let requestType: string = '';
    if (isLogin) {
      requestType = 'LOGIN';
      url = '/api/login';
    } else {
      requestType = 'SIGNUP';
      url = '/api/signup';
    }
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          requestType: requestType,
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
          displayName: enteredName,
          requestMethod: 'POST',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setIsLoading(false);
      if (debug) {
        console.log('DATA ===> ');
        console.log(data);
      }
      if (data.statusCode !== 200 && data.statusCode !== 201) {
        // set this to false so that the error modal is what is
        // displayed for all error...do not want the email verification
        // modal to also popup
        setUserRegistered(false);
        if (data.message === 'E-EMAIL-NOT-VERIFIED') {
          // Set idToken variable so that it can be passed to the modal
          // Required to resend confirmation message
          setToken(data.userData.idToken);
          // set this so that the user get the same modal that asks them to
          // verify their email
          // setUserRegistered(true);
          setErrorMessage(data.message);
        }
        throw new Error(data.message);
      }
      if (isLogin) {
        let idToken = data.userData.idToken;
        if (debug) {
          console.log('IDTOKEN ==>>> ' + idToken);
        }

        setIsLoading(false);
        //
        // Save token to local storage
        //
        const expirationTime = new Date(
          new Date().getTime() + +data.userData.expiresIn * 1000
        );
        //authContext.login();
        if (debug) {
          console.log(data);
          console.log(new Date());
          console.log('idToken ' + data.userData.idToken);
          console.log('expirationTime' + expirationTime.toISOString());
          console.log('AUTHCONTEXT');
          console.log(authContext);
        }
        loginUser(
          data.userData.idToken,
          expirationTime.toISOString(),
          data.userData.displayName,
          data.userData,
          data.authToken,
        );
        let redirectPath = home;
        if (authContext.redirectUrl) {
          redirectPath = authContext.redirectUrl + "/?auth_token=" + authContext.authToken;
        } else {
          if (authContext.asPath) {
            redirectPath = authContext.asPath;
          }
        }
        router.replace(redirectPath);
      } else {
        setUserRegistered(true);
        setIsLogin(false);
        if (debug) {
          console.log(data);
          console.log(error);
          console.log(userRegistered);
          console.log(isLogin);
        }
        setEmailBlur(false);
        setPasswordBlur(false);
        router.push(auth);
      }
    } catch (error) {
      setIsLoading(false);
      console.log('ERROR ===>>>> ' + error);
      setError(true);
      return;
    }
  };

  const closeErrorHandler = () => {
    if (debug) {
      console.log('CLOSE ERROR HANDLER');
      console.log(router);
    }
    let redirectPath: string = '';
    if (authContext.asPath) {
      redirectPath = authContext.asPath;
    }
    if (userRegistered) {
      setEnteredName('');
      setEnteredEmail('');
      setEnteredPassword('');
      router.push(auth + '?singIn=false');
    }
    setUserRegistered(false);
    if (error && isLogin) {
      redirectPath = auth + '?singIn=true';
    }
    setError(false);
    setForgotPassword(false);
    setErrorMessage('');
    if (redirectPath && isLogin) {
      router.push(redirectPath);
    }
  };


  //===================================================
  //   R E S E N D   E M A I L   C O N F I R M A T I O N
  //===================================================
  const sendEmailHandler = async (event: any) => {
    event.preventDefault();
    if (debug) {
      console.log('SEND EMAIL HANDLER');
      console.log(token);
    }

    setIsLoading(true);
    let url = '/api/resendEmail';
    let requestType = 'VERIFY_EMAIL';
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          requestType: requestType,
          idToken: token,
          requestMethod: 'POST',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setIsLoading(false);
      if (debug) {
        console.log('DATA ===> ');
        console.log(data);
      }
      if (data.statusCode !== 200 && data.statusCode !== 201) {
        throw new Error(data.message);
      }
      if (debug) {
        console.log('CLOSE MODAL');
      }
      closeErrorHandler();
    } catch (error) {
      {
        closeErrorHandler();
      }
    }
    {
      closeErrorHandler();
    }
  };

  const inputClass =
    'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';
  const errorClass =
    'appearance-none block w-full px-3 py-2 border border-red-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
          alt="Workflow"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin
            ? fmt({id: 'singIn2Account'})
            : fmt({id: 'createNewAccount'})}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={submitHandler}
          >
            {!isLogin && (
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700"
                >
                  {fmt({id: 'displayName'})}
                </label>
                <div className="mt-1">
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    autoComplete="displayName"
                    required
                    onChange={nameChangeHandler}
                    onBlur={validateNameHandler}
                    value={enteredName}
                    className={`${
                      nameIsValid === false && nameBlur === true
                        ? errorClass
                        : inputClass
                    }`}
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {fmt({id: 'emailAddress'})}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={emailChangeHandler}
                  onBlur={validateEmailHandler}
                  value={enteredEmail}
                  className={`${
                    emailIsValid === false && emailBlur === true
                      ? errorClass
                      : inputClass
                  }`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                {fmt({id: 'Password'})}
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  onChange={passwordChangeHandler}
                  onBlur={validatePasswordHandler}
                  value={enteredPassword}
                  className={`${
                    passwordIsValid === false && passwordBlur === true
                      ? errorClass
                      : inputClass
                  }`}
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember_me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {fmt({id: 'rememberMe'})}
                  </label>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-indigo-600 hover:text-indigo-500">
                    <Link
                      href={{
                        pathname: forgotpassword,
                        query: {
                          enteredEmail: enteredEmail,
                        },
                      }}
                      as={forgotpassword}
                    >
                      {fmt({id: 'forgotPassword'})}
                    </Link>
                  </div>
                </div>
              </div>
            )}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {!isLogin ? fmt({id: 'createNewAccount'}) : fmt({id: 'signIn'})}
              </button>
            </div>
          </form>

          {error && !isLogin && !userRegistered && (
            <ErrorModal
              title={fmt({id: 'signupError'})}
              buttonText={fmt({id: 'gobackToSignup'})}
              message={fmt({id: 'E-SIGNUP-FAILED'})}
              closeModal={closeErrorHandler}
            />
          )}
          {error &&
            isLogin &&
            !userRegistered &&
            errorMessage === 'E-EMAIL-NOT-VERIFIED' && (
              <ErrorModal
                title={fmt({id: 'signupError'})}
                buttonText={fmt({id: 'gobackToSignin'})}
                message={
                  fmt({id: 'userRegistered1'}) +
                  enteredEmail +
                  fmt({id: 'userRegistered2'})
                }
                closeModal={closeErrorHandler}
                cancelButton={true}
                buttonText2={fmt({id: 'resendEmailVerification'})}
                closeModal2={sendEmailHandler}
              />
            )}
          {error &&
            isLogin &&
            !userRegistered &&
            errorMessage !== 'E-EMAIL-NOT-VERIFIED' && (
              <ErrorModal
                title={fmt({id: 'signupError'})}
                buttonText={fmt({id: 'gobackToSignin'})}
                message={fmt({id: 'E-LOGIN-FAILED'})}
                closeModal={closeErrorHandler}
                cancelButton={false}
              />
            )}

          {userRegistered && (
            <AppModal
              title={fmt({id: 'accountCreated'})}
              buttonText={fmt({id: 'gobackToSignup'})}
              message={
                fmt({id: 'userRegistered1'}) +
                enteredEmail +
                fmt({id: 'userRegistered2'})
              }
              closeModal={closeErrorHandler}
              cancelButton={false}
            />
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Facebook</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Twitter</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with GitHub</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
