# GridWise — Smart Campus Energy Optimization Platform
## Frontend Structured Build Plan & Prompt Execution Sequence

---

### Challenge & Product Context
- **Event**: BUP CSE Fest 2026 Hackathon (Preliminary Round — 4-Hour Window)
- **Problem**: Smart Campus Energy Optimization Challenge — LLM-Assisted Operator Directive Interpretation
- **Canonical Architecture**:
  $$\text{Operator Notes} \longrightarrow \text{Frontend} \xrightarrow{\text{POST /optimize-energy}} \text{Backend (LLM Interpreter} \rightarrow \text{Guardrails} \rightarrow \text{Optimizer)} \longrightarrow \text{24-Hour Plan} \longrightarrow \text{Frontend Visualization}$$
- **Endpoints**: `GET /health` and `POST /optimize-energy` (Exact contract per official Problem Statement).
- **Core Principle**: The frontend displays and explains backend-computed results. The frontend **never** independently optimizes, interprets directives, or calculates the energy schedule.
- **Frontend Stack**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, customized shadcn/ui primitives, Lucide React, Recharts / SVG visualization.
- **Design System**: Compliant with `.agents/rules/ui-ux-design-system.md` (Industrial control-room aesthetics, tabular telemetry, zero generic SaaS/purple AI clichés).

---

# PROMPT 01 — Project Scaffolding & Next.js Foundation

## Goal
Initialize the clean frontend application workspace using Next.js 14+ (App Router) with TypeScript, Tailwind CSS, Lucide React, and essential utility configurations.

## Context
Acts as the baseline foundation for all subsequent components, pages, state management, and visual systems. Must ensure strict type safety, zero build warnings, and an efficient folder structure.

## User / Role
All platform users (Campus Energy Operator, Grid Analyst, Hackathon Judges).

## Requirements
- Initialize Next.js 14+ App Router project structure with TypeScript and ESLint.
- Configure Tailwind CSS with `@tailwindcss/typography` and `@tailwindcss/forms` if needed.
- Install Lucide React (`lucide-react`) and utility libraries (`clsx`, `tailwind-merge`, `class-variance-authority`).
- Create standard directories:
  - `src/app/` (routes and layouts)
  - `src/components/ui/` (primitives)
  - `src/components/energy/` (GridWise-specific components)
  - `src/components/layout/` (navigation and shell)
  - `src/lib/types/` (API/domain types)
  - `src/lib/api/` (API client)
  - `src/lib/fixtures/` (mock responses only for offline UI development)
  - `src/hooks/` (UI/state hooks)
- Define base metadata, SEO tags, viewport settings, and favicon for "GridWise — Smart Campus Energy".

## UI Components
- Root layout (`src/app/layout.tsx`) with font configuration (Inter or Outfit).
- Metadata provider and theme provider skeleton.

## UX Behavior
- Instant initial page load under 1 second.
- Clean system console without hydration errors or deprecated API flags.

## Data / API
- None (baseline architecture).

## Responsive Behavior
- Configured viewport `width=device-width, initial-scale=1, maximum-scale=5`.

## Animation
- Global CSS transition variables configured for micro-interactions (100–150ms).

## States
- Static server render / fast hydration.

## Acceptance Criteria
- [ ] `npm run dev` builds and serves without errors.
- [ ] TypeScript compiles cleanly with strict mode enabled.
- [ ] Directory structure strictly adheres to the requested layout.
- [ ] Tailwind utilities and Lucide icons render without bundling errors.

## Implementation Rules
- Follow the UI/UX skill guidelines.
- Use Next.js App Router conventions.
- Do not install extraneous UI libraries (e.g., Bootstrap, Material UI).
- Test with `npm run build` to ensure clean initial compilation.

---

# PROMPT 02 — Design Tokens, Energy Color Palette & Theme Engine

## Goal
Implement the semantic design system tokens, CSS variables, and light/dark theme engine specifically tailored for campus energy telemetry, solar, battery, grid, and ToU tariff structures.

## Context
Provides the single source of truth for styling across all dashboard cards, charts, badges, and controls. Replaces default generic shadcn colors with dedicated energy-domain semantic tokens.

## User / Role
All platform actors; ensures readability in both brightly lit offices and dark control-room environments.

## Requirements
- Configure `globals.css` with CSS variables for Light and Dark modes:
  - `background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`
  - `primary` (Deep Industrial Emerald/Teal), `secondary`, `muted`, `accent`
  - `border`, `strong-border`, `input`, `ring`
  - Energy Domain Semantics:
    - `--energy-solar`: Warm Amber/Gold (`#F59E0B` / dark: `#FBBF24`)
    - `--energy-battery`: Cyan/Teal (`#0EA5E9` / dark: `#38BDF8`)
    - `--energy-grid`: Slate/Indigo (`#6366F1` / dark: `#818CF8`)
    - `--energy-demand`: Rose/Coral (`#F43F5E` / dark: `#FB7185`)
    - `--energy-tariff`: Emerald (`#10B981` / dark: `#34D399`)
  - Directive Status Semantics:
    - `solar_reduction`: Amber
    - `minimum_battery_reserve`: Cyan
    - `no_charge_window`: Violet
    - `no_discharge_window`: Rose
    - `max_grid_window`: Indigo
    - `no_op`: Slate
  - Status Semantics: Success, Warning, Danger, Info, Guardrail Pass/Fail.
- Configure Tailwind theme extension (`tailwind.config.ts`) mapping to these CSS variables.
- Add tabular font support (`font-mono font-feature-settings: "tnum"`) for data tables and telemetry meters.
- Implement theme toggle provider (persisted in `localStorage`, default to dark control-room mode).

## UI Components
- Theme switch toggle button (Sun/Moon icon with smooth morph transition).
- Color preview & typography verification test card.

## UX Behavior
- Instant theme toggle without page reload or FOUC (Flash of Unstyled Content).
- Subtle, high-contrast borders separating dense telemetry data points.

## Data / API
- Local storage theme persistence key: `gridwise-theme`.

## Responsive Behavior
- High-contrast visual tokens remain legible in high-glare mobile environments.

## Animation
- 150ms ease-in-out color transitions when switching themes.

## States
- Default: Dark mode (Control room view).
- Alternative: Light mode (Clean report view).

## Acceptance Criteria
- [ ] CSS variables correctly declared in `:root` and `.dark`.
- [ ] Tailwind utility classes (e.g., `text-energy-solar`, `bg-energy-battery/10`) function as expected.
- [ ] Theme switches instantly with zero layout shifts.
- [ ] No generic purple gradients or neon cyberpunk blurs anywhere in the stylesheet.

## Implementation Rules
- Adhere strictly to `.agents/rules/ui-ux-design-system.md`.
- Never use color alone to convey error states; accompany with icons and text badges.

---

# PROMPT 03 — Customized shadcn/ui Component Primitives

## Goal
Install and customize essential shadcn/ui component primitives so they seamlessly integrate with the industrial energy design system.

## Context
Forms the building block library for forms, modal dialogs, status badges, buttons, tooltips, and data containers.

