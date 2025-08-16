import React, { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleOrdinal } from "d3-scale";
import { format } from "d3-format";
import { pollByState, getWinner, getPercentage, Vote, StateId } from "../data/pollData";

// TopoJSON of US states (lower 48 + AK/HI insets) hosted by react-simple-maps
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const CHOICES: Vote[] = ["yes", "no", "depends"];

// Brand-friendly colors matching your theme
const COLOR_BY_WINNER: Record<Vote, string> = {
  yes: "#3487de",      // Blue for Yes
  no: "#f9685f",       // Red for No  
  depends: "#fec75e",  // Yellow for Depends
};

// Light fill colors for states
const FILL_COLORS: Record<Vote, string> = {
  yes: "#d1e7ff",      // Light blue
  no: "#fef2f2",       // Light red
  depends: "#fef7e0",  // Light yellow
};

interface HoverState {
  id: string;
  name: string;
  x: number;
  y: number;
}

interface USPollMapProps {
  onStateClick?: (stateId: string) => void;
  className?: string;
}

export default function USPollMap({ onStateClick, className = "" }: USPollMapProps) {
  const [hover, setHover] = useState<HoverState | null>(null);

  const colorScale = useMemo(
    () =>
      scaleOrdinal<Vote, string>()
        .domain(CHOICES)
        .range(CHOICES.map((k) => COLOR_BY_WINNER[k])),
    []
  );

  const handleMouseEnter = (geo: any, event: any) => {
    const id = geo.properties?.postal as string;
    const name = geo.properties?.name as string;
    
    if (id && name) {
      setHover({
        id,
        name,
        x: event.clientX,
        y: event.clientY
      });
    }
  };

  const handleMouseLeave = () => {
    setHover(null);
  };

  const handleStateClick = (stateId: string) => {
    onStateClick?.(stateId);
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Interactive Map */}
      <ComposableMap 
        projection="geoAlbersUsa" 
        style={{ width: "100%", height: "auto" }}
        projectionConfig={{
          scale: 1000,
          center: [0, 0]
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const id = geo.id as unknown as string;         // e.g. '06'
              const abbrev = geo.properties?.postal as string; // e.g. 'CA'
              const name = geo.properties?.name as string;

              const winner = getWinner(abbrev);
              const fill = winner ? FILL_COLORS[winner] : "#f9fafb"; // Light gray if no data
              const stroke = winner ? COLOR_BY_WINNER[winner] : "#e5e7eb";

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={(event) => handleMouseEnter(geo, event)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleStateClick(abbrev)}
                  style={{
                    default: { 
                      fill, 
                      outline: "none", 
                      stroke: stroke, 
                      strokeWidth: 1.2,
                      cursor: "pointer"
                    },
                    hover: { 
                      fill, 
                      outline: "none", 
                      stroke: stroke,
                      strokeWidth: 2.5,
                      filter: "brightness(1.05)",
                      cursor: "pointer"
                    },
                    pressed: { 
                      fill, 
                      outline: "none",
                      stroke: stroke,
                      strokeWidth: 2
                    },
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${name} – ${winner ?? "no data"}`}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip */}
      {hover && (
        <div
          className="pointer-events-none absolute z-20 rounded-lg bg-white/95 p-4 text-sm shadow-xl ring-1 ring-slate-200 border border-slate-100"
          style={{ 
            left: hover.x + 15, 
            top: hover.y - 15,
            transform: "translateY(-100%)"
          }}
          role="status"
          aria-live="polite"
        >
          <TooltipCard stateId={hover.id} stateName={hover.name} />
        </div>
      )}

      {/* Legend */}
      <Legend />
    </div>
  );
}

function TooltipCard({ stateId, stateName }: { stateId: string; stateName: string }) {
  const row = pollByState[stateId as keyof typeof pollByState];
  if (!row) return (
    <div>
      <div className="mb-2 font-semibold text-gray-800">{stateName}</div>
      <div className="text-gray-500">No data yet</div>
    </div>
  );
  
  const total = row.yes + row.no + row.depends || 1;
  const pct = (n: number) => format(".0f")((n / total) * 100) + "%";
  const winner = getWinner(stateId);

  return (
    <div className="min-w-[200px]">
      <div className="mb-3 font-semibold text-gray-800 text-base">{stateName}</div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swatch color={COLOR_BY_WINNER.yes} />
            <span className="text-gray-700">Yes</span>
          </div>
          <span className="font-medium text-gray-800">{pct(row.yes)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swatch color={COLOR_BY_WINNER.no} />
            <span className="text-gray-700">No</span>
          </div>
          <span className="font-medium text-gray-800">{pct(row.no)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swatch color={COLOR_BY_WINNER.depends} />
            <span className="text-gray-700">Depends</span>
          </div>
          <span className="font-medium text-gray-800">{pct(row.depends)}</span>
        </div>
      </div>
      
      {winner && (
        <div className="mt-3 pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Leading: <span className="font-medium text-gray-700 capitalize">{winner}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Swatch({ color }: { color: string }) {
  return (
    <span 
      className="inline-block h-3 w-3 rounded-sm border border-gray-200" 
      style={{ background: color }} 
    />
  );
}

function Legend() {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-4 text-sm bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-100">
      <span className="font-semibold text-gray-800">Legend:</span>
      
      <div className="flex items-center gap-4">
        <label className="inline-flex items-center gap-2">
          <Swatch color={COLOR_BY_WINNER.yes} />
          <span className="text-gray-700">Yes (Majority)</span>
        </label>
        
        <label className="inline-flex items-center gap-2">
          <Swatch color={COLOR_BY_WINNER.no} />
          <span className="text-gray-700">No (Majority)</span>
        </label>
        
        <label className="inline-flex items-center gap-2">
          <Swatch color={COLOR_BY_WINNER.depends} />
          <span className="text-gray-700">Depends (Majority)</span>
        </label>
      </div>
    </div>
  );
}
