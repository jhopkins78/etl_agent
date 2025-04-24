# Cline Job: Integrate New Dashboard, Fix Scripts, and Clean Directory

## Context
The project is located in `/Users/joshuahopkins/Desktop/etl_agent`. It contains:
- A new frontend dashboard in `etl_agent_updated/`
- An existing Python backend with Flask, using a virtual environment (`venv/`)
- Old frontend folders like `dashboard-source/`, `build/`, and others that are no longer in use

## Objectives

### 1. Integrate New Dashboard
- Replace old frontend code with the new dashboard inside `etl_agent_updated/`
- Move `etl_agent_updated/` contents into a new folder called `frontend/`
- Ensure all dependencies are retained (use existing `package.json`)
- Update paths in `run.sh` and any config files

### 2. Fix `npm` Script Issues
- Inspect `frontend/package.json`
- If `"scripts"` is missing `"dev"`, add:
  ```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