## User / Role
Developers & UI system consistency.

## Requirements
- Integrate customized shadcn primitives:
  - `Button` (primary, secondary, outline, ghost, destructive, with loading spinner state)
  - `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
  - `Badge` (with variants: default, outline, success, warning, danger, solar, battery, grid, no_op)
  - `Input`, `Textarea`, `Select`
  - `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
  - `Dialog`, `Sheet` (for slide-over drawer and inspect modals)
  - `Tooltip`, `TooltipProvider`
  - `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`, `TableHead`
  - `Progress` (with custom color overrides for Battery State of Charge)
  - `Skeleton` (for data-fetching placeholders)
  - `Alert`, `AlertTitle`, `AlertDescription`
- Remove default rounded bubble radii in favor of crisp, engineered `rounded-md` ($6\text{px}$) or `rounded-lg` ($8\text{px}$).
- Ensure visible, accessible `:focus-visible` ring indicators on all interactive elements.

## UI Components
- Primitives located in `src/components/ui/*`.
- Interactive Component Kitchen Sink / Showcase preview page (`src/app/design-system/page.tsx` or test wrapper).

## UX Behavior
- Subtle 100ms tactile feedback on button clicks.
- Tooltips display on 200ms hover delay with keyboard escape support.

## Data / API
- None.

## Responsive Behavior
- Touch target sizes minimum $44\times44\text{px}$ on mobile screens.

## Animation
- Dialog and sheet open/close using sleek scale/opacity transforms (150ms).

## States
- Standard button states: Default, Hover, Active, Focus, Disabled, Loading (with embedded spinner).

## Acceptance Criteria
- [ ] All required primitives installed and customized.
- [ ] Clean TypeScript interfaces for all component props.
- [ ] Custom badge variants render domain colors (`solar_reduction`, `no_charge_window`, etc.).
- [ ] No unstyled Radix defaults present.

## Implementation Rules
- Do NOT modify Radix primitives directly; style via Tailwind `className` variants.
- Keep components modular and export cleanly from `src/components/ui`.

---

# PROMPT 04 — Core Application Shell & Navigation

## Goal
Build the unified application shell, responsive top header bar, live health indicator, lightweight role switcher, and mobile navigation drawer.

## Context
Provides persistent navigation, system status monitoring (`GET /health`), lightweight role switching (Energy Operator vs. Grid Analyst), and quick access to optimization workflows.

## User / Role
- Energy Operator (primary operational view)
- Grid Analyst (analytical and compliance view)
- Hackathon Evaluators

## Requirements
- Create `AppHeader` component:
  - Logo and Title: "GridWise" with an energetic, minimalist substation/grid node icon.
  - Live API Health Indicator: Polls `GET /health` with pulsing emerald dot ("System Online" / "Degraded" / "Offline").
  - Primary Navigation Links: Overview / Landing, Operations Dashboard, 24h Schedule & Charts, Directive Inspector.
  - Role Switcher Pill: Simple toggle between `Operator` and `Analyst` modes.
  - Quick Action Button: "Run Optimization" (triggers main optimization action on active scenario).
  - Theme Switcher & AI Assistant trigger button.
- Create `MobileNav` sheet drawer:
  - Touch-friendly slide-over menu with active route indicators.
- Create `AppShell` wrapper:
  - Persistent sticky header, container constraints (`max-w-7xl mx-auto px-4`), and clean footer with challenge metadata.

## UI Components
- `src/components/layout/AppHeader.tsx`
- `src/components/layout/MobileNav.tsx`
- `src/components/layout/AppFooter.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/energy/HealthBadge.tsx`
- `src/components/energy/RoleSwitcher.tsx`

## UX Behavior
- Header applies slight backdrop blur and elevation shadow on scroll.
- Switching roles immediately updates active context across all views without page reload.
- Health badge displays tooltip with response latency and timestamp of last check.

## Data / API
- Consumes `GET /health` with 15-second heartbeat interval (with graceful fallback in offline dev mode).

## Responsive Behavior
- Desktop: Horizontal navigation bar with role switcher and quick actions.
- Mobile (< 768px): Hamburger menu opens responsive slide-over drawer; compact health badge.

## Animation
- Slide-in from right for mobile navigation (200ms).
- Health indicator pulse: 2s infinite ease-in-out pulse.

## States
- Health States: Online (Green), Warning/Latency > 5s (Amber), Offline (Red).
- Active Navigation State: Highlighted background pill with subtle bottom indicator.

## Acceptance Criteria
- [ ] Shell renders cleanly across all viewport widths.
- [ ] Role switcher toggles active role in state.
- [ ] Mobile drawer opens, navigates, and closes smoothly.
- [ ] Health status updates reliably against `GET /health`.

## Implementation Rules
- Avoid layout thrashing on route changes.
- Ensure accessible `aria-label` on all icon buttons and mobile toggles.

---

# PROMPT 05 — Canonical Data Models, Schema Types & State Store

## Goal
Implement the exact TypeScript types, canonical schemas from the GridWise specification, static mock response fixtures for development, and application state management.

## Context
Ensures complete schema fidelity with the official BUP Hackathon API contract (`POST /optimize-energy` and `GET /health`). **Scenario switching must never perform local energy optimization or directive solving.** Mock fixtures are strictly for development previews when the backend is unavailable; production runs always call `POST /optimize-energy`.

## User / Role
Frontend architecture and data layer.

## Requirements
- Create `src/lib/types/gridwise.ts`:
  - `HourEntry`: `{ hour: number; demand_kwh: number; solar_kwh: number; tariff_bdt_per_kwh: number; }`
  - `BatteryParams`: `{ capacity_kwh: number; initial_energy_kwh: number; minimum_energy_kwh: number; max_charge_kwh_per_hour: number; max_discharge_kwh_per_hour: number; }`
  - `OptimizeEnergyRequest`: `{ scenario_id: string; operator_notes: string[]; hours: HourEntry[]; battery: BatteryParams; }`
  - `DirectiveType`: `'solar_reduction' | 'minimum_battery_reserve' | 'no_charge_window' | 'no_discharge_window' | 'max_grid_window' | 'no_op'`
  - `StructuredAdjustment`: Solar reduction `{ hours: number[]; factor: number; }`, Reserve `{ hours: number[]; minimum_energy_kwh: number; }`, Windows `{ hours: number[]; }`, Grid cap `{ hours: number[]; max_grid_kwh: number; }`, or `null`.
  - `DirectiveInterpretation`: `{ note_index: number; applies: boolean; directive_type: DirectiveType; structured_adjustment: any; explanation: string; }`
  - `HourlyPlanEntry`: `{ hour: number; grid_kwh: number; solar_used_kwh: number; battery_action: 'charge' | 'discharge' | 'idle'; battery_kwh: number; battery_energy_after_kwh: number; }`
  - `OptimizeEnergyResponse`: `{ scenario_id: string; directive_interpretation: DirectiveInterpretation[]; hourly_plan: HourlyPlanEntry[]; total_grid_kwh: number; total_cost_bdt: number; peak_grid_kwh: number; plan_summary: string; }`
