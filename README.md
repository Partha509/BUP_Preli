# GridWise — Smart Campus Energy Optimization Platform

> **BUP CSE Fest 2026 — Hackathon Preliminary Round**  
> An industrial-grade, AI-augmented energy dispatch and microgrid scheduling engine with an interactive operator control room.

---

## 🌟 Overview

**GridWise** solves the 24-hour microgrid optimization challenge by harmonizing variable solar generation, time-varying grid tariffs, dynamic campus loads, and battery storage constraints. The platform combines:
1. **Interactive Control Room Frontend**: A high-contrast, responsive dashboard built with Next.js 14 App Router, Tailwind CSS, and Recharts.
2. **Deterministic LP Solver Backend**: A custom Two-Phase Simplex linear programming optimizer ensuring mathematically sound, cost-optimal schedules with exact battery state-of-charge conservation and end-of-day neutrality ($E_{23} = E_0$).
3. **LLM Operator Directive Engine**: A guarded natural language interpreter powered by Google Gemini that extracts operational constraints from free-form operator notes and subjects them to strict validation guardrails before dispatch.
4. **3-Minute Evaluation Walkthrough**: Built-in interactive presenter assistant (toggle with `Ctrl + D`) guiding judges and evaluators through all scoring rubric dimensions.

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

The optimizer solves the continuous Linear Program over a 24-hour horizon ($h \in \{0, 1, \dots, 23\}$):

$$\min \sum_{h=0}^{23} g_h \cdot \text{tariff}_h$$

**Subject to:**

1. **Power Balance (every hour $h$):**
   $$g_h + s_h^{\text{eff}} + d_h = \text{load}_h + c_h$$
2. **Solar Availability & Directive Curtailment:**
   $$0 \le s_h^{\text{eff}} \le s_h \cdot (1 - \text{reduction}_h)$$
3. **Battery Storage Dynamics & Neutrality:**
   $$E_0 = E_{\text{initial}} + c_0 - d_0$$
   $$E_h = E_{h-1} + c_h - d_h \quad \forall h \in \{1, \dots, 23\}$$
   $$E_{23} = E_{\text{initial}} \quad (\text{End-of-Day Neutrality requirement})$$
4. **Capacity & Operational Limits:**
   $$E_h \ge \text{reserve}_h$$
   $$E_h \le C_{\text{battery}}$$
   $$0 \le c_h \le C_{\text{charge\_rate}}$$
   $$0 \le d_h \le C_{\text{discharge\_rate}}$$
   $$0 \le g_h \le C_{\text{grid\_max}}$$

---

## 🚀 API Endpoints & Verification

### 1. Health Check
- **Route:** `GET /health` (also aliased at `GET /api/health`)
- **cURL Test:**
  ```bash
  curl -X GET http://localhost:3000/health
  ```
- **Response:**
  ```json
  { "status": "ok" }
  ```

### 2. Energy Optimization
- **Route:** `POST /optimize-energy` (also aliased at `POST /api/optimize-energy`)
- **cURL Test (Sample Payload):**
  ```bash
  curl -X POST http://localhost:3000/optimize-energy \
    -H "Content-Type: application/json" \
    -d '{
      "scenario_id": "GRID-101",
      "operator_notes": [
        "Solar output will drop to about 20% from 1 PM to 3 PM.",
        "Do not charge the battery between 2 PM and 4 PM.",
        "The cafeteria menu changes tomorrow."
      ],
      "hours": [
        {"hour": 0, "demand_kwh": 180, "solar_kwh": 0, "tariff_bdt_per_kwh": 7},
        {"hour": 1, "demand_kwh": 170, "solar_kwh": 0, "tariff_bdt_per_kwh": 6},
        {"hour": 2, "demand_kwh": 160, "solar_kwh": 0, "tariff_bdt_per_kwh": 6},
        {"hour": 3, "demand_kwh": 160, "solar_kwh": 0, "tariff_bdt_per_kwh": 5},
        {"hour": 4, "demand_kwh": 165, "solar_kwh": 0, "tariff_bdt_per_kwh": 5},
        {"hour": 5, "demand_kwh": 175, "solar_kwh": 0, "tariff_bdt_per_kwh": 6},
        {"hour": 6, "demand_kwh": 200, "solar_kwh": 10, "tariff_bdt_per_kwh": 8},
        {"hour": 7, "demand_kwh": 240, "solar_kwh": 35, "tariff_bdt_per_kwh": 10},
        {"hour": 8, "demand_kwh": 280, "solar_kwh": 90, "tariff_bdt_per_kwh": 12},
        {"hour": 9, "demand_kwh": 310, "solar_kwh": 160, "tariff_bdt_per_kwh": 14},
        {"hour": 10, "demand_kwh": 330, "solar_kwh": 240, "tariff_bdt_per_kwh": 16},
        {"hour": 11, "demand_kwh": 340, "solar_kwh": 300, "tariff_bdt_per_kwh": 16},
        {"hour": 12, "demand_kwh": 350, "solar_kwh": 340, "tariff_bdt_per_kwh": 15},
        {"hour": 13, "demand_kwh": 340, "solar_kwh": 320, "tariff_bdt_per_kwh": 14},
        {"hour": 14, "demand_kwh": 320, "solar_kwh": 260, "tariff_bdt_per_kwh": 13},
        {"hour": 15, "demand_kwh": 310, "solar_kwh": 170, "tariff_bdt_per_kwh": 14},
        {"hour": 16, "demand_kwh": 320, "solar_kwh": 85, "tariff_bdt_per_kwh": 18},
        {"hour": 17, "demand_kwh": 350, "solar_kwh": 20, "tariff_bdt_per_kwh": 22},
        {"hour": 18, "demand_kwh": 390, "solar_kwh": 0, "tariff_bdt_per_kwh": 28},
        {"hour": 19, "demand_kwh": 410, "solar_kwh": 0, "tariff_bdt_per_kwh": 30},
        {"hour": 20, "demand_kwh": 390, "solar_kwh": 0, "tariff_bdt_per_kwh": 26},
        {"hour": 21, "demand_kwh": 330, "solar_kwh": 0, "tariff_bdt_per_kwh": 18},
        {"hour": 22, "demand_kwh": 260, "solar_kwh": 0, "tariff_bdt_per_kwh": 11},
        {"hour": 23, "demand_kwh": 200, "solar_kwh": 0, "tariff_bdt_per_kwh": 9}
      ],
      "battery": {
        "capacity_kwh": 500.0,
        "initial_energy_kwh": 200.0,
        "minimum_energy_kwh": 50.0,
        "max_charge_kwh_per_hour": 100.0,
        "max_discharge_kwh_per_hour": 100.0
      }
    }'
  ```

