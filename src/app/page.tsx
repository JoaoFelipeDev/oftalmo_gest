// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redireciona o usuário para a página de dashboard por padrão
  redirect('/dashboard');
} 