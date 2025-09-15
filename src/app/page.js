// app/page.jsx - Redirect to login page
import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to HR login page by default
  redirect('/hr/login');
}