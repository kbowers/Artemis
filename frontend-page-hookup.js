// Page hookup for Wix Forms - Paste this in your page code
import { sendToN8n } from 'backend/n8n';

$w.onReady(() => {
  $w('#wixForms1').onWixFormSubmitted(async (event) => {
    const submission = event.fields; // contains label/value pairs
    try {
      await sendToN8n({ formId: event.formId, submission });
      console.log('Sent to n8n');
    } catch (err) {
      console.error('Failed to send to n8n', err);
    }
  });
});