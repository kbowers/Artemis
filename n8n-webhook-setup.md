# N8N Webhook Setup for Wix Events

## Workflow Configuration

I've created an n8n workflow configuration file (`n8n-webhook-workflow.json`) that includes:

### Webhook Node Configuration
- **Method**: POST
- **Path**: `/wix-events`
- **Response Mode**: "Respond immediately" (200 OK)
- **Webhook ID**: `wix-events-webhook`

### Workflow Features
1. **Webhook Node**: Receives POST requests at `/wix-events`
2. **Immediate Response**: Returns 200 OK with "Webhook received successfully" message
3. **Data Processing**: Continues workflow after responding
4. **Data Validation**: Checks if data was received
5. **Logging**: Logs received data or "No data received" message

## How to Use

### 1. Import the Workflow
1. Open your n8n instance
2. Go to "Workflows" → "Import from File"
3. Select the `n8n-webhook-workflow.json` file
4. Click "Import"

### 2. Activate the Workflow
1. Open the imported workflow
2. Click the "Active" toggle to activate it
3. Save the workflow

### 3. Get Your Webhook URLs
Once activated, n8n will provide you with:

#### Test URL
- Format: `https://your-n8n-instance.com/webhook-test/wix-events-webhook`
- Use this for testing your webhook integration

#### Production URL
- Format: `https://your-n8n-instance.com/webhook/wix-events-webhook`
- Use this for your live Wix Events integration

### 4. Configure Wix Events
In your Wix Events settings, set the webhook URL to:
```
https://your-n8n-instance.com/webhook/wix-events-webhook
```

## Webhook Behavior

- **Immediate Response**: The webhook responds with 200 OK immediately upon receiving a request
- **Data Processing**: After responding, the workflow continues to process the received data
- **Logging**: All webhook calls are logged for debugging purposes
- **Error Handling**: The workflow handles both data and no-data scenarios

## Testing

You can test the webhook using curl:

```bash
# Test with data
curl -X POST https://your-n8n-instance.com/webhook-test/wix-events-webhook \
  -H "Content-Type: application/json" \
  -d '{"event": "test", "data": "sample"}'

# Test without data
curl -X POST https://your-n8n-instance.com/webhook-test/wix-events-webhook
```

## Security Notes

- The webhook is configured to accept POST requests only
- Consider adding authentication if needed for production use
- Monitor the logs to ensure proper webhook functionality
- Keep your n8n instance updated for security patches