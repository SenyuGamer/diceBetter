// background.js

// Clean up if the owlbear tab is closed
chrome.tabs.onRemoved.addListener(async (tabId) => {
  const { connectedTabId } = await chrome.storage.session.get("connectedTabId");
  if (tabId === connectedTabId) {
    await chrome.storage.session.remove("connectedTabId");
    console.log("BeyondOwl: Owlbear tab closed, disconnected.");
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "listOwlbearTabs") {
    chrome.tabs.query({ url: "https://www.owlbear.rodeo/*" }, (tabs) => {
      const result = tabs.map(t => {
        let title = t.title || "Owlbear Rodeo";
        if (t.url) {
          const match = t.url.match(/room\/[^\/]+\/([^?#]+)/);
          if (match && match[1]) {
            title = decodeURIComponent(match[1]);
          }
        }
        return { tabId: t.id, title };
      });
      sendResponse(result);
    });
    return true; // Indicates async response
  }
  
  if (msg.action === "connect") {
    chrome.storage.session.set({ connectedTabId: msg.tabId }).then(() => {
      console.log("BeyondOwl: Connected to tab", msg.tabId);
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (msg.action === "disconnect") {
    chrome.storage.session.remove("connectedTabId").then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (msg.action === "getStatus") {
    chrome.storage.session.get("connectedTabId").then(({ connectedTabId }) => {
      sendResponse({ connected: !!connectedTabId, tabId: connectedTabId });
    });
    return true;
  }

  if (msg.action === "roll") {
    chrome.storage.session.get("connectedTabId").then(({ connectedTabId }) => {
      if (connectedTabId) {
        chrome.tabs.sendMessage(connectedTabId, {
          action: "BeyondOwl_Roll",
          data: msg.data
        });
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: "No Owlbear tab connected" });
      }
    });
    return true;
  }
});
