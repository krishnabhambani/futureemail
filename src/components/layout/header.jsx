import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export function Header({ showNav = true }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Mail className="h-6 w-6" />
          <span className="text-xl font-bold">Future Email</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {showNav && (
            <nav className="flex gap-4">
              <Button variant="ghost" onClick={handleSignOut}>
                Sign Out
              </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}