- Create `src/lib/fixtures/sampleScenarios.ts`:
  - Sample Case (GRID-101) request fixture from problem statement.
  - Pre-computed mock response fixture for GRID-101 (used solely for offline UI testing when backend server is offline).
- Create `src/context/ScenarioContext.tsx`:
  - Holds: `activeRequest: OptimizeEnergyRequest`, `activeResponse: OptimizeEnergyResponse | null`, `isLoading: boolean`, `error: string | null`, `activeRole: 'operator' | 'analyst'`, `useMockFallback: boolean`.
  - `executeOptimization()`: Dispatches the current `activeRequest` to `POST /optimize-energy` (or loads static mock if mock fallback toggle is explicitly enabled).
  - **No client-side solver, no local recalculation, and no client-side directive parsing.**

## UI Components
- State provider wrapper: `ScenarioProvider`.

## UX Behavior
- Scenario switching must never perform local energy optimization or directive solving. During UI development, mock API responses may be used for visualization; in production, optimization always calls POST /optimize-energy.
- Clear distinction when mock fallback mode is active.

## Data / API
- Strict alignment with Sections 07 and 10 of the problem statement.

## Responsive Behavior
- N/A (State & Logic Layer).

## Animation
- N/A.

## States
- Status states: `idle`, `optimizing`, `success`, `error`.

## Acceptance Criteria
- [ ] All types match Sections 04, 07, 09, and 10 of the official problem statement exactly.
- [ ] Zero client-side mathematical solver or energy calculation logic.
- [ ] Scenario switching does not invent or calculate schedules locally.

## Implementation Rules
- Keep API types strictly in `src/lib/types/gridwise.ts`.
- Mock data in `src/lib/fixtures/` must remain static JSON/TS fixtures.

---

# PROMPT 06 — Focused Problem & Architecture Landing Page

## Goal
Build a concise, high-impact landing page (`src/app/page.tsx`) that immediately introduces GridWise, explains the challenge problem, visualizes the 5-stage pipeline, and provides an immediate CTA into the dashboard.

## Context
Judges need to grasp what the project does in seconds and transition directly into the operational optimization dashboard without wading through unnecessary marketing fluff.

## User / Role
Hackathon Judges, Evaluators, Campus Energy Stakeholders.

## Requirements
- **Hero Section**:
  - Clear product title: *"GridWise — Smart Campus Energy Optimization Platform"*.
  - Subtitle: *"LLM-Assisted Operator Directive Interpretation & Mathematical Cost Minimization"*.
  - Concise problem summary: Campus demand, rooftop solar, battery storage, and time-varying tariffs are reconciled with natural-language operator directives to produce an optimal 24-hour dispatch schedule.
  - Primary Action Button: "Launch Optimization Dashboard" (navigates to `/dashboard`).
- **Pipeline Architecture Visualization**:
  - Step 1: Operator Notes (Natural language inputs from campus staff).
  - Step 2: LLM Interpreter (Extracts structured adjustment parameters).
  - Step 3: Guardrail Validator (Validates directive types, hours, and bounds).
  - Step 4: Deterministic Math Optimizer (Minimizes total grid cost in BDT).
  - Step 5: 24-Hour Schedule (Produces hourly plan for solar, battery, and grid).
- **Challenge Specs Card**:
  - Highlights planning horizon (24 hours), required endpoints (`GET /health`, `POST /optimize-energy`), and supported directive types.
- **Footer**:
  - BUP CSE Fest 2026 Hackathon credits.

## UI Components
- `src/app/page.tsx`
- `src/components/landing/HeroSection.tsx`
- `src/components/landing/PipelineDiagram.tsx`

## UX Behavior
- Instant page load.
- Primary CTA smoothly navigates to `/dashboard` with active scenario pre-loaded.

## Data / API
- Static configuration.

## Responsive Behavior
- Desktop: Clean hero with horizontal pipeline diagram.
- Mobile: Compact vertical stack with swipeable pipeline cards.

## Animation
- Subtle entry fade (150ms) on hero elements.

## States
- Static server render.

## Acceptance Criteria
- [ ] Clear, focused presentation without marketing bloat or fake statistics.
- [ ] Pipeline accurately reflects the official problem flow.
- [ ] Direct CTA leads cleanly to the optimization dashboard.

## Implementation Rules
- Keep the landing page light, fast, and hackathon-focused.
- No generic SaaS illustrations, fake testimonials, or 3D canvas loops.

---

# PROMPT 07 — Scenario Selector, Notes Editor & Payload Inspector

## Goal
Build the Scenario Controller bar allowing operators to load canonical test scenarios (GRID-101 and presets), edit 1 to 3 operator notes in real-time, inspect battery parameters, view the raw request JSON, and trigger optimization.

## Context
Provides the primary interaction panel on the dashboard where users review or modify inputs before dispatching the payload to `POST /optimize-energy`.

## User / Role
- Energy Operator (loads scenarios, edits operator notes, triggers optimization)
- Evaluators / Judges (tests custom notes or preset edge cases)

## Requirements
- Create `ScenarioControlBar` component:
  - Preset Selector dropdown (`GRID-101 (Standard Scenario)`, `Edge Case: Peak Tariff`, `Edge Case: Solar Curtailment`).
  - "Optimize Energy" primary action button with loading spinner.
  - "View Request JSON" modal trigger button.
- Create `OperatorNotesEditor` component:
  - List of 1 to 3 editable text inputs for operator notes.
  - Add Note / Remove Note buttons (strictly enforced $1 \le \text{notes} \le 3$).
  - Quick Note chips for instant demo insertion:
    - *"Solar output will drop to about 20% from 1 PM to 3 PM."*
    - *"Do not charge the battery between 2 PM and 4 PM."*
    - *"Keep at least 120 kWh in reserve from 6 PM until 9 PM."*
    - *"The cafeteria menu changes tomorrow."*
- Create `BatteryParametersDrawer`:
  - Sheet displaying: `capacity_kwh`, `initial_energy_kwh`, `minimum_energy_kwh`, `max_charge_kwh_per_hour`, `max_discharge_kwh_per_hour`.
- Create `RawPayloadModal`:
  - Displays the exact formatted JSON matching Section 7.4 of the problem statement.
  - "Copy JSON" button with feedback.

## UI Components
- `src/components/energy/ScenarioControlBar.tsx`
- `src/components/energy/OperatorNotesEditor.tsx`
- `src/components/energy/BatteryParametersDrawer.tsx`
- `src/components/energy/RawPayloadModal.tsx`

## UX Behavior
- Editing notes updates request state and flags pending optimization.
- Quick chips populate note inputs in a single click.

## Data / API
- Updates `activeRequest` in `ScenarioContext`.

## Responsive Behavior
- Desktop: Horizontal control bar with drawer trigger.
- Mobile: Stacked cards with accordion for parameters.

## Animation
- Drawer slide-in from right (150ms).
- Quick chips tactile click feedback.

