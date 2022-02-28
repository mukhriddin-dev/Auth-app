import VerifyEmailForm from '../../../../component/Auth/VerifyEmailForm';
import {useRouter} from 'next/router';

const debug: boolean = false;
const VerifyEmailPage = () => {
  const router = useRouter();
  let oobCode: string | any;
  let lang: string | any;

  lang = router.query.lang;
  oobCode = router.query.oobCode;
  if (debug) {
    console.log('Verify email Page');
    console.log('=================');
    console.log('oobCode: ' + oobCode);
    console.log('lang: ' + lang);
  }

  return <VerifyEmailForm oobCode={oobCode} lang={lang} />;
};

export default VerifyEmailPage;
