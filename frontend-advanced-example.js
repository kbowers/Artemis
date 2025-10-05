// Advanced frontend example with multiple form types and error handling
import { sendToN8n } from 'backend/n8n.jsw';

$w.onReady(() => {
  // Handle main contact form
  $w('#contactForm').onWixFormSubmitted(async (event) => {
    await handleFormSubmission(event, 'contact');
  });
  
  // Handle newsletter signup form
  $w('#newsletterForm').onWixFormSubmitted(async (event) => {
    await handleFormSubmission(event, 'newsletter');
  });
  
  // Handle event registration form
  $w('#eventForm').onWixFormSubmitted(async (event) => {
    await handleFormSubmission(event, 'event-registration');
  });
});

/**
 * Generic form submission handler
 * @param {Object} event - Wix form submission event
 * @param {string} formType - Type of form for categorization
 */
async function handleFormSubmission(event, formType) {
  const submission = event.fields;
  
  // Prepare enhanced payload with additional context
  const payload = {
    formId: event.formId,
    formType: formType,
    submission: submission,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    pageUrl: window.location.href,
    source: 'wix-form'
  };
  
  try {
    // Show loading state
    showLoadingState(true);
    
    // Send to n8n
    await sendToN8n(payload);
    
    // Success handling
    console.log(`${formType} form submitted successfully to n8n`);
    showSuccessMessage(formType);
    
    // Optional: Reset form
    // $w(`#${formType}Form`).reset();
    
  } catch (err) {
    console.error(`Failed to send ${formType} form to n8n:`, err);
    showErrorMessage(formType, err.message);
  } finally {
    showLoadingState(false);
  }
}

/**
 * Show loading state during submission
 * @param {boolean} isLoading - Whether to show loading state
 */
function showLoadingState(isLoading) {
  if (isLoading) {
    $w('#submitButton').text = 'Submitting...';
    $w('#submitButton').disable();
  } else {
    $w('#submitButton').text = 'Submit';
    $w('#submitButton').enable();
  }
}

/**
 * Show success message
 * @param {string} formType - Type of form
 */
function showSuccessMessage(formType) {
  const messages = {
    'contact': 'Thank you for your message! We\'ll get back to you soon.',
    'newsletter': 'Successfully subscribed to our newsletter!',
    'event-registration': 'Event registration successful! Check your email for details.'
  };
  
  $w('#successMessage').text = messages[formType] || 'Form submitted successfully!';
  $w('#successMessage').show();
  
  // Hide success message after 5 seconds
  setTimeout(() => {
    $w('#successMessage').hide();
  }, 5000);
}

/**
 * Show error message
 * @param {string} formType - Type of form
 * @param {string} errorMessage - Error message to display
 */
function showErrorMessage(formType, errorMessage) {
  $w('#errorMessage').text = `Failed to submit ${formType} form. Please try again.`;
  $w('#errorMessage').show();
  
  // Hide error message after 10 seconds
  setTimeout(() => {
    $w('#errorMessage').hide();
  }, 10000);
}