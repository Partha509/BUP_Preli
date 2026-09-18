"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage, ChatMessageBubble } from "./ChatMessageBubble";
import { QuickSuggestionChips } from "./QuickSuggestionChips";
import { useScenario } from "@/context/ScenarioContext";
import { Sparkles, Trash2, Send, Terminal, ShieldCheck } from "lucide-react";

interface EnergyAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EnergyAssistantDrawer({
  isOpen,
  onClose,
}: EnergyAssistantDrawerProps) {
  const { activeRequest, activeResponse } = useScenario();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-welcome",
      sender: "assistant",
      text: "Hello, I am the GridWise Explanatory Copilot. I provide domain explanations for the active 24-hour dispatch schedule, ToU tariff arbitrage, and applied operator directives. How can I assist your operational review?",
      timestamp: "Ready",
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const clearChat = () => {
    setMessages([
      {
        id: "cleared-welcome",
        sender: "assistant",
        text: "Conversation reset. Context refreshed for scenario " + activeRequest.scenario_id + ". Ask any question regarding the active energy schedule.",
        timestamp: "Ready",
      },
    ]);
  };

  /**
   * Generates domain-aware explanation strictly grounded in active scenario results.
   * Never alters the scenario or runs client-side optimization.
   */
  const generateExplanation = (query: string): string => {
    const q = query.toLowerCase();

    if (!activeResponse) {
      return "No optimization plan has been calculated yet. Please click 'Optimize Energy' on the console dashboard to dispatch POST /optimize-energy first.";
    }

    const { total_cost_bdt, total_grid_kwh, peak_grid_kwh, directive_interpretation, hourly_plan } =
      activeResponse;

    const appliedDirectives = directive_interpretation.filter((d) => d.applies);
    const initialEnergy = activeRequest.battery.initial_energy_kwh;
    const finalEnergy =
      hourly_plan.length > 0
        ? hourly_plan[hourly_plan.length - 1].battery_energy_after_kwh
        : initialEnergy;

    if (q.includes("battery discharge") || q.includes("peak tariff") || q.includes("arbitrage")) {
      const peakDischarges = hourly_plan.filter(
        (h) => h.battery_action === "discharge"
      );
      const dischargeHours = peakDischarges.map((h) => `${h.hour}:00`).join(", ");

      return `The optimizer strategically dispatched battery energy during high-tariff hours (${dischargeHours || "peak window"}) to minimize total grid expenditure.

**Key Telemetry:**
- Battery Discharged During: ${dischargeHours || "Optimal windows"}
- Avoided Peak Grid Tariff: Up to max ToU tariff rate
- Resulting Total Cost: ${total_cost_bdt.toFixed(2)} BDT

By discharging stored solar and off-peak energy when grid electricity is most expensive, the mathematical solver achieved maximum economic arbitrage while obeying battery discharge rate limits (${activeRequest.battery.max_discharge_kwh_per_hour} kWh/hr).`;
    }

    if (q.includes("directive") || q.includes("directives") || q.includes("operator notes")) {
      return `The backend processed ${activeRequest.operator_notes.length} operator note(s) and applied ${appliedDirectives.length} active directive(s):

${appliedDirectives
  .map(
    (d, i) =>
      `${i + 1}. **${d.directive_type}** (Note #${d.note_index}): ${d.explanation}`
  )
  .join("\n")}

**Guardrail Compliance:**
All extracted adjustments (such as solar curtailment factors, battery reserves, and grid caps) were strictly clamped to physical feasibility limits by backend guardrails before entering the linear optimization program.`;
    }

    if (q.includes("solar") || q.includes("curtailment")) {
      const totalSolarUsed = hourly_plan.reduce((sum, h) => sum + h.solar_used_kwh, 0);
      const totalSolarPotential = activeRequest.hours.reduce((sum, h) => sum + h.solar_kwh, 0);
      const solarDirectives = directive_interpretation.filter(
        (d) => d.applies && d.directive_type === "solar_reduction"
      );

      return `**Solar Utilization Analysis:**
- Available Rooftop Solar Potential: ${totalSolarPotential.toFixed(2)} kWh
- Total Solar Dispatched to Campus Demand: ${totalSolarUsed.toFixed(2)} kWh
- Solar Utilization Ratio: ${((totalSolarUsed / (totalSolarPotential || 1)) * 100).toFixed(1)}%

${
  solarDirectives.length > 0
    ? `An operator directive (${solarDirectives[0].directive_type}) curtailed solar output during hours [${solarDirectives[0].structured_adjustment?.hours.join(
        ", "
      )}] to factor ${
        (solarDirectives[0].structured_adjustment as any)?.factor ?? "specified"
      } due to campus maintenance.`
    : "No solar curtailment directives were active; maximum available rooftop solar was utilized when demand permitted."
}`;
    }

    if (q.includes("change") || q.includes("reduce the cost further") || q.includes("modify") || q.includes("re-optimize")) {
      return "The Explanatory Copilot cannot directly modify or re-optimize the active schedule. Changes must go through the core optimization engine by adjusting scenario parameters or operator inputs on the console dashboard and executing 'Optimize Energy' again.";
    }

    if (q.includes("capacity")) {
      return activeRequest.battery?.capacity_kwh != null
        ? `The battery capacity is **${activeRequest.battery.capacity_kwh} kWh**.`
        : "The battery capacity is not available in the current optimization data.";
    }

    if (q.includes("weather") || (q.includes("tomorrow") && !q.includes("tariff"))) {
      return "That information is not available in the current optimization data.";
    }

    // Default response explaining current plan summary
    return `**Schedule Overview for ${activeRequest.scenario_id}:**
- Total Grid Consumption: **${total_grid_kwh.toFixed(2)} kWh**
- Peak Grid Draw: **${peak_grid_kwh.toFixed(2)} kWh**
- Total Electricity Cost: **${total_cost_bdt.toFixed(2)} BDT**

**Backend Plan Strategy:**
${activeResponse.plan_summary}

*(Note: The Explanatory Copilot is strictly an analytical observer. To modify operator notes or adjust constraints, use the console dashboard and click 'Optimize Energy'.)*`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery.trim();
    if (!query || isGenerating) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputQuery("");
    setIsGenerating(true);

    let responseText = "";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          scenarioContext: {
            scenario_id: activeRequest.scenario_id,
            total_cost_bdt: activeResponse?.total_cost_bdt,
            total_grid_kwh: activeResponse?.total_grid_kwh,
            peak_grid_kwh: activeResponse?.peak_grid_kwh,
            plan_summary: activeResponse?.plan_summary,
            battery: activeRequest.battery,
            directives: activeResponse?.directive_interpretation?.map((d) => ({
              note_index: d.note_index,
              applies: d.applies,
              directive_type: d.directive_type,
              explanation: d.explanation,
              structured_adjustment: d.structured_adjustment,
            })),
            hourly_plan: activeResponse?.hourly_plan,
            backend_verification:
              activeResponse?.hourly_plan && activeResponse.hourly_plan.length === 24
                ? {
                    neutrality_verified:
                      Math.abs(
                        activeResponse.hourly_plan[23].battery_energy_after_kwh -
                          activeRequest.battery.initial_energy_kwh
                      ) <= 0.05,
                    e0: activeRequest.battery.initial_energy_kwh,
                    e23: activeResponse.hourly_plan[23].battery_energy_after_kwh,
                  }
                : undefined,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.reply) {
          responseText = data.reply;
        }
      }
    } catch (err) {
      console.warn("Live Gemini chat endpoint unavailable, falling back to local domain engine", err);
    }

    if (!responseText) {
      responseText = generateExplanation(query);
    }

    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: "assistant",
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setIsGenerating(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col h-full bg-card border-l border-border font-mono"
      >
        {/* Drawer Header */}
        <SheetHeader className="p-4 md:p-5 border-b border-border bg-secondary/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/20 text-primary">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <SheetTitle className="text-sm font-bold tracking-tight text-foreground">
                  GridWise Explanatory Copilot
                </SheetTitle>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  <span className="text-emerald-400 font-medium">Gemini AI</span>
                  <span className="text-muted-foreground/40">•</span>
                  <span>{activeRequest.scenario_id}</span>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="h-8 text-xs font-mono text-muted-foreground hover:text-foreground"
              title="Clear conversation transcript"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              <span>Reset</span>
            </Button>
          </div>
          <SheetDescription className="text-[11px] text-muted-foreground leading-tight">
            Strictly an explanatory interface for active schedule telemetry, tariff arbitrage, and applied directives.
          </SheetDescription>
        </SheetHeader>

        {/* Message Transcript Container */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono"
        >
          {messages.map((msg) => (
            <ChatMessageBubble key={msg.id} message={msg} />
          ))}

          {isGenerating && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 rounded-lg bg-secondary/40 border border-border/40 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-spin" />
              <span>Synthesizing operational telemetry explanation...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-border/40 bg-secondary/20">
          <QuickSuggestionChips
            disabled={isGenerating}
            onSelectPrompt={(p) => handleSendMessage(p)}
          />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-border bg-card space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <Input
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about tariff arbitrage, battery, or directives..."
              className="font-mono text-xs h-9 bg-background"
              disabled={isGenerating}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!inputQuery.trim() || isGenerating}
              className="h-9 px-3 shrink-0 font-mono text-xs gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask</span>
            </Button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Zero client-side solver modifications</span>
            </span>
            <span>GridWise AI Engine v1.0</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
