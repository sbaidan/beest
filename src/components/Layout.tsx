import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Navbar from './Navbar';
import MobileMenu from './MobileMenu';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <main className="pt-16 p-4 md:pt-24 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}