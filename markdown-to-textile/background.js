// Create the context menu when the extension is installed or updated
browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: "convert-md-to-textile",
    title: "Convert Markdown to Textile",
    contexts: ["selection"],
  });
});

// Listen for context menu clicks
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "convert-md-to-textile" && info.selectionText) {
    // Send the selected text to the content script for conversion
    browser.tabs.sendMessage(tab.id, {
      action: "convert",
      text: info.selectionText
    });
  }
});

// Listen for messages from the popup or content scripts
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "convertFromPopup") {
    // Send to the active tab
    browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
      if (tabs && tabs.length > 0) {
        browser.tabs.sendMessage(tabs[0].id, {
          action: "convertFromPopup",
          text: message.text
        }).catch(error => {
          console.error("Error sending message to tab:", error);
          // Show a notification if we can't send to the tab
          showNotification("Please navigate to a webpage first");
        });
      } else {
        showNotification("No active tab found");
      }
    });
  } else if (message.action === "notify") {
    // Show browser notification
    showNotification(message.message);
  }
});

// When trying to show a notification
function showNotification(message) {
  browser.permissions.contains({permissions: ['notifications']})
    .then((result) => {
      if (result) {
        // We have permission, show the notification
        browser.notifications.create({
          type: "basic",
          iconUrl: browser.runtime.getURL("icons/icon-48.png"),
          title: "Markdown to Textile",
          message: message
        }).catch(error => {
          console.log("Notification:", message);
        });
      } else {
        // No permission, just log to console
        console.log("Notification:", message);
      }
    });
}