# GridWise — Smart Campus Energy Optimization Platform

> **BUP CSE Fest 2026 — Hackathon Preliminary Round**  
> An industrial-grade, AI-augmented energy dispatch and microgrid scheduling engine with an interactive operator control room.

---

## 🌟 Overview

**GridWise** solves the 24-hour microgrid optimization challenge by harmonizing variable solar generation, time-varying grid tariffs, dynamic campus loads, and battery storage constraints. The platform combines:
1. **Interactive Control Room Frontend**: A high-contrast, responsive dashboard built with Next.js 14 App Router, Tailwind CSS, and Recharts.
2. **Deterministic LP Solver Backend**: A custom Two-Phase Simplex linear programming optimizer ensuring mathematically sound, cost-optimal schedules with exact battery state-of-charge conservation.
3. **LLM Operator Directive Engine**: A guarded natural language interpreter powered by Google Gemini that extracts operational constraints from free-form operator notes and subjects them to strict validation guardrails before dispatch.

---

## 🏗️ Architecture

```
                               ┌─────────────────────────────┐
                               │  Operator Control Dashboard │
                               │  (Next.js 14 App Router)    │
                               └──────────────┬──────────────┘
                                              │
                              POST /optimize-energy (JSON)
                                              │
                                              ▼
                               ┌─────────────────────────────┐
                               │  Request Schema Validation  │
                               │  (Zod / Strict Bounds)      │
                               └──────────────┬──────────────┘
                                              │
                                              ▼
                               ┌─────────────────────────────┐
                               │   Gemini LLM Interpreter    │
                               │  (Natural Language Directives)│
                               └──────────────┬──────────────┘
                                              │
                                              ▼
                               ┌─────────────────────────────┐
                               │  Deterministic Guardrails   │
                               │  (Bounds, Clamping & Validation)
                               └──────────────┬──────────────┘
                                              │
                                              ▼
                               ┌─────────────────────────────┐
                               │  Two-Phase Simplex LP Solver │
                               │  (Cost-Minimizing Dispatch) │
                               └──────────────┬──────────────┘
                                              │
                                              ▼
                               ┌─────────────────────────────┐
                               │ Replay Balance Verification │
                               │   & Canonical API Response  │
                               └─────────────────────────────┘
```

---

## ⚡ Mathematical Formulation

The optimizer solves the following continuous Linear Program over a 24-hour horizon ($h \in \{0, 1, \dots, 23\}$):

$$\min \sum_{h=0}^{23} g_h \cdot \text{tariff}_h$$

**Subject to:**

1. **Power Balance (every hour $h$):**
   $$g_h + s_h^{\text{eff}} + d_h = \text{load}_h + c_h$$
2. **Solar Availability:**
   $$0 \le s_h^{\text{eff}} \le s_h \cdot (1 - \text{reduction}_h)$$
3. **Battery Storage Dynamics & Neutrality:**
   $$E_0 = E_{\text{initial}} + c_0 - d_0$$
   $$E_h = E_{h-1} + c_h - d_h \quad \forall h \in \{1, \dots, 23\}$$
   $$E_{23} = E_{\text{initial}} \quad (\text{Neutrality requirement})$$
4. **Capacity & Operational Limits:**
   $$E_h \ge \text{reserve}_h$$
   $$E_h \le C_{\text{battery}}$$
   $$0 \le c_h \le C_{\text{charge\_rate}}$$
   $$0 \le d_h \le C_{\text{discharge\_rate}}$$
   $$0 \le g_h \le C_{\text{grid\_max}}$$

---

## 🚀 API Endpoints

### 1. Health Check
- **Route:** `GET /health` (also aliased at `GET /api/health`)
- **Response:**
  ```json
  { "status": "ok" }
  ```

### 2. Energy Optimization
- **Route:** `POST /optimize-energy` (also aliased at `POST /api/optimize-energy`)
- **Request Format:**
  ```json
  {
    "scenario_id": "CAMPUS-GRID-2026",
    "operator_notes": [
      "Keep at least 20 kWh battery reserve between 18:00 and 22:00 due to evening lab sessions."
    ],
    "hourly_data": [
      {
        "hour": 0,
        "load_kwh": 35.2,
        "solar_kwh": 0.0,
        "grid_tariff_bdt": 4.5
      }
      ...
    ],
    "battery": {
      "capacity_kwh": 100.0,
      "max_charge_rate_kw": 25.0,
      "max_discharge_rate_kw": 25.0,
      "initial_energy_kwh": 40.0
    }
  }
  ```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18.17+ or 20+
- npm or yarn

### Installation
```bash
git clone https://github.com/Partha509/BUP_Preli.git
cd BUP_Preli
npm install
```

### Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env.local
```
Add your Gemini API key:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
GEMINI_MODEL="gemini-2.5-flash"
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the interactive operator control room.

### Verification & Testing
```bash
# Run server-side API integration tests
npm run test:backend

# Run deterministic LP solver tests across sample microgrid cases
npm run test:lp

# Run end-to-end verification suite
npm run test:verify
```

### Building for Production
```bash
npm run build
npm run start
```

---

## 📜 License
Developed for the BUP CSE Fest 2026 Microgrid Energy Optimization Challenge.
