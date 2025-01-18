import { Header } from '../components/layout/header';
import { Mail, Calendar, Bell, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-16">
        <h1 className="text-4xl font-bold text-center mb-12">How Future Email Works</h1>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">1. Write Your Message</h2>
            <p className="text-muted-foreground">
              Compose your future email using our rich text editor. Add personal touches, 
              images, and format your message exactly how you want it to be received.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">2. Set Your Delivery Date</h2>
            <p className="text-muted-foreground">
              Choose when you want your message to be delivered. It could be tomorrow, 
              next month, or even years into the future.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">3. Automatic Delivery</h2>
            <p className="text-muted-foreground">
              Our system securely stores your message and automatically delivers it 
              at the exact date and time you specified.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">4. Guaranteed Delivery</h2>
            <p className="text-muted-foreground">
              Rest assured that your message will be delivered on time. Track the 
              status of your scheduled emails right from your dashboard.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}