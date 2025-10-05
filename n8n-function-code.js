// n8n Function Node Code - Shape Data
// Paste this code into the Function node in n8n

// items[0].json is the webhook body
const { payload } = items[0].json;

// Extract form data
const { formId, submission } = payload;

// Map form submission to Wix API format
// Adjust this mapping based on your form fields and Wix API requirements
const contactData = {
  contact: {
    info: {
      emails: [{ email: submission.email || submission.Email || '' }],
      phones: [{ phone: submission.phone || submission.Phone || '' }],
      name: {
        first: submission.firstName || submission['First Name'] || '',
        last: submission.lastName || submission['Last Name'] || ''
      }
    },
    tags: [`form-${formId}`, 'n8n-import'],
    customFields: {
      formId: formId,
      submissionTime: new Date().toISOString(),
      source: 'wix-form'
    }
  }
};

// Add any additional fields from the form submission
if (submission.message || submission.Message) {
  contactData.contact.info.notes = submission.message || submission.Message;
}

if (submission.company || submission.Company) {
  contactData.contact.info.company = submission.company || submission.Company;
}

return [{ json: contactData }];