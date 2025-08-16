// Poll data for all 50 US states
const pollByState = {
  "AL": { yes: 45, no: 35, depends: 20 },
  "AK": { yes: 30, no: 50, depends: 20 },
  "AZ": { yes: 55, no: 25, depends: 20 },
  "AR": { yes: 40, no: 40, depends: 20 },
  "CA": { yes: 60, no: 20, depends: 20 },
  "CO": { yes: 50, no: 30, depends: 20 },
  "CT": { yes: 45, no: 35, depends: 20 },
  "DE": { yes: 40, no: 40, depends: 20 },
  "FL": { yes: 55, no: 25, depends: 20 },
  "GA": { yes: 45, no: 35, depends: 20 },
  "HI": { yes: 50, no: 30, depends: 20 },
  "ID": { yes: 35, no: 45, depends: 20 },
  "IL": { yes: 55, no: 25, depends: 20 },
  "IN": { yes: 40, no: 40, depends: 20 },
  "IA": { yes: 35, no: 45, depends: 20 },
  "KS": { yes: 35, no: 45, depends: 20 },
  "KY": { yes: 40, no: 40, depends: 20 },
  "LA": { yes: 50, no: 30, depends: 20 },
  "ME": { yes: 45, no: 35, depends: 20 },
  "MD": { yes: 50, no: 30, depends: 20 },
  "MA": { yes: 55, no: 25, depends: 20 },
  "MI": { yes: 45, no: 35, depends: 20 },
  "MN": { yes: 50, no: 30, depends: 20 },
  "MS": { yes: 40, no: 40, depends: 20 },
  "MO": { yes: 40, no: 40, depends: 20 },
  "MT": { yes: 35, no: 45, depends: 20 },
  "NE": { yes: 35, no: 45, depends: 20 },
  "NV": { yes: 50, no: 30, depends: 20 },
  "NH": { yes: 45, no: 35, depends: 20 },
  "NJ": { yes: 55, no: 25, depends: 20 },
  "NM": { yes: 45, no: 35, depends: 20 },
  "NY": { yes: 60, no: 20, depends: 20 },
  "NC": { yes: 45, no: 35, depends: 20 },
  "ND": { yes: 35, no: 45, depends: 20 },
  "OH": { yes: 40, no: 40, depends: 20 },
  "OK": { yes: 35, no: 45, depends: 20 },
  "OR": { yes: 50, no: 30, depends: 20 },
  "PA": { yes: 45, no: 35, depends: 20 },
  "RI": { yes: 50, no: 30, depends: 20 },
  "SC": { yes: 45, no: 35, depends: 20 },
  "SD": { yes: 35, no: 45, depends: 20 },
  "TN": { yes: 40, no: 40, depends: 20 },
  "TX": { yes: 45, no: 35, depends: 20 },
  "UT": { yes: 40, no: 40, depends: 20 },
  "VT": { yes: 45, no: 35, depends: 20 },
  "VA": { yes: 45, no: 35, depends: 20 },
  "WA": { yes: 55, no: 25, depends: 20 },
  "WV": { yes: 35, no: 45, depends: 20 },
  "WI": { yes: 40, no: 40, depends: 20 },
  "WY": { yes: 35, no: 45, depends: 20 }
};

// Helper function to get winner for a state
function getWinner(stateId) {
  const stateData = pollByState[stateId];
  if (!stateData) return null;
  
  const { yes, no, depends } = stateData;
  if (yes > no && yes > depends) return "yes";
  if (no > yes && no > depends) return "no";
  if (depends > yes && depends > no) return "depends";
  return "yes"; // Default to yes if tied
}

// Brand-friendly colors matching your theme
const COLOR_BY_WINNER = {
  yes: "#3487de",      // Blue for Yes
  no: "#f9685f",       // Red for No  
  depends: "#000000",  // Black for Depends (as requested)
};

