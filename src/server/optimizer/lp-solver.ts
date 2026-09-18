/**
 * Two-Phase Simplex Linear Programming (LP) Solver
 * Solves: Minimize c^T x
 * Subject to:
 *   A_eq * x = b_eq
 *   A_ub * x <= b_ub
 *   x >= 0
 *
 * Deterministic, self-contained, with zero external binary dependencies.
 */

export interface LpResult {
  status: "optimal" | "infeasible" | "unbounded" | "max_iterations";
  objectiveValue: number;
  solution: number[];
}

export class LpSolver {
  private static readonly EPSILON = 1e-9;
  private static readonly MAX_ITERATIONS = 10000;

  /**
   * Solves standard linear program:
   * Minimize c^T x
   * s.t. A_eq * x = b_eq (all b_eq >= 0)
   *      A_ub * x <= b_ub (all b_ub >= 0)
   *      x >= 0
   */
  public static solve(
    c: number[],
    A_eq: number[][],
    b_eq: number[],
    A_ub: number[][],
    b_ub: number[]
  ): LpResult {
    const numOrigVars = c.length;
    const numEq = b_eq.length;
    const numUb = b_ub.length;
    const numRows = numEq + numUb;

    // Convert constraints to all positive RHS (b >= 0)
    const eqA: number[][] = [];
    const eqB: number[] = [];
    for (let i = 0; i < numEq; i++) {
      let row = [...A_eq[i]];
      let rhs = b_eq[i];
      if (rhs < -this.EPSILON) {
        row = row.map((v) => -v);
        rhs = -rhs;
      }
      eqA.push(row);
      eqB.push(rhs);
    }

    const ubA: number[][] = [];
    const ubB: number[] = [];
    for (let i = 0; i < numUb; i++) {
      let row = [...A_ub[i]];
      let rhs = b_ub[i];
      if (rhs < -this.EPSILON) {
        // If b_ub < 0, multiplying by -1 turns it into >= constraint: -A*x >= -b
        // In our energy system, b_ub represents capacities/rates which are always >= 0.
        row = row.map((v) => -v);
        rhs = -rhs;
      }
      ubA.push(row);
      ubB.push(rhs);
    }

    // Number of slack variables for A_ub * x <= b_ub is numUb
    // Total structural + slack variables:
    const numCols = numOrigVars + numUb;

    // Build the constraint matrix A (numRows x numCols) and RHS b (numRows)
    // Structure:
    // Rows 0..numEq-1: eqA (no slack, will need artificial)
    // Rows numEq..numRows-1: ubA with slack variables
    const A: number[][] = [];
    const b: number[] = [];

    for (let i = 0; i < numEq; i++) {
      const row = new Array(numCols).fill(0);
      for (let j = 0; j < numOrigVars; j++) {
        row[j] = eqA[i][j];
      }
      A.push(row);
      b.push(eqB[i]);
    }

    for (let i = 0; i < numUb; i++) {
      const row = new Array(numCols).fill(0);
      for (let j = 0; j < numOrigVars; j++) {
        row[j] = ubA[i][j];
      }
      // Add slack variable (+1) for <= constraint
      row[numOrigVars + i] = 1.0;
      A.push(row);
      b.push(ubB[i]);
    }

    // Identify which rows need artificial variables (the equality constraints)
    const artificialRows: number[] = [];
    for (let i = 0; i < numEq; i++) {
      artificialRows.push(i);
    }

    // PHASE 1: Find feasible initial basis
    const numArtificial = artificialRows.length;
    let basis: number[] = [];

    // For rows with slack variables, the slack variable is the initial basic variable
    for (let i = 0; i < numUb; i++) {
      // Basis index for slack of row numEq + i:
      // We will assemble basis after artificial columns are appended
    }

    if (numArtificial > 0) {
      // Build Phase 1 Tableau
      // Cols: [numCols variables] [numArtificial variables] [RHS]
      const p1TotalCols = numCols + numArtificial + 1;
      const tableau: number[][] = [];

      for (let i = 0; i < numRows; i++) {
        const row = new Array(p1TotalCols).fill(0);
        for (let j = 0; j < numCols; j++) {
          row[j] = A[i][j];
        }
        // Set RHS
        row[p1TotalCols - 1] = b[i];
        tableau.push(row);
      }

      // Add artificial variables (+1 in their respective rows)
      basis = new Array(numRows);
      for (let aIdx = 0; aIdx < numArtificial; aIdx++) {
        const r = artificialRows[aIdx];
        const artCol = numCols + aIdx;
        tableau[r][artCol] = 1.0;
        basis[r] = artCol;
      }

      // Basis for slack rows
      for (let i = 0; i < numUb; i++) {
        const r = numEq + i;
        const slackCol = numOrigVars + i;
        basis[r] = slackCol;
      }

      // Objective Row for Phase 1: Minimize sum of artificial variables
      // z = sum_{a} a_i => z - sum_{a} a_i = 0
      // In tableau, express z in terms of non-basic variables by row reduction:
      const objRow = new Array(p1TotalCols).fill(0);
      for (let aIdx = 0; aIdx < numArtificial; aIdx++) {
        const r = artificialRows[aIdx];
        for (let cIdx = 0; cIdx < p1TotalCols; cIdx++) {
          objRow[cIdx] -= tableau[r][cIdx];
        }
      }
      tableau.push(objRow);

      // Solve Phase 1
      const p1Status = this.simplexLoop(tableau, basis, p1TotalCols - 1);
      if (p1Status === "max_iterations") {
        return { status: "max_iterations", objectiveValue: 0, solution: [] };
      }

      const p1Obj = -tableau[tableau.length - 1][p1TotalCols - 1];
      if (p1Obj > this.EPSILON) {
        return { status: "infeasible", objectiveValue: 0, solution: [] };
      }

      // Phase 1 succeeded!
      // Construct Phase 2 Tableau by removing artificial columns and resetting objective row
      const p2TotalCols = numCols + 1;
      const p2Tableau: number[][] = [];

      for (let i = 0; i < numRows; i++) {
        const row = new Array(p2TotalCols).fill(0);
        for (let j = 0; j < numCols; j++) {
          row[j] = tableau[i][j];
        }
        row[p2TotalCols - 1] = tableau[i][p1TotalCols - 1]; // RHS
        p2Tableau.push(row);
      }

      // Build Phase 2 Objective: Minimize sum(c_j * x_j)
      // objRow = c_j for structural, 0 for slack
      const p2ObjRow = new Array(p2TotalCols).fill(0);
      for (let j = 0; j < numOrigVars; j++) {
        p2ObjRow[j] = c[j];
      }

      // Canonicalize objective row with respect to current basis
      for (let i = 0; i < numRows; i++) {
        const basicVar = basis[i];
        if (basicVar < numCols) {
          const cost = basicVar < numOrigVars ? c[basicVar] : 0;
          if (Math.abs(cost) > this.EPSILON) {
            for (let j = 0; j < p2TotalCols; j++) {
              p2ObjRow[j] -= cost * p2Tableau[i][j];
            }
          }
        }
      }
      p2Tableau.push(p2ObjRow);

      // Solve Phase 2
      const p2Status = this.simplexLoop(p2Tableau, basis, p2TotalCols - 1);
      if (p2Status !== "optimal") {
        return { status: p2Status, objectiveValue: 0, solution: [] };
      }

      // Extract solution
      const sol = new Array(numOrigVars).fill(0);
      for (let i = 0; i < numRows; i++) {
        if (basis[i] < numOrigVars) {
          sol[basis[i]] = Math.max(0, p2Tableau[i][p2TotalCols - 1]);
        }
      }

      const finalObj = -p2Tableau[p2Tableau.length - 1][p2TotalCols - 1];
      return {
        status: "optimal",
        objectiveValue: finalObj,
        solution: sol,
      };
    } else {
      // No artificial variables needed; solve directly
      basis = [];
      for (let i = 0; i < numUb; i++) {
        basis.push(numOrigVars + i);
      }

      const totalCols = numCols + 1;
      const tableau: number[][] = [];
      for (let i = 0; i < numRows; i++) {
        const row = new Array(totalCols).fill(0);
        for (let j = 0; j < numCols; j++) {
          row[j] = A[i][j];
        }
        row[totalCols - 1] = b[i];
        tableau.push(row);
      }

      const objRow = new Array(totalCols).fill(0);
      for (let j = 0; j < numOrigVars; j++) {
        objRow[j] = c[j];
      }
      tableau.push(objRow);

      const status = this.simplexLoop(tableau, basis, totalCols - 1);
      if (status !== "optimal") {
        return { status, objectiveValue: 0, solution: [] };
      }

      const sol = new Array(numOrigVars).fill(0);
      for (let i = 0; i < numRows; i++) {
        if (basis[i] < numOrigVars) {
          sol[basis[i]] = Math.max(0, tableau[i][totalCols - 1]);
        }
      }

      return {
        status: "optimal",
        objectiveValue: -tableau[tableau.length - 1][totalCols - 1],
        solution: sol,
      };
    }
  }

