"use client";

import React from "react";
import { Plus, Trash2, MessageSquareText, Sparkles, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useScenario } from "@/context/ScenarioContext";

const QUICK_CHIPS = [
  {
    label: "20% Solar (1 PM - 3 PM)",
    text: "Solar output will drop to about 20% from 1 PM to 3 PM.",
    type: "solar_reduction",
  },
  {
    label: "No Charge (2 PM - 4 PM)",
    text: "Do not charge the battery between 2 PM and 4 PM.",
    type: "no_charge_window",
  },
  {
    label: "120 kWh Reserve (6 PM - 9 PM)",
    text: "Keep at least 120 kWh in reserve from 6 PM until 9 PM.",
    type: "minimum_battery_reserve",
  },
  {
    label: "Distractor Note",
    text: "The cafeteria menu changes tomorrow.",
    type: "no_op",
  },
];

export function OperatorNotesEditor({ className = "" }: { className?: string }) {
  const { activeRequest, updateOperatorNotes } = useScenario();
  const notes = activeRequest.operator_notes;

  const handleNoteChange = (index: number, newText: string) => {
    const updated = [...notes];
    updated[index] = newText;
    updateOperatorNotes(updated);
  };

  const handleAddNote = () => {
    if (notes.length < 3) {
      updateOperatorNotes([...notes, "New operator shift instruction..."]);
    }
  };

  const handleRemoveNote = (index: number) => {
    if (notes.length > 1) {
      const updated = notes.filter((_, i) => i !== index);
      updateOperatorNotes(updated);
    }
  };

  const handleApplyChip = (text: string) => {
    if (notes.length === 1 && notes[0].includes("New operator")) {
      updateOperatorNotes([text]);
      return;
    }
    if (notes.length < 3) {
      updateOperatorNotes([...notes, text]);
    } else {
      const updated = [...notes];
      updated[updated.length - 1] = text;
      updateOperatorNotes(updated);
    }
  };

  return (
    <div className={`rounded-2xl border border-border bg-card p-4 sm:p-5 md:p-6 space-y-4 shadow-xs ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-secondary/80 border border-border/80 flex items-center justify-center text-[#E5B25D]">
            <MessageSquareText className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-normal text-[11px] text-foreground tracking-[0.12em] uppercase font-mono">
              Operator Directives & Shift Notes
            </h3>
            <p className="text-[10px] text-muted-foreground font-mono">
              Natural language campus instructions (1 to 3 non-empty notes per scenario)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-muted-foreground">
            {notes.length}/3 Notes
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddNote}
            disabled={notes.length >= 3}
            className="h-8 text-xs gap-1 font-mono rounded-full uppercase tracking-wider"
          >
            <Plus className="w-3 h-3" />
            <span>Add Note</span>
          </Button>
        </div>
      </div>

      {/* Notes Inputs */}
      <div className="space-y-3">
        {notes.map((note, idx) => (
          <div
            key={idx}
            className="group relative flex items-start gap-2.5 p-3 rounded-2xl border border-border bg-secondary/20 transition-colors hover:border-strong-border"
          >
            <div className="pt-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary border border-border text-[10px] font-mono font-semibold text-muted-foreground">
                {idx + 1}
              </span>
            </div>

            <div className="flex-1">
              <Textarea
                value={note}
                onChange={(e) => handleNoteChange(idx, e.target.value)}
                placeholder="Enter operator note describing temporary conditions..."
                rows={2}
                className="text-xs font-sans resize-none border-border/80 bg-card/60"
              />
            </div>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleRemoveNote(idx)}
              disabled={notes.length <= 1}
              title={notes.length <= 1 ? "Minimum 1 note required" : "Remove note"}
              aria-label={`Remove note ${idx + 1}`}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 mt-1 rounded-full"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
      </div>

      {/* Quick Suggestions / Chips */}
      <div className="space-y-2 pt-2 border-t border-border/40">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground uppercase tracking-wider font-mono">
          <Lightbulb className="w-3.5 h-3.5 text-[#E5B25D]" />
          <span>Quick Note Templates (Click to insert):</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {QUICK_CHIPS.map((chip, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleApplyChip(chip.text)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-150 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#E5B25D]" />
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
