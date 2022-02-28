import {useRouter} from 'next/router';
import ResetPasswordForm from '../../../../component/Auth/ResetPassword';

const debug: boolean = false;
const ResetPasswordPage = () => {
  const router = useRouter();
  let oobCode: string | any;
  let lang: string | any;

  lang = router.query.lang;
  oobCode = router.query.oobCode;
  if (debug) {
    console.log('Reset Password Page');
    console.log('===================');
    console.log('oobCode: ' + oobCode);
    console.log('lang: ' + lang);
  }

  return <ResetPasswordForm />;
};

export default ResetPasswordPage;