## States
- Note count validation: 1 note (Delete disabled), 3 notes (Add disabled).
- Disabled states while optimization request is in flight.

## Acceptance Criteria
- [ ] User can switch scenarios and edit 1–3 notes.
- [ ] Raw JSON matches Section 07 schema exactly.
- [ ] "Optimize Energy" button fires `POST /optimize-energy`.

## Implementation Rules
- Strictly maintain $1 \le \text{operator\_notes.length} \le 3$.
- Never allow submission of empty notes.

---

# PROMPT 08 — Directive Interpretation & Backend Guardrail Visualizer

## Goal
Build the visual directive interpretation panel that displays the `directive_interpretation` array returned by `POST /optimize-energy`, showing how the backend LLM interpreted each note, extracted structured adjustments, and validated them against deterministic guardrails.

## Context
A major scoring section in the hackathon (25 points for LLM interpretation + 25 points for directive application). The frontend must clearly display the backend-returned interpretation without performing any independent client-side parsing or validation.

## User / Role
- Energy Operator (confirms operational instructions were understood by the system)
- Hackathon Judge (evaluates structured extraction and guardrail status)

## Requirements
- Create `DirectiveInterpretationList` component:
  - Consumes `directive_interpretation` from the backend response.
  - Renders cards in exact `note_index` order ($0 \dots N-1$).
  - For each interpreted directive, display:
    1. **Note Index & Original Text**: The operator note as submitted.
    2. **Directive Type Badge**:
       - `solar_reduction` (Amber)
       - `minimum_battery_reserve` (Cyan)
       - `no_charge_window` (Violet)
       - `no_discharge_window` (Rose)
       - `max_grid_window` (Indigo)
       - `no_op` (Slate)
    3. **Application Status Pill**:
       - `applies: true` (Green checkmark)
       - `applies: false` (Slate slash, strictly for `no_op`)
    4. **Extracted Structured Adjustment**:
       - Affected Hours: e.g. `Hours: [13, 14] (1 PM – 3 PM)`.
       - Numeric parameters: e.g. `Factor: 0.2` or `Reserve: 120 kWh` or `Max Grid: 80 kWh` (or `null` for `no_op`).
    5. **Guardrail Verification Status**:
       - Displays backend validation pass indicator confirming: Valid directive type, unique sorted hours 0–23, valid factor/reserve bounds, and strict `no_op` null adjustment.
    6. **Backend Explanation**: Displays the `explanation` string returned by the API.
- Interactive Chart Highlighting:
  - Hovering or clicking a directive card highlights the corresponding time interval on the 24-hour dispatch chart.

## UI Components
- `src/components/energy/DirectiveInterpretationList.tsx`
- `src/components/energy/DirectiveBadge.tsx`
- `src/components/energy/StructuredAdjustmentView.tsx`

## UX Behavior
- Cards render with clear visual separation between applicable directives and `no_op` entries.
- Synchronized time-window highlighting with the 24-hour chart.

## Data / API
- Strictly consumes `directive_interpretation: DirectiveInterpretation[]` from backend response.
- **Frontend must never independently interpret or validate operator notes.**

## Responsive Behavior
- Desktop: Grid or stacked cards with side-by-side structured values.
- Mobile: Vertical stack with collapsible details.

## Animation
- Staggered card entrance (50ms delay between items).

## States
- Loading state: Skeletons while waiting for `POST /optimize-energy`.
- Empty state: "Run optimization to view interpreted operator directives".

## Acceptance Criteria
- [x] Displays every entry in exact `note_index` order.
- [x] Accurately distinguishes `no_op` (`applies = false`, `adjustment = null`) from applicable directives.
- [x] Clearly renders hours and numeric factors from backend response.

## Implementation Rules
- Display only backend-provided results; do not implement a second client-side directive parser.
- Strictly adhere to Section 04 of the problem statement.

---

# PROMPT 09 — 24-Hour Energy Dispatch Chart & Directive Overlays

## Goal
Build the 24-hour energy dispatch interactive chart displaying Campus Demand, Solar Used, Battery Action, Grid Purchase, and Electricity Tariff directly from the backend's `hourly_plan` response.

## Context
Provides the central visualization of the optimized energy schedule, showing how the backend dispatched resources across the 24-hour horizon while obeying operator directives.

## User / Role
- Energy Operator (monitors hourly dispatch schedule and peak grid draw)
- Grid Analyst (inspects solar utilization and battery cycling)

## Requirements
- Create `EnergyDispatchChart` component using Recharts or SVG visualization:
  - X-Axis: 24 hourly intervals (`00:00` through `23:00`).
  - Left Y-Axis: Energy in Kilowatt-Hours ($kWh$).
  - Right Y-Axis: Tariff in Bangladeshi Taka ($BDT/kWh$).
  - Data Series (consumed directly from `hourly_plan` and `hours`):
    1. **Campus Demand ($kWh$)**: Muted dashed line or line.
    2. **Solar Used ($kWh$)**: Amber area/line.
    3. **Grid Purchase ($kWh$)**: Indigo bars or filled line.
    4. **Battery Discharge ($kWh$)**: Emerald bar/area.
    5. **Battery Charge ($kWh$)**: Cyan bar.
    6. **Tariff ($BDT/kWh$)**: Stepped line on secondary axis.
- Directive Window Overlays:
  - Vertical tinted background bands indicating active directive windows (e.g. amber band for `solar_reduction` hours 13–14, rose band for `no_discharge_window`).
- Focused Hourly Tooltip displaying:
  - Hour (e.g. `14:00`)
  - Demand ($kWh$)
  - Solar Used ($kWh$)
  - Battery Action (`charge` | `discharge` | `idle`) & Magnitude ($kWh$)
  - Battery Energy After ($kWh$)
  - Grid Purchase ($kWh$)
  - Tariff ($BDT/kWh$)
- Battery State of Charge (SoC) Sub-chart:
  - Synchronized secondary chart showing `battery_energy_after_kwh` across all 24 hours, highlighting baseline `minimum_energy_kwh` and proving end-of-day neutrality ($E_{23} = E_0$).

## UI Components
- `src/components/energy/EnergyDispatchChart.tsx`
- `src/components/energy/BatterySoCChart.tsx`
- `src/components/energy/ChartLegendToggles.tsx`

## UX Behavior
- Hovering any hour synchronizes the tooltip across both dispatch and battery SoC charts.
- Clicking series in the legend toggles their visibility.

## Data / API
- Consumes `hourly_plan: HourlyPlanEntry[]` from backend response.
- **The chart must not calculate a new plan; it displays backend output.**

## Responsive Behavior
- Desktop: Dual-axis full-width chart.
- Mobile: Horizontally scrollable or touch-optimized SVG container.

## Animation
- 250ms smooth curve entrance upon receiving optimization results.

## States
- Loading: Pulsing skeleton grid.
- Empty: Baseline grid with message "Awaiting 24-hour schedule from backend".

