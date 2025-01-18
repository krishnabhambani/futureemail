import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend('re_6WU1hvkt_KFP3uivxtRSKvxPVn7BXY6Z2');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.cron('check-and-send-emails', '*/5 * * * *', async () => {
  try {
    const now = new Date();
    
    // Fetch undelivered emails that are due
    const { data: emails, error } = await supabase
      .from('scheduled_emails')
      .select('*')
      .eq('delivered', false)
      .lte('scheduled_for', now.toISOString());

    if (error) throw error;

    for (const email of emails || []) {
      try {
        // Send email using Resend
        await resend.emails.send({
          from: 'Laya Hun Khat <notifications@layahunkhat.app>',
          to: email.to_email,
          subject: email.subject,
          text: email.content, // For plain text
          html: `<!DOCTYPE html>
<html>
<body>
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="color: #333; margin: 0;">Laya Hun Khat</h1>
      <p style="color: #666; margin: 5px 0;">Your Future Message Has Arrived</p>
    </div>
    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
      ${email.content}
    </div>
    <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
      Sent from Laya Hun Khat - Messages to Your Future Self
    </div>
  </div>
</body>
</html>`, 
          attachments: email.attachments?.map((att: any) => ({
            filename: att.name,
            path: att.url
          })) || []
        });

        // Mark as delivered
        await supabase
          .from('scheduled_emails')
          .update({ delivered: true })
          .eq('id', email.id);

      } catch (sendError) {
        console.error(`Failed to send email ${email.id}:`, sendError);
      }
    }
  } catch (error) {
    console.error('Cron job error:', error);
  }
});