// TopoJSON of US states (lower 48 + AK/HI insets) hosted by react-simple-maps
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Main US Poll Map component using react-simple-maps
function USPollMap() {
  const [hover, setHover] = React.useState(null);
  const [geographies, setGeographies] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Fetch the TopoJSON data and convert to GeoJSON
  React.useEffect(() => {
    console.log('Fetching TopoJSON data from:', geoUrl);
    setLoading(true);
    
    // First load topojson-client from CDN
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/topojson-client@3';
    script.onload = () => {
      console.log('topojson-client loaded from CDN');
      
      // Now fetch the TopoJSON data
      fetch(geoUrl)
        .then(res => {
          console.log('TopoJSON response status:', res.status);
          if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          return res.json();
        })
        .then(topology => {
          console.log('TopoJSON data loaded:', topology);
          console.log('States found:', topology.objects?.states?.geometries?.length || 0);
          
          // Convert TopoJSON to GeoJSON using topojson-client from CDN
          try {
            if (window.topojson && window.topojson.feature) {
              const geojson = window.topojson.feature(topology, topology.objects.states);
              console.log('GeoJSON converted successfully:', geojson);
              console.log('Features count:', geojson.features.length);
              
              if (geojson.features.length > 0) {
                console.log('First feature example:', geojson.features[0]);
              }
              
              setGeographies(geojson.features);
              setLoading(false);
            } else {
              throw new Error('topojson-client not available');
            }
          } catch (err) {
            console.error('Error converting TopoJSON to GeoJSON:', err);
            setError('Failed to process map data');
            setLoading(false);
          }
        })
        .catch(err => {
          console.error('Error loading map data:', err);
          setError(err.message);
          setLoading(false);
        });
    };
    
    script.onerror = () => {
      console.error('Failed to load topojson-client from CDN');
      setError('Failed to load map processing library');
      setLoading(false);
    };
    
    document.head.appendChild(script);
  }, []);

  const colorScale = React.useMemo(
    () => {
      const choices = ["yes", "no", "depends"];
      const colors = choices.map(k => COLOR_BY_WINNER[k]);
      return (voteType) => colors[choices.indexOf(voteType)] || "#e5e7eb";
    },
    []
  );

  // If loading, show loading state
  if (loading) {
    return React.createElement('div', { className: 'relative w-full' },
      React.createElement('div', { className: 'us-map-container' },
        React.createElement('div', { 
          className: 'flex items-center justify-center h-64 text-gray-600'
        },
          React.createElement('div', { className: 'text-center' },
            React.createElement('div', { className: 'text-lg font-medium mb-2' }, 'Loading US Map...'),
            React.createElement('div', { className: 'text-sm' }, 'Fetching state boundaries...')
          )
        )
      )
    );
  }

  // If error, show error state with fallback map
  if (error) {
    console.log('Showing fallback map due to error:', error);
    return React.createElement('div', { className: 'relative w-full' },
      React.createElement('div', { className: 'us-map-container' },
        React.createElement('svg', { 
          viewBox: '0 0 1000 600', 
          className: 'w-full h-auto',
          style: { width: '100%', height: 'auto' }
        },
          React.createElement('g', { className: 'states' },
            // Fallback: Create a simple US outline with major states
            React.createElement('path', {
              d: 'M100,100 L900,100 L900,500 L100,500 Z',
              fill: 'none',
              stroke: '#e5e7eb',
              strokeWidth: '2',
              className: 'us-outline'
            }),
            // Add some major state shapes as examples
            React.createElement('path', {
              d: 'M150,150 L300,150 L300,250 L150,250 Z',
              className: 'state',
              'data-state': 'CA',
              fill: getWinner("CA") ? colorScale(getWinner("CA")) : "#f9fafb",
              stroke: getWinner("CA") ? COLOR_BY_WINNER[getWinner("CA")] : "#e5e7eb",
              strokeWidth: '1.2',
              style: { cursor: 'pointer' },
              onMouseEnter: () => setHover({ id: 'CA', name: 'California' }),
              onMouseLeave: () => setHover(null),
              onClick: () => console.log('California clicked')
            }),
            React.createElement('text', { x: '225', y: '200', className: 'state-label' }, 'CA'),
            
            React.createElement('path', {
              d: 'M400,200 L600,200 L600,350 L400,350 Z',
              className: 'state',
              'data-state': 'TX',
              fill: getWinner("TX") ? colorScale(getWinner("TX")) : "#f9fafb",
              stroke: getWinner("TX") ? COLOR_BY_WINNER[getWinner("TX")] : "#e5e7eb",
              strokeWidth: '1.2',
              style: { cursor: 'pointer' },
              onMouseEnter: () => setHover({ id: 'TX', name: 'Texas' }),
              onMouseLeave: () => setHover(null),
              onClick: () => console.log('Texas clicked')
            }),
            React.createElement('text', { x: '500', y: '275', className: 'state-label' }, 'TX'),
            
            React.createElement('text', {
              x: '500',
              y: '450',
              className: 'text-center text-sm text-gray-500',
              textAnchor: 'middle'
            }, 'Fallback map - TopoJSON data failed to load')
          )
        )
      ),
      
      // Legend
      React.createElement('div', { 
        className: 'mt-6 flex flex-wrap items-center gap-4 text-sm bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-100'
      },
        React.createElement('span', { className: 'font-semibold text-gray-800' }, 'Legend:'),
        React.createElement('div', { className: 'flex items-center gap-4' },
          React.createElement('label', { className: 'inline-flex items-center gap-2' },
            React.createElement('span', { 
              className: 'inline-block h-3 w-3 rounded-sm border border-gray-200',
              style: { background: COLOR_BY_WINNER.yes }
            }),
            React.createElement('span', { className: 'text-gray-700' }, 'Yes (Majority)')
          ),
          React.createElement('label', { className: 'inline-flex items-center gap-2' },
            React.createElement('span', { 
              className: 'inline-block h-3 w-3 rounded-sm border border-gray-200',
              style: { background: COLOR_BY_WINNER.no }
            }),
            React.createElement('span', { className: 'text-gray-700' }, 'No (Majority)')
          ),
          React.createElement('label', { className: 'inline-flex items-center gap-2' },
            React.createElement('span', { 
              className: 'inline-block h-3 w-3 rounded-sm border border-gray-200',
              style: { background: COLOR_BY_WINNER.depends }
            }),
            React.createElement('span', { className: 'text-gray-700' }, 'Depends (Majority)')
          )
        )
      )
    );
  }

  return React.createElement('div', { className: 'relative w-full' },
    // Tooltip
    hover && React.createElement('div', {
      className: 'pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-lg bg-white/95 p-3 text-sm shadow-lg ring-1 ring-slate-200',
      style: { left: '50%', top: 0 },
      role: 'status',
      'aria-live': 'polite'
    }, React.createElement(TooltipCard, { stateId: hover.id, stateName: hover.name })),

    // Debug info
    React.createElement('div', { 
      className: 'mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm'
    },
      React.createElement('div', { className: 'font-semibold mb-2' }, 'Map Debug Info:'),
      React.createElement('div', {}, `Geographies loaded: ${geographies.length}`),
      React.createElement('div', {}, `Loading state: ${loading}`),
      React.createElement('div', {}, `Error state: ${error || 'none'}`)
    ),

    // Map Container
    React.createElement('div', { className: 'us-map-container' },
      React.createElement('svg', { 
        viewBox: '0 0 1000 600', 
        className: 'w-full h-auto',
        style: { width: '100%', height: 'auto' }
      },
        React.createElement('g', { className: 'states' },
          (() => {
            console.log('Starting to render states. Total geographies:', geographies.length);
            
            const renderedStates = geographies.map((feature) => {
              const properties = feature.properties;
              const geometry = feature.geometry;
              
              // Get state abbreviation from properties
              let abbrev = properties?.postal || properties?.STUSPS || properties?.abbrev;
              let name = properties?.name || properties?.NAME || properties?.state;
              
              if (!abbrev) {
                // Fallback to ID if no postal code found
                const stateIdMapping = {
                  "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA",
                  "08": "CO", "09": "CT", "10": "DE", "11": "DC", "12": "FL",
                  "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN",
                  "19": "IA", "20": "KS", "21": "KY", "22": "LA", "23": "ME",
                  "24": "MD", "25": "MA", "26": "MI", "27": "MN", "28": "MS",
                  "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH",
                  "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND",
                  "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI",
                  "45": "SC", "46": "SD", "47": "TN", "48": "TX", "49": "UT",
                  "50": "VT", "51": "VA", "53": "WA", "54": "WV", "55": "WI", "56": "WY"
                };
                abbrev = stateIdMapping[feature.id] || `ID${feature.id}`;
                name = name || `State ${feature.id}`;
              }
               
              if (!abbrev) {
                console.log('Skipping geometry without postal code:', feature);
                return null;
              }
              
              const w = getWinner(abbrev);
              const fill = w ? colorScale(w) : "#f9fafb";
              
              let pathData = '';
              
              try {
                // Now we have proper GeoJSON coordinates
                if (geometry.type === 'Polygon') {
                  const coordinates = geometry.coordinates[0]; // First ring
                  if (coordinates && coordinates.length > 0) {
                    // Start with the first point
                    let path = `M ${coordinates[0][0] * 2 + 100} ${coordinates[0][1] * 2 + 100}`;
                    
                    // Add line segments for the rest of the points
                    for (let i = 1; i < coordinates.length; i++) {
                      path += ` L ${coordinates[i][0] * 2 + 100} ${coordinates[i][1] * 2 + 100}`;
                    }
                    
                    // Close the path
                    path += ' Z';
                    pathData = path;
                  }
                  
                } else if (geometry.type === 'MultiPolygon') {
                  // Handle multiple polygons
                  let path = '';
                  
                  geometry.coordinates.forEach((polygon, polyIndex) => {
                    const ring = polygon[0]; // First ring of each polygon
                    if (ring && ring.length > 0) {
                      if (polyIndex === 0) {
                        path = `M ${ring[0][0] * 2 + 100} ${ring[0][1] * 2 + 100}`;
                      } else {
                        path += ` M ${ring[0][0] * 2 + 100} ${ring[0][1] * 2 + 100}`;
                      }
                      
                      // Add line segments for the rest of the points
                      for (let i = 1; i < ring.length; i++) {
                        path += ` L ${ring[i][0] * 2 + 100} ${ring[i][1] * 2 + 100}`;
                      }
                      
                      // Close the path
                      path += ' Z';
                    }
                  });
                  
                  pathData = path;
                }
                
                // Debug: log the first few states to see what's happening
                if (abbrev === 'CA' || abbrev === 'TX' || abbrev === 'NY') {
                  console.log(`State ${abbrev}:`, {
                    type: geometry.type,
                    coordinates: geometry.coordinates,
                    pathData: pathData,
                    fill: fill
                  });
                }
                
              } catch (err) {
                console.error('Error processing coordinates for', abbrev, err);
                return null;
              }
              
              if (!pathData) {
                console.log('No path data generated for', abbrev);
                return null;
              }
              
              return React.createElement('path', {
                key: feature.id,
                d: pathData,
                className: 'state',
                'data-state': abbrev,
                fill: fill,
                stroke: w ? COLOR_BY_WINNER[w] : "#e5e7eb",
                strokeWidth: '1.2',
                style: { cursor: 'pointer' },
                onMouseEnter: () => setHover({ id: abbrev, name }),
                onMouseLeave: () => setHover(null),
                onClick: () => console.log(`${name} clicked`)
              });
            }).filter(Boolean);
            
            console.log('Successfully rendered states:', renderedStates.length);
            return renderedStates;
          })()
        )
      )
    ),
    
    // Legend
    React.createElement('div', { 
      className: 'mt-6 flex flex-wrap items-center gap-4 text-sm bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-100'
    },
      React.createElement('span', { className: 'font-semibold text-gray-800' }, 'Legend:'),
      React.createElement('div', { className: 'flex items-center gap-4' },
        React.createElement('label', { className: 'inline-flex items-center gap-2' },
          React.createElement('span', { 
            className: 'inline-block h-3 w-3 rounded-sm border border-gray-200',
            style: { background: COLOR_BY_WINNER.yes }
          }),
          React.createElement('span', { className: 'text-gray-700' }, 'Yes (Majority)')
        ),
        React.createElement('label', { className: 'inline-flex items-center gap-2' },
          React.createElement('span', { 
            className: 'inline-block h-3 w-3 rounded-sm border border-gray-200',
            style: { background: COLOR_BY_WINNER.no }
          }),
          React.createElement('span', { className: 'text-gray-700' }, 'No (Majority)')
        ),
        React.createElement('label', { className: 'inline-flex items-center gap-2' },
          React.createElement('span', { 
            className: 'inline-block h-3 w-3 rounded-sm border border-gray-200',
            style: { background: COLOR_BY_WINNER.depends }
          }),
          React.createElement('span', { className: 'text-gray-700' }, 'Depends (Majority)')
        )
      )
    )
  );
}

