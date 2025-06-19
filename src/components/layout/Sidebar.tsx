// src/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  User,
  Wallet,
  Package,
  FileText,
  FlaskConical
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Componente para cada item da navegação
const NavItem = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center h-20 w-full transition-colors border-l-4", // Adicionamos a base da borda aqui
        isActive
          ? "bg-gray-800 text-white border-primary" // Estilo ATIVO: fundo cinza, texto branco e borda roxa
          : "text-gray-400 hover:bg-gray-700 hover:text-white border-transparent" // Estilo INATIVO: borda transparente
      )}
      title={label}
    >
      <Icon className="h-6 w-6" />
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

export function Sidebar() {
  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/agenda", icon: Calendar, label: "Agenda" },
    { href: "/pacientes", icon: User, label: "Pacientes" },
    { href: "/financeiro", icon: Wallet, label: "Financeiro" },
    { href: "/estoque", icon: Package, label: "Estoque" },
    { href: "/laudos", icon: FileText, label: "Laudos" },
    { href: "/exames", icon: FlaskConical, label: "Exames" },
  ];

  return (
    <aside className="w-24 flex-col items-center bg-[#09090B] text-white border-r border-gray-800 hidden md:flex z-50">
      <div className="py-4 font-bold text-lg text-white">
        {/* Aqui pode ir a versão "ícone" do seu logo */}
        OG
      </div>
      <nav className="flex flex-col items-center w-full">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>
      {/* Espaço no final, pode ter um ícone de settings ou logout no futuro */}
      <div className="mt-auto p-4">
        {/* Avatar do usuário logado (pode ser movido para o header depois) */}
      </div>
    </aside>
  );
}