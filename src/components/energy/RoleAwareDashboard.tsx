"use client";

import React from "react";
import { useRole } from "@/hooks/useRole";
import { OperatorView } from "./OperatorView";
import { AnalystView } from "./AnalystView";

export function RoleAwareDashboard() {
  const { role } = useRole();

  return (
    <div className="transition-opacity duration-150">
      {role === "operator" ? <OperatorView /> : <AnalystView />}
    </div>
  );
}
