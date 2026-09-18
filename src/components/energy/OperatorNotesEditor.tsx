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
    // If there's an empty or generic note, replace it; otherwise add or overwrite the last note
    if (notes.length === 1 && notes[0].includes("New operator")) {
      updateOperatorNotes([text]);
      return;
    }
    if (notes.length < 3) {
      updateOperatorNotes([...notes, text]);
    } else {
      // Overwrite the last note
      const updated = [...notes];
      updated[updated.length - 1] = text;
      updateOperatorNotes(updated);
    }
  };

  return (
    <div className={`rounded-xl border border-border bg-card p-5 md:p-6 space-y-5 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10 text-primary">
            <MessageSquareText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Operator Directives & Shift Notes</h3>
            <p className="text-xs text-muted-foreground">
              Natural language campus instructions (1 to 3 non-empty notes per scenario)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {notes.length}/3 Notes
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddNote}
            disabled={notes.length >= 3}
            className="h-8 text-xs gap-1 font-mono"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Note</span>
          </Button>
        </div>
      </div>

      {/* Notes Inputs */}
      <div className="space-y-3">
        {notes.map((note, idx) => (
          <div
            key={idx}
            className="group relative flex items-start gap-2 p-3 rounded-lg border border-border bg-secondary/20 transition-colors hover:border-primary/30"
          >
            <div className="pt-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary border border-border text-[10px] font-mono font-bold text-muted-foreground">
                {idx + 1}
              </span>
            </div>

            <div className="flex-1">
              <Textarea
                value={note}
                onChange={(e) => handleNoteChange(idx, e.target.value)}
                placeholder="Enter operator note describing temporary conditions..."
                rows={2}
                className="text-xs font-sans resize-none border-border/80 focus-visible:ring-primary/40 bg-card"
              />
            </div>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleRemoveNote(idx)}
              disabled={notes.length <= 1}
              title={notes.length <= 1 ? "Minimum 1 note required" : "Remove note"}
              aria-label={`Remove note ${idx + 1}`}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 mt-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
      </div>

      {/* Quick Suggestions / Chips */}
      <div className="space-y-2 pt-1 border-t border-border/40">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Note Templates (Click to insert):</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {QUICK_CHIPS.map((chip, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleApplyChip(chip.text)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border border-border bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-150 active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-primary" />
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
