import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Future Email. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
        
        <div className="border-t pt-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-sm text-muted-foreground">Created with ❤️ by Sanskar Dubey</p>
            <div className="flex gap-4">
              <a href="https://github.com/johnsmith" target="_blank" rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/johnsmith" target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/in/johnsmith" target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:john@example.com"
                className="text-muted-foreground hover:text-primary">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}