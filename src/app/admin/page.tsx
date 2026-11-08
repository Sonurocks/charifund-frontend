import { redirect } from 'next/navigation';

export const metadata = {
  title: "GiveSphere | Admin"
};

export default function AdminPage() {
  redirect('/admin/dashboard');
}