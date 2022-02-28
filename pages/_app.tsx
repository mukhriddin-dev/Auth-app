import 'tailwindcss/tailwind.css';
// import type { AppProps } from "next/app";
import Layout from '../component/Navigation/Layout';
import {useRouter} from 'next/router';
import {IntlProvider} from 'react-intl';

import de from '../translations/de/de.json';
import en from '../translations/en/en.json';
import es from '../translations/es/es.json';
import fr from '../translations/fr/fr.json';
import it from '../translations/it/it.json';
import pt from '../translations/pt/pt.json';

const debug: boolean = false;

function MyApp({Component, pageProps}) {
  const router = useRouter();
  const loc: string | any = router.locale;

  let translationContent = {};
  switch (loc) {
    case 'de':
      translationContent = de;
      break;

    case 'es':
      translationContent = es;
      break;

    case 'fr':
      translationContent = fr;
      break;

    case 'it':
      translationContent = it;
      break;

    case 'pt':
      translationContent = pt;
      break;

    default:
      translationContent = en;
      break;
  }

  return (


    <IntlProvider locale={loc} messages={translationContent}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </IntlProvider>
  );
  // <Component {...pageProps} />
}

export default MyApp;
