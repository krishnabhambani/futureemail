import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Header } from '../components/layout/header';
import { Footer } from '../components/layout/footer';
import { Button } from '../components/ui/button';
import { Plus, Mail, Calendar, Trash2 } from 'lucide-react';
import { useAuth } from '../lib/auth-provider';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchEmails = async () => {
      const { data, error } = await supabase
        .from('scheduled_emails')
        .select('*')
        .order('scheduled_for', { ascending: true });
        
      if (!error) {
        setEmails(data);
      }
      setLoading(false);
    };

    fetchEmails();
  }, [user]);

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('scheduled_emails')
      .delete()
      .match({ id });

    if (!error) {
      setEmails(emails.filter(email => email.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Your Future Mails</h1>
          <Button onClick={() => navigate('/compose')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Email
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : emails.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">No scheduled emails yet</h2>
            <p className="text-muted-foreground">
              Start by creating your first future email
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {emails.map((email) => (
              <div key={email.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold">{email.subject}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(email.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      To: {email.to_email}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {email.content}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(email.scheduled_for).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}