// src/dndbeyond/buttons.js

const getLang = () => navigator.language.startsWith('es') ? 'es' : 'en';
const i18nButtons = {
  en: {
    normal: "🦉 Normal",
    adv: "⬆️ Advantage",
    dis: "⬇️ Disadvantage",
    sent: "🦉 Sent",
    advLabel: " - Advantage",
    disLabel: " - Disadvantage"
  },
  es: {
    normal: "🦉 Normal",
    adv: "⬆️ Ventaja",
    dis: "⬇️ Desventaja",
    sent: "🦉 Enviado",
    advLabel: " - Ventaja",
    disLabel: " - Desventaja"
  }
};

let currentRollTarget = null;
let currentRollData = null;

function showToast(text) {
  let toast = document.getElementById("beyondowl-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "beyondowl-toast";
    Object.assign(toast.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: "rgba(0, 0, 0, 0.7)",
      color: "white",
      padding: "10px 20px",
      borderRadius: "8px",
      fontSize: "14px",
      pointerEvents: "none",
      zIndex: "999999",
      transition: "opacity 0.3s ease",
      backdropFilter: "blur(4px)",
      border: "1px solid rgba(255, 255, 255, 0.1)"
    });
    document.body.appendChild(toast);
  }

  toast.textContent = text;
  toast.style.opacity = "1";

  clearTimeout(window.beyondOwlToastTimeout);
  window.beyondOwlToastTimeout = setTimeout(() => {
    toast.style.opacity = "0";
  }, 2000);
}

function sendRoll(rollData, overrideAdvantage) {
  if (overrideAdvantage !== undefined && overrideAdvantage !== null) {
    rollData.advantage = overrideAdvantage;
  }
  
  const charNameEl = document.querySelector(".ddbc-character-name");
  const characterName = charNameEl ? charNameEl.textContent.trim() : "Unknown";
  rollData.character = { name: characterName };

  chrome.runtime.sendMessage({ action: "roll", data: rollData });
  
  const t = i18nButtons[getLang()];
  
  let rollText = rollData.name;
  if (rollData["to-hit"]) rollText += ` (${rollData["to-hit"]})`;
  if (rollData.damages) rollText += ` [${rollData.damages.join(", ")}]`;
  if (rollData.advantage === 3) rollText += t.advLabel;
  if (rollData.advantage === 4) rollText += t.disLabel;
  showToast(`${t.sent}: ${rollText}`);
}

function createGlobalMenu() {
  if (document.getElementById("beyondowl-global-menu")) return;

  const t = i18nButtons[getLang()];
  const menu = document.createElement("div");
  menu.id = "beyondowl-global-menu";
  menu.className = "beyondowl-hover-menu";
  
  const btnNormal = document.createElement("button");
  btnNormal.className = "beyondowl-menu-btn normal";
  btnNormal.innerHTML = t.normal;

  const btnAdv = document.createElement("button");
  btnAdv.className = "beyondowl-menu-btn adv";
  btnAdv.innerHTML = t.adv;

  const btnDis = document.createElement("button");
  btnDis.className = "beyondowl-menu-btn dis";
  btnDis.innerHTML = t.dis;

  menu.appendChild(btnNormal);
  menu.appendChild(btnAdv);
  menu.appendChild(btnDis);

  document.body.appendChild(menu);

  btnNormal.addEventListener("click", (e) => {
    e.stopPropagation(); e.preventDefault();
    if (currentRollData) sendRoll(currentRollData, 0);
    hideMenu();
  });

  btnAdv.addEventListener("click", (e) => {
    e.stopPropagation(); e.preventDefault();
    if (currentRollData) sendRoll(currentRollData, 3);
    hideMenu();
  });

  btnDis.addEventListener("click", (e) => {
    e.stopPropagation(); e.preventDefault();
    if (currentRollData) sendRoll(currentRollData, 4);
    hideMenu();
  });

  document.addEventListener("click", (e) => {
    if (menu.style.display === "flex" && !menu.contains(e.target)) {
      hideMenu();
    }
  });
}

function showMenu(target, data, clickEvent) {
  currentRollTarget = target;
  currentRollData = data;
  
  const menu = document.getElementById("beyondowl-global-menu");
  if (!menu) return;

  menu.style.display = "flex";
  
  const rect = target.getBoundingClientRect();
  menu.style.top = `${window.scrollY + rect.top + (rect.height / 2) - (menu.offsetHeight / 2)}px`;
  menu.style.left = `${window.scrollX + rect.right + 4}px`; 
}

function hideMenu() {
  const menu = document.getElementById("beyondowl-global-menu");
  if (menu) menu.style.display = "none";
  currentRollTarget = null;
  currentRollData = null;
}

function handleHijackedEvent(e, el) {
  if (!window.BeyondOwlIsConnected) return;

  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  if (e.type !== "click") return;

  const data = window.BeyondOwlScraper.getRollDataFromElement(el);
  if (!data) return;

  if (data.type === "damage") {
    sendRoll(data, 0);
  } else {
    showMenu(el, data, e);
  }
}

function attachHijackEvents() {
  const selectors = [
    ".ct-combat-attack__tohit", ".ddbc-combat-attack__tohit",
    ".ct-spells-spell__tohit", ".ddbc-spells-spell__tohit",
    ".ct-combat-attack__damage", ".ddbc-combat-attack__damage", ".ddbc-combat-item-attack__damage .integrated-dice__container",
    ".ct-spells-spell__damage", ".ddbc-spells-spell__damage",
    ".ct-skills__col--modifier", ".ddbc-skills__col--modifier",
    ".ct-saving-throws-summary__ability-modifier", ".ddbc-saving-throws-summary__ability-modifier",
    ".ct-combat__summary-value", ".ddbc-combat__summary-value",
    ".ct-combat__summary-group--initiative",
    ".ddbc-ability-summary__primary", ".ddbc-ability-summary__secondary"
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      if (!el.dataset.beyondowlAttached) {
        el.dataset.beyondowlAttached = "true";
        
        el.style.cursor = "pointer";
        el.style.boxShadow = "inset 0 0 0 1px rgba(100, 150, 255, 0.3)";
        
        const eventOptions = { capture: true };
        el.addEventListener("mousedown", (e) => handleHijackedEvent(e, el), eventOptions);
        el.addEventListener("mouseup", (e) => handleHijackedEvent(e, el), eventOptions);
        el.addEventListener("pointerdown", (e) => handleHijackedEvent(e, el), eventOptions);
        el.addEventListener("pointerup", (e) => handleHijackedEvent(e, el), eventOptions);
        el.addEventListener("click", (e) => handleHijackedEvent(e, el), eventOptions);
      }
    });
  });
}

const observer = new MutationObserver((mutations) => {
  let shouldAttach = false;
  for (const mutation of mutations) {
    if (mutation.addedNodes.length > 0) {
      shouldAttach = true;
      break;
    }
  }
  if (shouldAttach) {
    clearTimeout(window.beyondOwlTimeout);
    window.beyondOwlTimeout = setTimeout(attachHijackEvents, 500);
  }
});

chrome.runtime.sendMessage({ action: "getStatus" }, (res) => {
  if (res && res.connected) {
    createGlobalMenu();
    attachHijackEvents();
    observer.observe(document.body, { childList: true, subtree: true });
  }
});

window.BeyondOwlInjectAll = () => {
  createGlobalMenu();
  attachHijackEvents();
  observer.observe(document.body, { childList: true, subtree: true });
};
