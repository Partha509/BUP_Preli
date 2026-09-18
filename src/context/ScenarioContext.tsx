"use client";

import React, { createContext, useContext, useState } from "react";
import {
  OptimizeEnergyRequest,
  OptimizeEnergyResponse,
  BatteryParams,
} from "@/lib/types/gridwise";
import {
  getSampleScenario,
  getSampleExpectedOutput,
  DEFAULT_SCENARIO_INPUT,
  DEFAULT_MOCK_RESPONSE,
} from "@/lib/fixtures/sampleScenarios";
import { apiClient } from "@/lib/api/client";

interface ScenarioContextType {
  activeRequest: OptimizeEnergyRequest;
  activeResponse: OptimizeEnergyResponse | null;
  selectedScenarioId: string;
  isLoading: boolean;
  error: string | null;
  useMockFallback: boolean;
  highlightedHours: number[] | null;
  setHighlightedHours: (hours: number[] | null) => void;
  setUseMockFallback: (use: boolean) => void;
  selectScenario: (id: string) => void;
  updateOperatorNotes: (notes: string[]) => void;
  updateBatteryParams: (params: Partial<BatteryParams>) => void;
  executeOptimization: () => Promise<void>;
  resetToDefault: () => void;
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(undefined);

export function ScenarioProvider({ children }: { children: React.ReactNode }) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("GRID-101");
  const [activeRequest, setActiveRequest] = useState<OptimizeEnergyRequest>(
    JSON.parse(JSON.stringify(DEFAULT_SCENARIO_INPUT))
  );
  const [activeResponse, setActiveResponse] = useState<OptimizeEnergyResponse | null>(
    JSON.parse(JSON.stringify(DEFAULT_MOCK_RESPONSE))
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [useMockFallback, setUseMockFallback] = useState<boolean>(false); // Default false for production live backend optimization
  const [highlightedHours, setHighlightedHours] = useState<number[] | null>(null);

  /**
   * Scenario switching updates the request input.
   * Scenario switching must NEVER perform local energy optimization or directive solving.
   * During UI development, mock API responses may be used for visualization;
   * in production, optimization always calls POST /optimize-energy.
   */
  const selectScenario = (id: string) => {
    const scenario = getSampleScenario(id);
    if (scenario) {
      setSelectedScenarioId(id);
      setActiveRequest(scenario);
      setError(null);

      if (useMockFallback) {
        // Load pre-calculated canonical mock response for instant offline UI visualization
        const mockOutput = getSampleExpectedOutput(id);
        setActiveResponse(mockOutput || null);
      } else {
        // Clear active response until user clicks 'Optimize Energy' to call POST /optimize-energy
        setActiveResponse(null);
      }
    }
  };

  const updateOperatorNotes = (notes: string[]) => {
    setActiveRequest((prev) => ({
      ...prev,
      operator_notes: notes,
    }));
  };

  const updateBatteryParams = (params: Partial<BatteryParams>) => {
    setActiveRequest((prev) => ({
      ...prev,
      battery: {
        ...prev.battery,
        ...params,
      },
    }));
  };

  /**
   * Primary Optimization Execution:
   * Production optimization must always call POST /optimize-energy.
   * If useMockFallback is enabled and backend is unreachable, loads the static mock response.
   */
  const executeOptimization = async () => {
    setIsLoading(true);
    setError(null);

    // If offline mock mode is active, simulate network trip and return static expected response
    if (useMockFallback) {
      setTimeout(() => {
        const mock = getSampleExpectedOutput(selectedScenarioId) || DEFAULT_MOCK_RESPONSE;
        // Echo current request scenario_id
        setActiveResponse({
          ...mock,
          scenario_id: activeRequest.scenario_id,
        });
        setIsLoading(false);
      }, 500);
      return;
    }

    try {
      const data = await apiClient.optimizeEnergy(activeRequest);
      setActiveResponse(data);
    } catch (err: any) {
      setError(err.message || "Failed to communicate with backend optimizer.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefault = () => {
    selectScenario("GRID-101");
  };

  return (
    <ScenarioContext.Provider
      value={{
        activeRequest,
        activeResponse,
        selectedScenarioId,
        isLoading,
        error,
        useMockFallback,
        highlightedHours,
        setHighlightedHours,
        setUseMockFallback,
        selectScenario,
        updateOperatorNotes,
        updateBatteryParams,
        executeOptimization,
        resetToDefault,
      }}
    >
      {children}
    </ScenarioContext.Provider>
  );
}

export function useScenario() {
  const context = useContext(ScenarioContext);
  if (!context) {
    throw new Error("useScenario must be used within a ScenarioProvider");
  }
  return context;
}
