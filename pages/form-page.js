// pages/<your-page>.js
import { sendToN8n } from 'backend/n8n';

$w.onReady(() => {
  $w('#wixForms1').onWixFormSubmitted(async (event) => {
    // event.fields is an array of {id, label, value}
    const submission = {};
    for (const f of event.fields) submission[f.label || f.id] = f.value;

    try {
      await sendToN8n({
        formId: event.formId,
        formTitle: event.formName,
        submission
      });
      console.log('Sent to n8n');
    } catch (err) {
      console.error('Failed to send to n8n', err);
    }
  });
});