'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { logout } from '../actions';

// Componentes de ícones
function DashboardIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function ClientsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function AnimalsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ProductsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m0 0v10l8 4m0-14L4 7"></path>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

const menuItems = [
  { name: 'Painel', href: '/admin', icon: DashboardIcon },
  { name: 'Clientes', href: '/admin/clientes', icon: ClientsIcon },
  { name: 'Animais', href: '/admin/animais', icon: AnimalsIcon },
  { name: 'Agenda', href: '/admin/agenda', icon: CalendarIcon },
  { name: 'Agendamentos', href: '/admin/tosas', icon: ListIcon },
  { name: 'Produtos', href: '/admin/produtos', icon: ProductsIcon }
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
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name} className="mb-2">
                    <Link href={item.href}>
                      <span
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                          pathname === item.href
                            ? 'bg-gray-700'
                            : 'hover:bg-gray-800'
                        }`}
                      >
                        <Icon />
                        {item.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
              <li className="mt-8">
                <form action={logout}>
                  <button
                    type="submit"
                    className="w-full text-left flex items-center gap-3 p-2 rounded-md hover:bg-gray-800 transition-colors hover:cursor-pointer"
                  >
                    <LogoutIcon />
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
