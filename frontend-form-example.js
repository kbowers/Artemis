// Frontend code for Wix Forms integration with n8n
import { sendToN8n } from 'backend/n8n.jsw';

$w.onReady(() => {
  $w('#wixForms1').onWixFormSubmitted(async (event) => {
    const submission = event.fields; // contains label/value pairs
    
    try {
      // Send form data to n8n webhook
      await sendToN8n({ 
        formId: event.formId, 
        submission,
        timestamp: new Date().toISOString(),
        source: 'wix-form'
      });
      
      console.log('Form submission sent to n8n successfully');
      
      // Optional: Show success message to user
      // $w('#successMessage').show();
      
    } catch (err) {
      console.error('Failed to send form data to n8n:', err);
      
      // Optional: Show error message to user
      // $w('#errorMessage').text = 'Failed to submit form. Please try again.';
      // $w('#errorMessage').show();
    }
  });
});