# Ready-to-Paste Cursor Prompts

## Prompt A — Create the Wix Backend Sender

```
In a Wix Velo project, create backend/n8n.jsw that exports sendToN8n(payload) which reads the secret N8N_WEBHOOK_URL and POSTs JSON to it with 7s timeout and 3 retries. On non-2xx, throw an error including status and text. Return { ok: true, status } on success.
```

## Prompt B — Add Page Hookup for Wix Forms

```
On my form page, add code to handle onWixFormSubmitted for #wixForms1. Convert event.fields to a key/value object { labelOrId: value }, then call sendToN8n({ formId, formTitle, submission }) and log success or error.
```

## Prompt C — N8N Function Mapper

```
In the n8n Function node after the Webhook, map the incoming body to:

wixContact with info.name.first/last + info.emails: [{ email }]

slackText summary string
Return { wixContact, slackText, siteId: "<YOUR_SITE_ID>" }.
```

## Complete Implementation Files

### Part A — Wix (Velo) → send submissions to n8n

#### 1. Secret Setup
- **Location**: Wix Dashboard → Settings → Secrets Manager
- **Name**: `N8N_WEBHOOK_URL`
- **Value**: Your n8n Production webhook URL

#### 2. Backend Module
**File**: `backend/n8n.jsw`
```javascript
// backend/n8n.jsw
import { getSecret } from 'wix-secrets-backend';

export async function sendToN8n(payload) {
  const url = await getSecret('N8N_WEBHOOK_URL');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  const body = JSON.stringify({
    source: 'wix',
    ts: Date.now(),
    payload
  });

  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`n8n ${res.status}: ${text}`);
      }
      return { ok: true, status: res.status };
    } catch (e) {
      lastErr = e;
      // simple backoff
      await new Promise(r => setTimeout(r, 300 * (attempt + 1)));
    }
  }
  throw lastErr;
}
```

#### 3. Page Code
**File**: `pages/<your-page>.js`
```javascript
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
```

### Part B — N8N Workflow

#### Workflow Structure
```
Webhook (POST /wix/form-submitted) → Function (map fields) → HTTP Request (Wix CRM) + HTTP Request (Slack)
```

#### 1. Webhook Node
- **HTTP Method**: POST
- **Path**: `wix/form-submitted`
- **Response**: Respond immediately (200) with `{ "received": true }`

#### 2. Function Node (Map Fields)
**Code**:
```javascript
// items[0].json is the webhook body
const body = items[0].json;
const sub = body?.payload?.submission || {};

// Map your form labels -> contact fields
const email = sub['Email'] || sub['email'] || '';
const firstName = sub['First Name'] || sub['first_name'] || '';
const lastName  = sub['Last Name'] || sub['last_name'] || '';
const note      = sub['Message'] || sub['message'] || '';

// Build Wix CRM Contacts payload
const wixContact = {
  info: {
    name: { first: firstName, last: lastName },
    emails: email ? [{ email }] : []
  }
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
      siteId: "<YOUR_SITE_ID>"
    }
  }
];
```

#### 3. HTTP Request (Wix CRM Contact)
- **Authentication**: Wix OAuth2 Credential
- **Method**: POST
- **URL**: `https://www.wixapis.com/crm/v1/contacts`
- **Headers**:
  - `Content-Type: application/json`
  - `wix-site-id: <YOUR_SITE_ID>`
- **Body**: `{{ $json["wixContact"] }}`
- **Options**: Send Body as JSON

#### 4. HTTP Request (Slack Webhook)
- **Method**: POST
- **URL**: Your Slack Incoming Webhook URL
- **Headers**: `Content-Type: application/json`
- **Body**: `{ "text": "{{ $json.slackText }}" }`
- **Options**: Send Body as JSON

### Part C — Test

#### Curl Test Command
```bash
curl -X POST "https://<your-n8n>/webhook/wix/form-submitted" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "wix",
    "ts": 1730745600000,
    "payload": {
      "formId": "abcd1234",
      "formTitle": "Contact Us",
      "submission": {
        "Email": "jane@example.com",
        "First Name": "Jane",
        "Last Name": "Doe",
        "Message": "Hello from curl!"
      }
    }
  }'
```

#### Test Script
**File**: `test-webhook.sh`
```bash
#!/bin/bash
# Replace <your-n8n> with your actual n8n instance URL

curl -X POST "https://<your-n8n>/webhook/wix/form-submitted" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "wix",
    "ts": 1730745600000,
    "payload": {
      "formId": "abcd1234",
      "formTitle": "Contact Us",
      "submission": {
        "Email": "jane@example.com",
        "First Name": "Jane",
        "Last Name": "Doe",
        "Message": "Hello from curl!"
      }
    }
  }'
```

## Setup Checklist

### Wix Setup
- [ ] Add `N8N_WEBHOOK_URL` secret in Wix Dashboard
- [ ] Upload `backend/n8n.jsw` to your Wix site
- [ ] Add page code to your form page
- [ ] Test form submission

### N8N Setup
- [ ] Import `n8n-complete-workflow.json`
- [ ] Configure Wix OAuth2 credentials
- [ ] Configure Slack webhook credentials
- [ ] Update `<YOUR_SITE_ID>` in headers
- [ ] Activate workflow
- [ ] Copy production webhook URL to Wix secret

### Testing
- [ ] Run curl test command
- [ ] Submit test form on Wix site
- [ ] Check n8n execution logs
- [ ] Verify contact created in Wix CRM
- [ ] Verify Slack notification received