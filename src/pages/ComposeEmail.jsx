import { Header } from '../components/layout/header';
import { Footer } from '../components/layout/footer';
import { ComposeEmail as EmailForm } from '../components/email/compose-email';

export default function ComposeEmail() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-2xl font-bold mb-8">Compose Future Email</h1>
        <div className="max-w-2xl mx-auto">
          <EmailForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}