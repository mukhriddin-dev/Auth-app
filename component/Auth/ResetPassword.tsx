import {useRouter} from 'next/router';
import {useState, useRef, useContext, useEffect} from 'react';
import {useIntl} from 'react-intl';
import AuthContext from '../../store/auth-context';
import AppModal from '../UI/AppModal';
import Loading from '../UI/Loading';
import ErrorModal from '../UI/ErrorModal';

const debug: boolean = false;

export default function ResetPasswordForm() {
  const router = useRouter();
  let loc = router.query.lang;
  if (!loc) {
    loc = router.locale;
  }
  const home = '/' + loc;
  const auth = home + '/auth';

  let oobCode = router.query.oobCode;
  if (debug) {
    console.log('Reset Password Form 2');
    console.log('=====================');
    console.log('oobCodeVar: ' + oobCode);
    console.log('lang: ' + loc);
  }

  const authContext = useContext(AuthContext);

  // const [passwordReset, setPasswordReset] = useState<boolean>(false);
  const [passwordResetDone, setPasswordResetDone] = useState<boolean>(false);
  const [passwordResetError, setPasswordResetError] = useState<boolean>(false);

  useEffect(() => {
    let oobCode: string | any;
    oobCode = router.query.oobCode;
    if (oobCode) {
      if (authContext.oobCode === '') {
        authContext.oobCode = oobCode;
      }
    }
    if (debug) {
      console.log('Reset Password Form');
      console.log('===================');
      console.log('oobCodeVar: ' + oobCode);
      console.log(authContext);
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
      console.log(router);
      console.log(authContext);
    }
  }, [router.query]);

  if (authContext.isLoggedIn) {
    router.push(home);
  }

  const {formatMessage: fmt} = useIntl();

  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false);
  const [passwordBlur, setPasswordBlur] = useState<boolean>(false);

  const [enteredPassword2, setEnteredPassword2] = useState('');
  const [passwordIsValid2, setPasswordIsValid2] = useState<boolean>(false);
  const [passwordBlur2, setPasswordBlur2] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);
  // const [error, setError] = useState<boolean>(false);

  //===================================================
  //   V A L I D A T I O N
  //===================================================

  //
  // Validate Password
  //
  const passwordChangeHandler = (event: any) => {
    // setError(false);
    if (event.target.value.trim().length > 7) {
      setPasswordIsValid(true);
    }
    setEnteredPassword(event.target.value);
  };

  //
  // Validate Confirm Password
  //
  const passwordChangeHandler2 = (event: any) => {
    // setError(false);
    if (event.target.value.trim().length > 7) {
      setPasswordIsValid2(true);
    }
    setEnteredPassword2(event.target.value);
  };

  //===================================================
  //   O N   B L U R (cursor out of focus)
  //===================================================

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
  };

  //
  // Validate confirm password
  //
  const validatePasswordHandler2 = () => {
    if (enteredPassword2 && enteredPassword2.trim().length > 7) {
      setPasswordIsValid2(true);
    } else {
      setPasswordIsValid2(false);
    }
    setPasswordBlur2(true);
  };

  const closeErrorHandler = () => {
    // setPasswordReset(false);
    setPasswordResetDone(false);
    setPasswordResetError(false);
    router.push({pathname: auth, query: {singIn: true}});
  };

  const closeModalHandler = () => {
    setPasswordResetDone(false);
    setPasswordResetError(false);
    setPasswordsMatch(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  //===================================================
  //   R E S E T   P A S S W O R D
  //===================================================
  const processResetPasswordHandler = async (event: any) => {
    event.preventDefault();

    if (enteredPassword !== enteredPassword2) {
      setPasswordsMatch(false);
      return;
    }
    setPasswordsMatch(true);

    setIsLoading(true);
    setPasswordResetDone(false);
    setPasswordResetError(false);
    // setPasswordReset(true);
    // setError(false);
    let url = '/api/resetPassword';
    try {
      console.log('entered password ' + enteredPassword);
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          password: enteredPassword,
          oobCode: authContext.oobCode,
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
      if (!data) {
        throw new Error('E-RESET-PASSWORD');
      } else {
        if (data.statusCode !== 200) {
          throw new Error('E-RESET-PASSWORD');
        }
      }
      setPasswordResetDone(true);
    } catch (error) {
      console.log(error);
      // setError(true);
      setPasswordResetError(true);
    }
  };

  const inputClass =
    'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';
  const errorClass =
    'appearance-none block w-full px-3 py-2 border border-red-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';

  return (
    <div className="min-h-10  bg-gray-50 flex flex-col justify-center py-12  sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
          alt="Workflow"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {fmt({id: 'resetPasswordTitle'})}
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={processResetPasswordHandler}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                {fmt({id: 'newPassword'})}
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

            <div>
              <label
                htmlFor="password2"
                className="block text-sm font-medium text-gray-700"
              >
                {fmt({id: 'confirmPassword'})}
              </label>
              <div className="mt-1">
                <input
                  id="password2"
                  name="password2"
                  type="password"
                  autoComplete="current-password2"
                  required
                  onChange={passwordChangeHandler2}
                  onBlur={validatePasswordHandler2}
                  value={enteredPassword2}
                  className={`${
                    passwordIsValid2 === false && passwordBlur2 === true
                      ? errorClass
                      : inputClass
                  }`}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {fmt({id: 'saveNewPassword'})}
              </button>
            </div>
          </form>
          {passwordsMatch === false &&
            passwordIsValid === true &&
            passwordIsValid2 === true && (
              <ErrorModal
                title={fmt({id: 'passwordMatchErrorTitle'})}
                buttonText={fmt({id: 'reenterPassword'})}
                message={fmt({id: 'passwordMatchErrorMessage'})}
                closeModal={closeModalHandler}
              />
            )}
          {passwordResetError === true && (
            <ErrorModal
              title={fmt({id: 'resetPasswordErrorTitle'})}
              buttonText={fmt({id: 'reenterPassword'})}
              message={fmt({id: 'resetPasswordErrorMessage'})}
              closeModal={closeModalHandler}
            />
          )}

          {passwordResetDone === true && (
            <AppModal
              title={fmt({id: 'passwordChanged'})}
              buttonText={fmt({id: 'gobackToSignin'})}
              message={fmt({id: 'passwordChangedMessage'})}
              closeModal={closeErrorHandler}
            />
          )}
        </div>
      </div>
    </div>
  );
}