## Acceptance Criteria
- [x] Plots all 24 hours ($0 \dots 23$) from the backend `hourly_plan`.
- [x] Tooltip accurately displays the 7 required data points.
- [x] Directive windows correctly overlay on the affected hours.
- [x] Battery SoC reflects `battery_energy_after_kwh` accurately.

## Implementation Rules
- Strictly consume API response fields; do not re-optimize or alter values.
- Adhere to the energy color tokens defined in Prompt 02.

---

# PROMPT 10 — 24-Hour Schedule Inspection & Validation Display Table

## Goal
Build the 24-row schedule inspection table that displays the complete hourly breakdown of the optimized plan and verifies that the backend response adheres to the energy balance and battery rules.

## Context
Provides a dense, machine-checkable view of the `hourly_plan` returned by `POST /optimize-energy` so judges can inspect individual hourly numbers and confirm validity.

## User / Role
- Energy Operator (inspects hourly operational numbers)
- Hackathon Judge (verifies numeric compliance within $0.01\text{ kWh}$ tolerance)

## Requirements
- Create `HourlyScheduleTable` component:
  - Exactly 24 rows corresponding to hours $0 \dots 23$.
  - Columns:
    1. **Hour**: `00:00` to `23:00`.
    2. **Tariff ($BDT/kWh$)**: Numeric value with price intensity indicator.
    3. **Demand ($kWh$)**: Requested campus demand.
    4. **Solar Used ($kWh$)**: Solar energy used from `hourly_plan`.
    5. **Battery Action**: Badge (`CHARGE`, `DISCHARGE`, `IDLE`) and magnitude ($kWh$).
    6. **Battery Storage ($kWh$)**: `battery_energy_after_kwh`.
    7. **Grid Purchase ($kWh$)**: `grid_kwh` from `hourly_plan`.
    8. **Hourly Cost ($BDT$)**: Calculated as $\text{grid\_kwh} \times \text{tariff}$.
    9. **Energy Balance Indicator**: Visual badge confirming backend balance ($Grid + SolarUsed + BatDis = Demand + BatChg$).
- Table Controls:
  - "Export CSV / JSON" button to download schedule for judge verification.
  - "Filter by Directive Hours" checkbox (isolates hours affected by active directives).
  - Summary footer row displaying totals (`total_grid_kwh`, `total_cost_bdt`, peak grid hour).

## UI Components
- `src/components/energy/HourlyScheduleTable.tsx`
- `src/components/energy/BatteryActionBadge.tsx`
- `src/components/energy/TableExportButton.tsx`

## UX Behavior
- Hovering a row highlights the corresponding interval on the 24-hour chart.
- Clean tabular scanning with monospace numbers.

## Data / API
- Consumes `hourly_plan: HourlyPlanEntry[]` and `hours: HourEntry[]`.

## Responsive Behavior
- Desktop: High-density 9-column table.
- Mobile: Horizontally scrollable container with sticky first column (Hour).

## Animation
- Subtle row hover highlight (100ms).

## States
- Full schedule rendered (24 rows).
- Empty state prior to optimization execution.

## Acceptance Criteria
- [x] Exactly 24 rows present ($0 \dots 23$).
- [x] Grid, solar, battery, and cost values reflect the backend response.
- [x] Footer totals match `total_grid_kwh` and `total_cost_bdt`.
- [x] Export button produces clean CSV and JSON files.

## Implementation Rules
- Display values with 2 decimal places using `font-mono`.
- The frontend acts as an inspection display, not an independent solver.

---

# PROMPT 11 — Optimization KPIs & Plan Summary Display

## Goal
Build the top-level KPI metrics cards and human-readable plan summary banner displaying the optimization output fields returned by `POST /optimize-energy`.

## Context
Presents the primary high-level results of the optimization run: Total Grid Consumption ($kWh$), Total Electricity Cost ($BDT$), Peak Grid Demand ($kWh$), and the AI-generated strategy summary (`plan_summary`).

## User / Role
- Energy Operator (monitors peak grid draw and total consumption)
- Grid Analyst / Campus Stakeholders (reviews overall financial cost in BDT)

## Requirements
- Create `OptimizationMetricsHeader` component:
  - **KPI Card 1: Total Electricity Cost ($BDT$)**:
    - Displays `total_cost_bdt` formatted cleanly (e.g. `24,350.00 BDT`).
    - Tabular, high-contrast numerals.
  - **KPI Card 2: Total Grid Energy ($kWh$)**:
    - Displays `total_grid_kwh` (e.g. `2,180.50 kWh`).
    - Sub-metric showing solar contribution percentage.
  - **KPI Card 3: Peak Grid Import ($kWh$)**:
    - Displays `peak_grid_kwh` (e.g. `145.00 kWh`).
    - Indicates the peak demand hour.
  - **KPI Card 4: Battery Cycling & End-of-Day Status**:
    - Confirms end-of-day battery neutrality ($E_{23} = E_0$).
- Create `PlanSummaryBanner` component:
  - Displays the human-readable `plan_summary` string returned directly from the backend.
  - Clean typography with subtle quote styling and an AI intelligence badge.

## UI Components
- `src/components/energy/OptimizationMetricsHeader.tsx`
- `src/components/energy/MetricCard.tsx`
- `src/components/energy/PlanSummaryBanner.tsx`

## UX Behavior
- KPI numbers update cleanly when an optimization response is received.
- Tooltips explain the metric sources.

## Data / API
- Directly consumes: `total_grid_kwh`, `total_cost_bdt`, `peak_grid_kwh`, and `plan_summary` from `OptimizeEnergyResponse`.

## Responsive Behavior
- Desktop: 4-column card row.
- Tablet: 2-column grid.
- Mobile: Single-column stacked cards.

## Animation
- Smooth 200ms number transition on update.

## States
- Skeletons displayed during optimization run.
- Empty state: Muted metric placeholders before first optimization run.

## Acceptance Criteria
- [x] All 3 required numeric totals (`total_grid_kwh`, `total_cost_bdt`, `peak_grid_kwh`) match the backend response.
- [x] `plan_summary` is displayed verbatim from the API response.
- [x] Clear typography with explicit BDT and kWh unit labels.

## Implementation Rules
- Do not invent artificial KPIs outside the official response schema.
- Follow Section 11 of `.agents/rules/ui-ux-design-system.md`.

---

# PROMPT 12 — Backend API Integration (`GET /health` & `POST /optimize-energy`)

## Goal
Implement the production HTTP API client connecting the frontend directly to the deployed backend service endpoints: `GET /health` and `POST /optimize-energy`, with timeout handling, error interceptors, and an offline mock toggle for development.

## Context
This connects the entire UI to the actual live backend solver. As per the problem statement: `POST /optimize-energy` accepts one scenario JSON object and returns the interpretation + optimization plan. Timeout limit is 30 seconds.

## User / Role
System integration & Hackathon judging harness.

