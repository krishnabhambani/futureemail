import { Link } from 'react-router-dom';
import { Calendar, Clock, Mail } from 'lucide-react';
import { Header } from '../components/layout/header';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="container space-y-6 py-24 sm:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-4xl font-bold sm:text-6xl">
              Send Messages to Your Future Self
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
              Schedule emails to be delivered at any future date. Perfect for goals, reminders, and personal time capsules.
            </p>
            <div className="flex gap-4">
              <Link 
                to="/register"
                className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
              >
                Start Writing
              </Link>
              <Link 
                to="/how-it-works"
                className="px-6 py-3 border hover:bg-secondary rounded-md"
              >
                How it Works
              </Link>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-24 lg:py-32">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group relative rounded-lg border p-6 hover:shadow-lg transition-all">
              <Mail className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Write Your Message</h3>
              <p className="text-muted-foreground">
                Compose your email with our rich text editor. Add images, formatting, and make it personal.
              </p>
            </div>
            <div className="group relative rounded-lg border p-6 hover:shadow-lg transition-all">
              <Calendar className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Pick Your Date</h3>
              <p className="text-muted-foreground">
                Choose when you want to receive your message. It could be next week or next year.
              </p>
            </div>
            <div className="group relative rounded-lg border p-6 hover:shadow-lg transition-all">
              <Clock className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">We'll Deliver It</h3>
              <p className="text-muted-foreground">
                Sit back and relax. We'll make sure your message arrives exactly when you want it.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            © 2024 Laya Hun Khat. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}