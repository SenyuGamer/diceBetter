// src/owlbear/bridge.js
console.log("BeyondOwl Bridge loaded in Owlbear Rodeo");

// Find all extension iframes
const iframes = new Set();

function findIframes() {
  document.querySelectorAll("iframe").forEach(iframe => {
    // Target any extension iframe
    if (iframe.src && (iframe.src.includes("dice") || iframe.src.includes("localhost") || iframe.src.includes("owl"))) {
      iframes.add(iframe);
    }
  });
}

// Observe dynamically added iframes
const observer = new MutationObserver(() => findIframes());
observer.observe(document.body, { childList: true, subtree: true });
findIframes();

// Listen to background service worker and forward to iframes via postMessage
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "BeyondOwl_Roll") {
    console.log("BeyondOwl Bridge: Forwarding roll to iframes", msg.data);
    
    // Prune dead iframes
    const deadIframes = [];
    iframes.forEach(iframe => {
      if (!document.body.contains(iframe) || !iframe.contentWindow) {
        deadIframes.push(iframe);
      }
    });
    deadIframes.forEach(i => iframes.delete(i));

    // Send to all valid iframes
    iframes.forEach(iframe => {
      iframe.contentWindow.postMessage({
        type: "BeyondOwl_Roll",
        data: msg.data
      }, "*");
    });
    sendResponse({ success: true });
  }
});
