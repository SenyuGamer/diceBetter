// src/dndbeyond/widget.js

const getLangW = () => navigator.language.startsWith('es') ? 'es' : 'en';
const tw = {
  en: {
    disconnected: "🔴 Disconnected",
    connected: "🟢 Connected",
    searching: "Searching for Owlbear...",
    empty: "No open Owlbear Rodeo tabs.",
    disconnectBtn: "🔴 Disconnect",
    title: "🦉 BeyondOwl"
  },
  es: {
    disconnected: "🔴 Desconectado",
    connected: "🟢 Conectado",
    searching: "Buscando Owlbear...",
    empty: "No hay pestañas de Owlbear Rodeo abiertas.",
    disconnectBtn: "🔴 Desconectar",
    title: "🦉 BeyondOwl"
  }
};

let isConnected = false;

function createWidget() {
  const t = tw[getLangW()];
  const container = document.createElement("div");
  container.id = "beyondowl-widget";
  
  const header = document.createElement("div");
  header.className = "beyondowl-header";
  header.innerHTML = `
    <span class="beyondowl-title">${t.title}</span>
    <span class="beyondowl-status">${t.disconnected}</span>
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
  const t = tw[getLangW()];
  listEl.innerHTML = `<div class='beyondowl-tab-item'>${t.searching}</div>`;
  chrome.runtime.sendMessage({ action: "listOwlbearTabs" }, (tabs) => {
    listEl.innerHTML = "";
    if (!tabs || tabs.length === 0) {
      listEl.innerHTML = `<div class='beyondowl-tab-item empty'>${t.empty}</div>`;
      return;
    }
    
    const discBtn = document.createElement("div");
    discBtn.className = "beyondowl-tab-item disconnect";
    discBtn.textContent = t.disconnectBtn;
    discBtn.addEventListener("click", () => connectToTab(null));
    listEl.appendChild(discBtn);

    tabs.forEach(tab => {
      const item = document.createElement("div");
      item.className = "beyondowl-tab-item";
      item.textContent = `🎲 ${tab.title}`;
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
  const t = tw[getLangW()];
  isConnected = connected;
  window.BeyondOwlIsConnected = connected;
  const statusEl = document.querySelector(".beyondowl-status");
  if (!statusEl) return;
  
  if (connected) {
    statusEl.innerHTML = t.connected;
    statusEl.classList.add("connected");
    
    if (window.BeyondOwlInjectAll) {
      window.BeyondOwlInjectAll();
    }
  } else {
    statusEl.innerHTML = t.disconnected;
    statusEl.classList.remove("connected");
    
    document.querySelectorAll(".beyondowl-btn-container").forEach(e => e.remove());
    const menu = document.getElementById("beyondowl-global-menu");
    if (menu) menu.style.display = "none";
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createWidget);
} else {
  createWidget();
}
