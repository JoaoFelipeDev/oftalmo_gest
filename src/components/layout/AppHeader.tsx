// src/components/layout/AppHeader.tsx

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, LifeBuoy, LogOut, Settings } from 'lucide-react';
import { ThemeToggle } from '../shared/ThemeToggle';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between max-w-full px-6">
        {/* Placeholder para o nome da clínica ou breadcrumbs */}
        <div>
          <h2 className="text-lg font-semibold text-foreground">Clinica Teste</h2>
        </div>
        
        <div className="flex items-center space-x-4">
           <ThemeToggle />
          <button className="p-2 rounded-full hover:bg-muted">
            <Bell size={20} className="text-muted-foreground" />
          </button>
          
          {/* Menu Dropdown do Usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  {/* Adicione a imagem do avatar se tiver, senão ele mostra o fallback */}
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>GM</AvatarFallback>
                </Avatar>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium">Admin Master</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span>Suporte</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}