export async function sendGiftEmail(recipientEmail: string, gifterName: string, plan: string, message?: string) {
  return sendEmail('gift', recipientEmail, {
    gifterName,
    plan,
    message
  });
}

export async function sendNewsletterWelcome(email: string, name: string) {
  return sendEmail('newsletterWelcome', email, {
    name
  });
}

export async function sendPurchaseConfirmation(email: string, name: string, plan: string, orderId?: string) {
  return sendEmail('purchaseConfirmation', email, {
    name,
    plan,
    orderId
  });
}

async function sendEmail(type: string, to: string, data: any) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        to,
        data
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