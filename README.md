# 🎲 Better Dice

An advanced 3D dice extension with realistic physics for [Owlbear Rodeo](https://www.owlbear.rodeo/), equipped with a global history system, quick tools, and direct synchronization with **D&D Beyond** through the **BeyondOwl** browser extension (or Beyond20).

[🇪🇸 Español (Spanish)](./README.es.md)

---

## 🚀 Key Features

### 🎲 Better Dice (Owlbear Rodeo Extension)
- **Deterministic 3D Physics:** Powered by the [Rapier](https://rapier.rs/) physics engine and rendered with [Three.js](https://threejs.org/) for fluid animations and fair results synchronized across all players.
- **Global and Player History:** Real-time logging of public and private rolls, detailed totals, and advantage/disadvantage.
- **Advanced Controls:** Modifiers, advantage/disadvantage, hidden GM dice, native *Bless* support, and a statistical fairness tester.
- **Customizable Dice Sets:** Select from multiple styles, materials, and colors.
- **Save Rolls:** Save commonly used rolls in a quick-access panel with specific categories (Attacks, Damage, Saves, Skills, etc).
- **External Integrations:** Native receiver support for rolls coming from D&D Beyond.

---

## 🛠️ Installation and Usage

### 1. Activate Better Dice in Owlbear Rodeo
1. Open your room in Owlbear Rodeo.
2. Go to the profile/room extensions settings.
3. Add the manifest URL of your deployment (e.g. Render or local) or install it directly from the extension store.

### 2. D&D Beyond Integration (Optional)
To send rolls from D&D Beyond directly into this 3D physical tray, you can use the **BeyondOwl** browser extension (available in the `BeyondOwl` folder) or the classic **Beyond20** extension.

[🦊 Get BeyondOwl for Firefox / Firefox Android](https://addons.mozilla.org/es-ES/android/addon/beyondowl/)

---

## 💻 Local Development

This project uses [Yarn](https://yarnpkg.com/) as a package manager.

### Prerequisites
- [Node.js](https://nodejs.org/) v20 or v22
- [Yarn](https://yarnpkg.com/)

### Commands

```bash
# Install dependencies
yarn install

# Development mode (Vite)
yarn dev

# Build for production (TypeScript + Vite)
yarn build
```

---

## 📂 Project Structure

```text
├── .github/workflows/   # CI/CD pipelines
├── BeyondOwl/           # BeyondOwl Browser Extension (Chrome & Firefox)
├── public/              # Static files and Owlbear Rodeo manifest
└── src/                 # Better Dice source code (React + Three.js)
    ├── controls/        # UI Controls, history, and state
    ├── dice/            # 3D Dice store and simulation
    ├── plugin/          # Owlbear Rodeo SDK Integration & Listeners
    ├── sets/            # Dice sets definitions
    └── types/           # TypeScript types
```

---

## 📜 License

This project is distributed under the **GNU General Public License v3.0 (GPLv3)**. See the `LICENSE` file for more details.

---

## 🙌 Credits
- Developed and maintained by **SenyuDev**.
- Built upon the open-source work of [Owlbear Rodeo Dice Roller by SeamusBoyle](https://github.com/SeamusBoyle/owlbear-dice) and [owlbear-rodeo/dice](https://github.com/owlbear-rodeo/dice).