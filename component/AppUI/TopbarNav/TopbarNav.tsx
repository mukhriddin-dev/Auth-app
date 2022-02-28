import {Fragment, useState} from 'react';
import {useIntl} from 'react-intl';
import { Menu, Transition} from '@headlessui/react';
import TopbarSearchForm from './TopbarSearch';
import {BellIcon, UserIcon} from '@heroicons/react/outline';

const userNavigation = [
  {name: 'yourProfile', href: '#'},
  {name: 'settings', href: '#'},
  {name: 'switchAccount', href: '#'},
  {name: 'signOut', href: '/logout'},
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

export default function TopbarNavForm(props: any) {
  const {formatMessage: fmt} = useIntl();

  return (
    <Fragment>
      <TopbarSearchForm searchOn={props.searchOn} />

      <div className="ml-4 flex items-center md:ml-6">
        <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <span className="sr-only">{fmt({id: 'viewNotifications'})}</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Profile dropdown */}
        <Menu as="div" className="ml-3 relative">
          {({open}) => (
            <>
              <div>
                <Menu.Button className="max-w-xs flex items-center text-gray-400 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span className="sr-only">Open user menu</span>
                  <UserIcon className="h-8 w-8 rounded-full" aria-hidden="true"/>
                </Menu.Button>
              </div>
              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  static
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none"
                >
                  {userNavigation.map((item) => (
                    <Menu.Item key={item.name}>
                      {({active}) => (
                        <a
                          href={item.href}
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block py-2 px-4 text-sm text-gray-700'
                          )}
                        >
                          {fmt({id: `${item.name}`})}
                        </a>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </div>
    </Fragment>
  );
}
