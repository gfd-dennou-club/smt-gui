# smalruby3-gui

This file provides context for AI agents working on the `smalruby3-gui` project.

## Project Overview

`smalruby3-gui` is the Graphical User Interface for **Smalruby 3.0**, a visual programming environment based on Ruby. It is a fork of [scratch-gui](https://github.com/LLK/scratch-gui).

This project integrates Ruby programming capabilities into the Scratch interface using **Opal** (a Ruby-to-JavaScript transpiler), allowing users to write programs using both visual blocks and Ruby code.

## Key Technologies & Architecture

*   **Frontend:** React (v16), Redux (v3.7)
*   **Build System:** Webpack (v5)
*   **Ruby Transpilation:** Opal (located in `opal/`)
*   **Code Editor:** `ace-builds`, `react-ace`
*   **Core Dependencies:**
    *   `scratch-vm`: The virtual machine (forked as `smalruby/scratch-vm`)
    *   `scratch-blocks`: The block engine
    *   `scratch-render`: The rendering engine
*   **Testing:** Jest, Enzyme, Selenium WebDriver (for integration tests)

## Development Setup

### 1. Installation

```bash
npm install
```

### 2. Setup Dependencies

**Critical:** You must run the setup scripts to prepare Opal and the VM before starting development.

```bash
# Generates static/javascripts/setup-opal.js from opal/ files
npm run setup-opal

# Installs and builds the scratch-vm dependency
npm run setup-scratch-vm
```

### 3. Running the Development Server

Start the local development server (Webpack Dev Server):

```bash
npm start
```

*   **URL:** `http://localhost:8601/`
*   **Playground:** The default output is the playground interface.

## Build Commands

| Command | Description |
| :--- | :--- |
| `npm run build` | Builds the project for production into `build/` (playground) and `dist/` (lib). |
| `npm run clean` | Removes `build/` and `dist/` directories. |
| `npm run watch` | Runs webpack in watch mode. |

**Note on Deployment:**
The project uses `PUBLIC_PATH` environment variable to adjust paths for GitHub Pages deployment (e.g., `/smalruby3-gui/`).

## Testing

**Important:** Integration tests require a build artifact.

| Command | Description |
| :--- | :--- |
| `npm test` | Runs lint, unit tests, build, and integration tests sequentially. |
| `npm run test:lint` | Runs ESLint. |
| `npm run test:unit` | Runs unit tests using Jest. |
| `npm run test:integration` | Runs integration tests (Requires `npm run build` first). |

## Key Directories

*   **`src/`**: React components and application logic.
    *   `src/lib/`: Library code, including Ruby/Opal integration logic.
    *   `src/components/`: Presentational components.
    *   `src/containers/`: Container components (Redux connected).
    *   `src/playground/`: Playground harness for development.
*   **`opal/`**: Contains Opal Ruby transpiler source files.
*   **`scripts/`**: Build and utility scripts (e.g., `make-setup-opal.js`).
*   **`test/`**:
    *   `test/unit/`: Unit tests (Jest/Enzyme).
    *   `test/integration/`: Integration tests (Selenium/Headless Chrome).
*   **`static/`**: Static assets.

## Conventions & Workflow

*   **Commits:** Follow [Conventional Commits](https://www.conventionalcommits.org/). The project uses `commitlint` to enforce this.
*   **Linting:** The project uses `eslint-config-scratch`. Run `npm run test:lint` before pushing.
*   **Submodules:** `scratch-vm` is often linked or installed from a specific branch (`develop` in `package.json`). Ensure it is in sync.
*   **Opal:** If you modify files in `opal/`, you **must** run `npm run setup-opal` to regenerate `static/javascripts/setup-opal.js`.

## Common Issues

*   **Opal not found:** If you see errors related to `Opal` or `setup-opal.js`, run `npm run setup-opal`.
*   **VM mismatch:** If the GUI behaves unexpectedly, ensure `scratch-vm` is up to date (`npm run setup-scratch-vm`).
