document.addEventListener('DOMContentLoaded', function() {
  // Get UI elements
  const markdownInput = document.getElementById('markdown-input');
  const textileOutput = document.getElementById('textile-output');
  const convertBtn = document.getElementById('convert-btn');
  const copyBtn = document.getElementById('copy-btn');
  const clearBtn = document.getElementById('clear-btn');
  const statusMessage = document.getElementById('status-message');
  const sendToTabBtn = document.getElementById('send-to-tab');
  const livePreview = document.getElementById('live-preview');
  const historySelect = document.getElementById('history-select');

  // Create converter instance
  const converter = new MarkdownToTextile();

  // Conversion history (max 10 entries)
  const history = [];
  const MAX_HISTORY = 10;

  // Debounce timer for live preview
  let debounceTimer = null;

  // Flash a button briefly to give visual feedback
  function flashButton(btn) {
    btn.classList.remove('flash');
    // Force reflow so re-adding the class triggers the animation
    void btn.offsetWidth;
    btn.classList.add('flash');
  }

  // Shared convert function
  function doConvert() {
    const markdownText = markdownInput.value.trim();
    if (!markdownText) {
      showStatus('Please enter some Markdown text', 'error');
      return;
    }

    try {
      const textileText = converter.convert(markdownText);
      textileOutput.value = textileText;

      // Enable action buttons if there's output
      const hasOutput = !!textileText;
      copyBtn.disabled = !hasOutput;
      sendToTabBtn.disabled = !hasOutput;

      // Add to history
      addToHistory(markdownText, textileText);

      flashButton(convertBtn);
      showStatus('Conversion successful!', 'success');
    } catch (error) {
      showStatus('Conversion error: ' + error.message, 'error');
      console.error(error);
    }
  }

  // Add conversion to history
  function addToHistory(markdown, textile) {
    // Don't add duplicates of the last entry
    if (history.length > 0 && history[0].markdown === markdown) {
      return;
    }

    const preview = markdown.substring(0, 40) + (markdown.length > 40 ? '...' : '');
    history.unshift({ markdown, textile, preview });

    // Trim to max size
    if (history.length > MAX_HISTORY) {
      history.pop();
    }

    updateHistorySelect();
  }

  // Update the history dropdown
  function updateHistorySelect() {
    // Rebuild options using DOM methods (no innerHTML for CSP compliance)
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.textContent = 'History (' + history.length + ')';

    const options = [placeholder];
    history.forEach((entry, i) => {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = entry.preview;
      options.push(option);
    });

    historySelect.replaceChildren(...options);
  }

  // Restore a history entry
  historySelect.addEventListener('change', function() {
    const index = parseInt(historySelect.value, 10);
    if (index >= 0 && index < history.length) {
      markdownInput.value = history[index].markdown;
      textileOutput.value = history[index].textile;
      copyBtn.disabled = false;
      sendToTabBtn.disabled = false;
      showStatus('Restored from history', 'info');
    }
    // Reset dropdown to placeholder
    historySelect.selectedIndex = 0;
  });

  // Convert button click handler
  convertBtn.addEventListener('click', doConvert);

  // Keyboard shortcut: Ctrl+Enter to convert
  markdownInput.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      doConvert();
    }
  });

  // Live preview on input
  markdownInput.addEventListener('input', function() {
    statusMessage.textContent = '';

    if (livePreview.checked) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function() {
        const text = markdownInput.value.trim();
        if (text) {
          try {
            textileOutput.value = converter.convert(text);
            copyBtn.disabled = false;
            sendToTabBtn.disabled = false;
          } catch (e) {
            // Silently ignore during live typing
          }
        } else {
          textileOutput.value = '';
          copyBtn.disabled = true;
          sendToTabBtn.disabled = true;
        }
      }, 200);
    }
  });

  // Copy button click handler
  copyBtn.addEventListener('click', function() {
    navigator.clipboard.writeText(textileOutput.value)
      .then(() => {
        flashButton(copyBtn);
        showStatus('Copied to clipboard!', 'success');
      })
      .catch(err => {
        showStatus('Failed to copy: ' + err.message, 'error');
      });
  });

  // Clear button click handler
  clearBtn.addEventListener('click', function() {
    markdownInput.value = '';
    textileOutput.value = '';
    copyBtn.disabled = true;
    sendToTabBtn.disabled = true;
    statusMessage.textContent = '';
    markdownInput.focus();
  });

  // Function to show status messages
  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message';
    if (type === 'error') {
      statusMessage.style.color = '#db4437';
    } else if (type === 'success') {
      statusMessage.style.color = '#0f9d58';
    } else {
      statusMessage.style.color = '#4285f4';
    }

    // Clear the status message after 3 seconds
    setTimeout(function() {
      statusMessage.textContent = '';
    }, 3000);
  }

  // Send conversion to active tab
  sendToTabBtn.addEventListener('click', function() {
    const textileText = textileOutput.value.trim();
    if (!textileText) {
      showStatus('No converted text to send', 'error');
      return;
    }

    browser.runtime.sendMessage({
      action: "convertFromPopup",
      text: markdownInput.value.trim()
    });

    flashButton(sendToTabBtn);
    showStatus('Sent to active tab!', 'success');
  });
});
