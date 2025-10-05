# N8N Wix Integration Setup

## Complete Implementation Guide

This guide covers all three prompts for setting up the Wix to n8n integration.

## Prompt 1 — Velo Backend Sender ✅

**File**: `backend/n8n.jsw`

```javascript
import { getSecret } from 'wix-secrets-backend';

export async function sendToN8n(payload) {
  const url = await getSecret('N8N_WEBHOOK_URL');
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 5000);
  const body = JSON.stringify({ source: 'wix', payload, ts: Date.now() });
  const headers = { 'Content-Type': 'application/json' };
  let lastErr;
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { method: 'POST', headers, body, signal: controller.signal });
      clearTimeout(t);
      if (!res.ok) throw new Error(`n8n ${res.status} ${await res.text()}`);
      return { ok: true, status: res.status };
    } catch (e) {
      lastErr = e;
      await new Promise(r => setTimeout(r, 300));
    }
  }
  throw lastErr;
}
```

**Features**:
- ✅ 5-second timeout with AbortController
- ✅ 3 retries with 300ms delay
- ✅ Velo-compatible (uses native fetch)
- ✅ Proper error handling

## Prompt 2 — Page Hookup for Wix Forms ✅

**File**: `frontend-page-hookup.js`

```javascript
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
```

**Usage**: Paste this code in your Wix page with a form (#wixForms1)

## Prompt 3 — N8N Flow Skeleton ✅

### Workflow Structure
```
Webhook (POST /wix-events) → Function (shape data) → HTTP Request (Wix API)
```

### 1. Webhook Node
- **Method**: POST
- **Path**: `/wix-events`
- **Response**: "Respond immediately" (200 OK)

### 2. Function Node - Shape Data
**Code** (paste in Function node):
```javascript
// items[0].json is the webhook body
const { payload } = items[0].json;

// Extract form data
const { formId, submission } = payload;

// Map form submission to Wix API format
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

// Add additional fields
if (submission.message || submission.Message) {
  contactData.contact.info.notes = submission.message || submission.Message;
}

if (submission.company || submission.Company) {
  contactData.contact.info.company = submission.company || submission.Company;
}

return [{ json: contactData }];
```

### 3. HTTP Request Node - Wix API
- **Method**: POST
- **URL**: `https://www.wixapis.com/contacts/v4/contacts`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_WIX_API_TOKEN`
- **Body**: `{{ $json }}` (output from Function node)
- **Response**: JSON

## Setup Steps

### 1. Wix Setup
1. **Add Secret**: In Wix dashboard → Settings → Secrets Manager
   - Name: `N8N_WEBHOOK_URL`
   - Value: Your n8n webhook URL

2. **Deploy Backend**: Upload `backend/n8n.jsw` to your Wix site

3. **Add Frontend Code**: Paste the page hookup code in your form page

### 2. N8N Setup
1. **Import Workflow**: Use `n8n-wix-flow.json`
2. **Configure Credentials**: Set up Wix API credentials
3. **Activate Workflow**: Enable the workflow
4. **Copy Webhook URL**: Get the production webhook URL

### 3. Wix API Setup
1. **Get API Token**: From Wix dashboard → Settings → API Keys
2. **Configure n8n**: Add Wix API credentials in n8n
3. **Test Integration**: Submit a form to test the flow

## Data Flow

1. **User submits form** → Wix Form event triggered
2. **Frontend code** → Calls `sendToN8n()` with form data
3. **Backend module** → Sends POST to n8n webhook with retries/timeout
4. **N8N webhook** → Receives data, responds immediately
5. **N8N function** → Shapes data for Wix API format
6. **N8N HTTP request** → Creates contact in Wix via API
7. **Success/Error** → Logged in n8n

## Testing

### Test Webhook
```bash
curl -X POST https://your-n8n-instance.com/webhook-test/wix-events-webhook \
  -H "Content-Type: application/json" \
  -d '{"source":"wix","payload":{"formId":"test","submission":{"email":"test@example.com"}},"ts":1234567890}'
```

### Test Form Submission
1. Fill out your Wix form
2. Submit the form
3. Check n8n execution logs
4. Verify contact created in Wix

## Troubleshooting

- **Secret not found**: Check Wix Secrets Manager
- **Timeout errors**: Verify n8n webhook response time
- **API errors**: Check Wix API credentials and permissions
- **Form not triggering**: Verify form ID matches `#wixForms1`