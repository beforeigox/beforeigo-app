import type { VercelRequest, VercelResponse } from '@vercel/node';

const emailTemplates = {
  gift: (data: any) => ({
    subject: `${data.gifterName} Sent You a Legacy Story`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8f1133;">You've Received a Gift! 🎁</h1>
        <p style="font-size: 16px; color: #333;">
          ${data.gifterName} has gifted you a Before I Go ${data.plan} plan.
        </p>
        ${data.message ? `
          <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p style="font-style: italic; color: #666;">"${data.message}"</p>
            <p style="text-align: right; color: #999;">- ${data.gifterName}</p>
          </div>
        ` : ''}
        <p style="font-size: 16px; color: #333;">
          Click below to create your account and start preserving your precious memories.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://app.beforeigo.app/signup?plan=${data.plan.toLowerCase()}&gift=true" 
             style="background: linear-gradient(to right, #8f1133, #d946a6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">
            Start My Story →
          </a>
        </div>
      </div>
    `
  }),

  newsletterWelcome: (data: any) => ({
    subject: 'Welcome to Before I Go - Here\'s Your 10% Discount! 🎁',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8f1133;">Welcome to the Before I Go Family! ✨</h1>
        <p style="font-size: 16px; color: #333;">
          Hi ${data.name || 'there'},
        </p>
        <p style="font-size: 16px; color: #333;">
          Thank you for joining our newsletter! We're excited to help you preserve your family's most precious memories.
        </p>
        <div style="background: linear-gradient(to right, #8f1133, #d946a6); padding: 20px; border-radius: 10px; margin: 30px 0; text-align: center;">
          <p style="color: white; font-size: 18px; margin: 0 0 10px 0;">Your Exclusive Discount Code:</p>
          <p style="color: white; font-size: 32px; font-weight: bold; margin: 0; letter-spacing: 2px;">WELCOME10</p>
          <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 10px 0 0 0;">Save 10% on your first story</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://beforeigo.app/checkout" 
             style="background: #8f1133; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">
            Start Your Story →
          </a>
        </div>
        <p style="font-size: 14px; color: #666;">
          You'll receive weekly tips, inspiration, and stories from other families preserving their legacies.
        </p>
      </div>
    `
  }),

  purchaseConfirmation: (data: any) => ({
    subject: 'Your Before I Go Story Awaits! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8f1133;">Thank You for Your Purchase! 🎉</h1>
        <p style="font-size: 16px; color: #333;">
          Hi ${data.name},
        </p>
        <p style="font-size: 16px; color: #333;">
          Welcome to Before I Go! You've taken the first step in preserving your family's legacy.
        </p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #8f1133;">Your Plan: ${data.plan}</h3>
          <p style="margin: 0; color: #666;">Order #${data.orderId || 'XXXXX'}</p>
        </div>
        <h3 style="color: #333;">What's Next:</h3>
        <ol style="color: #666; line-height: 1.8;">
          <li>Log in to your account</li>
          <li>Choose your role (grandparent, parent, etc.)</li>
          <li>Start answering thoughtful questions</li>
          <li>Watch your story come to life!</li>
        </ol>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://app.beforeigo.app/dashboard" 
             style="background: linear-gradient(to right, #8f1133, #d946a6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">
            Go to Dashboard →
          </a>
        </div>
        <p style="font-size: 14px; color: #666;">
          Need help? Reply to this email or visit our help center.
        </p>
      </div>
    `
  })
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, to, data } = req.body;

  if (!emailTemplates[type as keyof typeof emailTemplates]) {
    return res.status(400).json({ error: 'Invalid email type' });
  }

  try {
    const template = emailTemplates[type as keyof typeof emailTemplates](data);
    
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Before I Go <noreply@beforeigo.app>',
        to,
        subject: template.subject,
        html: template.html
      })
    });

    const responseText = await resendResponse.text();
    console.log('Resend response:', resendResponse.status, responseText);

    if (!resendResponse.ok) {
      throw new Error(`Resend API error: ${resendResponse.status} - ${responseText}`);
    }

    const responseData = JSON.parse(responseText);
    return res.status(200).json(responseData);
    
  } catch (error: any) {
    console.error('Email send error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}