## Requirements
- Create `src/lib/api/client.ts`:
  - Reads `NEXT_PUBLIC_API_URL` environment variable (defaults to `http://localhost:8000` or `/api`).
  - `checkHealth()`:
    - Calls `GET /health`.
    - Expects HTTP 200 with `{ "status": "ok" }`.
    - Returns latency and health status.
  - `optimizeEnergy(payload: OptimizeEnergyRequest)`:
    - Calls `POST /optimize-energy`.
    - Sets 30-second timeout using `AbortController`.
    - Validates that response contains all required fields: `scenario_id`, `directive_interpretation`, `hourly_plan`, `total_grid_kwh`, `total_cost_bdt`, `peak_grid_kwh`, `plan_summary`.
    - Handles HTTP error codes: 400 (Malformed JSON), 422 (Semantically invalid), 500 (Internal server error).
- Development Mock Fallback Toggle:
  - A small developer pill in the footer/header allowing developers to toggle `Use Mock Responses (Offline Dev Mode)` when testing the UI without a running backend.
  - In production mode, requests always hit the live backend.

## UI Components
- `src/components/energy/ApiModeBadge.tsx`
- `src/components/energy/ApiErrorAlert.tsx`

## UX Behavior
- Triggering optimization sets `isLoading = true`, showing skeletons across the dashboard.
- If request exceeds 30 seconds or fails, an alert appears with retry action.

## Data / API
- Strictly implements canonical contract: `GET /health` and `POST /optimize-energy`.

## Responsive Behavior
- Error alerts and status badges adapt cleanly to mobile viewports.

## Animation
- Smooth fade-in for status notifications.

## States
- Connecting, Success, Timeout (>30s), 400 Malformed, 500 Server Error, Offline Mock Active.

## Acceptance Criteria
- [x] Successfully calls live `GET /health` and `POST /optimize-energy`.
- [x] Enforces 30-second timeout.
- [x] Gracefully captures and displays backend errors without crashing.
- [x] Zero secret leaks in console or error messages.

## Implementation Rules
- Never alter the canonical request schema.
- Do not implement a client-side solver; all optimization logic resides in the backend.

---

# PROMPT 13 — Domain-Native Explanatory Energy AI Assistant

## Goal
Build the contextual AI Assistant slide-over copilot that serves as an explanatory interface for the current optimization results, tariff strategy, and directive impacts.

## Context
The AI Assistant is strictly an explanatory interface. It must **NOT** independently interpret operator notes into directives, modify the optimization problem, or execute a client-side solver. The dashboard's Operator Notes $\rightarrow$ Optimize flow is the only path that changes the optimization request.

## User / Role
- Energy Operator & Grid Analyst (asks for explanations regarding the current schedule)
- Hackathon Judges (evaluates domain awareness)

## Requirements
- Create `EnergyAssistantDrawer` component:
  - Floating trigger button in bottom-right corner with subtle pulse and icon.
  - Slide-over panel (desktop: $400\text{px}$ width; mobile: full-screen sheet).
  - Header: "GridWise Explanatory Copilot" with active scenario indicator (`Context: GRID-101`).
  - "Clear Conversation" button.
- Suggested Explanatory Prompts:
  - *"Why did the battery discharge during peak tariff hours?"*
  - *"How did the active operator directives affect total grid cost?"*
  - *"Summarize the solar utilization and curtailment in this schedule."*
  - *"Explain how end-of-day battery neutrality was maintained."*
- Explanatory Capabilities:
  - Explains the returned `plan_summary` in detail.
  - Explains why the optimizer avoided grid import during specific high-tariff hours.
  - Explains the operational impact of applied directives (e.g. `solar_reduction` or `no_charge_window`).
  - **Strict Constraint**: Must NOT parse hypothetical operator notes into directives or modify the optimization problem.

## UI Components
- `src/components/ai/EnergyAssistantDrawer.tsx`
- `src/components/ai/AssistantTriggerButton.tsx`
- `src/components/ai/ChatMessageBubble.tsx`
- `src/components/ai/QuickSuggestionChips.tsx`

## UX Behavior
- Clicking a suggestion chip immediately sends the explanatory query.
- Responses render formatted markdown with bullet points and bold highlights.

## Data / API
- Passes the active scenario's `total_cost_bdt`, `total_grid_kwh`, `peak_grid_kwh`, `directive_interpretation`, and `plan_summary` as context to the assistant.

## Responsive Behavior
- Desktop: Slide-over drawer on right margin.
- Mobile: Full-screen bottom sheet with keyboard-safe padding.

## Animation
- Drawer slide-in from right (150ms).
- Typing indicator dots while generating explanation.

## States
- Closed, Open, Idle, Generating, Error with Retry.

## Acceptance Criteria
- [x] Opens and closes smoothly without layout shifts.
- [x] Accurately explains energy concepts (ToU tariffs, peak shaving, battery neutrality).
- [x] Does NOT attempt to interpret notes or alter the active scenario.
- [x] Branded to GridWise; avoids generic ChatGPT styling.

## Implementation Rules
- Strictly follow Section 14 of `.agents/rules/ui-ux-design-system.md`.
- No generic purple haze or floating background particles.

---

# PROMPT 14 — Lightweight Role-Aware Views (Operator vs. Analyst)

## Goal
Implement a lightweight role-aware interface with two tailored views (Energy Operator and Grid Analyst) using shared components and the same backend response.

## Context
Satisfies the role-based UX requirement cleanly without creating unnecessary enterprise bloat, manual overrides, or fake permission systems.

## User / Role
- **Energy Operator**: Focuses on scenario inputs, operator notes, running optimization, directive interpretation, and the 24-hour dispatch schedule.
- **Grid Analyst**: Focuses on optimization results, cost analysis, grid reliance, solar utilization, battery behavior, and directive compliance.

## Requirements
- Create role-aware view toggling within the main dashboard:
  - Header role toggle switch: `[ Operator | Analyst ]`.
- **Energy Operator View**:
  - Highlights: Scenario Selector, Operator Notes Editor (1–3 notes), "Optimize Energy" primary trigger, Directive Interpretation visualizer, and the 24-Hour Dispatch Table.
  - Context: Operational shift management and schedule execution.
- **Grid Analyst View**:
  - Highlights: Optimization KPIs (Total Cost, Grid kWh, Peak Grid), 24-Hour Energy Dispatch Chart with Tariff Overlay, Battery SoC curve, Directive Compliance Summary, and Plan Summary banner.
  - Context: Financial performance, tariff arbitrage, and clean energy utilization.
- Shared Components & State:
  - Both views consume the exact same `ScenarioContext` and backend response.
  - Switching roles updates the visible layout smoothly without reloading the page or losing current results.
- **Explicit Exclusions**:
  - Do not implement manual energy overrides, emergency reserve controls, battery locking, battery degradation simulation, or complex permission trees.

## UI Components
- `src/components/energy/RoleAwareDashboard.tsx`
- `src/components/energy/OperatorView.tsx`
- `src/components/energy/AnalystView.tsx`

## UX Behavior
- Instant, seamless toggle between Operator and Analyst perspectives.
- Active role pill highlighted in the navigation bar.

## Data / API
- Shared state from `ScenarioContext`.

## Responsive Behavior
- Both views adapt cleanly across mobile, tablet, and desktop layouts.

