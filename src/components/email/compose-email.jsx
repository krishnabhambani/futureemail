import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Calendar, Paperclip, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../lib/auth-provider';

export function ComposeEmail() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [formData, setFormData] = useState({
    to_email: '',
    subject: '',
    content: '',
    scheduled_for: ''
  });

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 10 * 1024 * 1024) {
      toast.error('Total attachment size cannot exceed 10MB');
      return;
    }

    setLoading(true);
    const newAttachments = [];

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('email-attachments')
          .upload(filePath, file);

        if (uploadError) {
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('email-attachments')
          .getPublicUrl(filePath);

        newAttachments.push({
          name: file.name,
          path: filePath,
          url: publicUrl,
          size: file.size,
          type: file.type
        });
      }

      setAttachments(prev => [...prev, ...newAttachments]);
      toast.success('Files uploaded successfully');
    } catch (error) {
      toast.error('Error uploading files');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeAttachment = async (index) => {
    try {
      const attachment = attachments[index];
      const { error } = await supabase.storage
        .from('email-attachments')
        .remove([attachment.path]);

      if (error) throw error;

      setAttachments(prev => prev.filter((_, i) => i !== index));
      toast.success('Attachment removed');
    } catch (error) {
      toast.error('Error removing attachment');
      console.error('Remove error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        throw new Error('Please sign in to schedule emails');
      }

      const scheduledDate = new Date(formData.scheduled_for);
      if (scheduledDate < new Date()) {
        throw new Error('Scheduled date must be in the future');
      }

      const { error } = await supabase
        .from('scheduled_emails')
        .insert({
          user_id: user.id,
          to_email: formData.to_email,
          subject: formData.subject,
          content: formData.content,
          scheduled_for: scheduledDate.toISOString(),
          attachments: attachments,
          delivered: false
        });

      if (error) throw error;

      toast.success('Email scheduled successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Scheduling error:', error);
      toast.error(error.message || 'Failed to schedule email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">To</label>
        <Input
          type="email"
          required
          value={formData.to_email}
          onChange={(e) => setFormData({ ...formData, to_email: e.target.value })}
          placeholder="recipient@example.com"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Subject</label>
        <Input
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="Email subject"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Message</label>
        <textarea
          required
          className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Write your message here..."
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Attachments</label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('file-upload').click()}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Paperclip className="h-4 w-4" />
              Add Files
            </Button>
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,.pdf,.doc,.docx,.txt"
              disabled={loading}
            />
          </div>
          {attachments.length > 0 && (
            <div className="space-y-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm truncate">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                    disabled={loading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Delivery Date</label>
        <div className="flex gap-2 items-center">
          <Calendar className="h-5 w-5" />
          <input
            type="datetime-local"
            required
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
            value={formData.scheduled_for}
            onChange={(e) => setFormData({ ...formData, scheduled_for: e.target.value })}
            min={new Date().toISOString().slice(0, 16)}
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Scheduling...' : 'Schedule Email'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/dashboard')}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}