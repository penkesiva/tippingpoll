export type Vote = "yes" | "no" | "depends";
export type StateId = string; // e.g. 'TX', 'CA'

export const pollByState: Record<StateId, { yes: number; no: number; depends: number }> = {
  // West Coast
  CA: { yes: 48, no: 42, depends: 10 },
  OR: { yes: 55, no: 35, depends: 10 },
  WA: { yes: 58, no: 32, depends: 10 },
  
  // Southwest
  AZ: { yes: 45, no: 45, depends: 10 },
  NM: { yes: 42, no: 48, depends: 10 },
  NV: { yes: 42, no: 48, depends: 10 },
  UT: { yes: 35, no: 55, depends: 10 },
  
  // Mountain States
  CO: { yes: 65, no: 25, depends: 10 },
  MT: { yes: 62, no: 28, depends: 10 },
  WY: { yes: 58, no: 32, depends: 10 },
  ID: { yes: 38, no: 52, depends: 10 },
  
  // Alaska & Hawaii
  AK: { yes: 45, no: 40, depends: 15 },
  HI: { yes: 52, no: 35, depends: 13 },
  
  // Northern Plains
  ND: { yes: 55, no: 35, depends: 10 },
  SD: { yes: 52, no: 38, depends: 10 },
  NE: { yes: 48, no: 42, depends: 10 },
  KS: { yes: 45, no: 45, depends: 10 },
  
  // Midwest
  MN: { yes: 62, no: 28, depends: 10 },
  IA: { yes: 55, no: 35, depends: 10 },
  MO: { yes: 42, no: 48, depends: 10 },
  IL: { yes: 58, no: 32, depends: 10 },
  WI: { yes: 62, no: 28, depends: 10 },
  MI: { yes: 55, no: 35, depends: 10 },
  
  // Great Lakes
  OH: { yes: 48, no: 42, depends: 10 },
  IN: { yes: 45, no: 45, depends: 10 },
  KY: { yes: 42, no: 48, depends: 10 },
  TN: { yes: 38, no: 52, depends: 10 },
  
  // Southeast
  AR: { yes: 35, no: 55, depends: 10 },
  LA: { yes: 38, no: 52, depends: 10 },
  MS: { yes: 32, no: 58, depends: 10 },
  AL: { yes: 35, no: 55, depends: 10 },
  GA: { yes: 42, no: 48, depends: 10 },
  FL: { yes: 45, no: 45, depends: 10 },
  SC: { yes: 42, no: 48, depends: 10 },
  NC: { yes: 45, no: 45, depends: 10 },
  
  // Northeast
  VA: { yes: 52, no: 38, depends: 10 },
  WV: { yes: 38, no: 52, depends: 10 },
  MD: { yes: 58, no: 32, depends: 10 },
  DE: { yes: 55, no: 35, depends: 10 },
  PA: { yes: 65, no: 25, depends: 10 },
  NJ: { yes: 62, no: 28, depends: 10 },
  NY: { yes: 68, no: 22, depends: 10 },
  CT: { yes: 58, no: 32, depends: 10 },
  RI: { yes: 55, no: 35, depends: 10 },
  MA: { yes: 65, no: 25, depends: 10 },
  VT: { yes: 68, no: 22, depends: 10 },
  NH: { yes: 62, no: 28, depends: 10 },
  ME: { yes: 65, no: 25, depends: 10 },
  
  // Texas (big state, gets its own category)
  TX: { yes: 25, no: 65, depends: 10 },
  OK: { yes: 38, no: 52, depends: 10 }
};

// Helper function to get winner for a state
export function getWinner(stateId: StateId): Vote | null {
  const row = pollByState[stateId];
  if (!row) return null;
  
  const entries = Object.entries(row) as [Vote, number][];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0]; // highest count
}

// Helper function to get percentage for a state
export function getPercentage(stateId: StateId, voteType: Vote): number {
  const row = pollByState[stateId];
  if (!row) return 0;
  
  const total = row.yes + row.no + row.depends;
  if (total === 0) return 0;
  
  return Math.round((row[voteType] / total) * 100);
}