## Animation
- 150ms smooth cross-fade between view modes.

## States
- Active role: `operator` | `analyst`.

## Acceptance Criteria
- [x] Switching roles changes the dashboard layout and visual priority instantly.
- [x] Operator view prioritizes inputs, directives, and hourly table.
- [x] Analyst view prioritizes KPIs, dispatch curves, and tariff analytics.
- [x] Zero code duplication; shared components reused cleanly.

## Implementation Rules
- Keep the role system lightweight and demonstrable.
- Avoid over-engineering authentication or permission management.

---

# PROMPT 15 — Loading States, Error Boundaries & Safe-Failure Displays

## Goal
Implement comprehensive loading skeletons, API error banners, 30-second timeout alerts, and safe-failure displays for malformed or rejected inputs.

## Context
The problem statement requires controlled error handling: *"If the LLM returns malformed or unsupported structured output, the service must handle it in a controlled way. The service must not silently invent a new directive type or crash."*

## User / Role
All platform users; system reliability and judge evaluation.

## Requirements
- Loading Skeletons:
  - Shimmer skeletons for KPI cards, directive interpretation cards, 24-hour chart, and schedule table during optimization runs.
- Safe-Failure & Error Alerts:
  - **400 / 422 Handler**: Displays clear message if request JSON is malformed or semantically invalid.
  - **500 Server Error Handler**: Displays controlled error banner with "Retry" action, without exposing secrets or raw stack traces.
  - **30s Timeout Handler**: Displays notice if backend exceeds the 30-second evaluation timeout.
  - **Guardrail Rejection Notice**: If backend marks a note as `no_op` due to irrelevance, display friendly badge explaining why.
- Global Error Boundary (`src/app/error.tsx`):
  - Catches client runtime exceptions safely and provides a "Reset to Standard Scenario" button.

## UI Components
- `src/components/ui/LoadingSkeletons.tsx`
- `src/components/energy/ApiErrorAlert.tsx`
- `src/app/error.tsx`
- `src/app/not-found.tsx`

## UX Behavior
- Skeletons prevent layout shifts while waiting for API responses.
- Error alerts provide actionable retry options.

## Data / API
- Intercepts fetch errors and HTTP status codes (400, 422, 500, network failure).

## Responsive Behavior
- Error cards remain legible and non-overflowing on mobile screens.

## Animation
- Gentle CSS shimmer animation on skeletons (no heavy CPU loops).

## States
- Loading, Error, Timeout, Safe Failure, Success.

## Acceptance Criteria
- [x] No blank screens during optimization requests.
- [x] 30-second timeout triggers friendly notification.
- [x] Stack traces and secrets never leak to the UI.
- [x] "Retry" action successfully re-triggers the optimization.

## Implementation Rules
- Adhere strictly to Sections 21 and 22 of `.agents/rules/ui-ux-design-system.md`.
- Never expose sensitive environment variables or internal paths.

---

# PROMPT 16 — Responsive Design & Touch UX Audit

## Goal
Audit and optimize all application pages and components across mobile phones, tablets, standard laptops, and widescreen control-room displays.

## Context
Ensures that judges evaluating on mobile devices or laptops experience a completely responsive, touch-friendly interface with zero horizontal overflow.

## User / Role
Field operators on tablets/smartphones, evaluators on laptops.

## Requirements
- Mobile Optimization (< 768px):
  - Verify zero horizontal overflow on root viewport.
  - Minimum touch target size $44\times44\text{px}$ for all buttons, inputs, and toggles.
  - Dispatch chart supports touch scrubbing with finger-offset tooltips.
  - Schedule table provides smooth horizontal scrolling with sticky Hour column.
  - AI Assistant opens in a native-feeling full-screen bottom sheet with keyboard safety.
- Tablet Optimization (768px – 1024px):
  - 2-column dashboard layout with collapsible parameter drawers.
- Widescreen Optimization (> 1440px):
  - Clean centered container (`max-w-7xl`) preventing stretched charts.

## UI Components
- Responsive layout containers and media query utilities.

## UX Behavior
- Seamless layout adaptation upon window resize or device orientation change.
- Touch gestures feel natural without sticky scroll bugs.

## Data / API
- N/A.

## Responsive Behavior
- Tested across 375px (iPhone SE), 768px (iPad), 1024px (Tablet landscape), and 1440px (Desktop).

## Animation
- Hardware-accelerated transitions that do not stutter on mobile CPUs.

## States
- Responsive breakpoints: `sm`, `md`, `lg`, `xl`.

## Acceptance Criteria
- [x] Zero horizontal scrollbar on root window at any breakpoint.
- [x] All forms, modals, and sheets accessible on mobile screens.
- [x] Touch interactions function cleanly without double-tap bugs.

## Implementation Rules
- Adhere to Sections 19 and 20 of `.agents/rules/ui-ux-design-system.md`.
- Test using Chrome DevTools responsive device emulation.

---

# PROMPT 17 — Micro-Interactions, Motion System & Visual Polish

## Goal
Refine the tactile feedback, transitions, typography hierarchy, and visual polish across the entire application to establish a distinctive, industrial control-room aesthetic.

## Context
Elevates the interface from a standard web app into an intentionally designed, memorable product.

## User / Role
All platform users and Hackathon Judges.

## Requirements
- Micro-Interactions (Level 1):
  - Subtle tactile scale on button clicks ($0.98 \rightarrow 1.0$).
  - Tabular font alignment (`font-mono`) for all numeric telemetry.
  - Smooth toggle transitions for theme and role switches.
- Component Transitions (Level 2):
  - Dialog and sheet open/close animations ($150\text{ms}$).
  - Table row subtle hover highlights.
- Visual System Polish:
  - Custom dark control-room scrollbar in `globals.css`.
  - Consistent border radii (`rounded-lg` / `rounded-md`).
  - High-contrast text contrast meeting WCAG AA standards.
  - Uniform Lucide React icon sizing ($16\text{px}$ or $20\text{px}$).

## UI Components
- Custom scrollbar styling in `src/app/globals.css`.
- Polished badge and button states.

## UX Behavior
- Interface feels crisp, responsive, and engineered with precision.
- Zero visual jitter or layout thrashing during state updates.

## Data / API
- N/A.

## Responsive Behavior
- Respects `prefers-reduced-motion` media query for accessibility.

## Animation
- All animations constrained under $200\text{ms}$ duration.

## States
- Default, hover, active, focus-visible, disabled.

## Acceptance Criteria
- [x] Application feels fluid, tactile, and professional.
- [x] Custom dark scrollbar renders cleanly.
- [x] Tabular data aligns perfectly down to the pixel.
- [x] Zero generic purple gradients or flashy neon glows.

## Implementation Rules
- Adhere to Section 18 of `.agents/rules/ui-ux-design-system.md`.
- Keep CSS animations lightweight and performant.

---

# PROMPT 18 — API-Focused Verification & Integration Testing

## Goal
Execute a thorough integration test suite validating the frontend against all official challenge requirements, API contracts, and edge cases.

