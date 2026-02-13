export async function sendGiftEmail(recipientEmail: string, gifterName: string, plan: string, message?: string) {
  try {
    const response = await fetch('/api/send-gift', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientEmail,
        gifterName,
        plan,
        message
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