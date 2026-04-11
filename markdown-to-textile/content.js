// Track the last selected text and its element
let lastSelectedText = '';
let lastActiveElement = null;
let lastSelectionStart = 0;
let lastSelectionEnd = 0;

// Single converter instance
const converter = new MarkdownToTextile();

// Store selection information when text is selected
document.addEventListener('mouseup', function(e) {
  const selection = window.getSelection();
  if (selection.toString().trim()) {
    lastSelectedText = selection.toString();
    
    // Check if selection is in an editable element
    lastActiveElement = document.activeElement;
    if (lastActiveElement && (lastActiveElement.isContentEditable || 
        lastActiveElement.tagName === 'TEXTAREA' || 
        lastActiveElement.tagName === 'INPUT')) {
      lastSelectionStart = lastActiveElement.selectionStart;
      lastSelectionEnd = lastActiveElement.selectionEnd;
    } else {
      lastSelectionStart = null;
      lastSelectionEnd = null;
    }
  }
});

// Listen for messages from the background script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "convert" && message.text) {
    convertAndReplace(message.text);
  } else if (message.action === "convertFromPopup" && message.text) {
    convertAndCopy(message.text);
  }
});

// Function to convert text and replace selected text
function convertAndReplace(markdownText) {
  const textileText = converter.convert(markdownText);
  const activeElement = lastActiveElement;

  // Replace in textarea or input elements
  if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT') &&
      typeof lastSelectionStart === 'number' && typeof lastSelectionEnd === 'number') {
    try {
      const value = activeElement.value || '';
      activeElement.value = value.substring(0, lastSelectionStart) +
                            textileText +
                            value.substring(lastSelectionEnd);

      // Position cursor at the end of inserted text
      const cursorPos = lastSelectionStart + textileText.length;
      activeElement.selectionStart = cursorPos;
      activeElement.selectionEnd = cursorPos;
      activeElement.focus();

      // Trigger events for React and other frameworks
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
      activeElement.dispatchEvent(new Event('change', { bubbles: true }));

      showNotification("Text converted and replaced");
      return;
    } catch (err) {
      console.error('Error replacing text in textarea:', err);
    }
  }

  // Replace in contentEditable elements
  if (activeElement && activeElement.isContentEditable) {
    try {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(textileText));
        range.collapse(false);
      }
      showNotification("Text converted and replaced");
      return;
    } catch (err) {
      console.error('Error replacing text in contentEditable:', err);
    }
  }

  // Fallback: copy to clipboard
  navigator.clipboard.writeText(textileText)
    .then(() => {
      showNotification("Converted text copied to clipboard");
    })
    .catch(err => {
      console.error('Failed to copy text:', err);
      showNotification("Conversion failed", true);
    });
}

// Function to convert text and copy to clipboard
function convertAndCopy(markdownText) {
  const textileText = converter.convert(markdownText);

  navigator.clipboard.writeText(textileText)
    .then(() => {
      showNotification("Converted and copied to clipboard!");
    })
    .catch(err => {
      console.error('Failed to copy text:', err);
      showNotification("Failed to copy to clipboard", true);
    });
}

// Helper function to show notifications
function showNotification(message, isError = false) {
  // Create notification element
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.padding = '10px 15px';
  notification.style.backgroundColor = isError ? '#f44336' : '#4CAF50';
  notification.style.color = 'white';
  notification.style.borderRadius = '4px';
  notification.style.zIndex = '10000';
  notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
  notification.style.transition = 'opacity 0.3s';
  
  // Add to page
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
  
  // Also send to background script
  browser.runtime.sendMessage({
    action: "notify",
    message: message
  });
}