---

## 🐳 Docker Deployment (Production Multi-Stage Container)

The repository provides a multi-stage, hardened Docker container adhering to unprivileged execution and Next.js standalone runner conventions.

### Build and Run with Docker

1. **Build Container Image:**
   ```bash
   docker build -t gridwise-energy .
   ```

2. **Run Container (Background Mode):**
   ```bash
   docker run -d --name gridwise-app -p 3000:3000 -e GEMINI_API_KEY="your-gemini-key" gridwise-energy
   ```

3. **Verify Health & Logs:**
   ```bash
   # Check container status (should show 'healthy')
   docker ps

   # Check container logs
   docker logs gridwise-app

   # Test healthcheck endpoint
   curl -i http://localhost:3000/health
   ```

4. **Stop Container:**
   ```bash
   docker stop gridwise-app && docker rm gridwise-app
   ```

---

## 🛠️ Local Development Quickstart

### Prerequisites
- Node.js 18.17+ or 20+
- npm or yarn

### 1. Installation
```bash
git clone https://github.com/Partha509/BUP_Preli.git
cd BUP_Preli
npm install
```

### 2. Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env.local
```
Add your Gemini credentials to `.env.local`:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
GEMINI_MODEL="gemini-2.5-flash"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 3. Running Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or [http://localhost:3000/dashboard](http://localhost:3000/dashboard)) in your browser.

---

## 🧪 Comprehensive Verification & Test Suites

The project includes offline unit tests, mathematical replay validation, and live integration tests:

```bash
# 1. Linear Programming & Battery Balance Unit Verification (500 checks across 10 sample cases)
npm run test:lp

# 2. Server-Side API Integration & Contract Tests
npm run test:backend

# 3. End-to-End Evaluation Verification Suite (All 8 judge checkpoints)
npm run test:verify

# 4. TypeScript Typecheck
npx tsc --noEmit

# 5. ESLint Code Quality Verification (0 errors, 0 warnings)
npm run lint

# 6. Next.js Production Build
npm run build
```

---

## 🎙️ 3-Minute Hackathon Presentation Walkthrough

Press <kbd>Ctrl + D</kbd> (or click the **Demo Walkthrough** button) anywhere on the dashboard to trigger the presentation assistant:

| Step | Time | Title & Rubric Dimension | Key Action / Demonstration |
| :--- | :--- | :--- | :--- |
| **01** | `0:00 - 0:25` | **Introduction & Campus Setup** | Overview of load, solar, ToU tariffs, and 500 kWh battery storage. |
| **02** | `0:25 - 0:50` | **Operator Directives** | Demonstrates 3 shift notes (Solar reduction, No-charge, Cafeteria distractor). |
| **03** | `0:50 - 1:15` | **Run Optimization Engine** | Triggers `POST /optimize-energy` with sub-second Two-Phase Simplex LP solving. |
| **04** | `1:15 - 1:45` | **LLM Interpretation & Guardrails** | Inspects structured extraction and safe `no_op` distractor classification. |
| **05** | `1:45 - 2:15` | **24-Hour Dispatch Plan** | Highlights ToU arbitrage (charging at 5–7 BDT, discharging at 28–30 BDT) and neutrality ($E_{23}=E_0$). |
| **06** | `2:15 - 2:40` | **Explanatory AI Copilot** | Queries: *"Why did the battery discharge during peak tariff hours?"* with live telemetry rationale. |
| **07** | `2:40 - 3:00` | **Role Perspective & Schedule Export** | Switches to Grid Analyst view to review financial KPIs and exports verified 24h CSV. |

---

## 📜 License
Developed for the BUP CSE Fest 2026 Microgrid Energy Optimization Challenge.