  private static simplexLoop(
    tableau: number[][],
    basis: number[],
    rhsCol: number
  ): "optimal" | "unbounded" | "max_iterations" {
    const numRows = tableau.length - 1;
    const objRowIdx = numRows;

    let iteration = 0;
    while (iteration++ < this.MAX_ITERATIONS) {
      // Find entering column (most negative reduced cost)
      let enterCol = -1;
      let minVal = -this.EPSILON;

      for (let j = 0; j < rhsCol; j++) {
        if (tableau[objRowIdx][j] < minVal) {
          minVal = tableau[objRowIdx][j];
          enterCol = j;
        }
      }

      // If no negative reduced cost, optimal solution reached
      if (enterCol === -1) {
        return "optimal";
      }

      // Minimum ratio test to find leaving row
      let leaveRow = -1;
      let minRatio = Infinity;

      for (let i = 0; i < numRows; i++) {
        const pivotVal = tableau[i][enterCol];
        if (pivotVal > this.EPSILON) {
          const ratio = tableau[i][rhsCol] / pivotVal;
          if (ratio < minRatio - this.EPSILON) {
            minRatio = ratio;
            leaveRow = i;
          }
        }
      }

      // If no valid pivot row, problem is unbounded
      if (leaveRow === -1) {
        return "unbounded";
      }

      // Pivot operation
      const pivot = tableau[leaveRow][enterCol];
      for (let j = 0; j <= rhsCol; j++) {
        tableau[leaveRow][j] /= pivot;
      }
      tableau[leaveRow][enterCol] = 1.0;

      for (let i = 0; i <= numRows; i++) {
        if (i !== leaveRow) {
          const factor = tableau[i][enterCol];
          if (Math.abs(factor) > this.EPSILON) {
            for (let j = 0; j <= rhsCol; j++) {
              tableau[i][j] -= factor * tableau[leaveRow][j];
            }
            tableau[i][enterCol] = 0.0;
          }
        }
      }

      basis[leaveRow] = enterCol;
    }

    return "max_iterations";
  }
}
