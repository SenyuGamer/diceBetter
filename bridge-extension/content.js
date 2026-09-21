// BetterDice Bridge
// Este script se inyecta en la pestaña principal de Owlbear Rodeo.
// Su único trabajo es escuchar los eventos que Beyond20 escupe en la página,
// y reenviarlos hacia adentro del cuadrito (iframe) de BetterDice Mod.

console.log("BetterDice Bridge: Iniciado y esperando a Beyond20...");

// Buscamos si la URL del iframe coincide con local o producción
function isBetterDiceIframe(iframe) {
    try {
        const src = iframe.src || "";
        // Aceptamos localhost para pruebas, y puedes añadir la URL real de tu host
        return src.includes("localhost:5173") || src.includes("dice") || src.includes("senyudev");
    } catch (e) {
        return false;
    }
}

// Escuchamos ambos eventos por si acaso
function handleBeyond20Roll(rollData) {
    const iframes = document.querySelectorAll('iframe');
    let sent = false;
    iframes.forEach((iframe) => {
        if (isBetterDiceIframe(iframe) && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                type: "Beyond20_Roll",
                data: rollData
            }, "*");
            sent = true;
            console.log("BetterDice Bridge: Tirada enviada al iframe de BetterDice!");
        }
    });
    if (!sent) {
        console.warn("BetterDice Bridge: No se encontró ningún iframe de BetterDice activo.");
    }
}

document.addEventListener("Beyond20_RenderedRoll", (event) => {
    console.log("BetterDice Bridge: Received Beyond20 rendered roll", event.detail);
    if (event.detail && event.detail[0]) {
        handleBeyond20Roll(event.detail[0]);
    }
});

document.addEventListener("Beyond20_Roll", (event) => {
    console.log("BetterDice Bridge: Received Beyond20 roll", event.detail);
    if (event.detail && event.detail[0]) {
        handleBeyond20Roll(event.detail[0]);
    }
});
