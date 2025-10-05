// n8n Function Node Code - Map fields
// Paste this code into the Function node in n8n

// items[0].json is the webhook body
const body = items[0].json;
const sub = body?.payload?.submission || {};

// Map your form labels -> contact fields
const email = sub['Email'] || sub['email'] || '';
const firstName = sub['First Name'] || sub['first_name'] || '';
const lastName  = sub['Last Name'] || sub['last_name'] || '';
const note      = sub['Message'] || sub['message'] || '';

// Build Wix CRM Contacts payload
// For Wix CRM v1 contacts:
const wixContact = {
  // See Wix docs for full schema; this is a minimal example
  info: {
    name: { first: firstName, last: lastName },
    emails: email ? [{ email }] : []
  },
  // You can add notes/tags/addresses if supported by your API
  // customFields: [...]
};

const slackText =
  `New form: *${body?.payload?.formTitle || 'Unknown'}*\n` +
  `*Name:* ${firstName} ${lastName}\n` +
  `*Email:* ${email}\n` +
  (note ? `*Message:* ${note}\n` : '');

return [
  {
    json: {
      wixContact,
      slackText,
      // pass along siteId if you want to set it on the next node via expression
      siteId: $json.siteId || '' // or set statically in next node
    }
  }
];