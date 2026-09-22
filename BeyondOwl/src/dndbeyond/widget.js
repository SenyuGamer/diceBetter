// src/dndbeyond/widget.js

let isConnected = false;

function createWidget() {
  const container = document.createElement("div");
  container.id = "beyondowl-widget";
  
  const header = document.createElement("div");
  header.className = "beyondowl-header";
  header.innerHTML = `
    <span class="beyondowl-title">🦉 BeyondOwl</span>
    <span class="beyondowl-status">🔴 Desconectado</span>
  `;

  const dropdownContainer = document.createElement("div");
  dropdownContainer.className = "beyondowl-dropdown-container";
  dropdownContainer.style.display = "none";

  const tabsList = document.createElement("div");
  tabsList.className = "beyondowl-tabs-list";

  dropdownContainer.appendChild(tabsList);
  container.appendChild(header);
  container.appendChild(dropdownContainer);
  
  document.body.appendChild(container);

  // Toggle dropdown
  header.addEventListener("click", () => {
    if (dropdownContainer.style.display === "none") {
      refreshTabs(tabsList);
      dropdownContainer.style.display = "block";
    } else {
      dropdownContainer.style.display = "none";
    }
  });

  checkStatus(header);
}

function refreshTabs(listEl) {
  listEl.innerHTML = "<div class='beyondowl-tab-item'>Buscando Owlbear...</div>";
  chrome.runtime.sendMessage({ action: "listOwlbearTabs" }, (tabs) => {
    listEl.innerHTML = "";
    if (!tabs || tabs.length === 0) {
      listEl.innerHTML = "<div class='beyondowl-tab-item empty'>No hay pestañas de Owlbear Rodeo abiertas.</div>";
      return;
    }
    
    // Disconnect button
    const discBtn = document.createElement("div");
    discBtn.className = "beyondowl-tab-item disconnect";
    discBtn.textContent = "🔴 Desconectar";
    discBtn.addEventListener("click", () => connectToTab(null));
    listEl.appendChild(discBtn);

    tabs.forEach(tab => {
      const item = document.createElement("div");
      item.className = "beyondowl-tab-item";
      item.textContent = `🟢 ${tab.title}`;
      item.addEventListener("click", () => connectToTab(tab.tabId, tab.title));
      listEl.appendChild(item);
    });
  });
}

function connectToTab(tabId, title) {
  if (tabId === null) {
    chrome.runtime.sendMessage({ action: "disconnect" }, () => {
      updateStatusUI(false);
      document.querySelector(".beyondowl-dropdown-container").style.display = "none";
    });
  } else {
    chrome.runtime.sendMessage({ action: "connect", tabId }, () => {
      updateStatusUI(true, title);
      document.querySelector(".beyondowl-dropdown-container").style.display = "none";
    });
  }
}

function checkStatus() {
  chrome.runtime.sendMessage({ action: "getStatus" }, (res) => {
    if (res && res.connected) {
      updateStatusUI(true);
    } else {
      updateStatusUI(false);
    }
  });
}

function updateStatusUI(connected, title) {
  isConnected = connected;
  window.BeyondOwlIsConnected = connected; // Add global flag for buttons.js
  const statusEl = document.querySelector(".beyondowl-status");
  if (!statusEl) return;
  
  if (connected) {
    statusEl.innerHTML = `🟢 Conectado`;
    statusEl.classList.add("connected");
    
    // Inject real buttons via buttons.js
    if (window.BeyondOwlInjectAll) {
      window.BeyondOwlInjectAll();
    }
  } else {
    statusEl.innerHTML = `🔴 Desconectado`;
    statusEl.classList.remove("connected");
    
    // Remove all injected menus/buttons
    document.querySelectorAll(".beyondowl-btn-container").forEach(e => e.remove());
    const menu = document.getElementById("beyondowl-global-menu");
    if (menu) menu.style.display = "none";
  }
}

// Initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createWidget);
} else {
  createWidget();
}