## Context
Verifies that the frontend communicates seamlessly with `GET /health` and `POST /optimize-energy`, handles 1–3 operator notes, correctly renders applicable vs `no_op` directives, and handles timeouts gracefully.

## User / Role
QA, DevOps, Hackathon Evaluators.

## Requirements
- Automated / Manual Verification Suite:
  1. **Health Check**: Call `GET /health` $\rightarrow$ verifies `{ "status": "ok" }`.
  2. **Valid Optimization Request**: Dispatch standard GRID-101 scenario $\rightarrow$ verifies 200 response with all required top-level fields.
  3. **Multiple Operator Notes**: Test scenario with 1, 2, and 3 notes $\rightarrow$ verifies all notes mapped in `note_index` order.
  4. **Applicable Directives**: Verify `solar_reduction`, `minimum_battery_reserve`, `no_charge_window`, `no_discharge_window`, `max_grid_window` render with `applies: true` and non-null adjustments.
  5. **Irrelevant Note (`no_op`)**: Test with distractor note (e.g. cafeteria menu) $\rightarrow$ verifies `applies: false`, `directive_type: "no_op"`, and `structured_adjustment: null`.
  6. **24-Hour Plan Correctness**: Verify `hourly_plan` contains exactly 24 entries ($0 \dots 23$) and hourly energy balance holds.
  7. **Timeout & Error Handling**: Simulate 30s timeout and 500 error $\rightarrow$ verify graceful user notification without crashing.
  8. **Empty Note Validation**: Confirm frontend blocks submission of blank operator notes.

## UI Components
- Test runner scripts or in-app developer verification drawer.

## UX Behavior
- Immediate feedback indicating test pass/fail status.

## Data / API
- Directly exercises live or test backend endpoints.

## Responsive Behavior
- N/A.

## Animation
- N/A.

## States
- Test passed ($\checkmark$), Test failed ($\times$).

## Acceptance Criteria
- [x] All 8 verification checks pass without errors.
- [x] Request and response schemas strictly match the official specification.
- [x] Zero unhandled promise rejections or console errors.

## Implementation Rules
- Focus testing strictly on the API contract and user workflows.
- Do not test any non-existent client-side optimization logic.

---

# PROMPT 19 — End-to-End Hackathon Demo Walkthrough Flow

## Goal
Configure and test the streamlined 3-minute winning demo sequence that allows presenters to walk judges through the entire product workflow with zero friction.

## Context
Directly prepares the team for the live evaluation and mandatory 3-minute solution video walkthrough.

## User / Role
Hackathon Judges and Team Presenters.

## Requirements
- Create `DemoWalkthroughBar` component:
  - Collapsible helper bar at the top of the dashboard for presentations (toggle with `Ctrl + D`).
  - **Demo Story Steps**:
    1. **Step 1: Introduction & Campus Setup**: Introduce campus load, rooftop solar, and fluctuating ToU tariffs.
    2. **Step 2: Operator Directives**: Load Scenario GRID-101 with 3 notes (Solar reduction, No-charge window, Distractor note).
    3. **Step 3: Run Optimization**: Click "Optimize Energy" to call `POST /optimize-energy`.
    4. **Step 4: LLM Interpretation & Guardrails**: Point out how the LLM converted natural language notes into structured parameters, verified guardrails, and safely classified the distractor note as `no_op`.
    5. **Step 5: 24-Hour Dispatch Plan**: Inspect the dispatch curve showing battery charging during low-cost morning hours ($7\text{ BDT}$) and discharging during peak tariff windows ($14\text{ BDT}$), with end-of-day neutrality.
    6. **Step 6: Explanatory AI Copilot**: Open the assistant to ask *"Why did the battery discharge during peak tariff hours?"*.
    7. **Step 7: Role Perspective**: Toggle to Grid Analyst view to review total cost in BDT and export the 24-hour schedule.
- Provide "Auto-Fill Demo Scenario" button for instantaneous presenter reset.

## UI Components
- `src/components/demo/DemoWalkthroughBar.tsx`
- `src/components/demo/DemoStepCard.tsx`

## UX Behavior
- Presenter can press Right Arrow key or click "Next Step" to advance through the narrative.
- Non-intrusive focus rings draw attention to the relevant section during each step.

## Data / API
- Uses canonical GRID-101 scenario dataset to guarantee 100% demo reliability.

## Responsive Behavior
- Minimizes to a compact floating pill on smaller screens.

## Animation
- Smooth transition between walkthrough steps.

## States
- Walkthrough Steps $1 \dots 7$, Demo Complete state.

## Acceptance Criteria
- [ ] The entire end-to-end story can be demonstrated cleanly in under 3 minutes.
- [ ] Every step directly maps to a high-scoring rubric item.
- [ ] Presenter can jump to any step instantly.

## Implementation Rules
- Demo helper must be easily hidden so the UI looks completely native.
- All numbers and responses demonstrated must be authentic and mathematically valid.

---

# PROMPT 20 — Production Build & Docker Deployment Readiness

## Goal
Execute the production build audit, verify TypeScript compilation, generate a production-ready Dockerfile, and document copy-paste local reproduction commands in `README.md`.

## Context
Satisfies the hackathon's deployment and reproducibility requirements (10 points for Deployment & Docker Fallback, 10 points for Documentation & Local Reproducibility).

## User / Role
Judges evaluating Docker fallback images and reproducing the service locally.

## Requirements
- Run verification checks:
  - `npm run build` (Next.js production build verification).
  - `npm run lint` (ESLint code quality check).
  - TypeScript compilation check (`tsc --noEmit`).
- Create Production `Dockerfile`:
  - Multi-stage build (deps $\rightarrow$ builder $\rightarrow$ runner).
  - Uses unprivileged user for security.
  - Exposes port `3000` and binds to `0.0.0.0`.
  - No baked-in secrets, API keys, or `.env` files.
- Document Local Quickstart in `README.md`:
  - Step-by-step copy-paste commands to clone, configure environment variables (`NEXT_PUBLIC_API_URL`), install dependencies, start dev server, and run Docker container.
  - Documented curl commands for testing `GET /health` and `POST /optimize-energy`.

## UI Components
- `src/app/robots.ts` and metadata for clean production deployment.

## UX Behavior
- Instant production load with optimized asset caching and code splitting.

## Data / API
- Fast health response.

## Responsive Behavior
- Verified across all production targets.

## Animation
- Smooth 60fps hardware-accelerated animations.

## States
- Production ready.

## Acceptance Criteria
- [ ] `npm run build` completes with 0 errors and 0 warnings.
- [ ] Multi-stage Docker container builds cleanly, starts, and binds to `0.0.0.0:3000`.
- [ ] README provides clear, copy-paste instructions for judges to test locally.
- [ ] All 30 checkpoints in `.agents/rules/ui-ux-design-system.md` pass.

## Implementation Rules
- Do not commit secrets, tokens, or sensitive credentials.
- Ensure Docker container strictly adheres to Section 03 of the Participant Guide.
