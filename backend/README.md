# Wix Velo Backend - N8N Integration

## Overview

This backend module provides integration with n8n webhooks from Wix Velo applications.

## Files

- `n8n.jsw` - Main backend web module with `sendToN8n()` function
- `n8n-usage-example.js` - Example usage patterns

## Setup

### 1. Configure Wix Secrets

In your Wix dashboard, add a secret named `N8N_WEBHOOK_URL`:

1. Go to **Settings** → **Secrets Manager**
2. Add new secret:
   - **Name**: `N8N_WEBHOOK_URL`
   - **Value**: Your n8n webhook URL (e.g., `https://your-n8n-instance.com/webhook/wix-events-webhook`)

### 2. Import the Module

```javascript
import { sendToN8n } from 'backend/n8n.jsw';
```

## Usage

### Basic Usage

```javascript
import { sendToN8n } from 'backend/n8n.jsw';

export async function myFunction() {
    try {
        const payload = {
            event: 'user_action',
            data: { userId: '123', action: 'login' }
        };
        
        const result = await sendToN8n(payload);
        console.log('Success:', result); // { ok: true }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}
```

### Function Signature

```javascript
sendToN8n(payload: Object): Promise<{ ok: true }>
```

**Parameters:**
- `payload` (Object): The data to send to n8n

**Returns:**
- `Promise<{ ok: true }>`: Success response

**Throws:**
- `Error`: On failure with status and error text

## Features

### ✅ Implemented Features

- **Secret Management**: Reads `N8N_WEBHOOK_URL` from Wix secrets
- **HTTP POST**: Sends JSON data to n8n webhook
- **Data Structure**: Sends `{ payload, source: "wix" }`
- **Error Handling**: Throws errors with HTTP status and text
- **Timeout**: 5-second request timeout
- **Retry Logic**: 2 retries with 300ms backoff
- **Response Validation**: Only 2xx responses considered successful

### Request Format

The function sends data in this format:
```json
{
    "payload": { /* your data */ },
    "source": "wix"
}
```

### Error Handling

The function will throw errors in these cases:
- Secret `N8N_WEBHOOK_URL` not found
- Network timeout (5 seconds)
- HTTP error responses (non-2xx)
- After 2 failed retry attempts

### Retry Logic

- **Max Retries**: 2 attempts
- **Backoff**: 300ms × attempt number (300ms, 600ms)
- **Timeout**: 5 seconds per attempt
- **Total Max Time**: ~15 seconds (3 attempts × 5s timeout)

## Testing

### Test in Wix Editor

1. Open your site in Wix Editor
2. Go to **Dev Mode** → **Backend**
3. Create a test function:

```javascript
import { sendToN8n } from 'backend/n8n.jsw';

export async function testN8n() {
    try {
        const result = await sendToN8n({ test: 'data' });
        console.log('Test successful:', result);
    } catch (error) {
        console.error('Test failed:', error);
    }
}
```

4. Run the test function from the backend console

### Test with n8n

Make sure your n8n webhook is active and check the logs to see incoming requests.

## Troubleshooting

### Common Issues

1. **Secret not found**: Ensure `N8N_WEBHOOK_URL` is set in Wix Secrets Manager
2. **Timeout errors**: Check n8n webhook response time
3. **HTTP errors**: Verify webhook URL is correct and n8n is running
4. **Retry exhaustion**: Check n8n logs for error details

### Debug Tips

- Check Wix backend logs for error details
- Verify n8n webhook is receiving requests
- Test webhook URL directly with curl or Postman
- Check n8n workflow execution logs