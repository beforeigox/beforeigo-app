const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;

export async function sendGiftEmail(recipientEmail: string, gifterName: string, plan: string, message?: string) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Before I Go <noreply@beforeigo.app>',
        to: recipientEmail,
        subject: `${gifterName} Sent You a Legacy Story`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #8f1133;">You've Received a Gift! 🎁</h1>
            <p style="font-size: 16px; color: #333;">
              ${gifterName} has gifted you a Before I Go ${plan} plan to help you preserve your life story.
            </p>
            ${message ? `
              <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p style="font-style: italic; color: #666;">"${message}"</p>
                <p style="text-align: right; color: #999;">- ${gifterName}</p>
              </div>
            ` : ''}
            <p style="font-size: 16px; color: #333;">
              Click the button below to create your account and start preserving your precious memories.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://app.beforeigo.app/signup?plan=${plan.toLowerCase()}&gift=true" 
                 style="background: linear-gradient(to right, #8f1133, #d946a6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">
                Start My Story →
              </a>
            </div>
            <p style="font-size: 14px; color: #666;">
              If you have any questions, reply to this email or visit our help center.
            </p>
          </div>
        `
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return await response.json();
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
}