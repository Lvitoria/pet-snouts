'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { logout } from '../actions';

const menuItems = [
  { name: 'Painel', href: '/admin' },
  { name: 'Usuários', href: '/admin/users' },
  // Adicione mais itens de menu aqui
];

function HamburgerIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}


export default function NavMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Header and Hamburger Button */}
      <div className="md:hidden flex justify-between items-center p-4 bg-gray-900 text-white">
        <h2 className="text-2xl font-bold">Fucinhos</h2>
        <button onClick={toggleMenu}>
          {isOpen ? <CloseIcon /> : <HamburgerIcon />}
        </button>
      </div>

      {/* Navigation Menu */}
      <aside
        className={`transform top-0 left-0 w-64 bg-gray-900 text-white fixed bottom-0 overflow-auto ease-in-out transition-all duration-300 z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <div className="p-4">
            <div className="mb-8 hidden md:block">
                <h2 className="text-2xl font-bold">Fucinhos</h2>
            </div>
            <nav>
            <ul>
              {menuItems.map((item) => (
                <li key={item.name} className="mb-2">
                  <Link href={item.href}>
                    <span
                      onClick={() => setIsOpen(false)}
                      className={`block p-2 rounded-md transition-colors ${
                        pathname === item.href
                          ? 'bg-gray-700'
                          : 'hover:bg-gray-800'
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
              <li className="mt-8">
                <form action={logout}>
                  <button
                    type="submit"
                    className="w-full text-left block p-2 rounded-md hover:bg-gray-800 transition-colors hover:cursor-pointer"
                  >
                    Sair
                  </button>
                </form>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
