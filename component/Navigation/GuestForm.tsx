import Link from 'next/link';
import {useRouter} from 'next/router';
import {useIntl} from 'react-intl';
import {useContext, useEffect, useState} from 'react';

const navigation = [
  {name: 'Solutions', href: '#'},
  {name: 'Pricing', href: '#'},
  {name: 'Docs', href: '#'},
  {name: 'Company', href: '#'},
];

const GuestForm = (props: any) => {
  const {formatMessage: fmt} = useIntl();
  const router = useRouter();
  const {locale, locales} = router;
  const home = '/' + locale;
  const auth = home + '/auth';

  return (
    <header className="bg-indigo-600">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
          <div className="flex items-center">
            <a href="#">
              <span className="sr-only">Workflow</span>
              <img
                className="h-10 w-auto"
                src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white"
                alt=""
              />
            </a>
            <div className="hidden ml-10 space-x-8 lg:block">
              {navigation.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-base font-medium text-white hover:text-indigo-50"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          {!props.isLoggedIn && (
            <div className="ml-10 space-x-4">
              <div className={props.signInClass}>
                <Link href={{pathname: auth, query: {signIn: true}}} as={auth}>
                  {fmt({id: 'signIn'})}
                </Link>
              </div>
              <div className={props.signUpClass}>
                <Link href={{pathname: auth, query: {signIn: false}}} as={auth}>
                  {fmt({id: 'signUp'})}
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
          {navigation.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-base font-medium text-white hover:text-indigo-50"
            >
              {link.name}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default GuestForm;