// Tooltip component
function TooltipCard({ stateId, stateName }) {
  const row = pollByState[stateId];
  if (!row) return React.createElement('div', {}, 
    React.createElement('b', {}, stateName),
    React.createElement('div', {}, 'No data yet')
  );
  
  const total = row.yes + row.no + row.depends || 1;
  const pct = (n) => Math.round((n / total) * 100) + "%";
  const winner = getWinner(stateId);

  return React.createElement('div', {},
    React.createElement('div', { className: 'mb-1 font-semibold' }, stateName),
    React.createElement('div', { className: 'flex items-center gap-2' },
      React.createElement(Swatch, { color: COLOR_BY_WINNER.yes }),
      React.createElement('span', {}, 'Yes: ' + pct(row.yes))
    ),
    React.createElement('div', { className: 'flex items-center gap-2' },
      React.createElement(Swatch, { color: COLOR_BY_WINNER.no }),
      React.createElement('span', {}, 'No: ' + pct(row.no))
    ),
    React.createElement('div', { className: 'flex items-center gap-2' },
      React.createElement(Swatch, { color: COLOR_BY_WINNER.depends }),
      React.createElement('span', {}, 'Depends: ' + pct(row.depends))
    ),
    winner && React.createElement('div', { className: 'mt-1 text-xs text-slate-500' }, 
      'Leading: ' + winner
    )
  );
}

// Color swatch component
function Swatch({ color }) {
  return React.createElement('span', { 
    className: 'inline-block h-3 w-3 rounded-sm',
    style: { background: color } 
  });
}

// Render the map when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, attempting to render map...');
  
  const mapRoot = document.getElementById('us-map-root');
  if (mapRoot) {
    console.log('Map root found, rendering React component...');
    try {
      // Use modern React 18 createRoot API
      if (ReactDOM.createRoot) {
        const root = ReactDOM.createRoot(mapRoot);
        root.render(React.createElement(USPollMap));
        console.log('Map rendered successfully with React 18 createRoot!');
      } else {
        // Fallback for older React versions
        ReactDOM.render(React.createElement(USPollMap), mapRoot);
        console.log('Map rendered successfully with ReactDOM.render!');
      }
    } catch (error) {
      console.error('Error rendering map:', error);
    }
  } else {
    console.error('Map root element not found!');
  }
});
