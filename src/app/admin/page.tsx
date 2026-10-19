import { redirect } from 'next/navigation';

export const metadata = {
  title: "charifund | Admin"
};

export default function AdminPage() {
  redirect('/admin/dashboard');
}