#!/bin/bash

# Test script for n8n webhook
# Replace <your-n8n> with your actual n8n instance URL

echo "Testing n8n webhook..."

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

echo -e "\n\nTest completed. Check n8n execution logs for results."