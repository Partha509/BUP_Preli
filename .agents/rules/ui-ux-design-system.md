# UI/UX Pro Design System & Architecture Specification
## GridWise Smart Campus Energy Platform (Hackathon Frontend)

### 1. Design Authority & Core Principles
- **Clarity > Decoration**
- **Usability > Visual Effects**
- **Hierarchy > Visual Noise**
- **Consistency > Random Creativity**
- **Responsiveness > Fixed Desktop Design**
- **Performance > Heavy Animation**
- **Product Identity > Generic Component Libraries**

Never sacrifice required functionality for visual decoration. Never invent functionality merely for visual flair.

---

### 2. Product Domain & Visual Identity
Energy Management & AI Optimization:
- **Core Entities**: Solar generation, Battery energy storage (BESS), Grid draw, Campus demand, Time-of-Use (ToU) Tariffs (in BDT / kWh), Directive Interpretations, 24-Hour Hourly Dispatch Plan.
- **Tone**: Technical sophistication, control, high data density without clutter, reliability, industrial precision.
- **Numbers to prioritize**: kWh, BDT, %, kW peak, State of Charge (SoC), tariffs, cost savings.

---

### 3. Component & Styling Architecture
- **UI Primitive Foundation**: Customized Radix / shadcn/ui primitives.
- **Styling**: Tailwind CSS with strict semantic tokens (CSS variables for light and dark themes).
- **Icons**: Lucide React only (no emojis as interface icons).
- **Typography**: Clear hierarchical sans-serif (Inter / Outfit) with tabular numbers (`font-mono` / `tnum`) for data/telemetry readouts.
- **Color Roles**:
  - `background`, `surface`, `surface-elevated`
  - `primary`, `secondary`, `muted`, `border`, `strong-border`
  - Energy semantics: Solar (warm amber/gold), Battery (cyan/teal), Grid (slate/indigo), Demand (rose/coral), Tariff (emerald)
  - Directive semantics: `solar_reduction` (amber), `minimum_battery_reserve` (cyan), `no_charge_window` (violet), `no_discharge_window` (rose), `max_grid_window` (indigo), `no_op` (slate)
  - Status semantics: Success, Warning, Danger, Info
  - AI accent: Distinctive, subtle accent (not generic purple gradient haze)

---

### 4. Key Workflows & Views
1. **Landing Page**: Focused overview of the challenge problem, the LLM $\rightarrow$ Guardrails $\rightarrow$ Optimizer pipeline, and instant CTA to the dashboard.
2. **Optimization Dashboard**:
   - Scenario selector (GRID-101 and presets), 1–3 operator notes editor, and primary "Optimize Energy" trigger calling `POST /optimize-energy`.
   - Top-level KPI cards: Total Grid kWh, Total Cost (BDT), Peak Grid kWh.
3. **Directive Interpretation Visualizer**: Displaying backend-returned `directive_interpretation` (applies, directive_type, hours, structured_adjustment, guardrail verification, explanation).
4. **24-Hour Dispatch Chart & Schedule Table**: Visualizing `hourly_plan` from the backend response across all 24 hours with directive window overlays.
5. **Lightweight Role Switch**:
   - *Energy Operator*: Focus on scenario inputs, operator notes, optimization trigger, and dispatch schedule.
   - *Grid Analyst*: Focus on cost analysis, solar utilization, grid reliance, and directive compliance.
6. **Explanatory AI Assistant**: Slide-over copilot explaining backend schedule decisions, peak tariff avoidance, and plan summaries.

---

### 5. Motion, Scrolling & Interaction Guidelines
- **Level 1 (Micro)**: 100-150ms button press, toggles, badge transitions.
- **Level 2 (Component)**: 200-250ms smooth drawers, modals, tab switching, AI assistant sheet.
- **Level 3 (Section/Page)**: Subtle entrance opacity and transform.
- **Performance**: No expensive infinite canvas blurs or CPU-draining particle loops.
- **Scroll & Responsive**: Touch-friendly, adaptive layouts for mobile, tablet, and desktop control room displays.
