"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Progress,
  Skeleton,
  Alert,
  AlertTitle,
  AlertDescription,
  ThemeToggle,
} from "@/components/ui";
import {
  Zap,
  ArrowLeft,
  Sun,
  BatteryCharging,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Sliders,
} from "lucide-react";

export default function DesignSystemKitchenSink() {
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [bessSoc, setBessSoc] = useState(68);

  return (
    <TooltipProvider>
      <main className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto space-y-10">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-md border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Layers className="w-6 h-6 text-primary" />
                GridWise Component System
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Industrial Primitives Showcase &bull; Prompt 03 Verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>

        {/* 1. Buttons Suite */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            1. Buttons Suite (Standard & Energy Domain)
          </h2>
          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="default">Primary Action</Button>
            <Button variant="secondary">Secondary Action</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="solar">Solar Action</Button>
            <Button variant="battery">Battery Action</Button>
            <Button variant="grid">Grid Action</Button>
            <Button
              loading={loadingBtn}
              onClick={() => {
                setLoadingBtn(true);
                setTimeout(() => setLoadingBtn(false), 2000);
              }}
            >
              {loadingBtn ? "Optimizing..." : "Click to Test Spinner"}
            </Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" variant="outline" aria-label="Quick Icon">
              <Zap className="w-4 h-4 text-primary" />
            </Button>
          </div>
        </section>

        {/* 2. Badges Suite */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            2. Badges Suite (Status & Canonical Directives)
          </h2>
          <div className="flex flex-wrap gap-2.5 items-center">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
            {/* Directive Canonical Variants */}
            <Badge variant="directive_solar">solar_reduction</Badge>
            <Badge variant="directive_reserve">minimum_battery_reserve</Badge>
            <Badge variant="directive_nocharge">no_charge_window</Badge>
            <Badge variant="directive_nodischarge">no_discharge_window</Badge>
            <Badge variant="directive_gridcap">max_grid_window</Badge>
            <Badge variant="directive_noop">no_op</Badge>
          </div>
        </section>

        {/* 3. Forms & Inputs */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            3. Form Inputs & Select Controls
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Scenario ID</label>
              <Input defaultValue="GRID-101" className="font-mono" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Optimization Horizon</label>
              <Select defaultValue="24">
                <SelectTrigger>
                  <SelectValue placeholder="Select horizon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24 Hours (Planning Standard)</SelectItem>
                  <SelectItem value="12">12 Hours (Half Day)</SelectItem>
                  <SelectItem value="48">48 Hours (Multi-Day)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Battery Initial Energy</label>
              <Input type="number" defaultValue="200" className="font-mono" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Operator Natural Language Note</label>
            <Textarea
              placeholder="e.g. Solar output will drop to about 20% from 1 PM to 3 PM."
              defaultValue="Solar output will drop to about 20% from 1 PM to 3 PM."
              rows={2}
            />
          </div>
        </section>

        {/* 4. Modals & Drawers */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            4. Modal Dialogs & Slide-Over Drawers (Sheet)
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            {/* Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open Inspection Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Optimization Dispatch Check</DialogTitle>
                  <DialogDescription>
                    Reviewing deterministic constraint satisfaction before finalizing schedule.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-2 text-sm font-mono">
                  <div className="flex justify-between border-b border-border pb-1">
                    <span className="text-muted-foreground">Battery Neutrality:</span>
                    <span className="text-emerald-500 font-semibold">200.00 kWh (Locked)</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-1">
                    <span className="text-muted-foreground">Applied Directives:</span>
                    <span className="text-primary font-semibold">2 Active, 1 No-Op</span>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="default">Acknowledge</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Sheet Drawer */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Open Parameters Drawer</Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>BESS Storage Parameters</SheetTitle>
                  <SheetDescription>
                    Inspect hardware bounds matching Section 7.3 of the canonical contract.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-4 text-xs font-mono">
                  <div className="space-y-1">
                    <label className="text-muted-foreground">Capacity (kWh)</label>
                    <Input defaultValue="500" readOnly />
                  </div>
                  <div className="space-y-1">
                    <label className="text-muted-foreground">Initial Energy (kWh)</label>
                    <Input defaultValue="200" readOnly />
                  </div>
                  <div className="space-y-1">
                    <label className="text-muted-foreground">Minimum Reserve (kWh)</label>
                    <Input defaultValue="50" readOnly />
                  </div>
                  <div className="space-y-1">
                    <label className="text-muted-foreground">Max Charge Rate (kWh/h)</label>
                    <Input defaultValue="100" readOnly />
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Tooltip Demonstration */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Telemetry Info">
                  <Info className="w-5 h-5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span>Tooltip active: 200ms delay &bull; Esc to dismiss</span>
              </TooltipContent>
            </Tooltip>
          </div>
        </section>

        {/* 5. Progress, Tabs & Alerts */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            5. Progress (BESS SoC), Tabs & Alerts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Battery State of Charge (SoC)</CardTitle>
                <CardDescription>Dynamic progress bar with color overrides</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-muted-foreground">Current SoC:</span>
                  <span className="text-sky-400 font-bold">{bessSoc}% (340 / 500 kWh)</span>
                </div>
                <Progress
                  value={bessSoc}
                  indicatorClassName="bg-sky-400"
                />
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => setBessSoc(25)}>
                    Set 25% (Low)
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setBessSoc(68)}>
                    Set 68% (Nominal)
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setBessSoc(95)}>
                    Set 95% (Full)
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Role Tabs Controller</CardTitle>
                <CardDescription>Segmented tab switcher for role views</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="operator">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="operator">Energy Operator</TabsTrigger>
                    <TabsTrigger value="analyst">Grid Analyst</TabsTrigger>
                  </TabsList>
                  <TabsContent value="operator" className="text-xs text-muted-foreground p-3 bg-card border border-border rounded-md mt-2">
                    Operator mode active: Real-time dispatch schedule and directive adherence.
                  </TabsContent>
                  <TabsContent value="analyst" className="text-xs text-muted-foreground p-3 bg-card border border-border rounded-md mt-2">
                    Analyst mode active: Cost variance, tariff arbitrage, and BDT financial savings.
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Alert variant="success">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Deterministic Guardrails Passed</AlertTitle>
              <AlertDescription>
                All 3 operator directives successfully mapped with valid hour bounds [0..23].
              </AlertDescription>
            </Alert>

            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Time-of-Use Peak Tariff Approaching</AlertTitle>
              <AlertDescription>
                Grid tariff surges to 14.00 BDT/kWh from 17:00 to 22:00. BESS dispatch primed.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* 6. Loading Skeletons */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            6. Loading Shimmer Skeletons
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </section>
      </main>
    </TooltipProvider>
  );
}
