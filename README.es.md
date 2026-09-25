# 🎲 Better Dice + BeyondOwl

Una extensión avanzada de dados 3D con físicas realistas para [Owlbear Rodeo](https://www.owlbear.rodeo/), equipada con un sistema de historial global, compendio de herramientas y sincronización directa con **D&D Beyond** mediante la extensión de navegador **BeyondOwl**.

[🇺🇸 English](./README.md)

---

## 🚀 Características Principales

### 🎲 Better Dice (Extensión para Owlbear Rodeo)
- **Físicas 3D Deterministas:** Motor de físicas [Rapier](https://rapier.rs/) y renderizado con [Three.js](https://threejs.org/) para animaciones fluidas y resultados justos sincronizados entre todos los jugadores.
- **Historial Global y del Jugador:** Registro en tiempo real de tiradas públicas y privadas, totales desglosados y ventaja/desventaja.
- **Controles Avanzados:** Modificadores, ventaja/desventaja, dados ocultos para el GM, soporte nativo de *Bless* (Bendición) y probador de imparcialidad estadística.
- **Sets de Dados Personalizables:** Selección de múltiples estilos, materiales y colores.
- **Tiradas Guardadas:** Guarda tiradas de uso frecuente en un panel de acceso rápido, categorizadas (Ataques, Daño, Salvación, Habilidades).
- **Integración con BeyondOwl:** Soporte receptor nativo para tiradas procedentes de D&D Beyond.

### 🦉 BeyondOwl (Extensión de Navegador)
- **Puente Directo D&D Beyond ➔ Owlbear Rodeo:** Tira desde tu ficha oficial de personaje de D&D Beyond directamente en tu tablero de Owlbear Rodeo.
- **Secuestro Inteligente de Tiradas:** Intercepta clics en ataques, salvaciones, habilidades y daño para evitar tiradas duplicadas en DDB y ofrecer un menú desplegable contextual (Normal / Ventaja / Desventaja).
- **Soporte para Armas Versátiles:** Detección precisa de tiradas a una mano o a dos manos.
- **Notas y Daño Adicional:** Extrae automáticamente daños extra de notas y rasgos (ej. *Divine Strike*, *Sneak Attack*).
- **Multiplataforma:** Compatible con Chrome, Edge, Brave, Opera, Firefox Desktop y Firefox para Android.

---

## 🛠️ Instalación y Uso

### 1. Activar Better Dice en Owlbear Rodeo
1. Abre tu sala en Owlbear Rodeo.
2. Ve a los ajustes de extensiones del perfil / sala.
3. Añade la URL del manifest de tu despliegue (ej. en Render o local) o instálala directamente desde la tienda de extensiones.

### 2. Instalar BeyondOwl en tu Navegador

#### Google Chrome / Edge / Brave:
1. Descarga `BeyondOwl-Chrome.zip` desde la sección [Releases](https://github.com/SenyuGamer/diceBetter/releases).
2. Descomprime el archivo en una carpeta.
3. Abre `chrome://extensions/` y activa el **Modo de desarrollador**.
4. Haz clic en **Cargar descomprimida** y selecciona la carpeta descomprimida.

#### Firefox (Desktop y Android):
1. Descarga `BeyondOwl-Firefox.xpi` desde [Releases](https://github.com/SenyuGamer/diceBetter/releases) o instálalo directamente desde [addons.mozilla.org](https://addons.mozilla.org/) si está publicado.
2. Abre el archivo en Firefox y pulsa **Añadir**.

---

## 💻 Desarrollo Local

Este proyecto utiliza [Yarn](https://yarnpkg.com/) como gestor de paquetes.

### Requisitos Previos
- [Node.js](https://nodejs.org/) v20 o v22
- [Yarn](https://yarnpkg.com/)

### Comandos

```bash
# Instalar dependencias
yarn install

# Modo desarrollo (Vite)
yarn dev

# Compilar para producción (TypeScript + Vite)
yarn build
```

---

## 📂 Estructura del Proyecto

```text
├── .github/workflows/   # Flujos de CI/CD para compilar Better Dice y empaquetar BeyondOwl
├── BeyondOwl/           # Código fuente de la extensión de navegador (Chrome & Firefox)
│   ├── manifest.json    # Manifiesto V3 multiplataforma
│   ├── background.js    # Service worker / script de fondo
│   ├── beyondowl.css    # Estilos del widget y menús inyectados
│   └── src/
│       ├── dndbeyond/   # Scraper, secuestro de eventos y widget en DDB
│       └── owlbear/     # Puente de mensajería con el iframe de Owlbear
├── public/              # Archivos estáticos y manifest de Owlbear Rodeo
└── src/                 # Código fuente de Better Dice (React + Three.js)
    ├── controls/        # Estado de controles, historial y dados
    ├── dice/            # Tienda y simulación de dados 3D
    ├── plugin/          # Integración con el SDK de Owlbear Rodeo y Beyond20Listener
    ├── sets/            # Definición de sets de dados
    └── types/           # Tipos TypeScript
```

---

## 📜 Licencia

Este proyecto se distribuye bajo la licencia **GNU General Public License v3.0 (GPLv3)**. Consulta los archivos `LICENSE` en la raíz y en `BeyondOwl/LICENSE` para más detalles.

---

## 🙌 Créditos
- Desarrollado y mantenido por **SenyuDev**.
- Basado originalmente en el trabajo de código abierto de [Owlbear Rodeo Dice Roller por SeamusBoyle](https://github.com/SeamusBoyle/owlbear-dice) y [owlbear-rodeo/dice](https://github.com/owlbear-rodeo/dice).
