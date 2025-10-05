// Example usage of the n8n.jsw module
import { sendToN8n } from 'backend/n8n.jsw';

/**
 * Example function showing how to use sendToN8n
 */
export async function exampleUsage() {
    try {
        // Example payload - replace with your actual data
        const payload = {
            eventType: 'user_registration',
            userId: 'user123',
            timestamp: new Date().toISOString(),
            data: {
                email: 'user@example.com',
                name: 'John Doe'
            }
        };
        
        // Send to n8n webhook
        const result = await sendToN8n(payload);
        console.log('Success:', result); // { ok: true }
        
        return result;
        
    } catch (error) {
        console.error('Failed to send to n8n:', error.message);
        throw error;
    }
}

/**
 * Example with different payload types
 */
export async function sendEventData(eventData) {
    try {
        const result = await sendToN8n(eventData);
        return result;
    } catch (error) {
        console.error('Event data send failed:', error.message);
        throw error;
    }
}