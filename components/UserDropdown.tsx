import { Menu, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import md5 from 'md5';

interface UserDropdownProps {
  user: {
    email: string;
    uid: string;
  };
}

interface UserData {
  username: string;
  firstName: string;
  lastName: string;
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData({
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
        });
      }
    };
    fetchUserData();
  }, [user.uid]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const gravatarUrl = `https://www.gravatar.com/avatar/${md5(user.email.toLowerCase().trim())}?d=mp`;

  return (
    <Menu as="div" className="relative inline-block text-left z-50">
      <Menu.Button className="flex items-center space-x-2">
        <img
          src={gravatarUrl}
          alt="User avatar"
          className="w-8 h-8 rounded-full border-2 border-white/10"
        />
        <span className="text-white">{userData?.username}</span>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-gray-900 border border-gray-700 shadow-lg z-50">
          <div className="px-4 py-3 border-b border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <img
                src={gravatarUrl}
                alt="User avatar"
                className="w-10 h-10 rounded-full border-2 border-gray-700"
              />
              <span className="text-sm font-medium text-gray-200">{userData?.username}</span>
            </div>
            <p className="text-sm text-gray-400">
              {userData?.firstName} {userData?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate mt-1">{user.email}</p>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleSignOut}
                  className={`${
                    active ? 'bg-gray-800' : ''
                  } text-red-400 w-full text-left px-4 py-2 text-sm`}
                >
                  Sign Out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}