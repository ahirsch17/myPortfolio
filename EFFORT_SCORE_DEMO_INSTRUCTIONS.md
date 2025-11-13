# Effort Score Demo - Complete Code Generation Instructions

## CRITICAL: What You Need to Provide

**YOU MUST GENERATE A COMPLETE, SINGLE HTML FILE** that contains everything needed. The user will copy this code and paste it directly into a file called `effort-score-demo.html`. 

**Do NOT:**
- Reference files that don't exist
- Assume access to the codebase
- Leave placeholders or TODOs
- Skip any features described below

**DO:**
- Provide the complete HTML code ready to copy/paste
- Include all dependencies via CDN
- Make it work standalone when opened in a browser
- Implement all features exactly as specified
- Use proper error handling

## Your Task
Generate a complete, standalone HTML file that creates an interactive Effort Score demo. This will simulate Apple Watch heart rate and movement signals, allowing users to tune the algorithm in real-time.

## Output Format
**You must provide a single, complete HTML file** that:
- Can be saved directly as `effort-score-demo.html`
- Works when opened in a browser (all dependencies via CDN)
- Can be embedded in an iframe on a portfolio page
- Contains all HTML, CSS, and JavaScript in one file
- Is production-ready with no missing pieces

## File Structure Expected
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Effort Score Demo</title>
  <!-- Tailwind CSS via CDN -->
  <!-- Custom styles for glassmorphism and animations -->
</head>
<body>
  <div id="root"></div>
  <!-- React, ReactDOM, Recharts, Babel Standalone via CDN -->
  <!-- React component code in <script type="text/babel"> -->
</body>
</html>
```

## Dependencies (All Must Be Via CDN)
- **React 18**: `https://unpkg.com/react@18/umd/react.development.js`
- **ReactDOM 18**: `https://unpkg.com/react-dom@18/umd/react-dom.development.js`
- **Recharts**: `https://unpkg.com/recharts/umd/Recharts.min.js`
- **Babel Standalone**: `https://unpkg.com/@babel/standalone/babel.min.js` (for JSX transformation)
- **Tailwind CSS**: `https://cdn.tailwindcss.com`

## Visual Design Requirements

### Color Scheme & Theme
- **Background**: Dark theme with radial gradient
  - `background: radial-gradient(circle at 50% -20%, rgba(37,99,235,0.35), rgba(15,23,42,0.92))`
- **Glassmorphism Effect**:
  - Semi-transparent containers: `background: rgba(15, 23, 42, 0.75)`
  - Backdrop blur: `backdrop-filter: blur(18px)`
  - Subtle borders: `border: 1px solid rgba(148, 163, 184, 0.22)`
- **Primary Colors**:
  - Sky blue (#38bdf8) for heart rate visualizations
  - Orange (#f97316) for movement/acceleration visualizations
  - Emerald green (#10b981) for high-effort states and success indicators
  - Slate tones for text and backgrounds
- **Text Colors**:
  - Headers: `text-white`
  - Body: `text-slate-300`
  - Muted: `text-slate-400`

### Layout Structure
- **Two-column grid layout** (responsive, stacks on mobile):
  - **Left Column**: Controls and KPIs
  - **Right Column**: Visualizations and charts
- **Card-based design**: All major sections in rounded glass containers (`rounded-3xl`)

## Functional Requirements

### Core Features

#### 1. Real-Time Data Streaming
- Simulate Apple Watch signals (heart rate + accelerometer data)
- Update every 500ms (BASE_INTERVAL_MS = 500)
- Support speed controls: 0.5x, 1x, 2x
- Maintain rolling buffer of last 1200 samples (MAX_BUFFER = 1200)

#### 2. Effort Score Algorithm
Calculate effort score using this formula:
```
eₜ = 100 × smooth_avg₁₀(zoneWeight × movementFactor)
```

**Components**:
- **Heart Rate Zones** (5 zones with weights):
  - Zone 1: <100 bpm (weight: 0.2)
  - Zone 2: 100-119 bpm (weight: 0.4)
  - Zone 3: 120-139 bpm (weight: 0.7)
  - Zone 4: 140-159 bpm (weight: 1.0)
  - Zone 5: ≥160 bpm (weight: 1.3)

- **Movement Factor**: 
  - Based on g-force (0-1.2 range)
  - Formula: `clamp(0.2 + 0.25 * acc, 0.0, 1.2)`

- **Focus Mode Multipliers**:
  - **Cardio bias**: HR weight × 1.15, Movement × 0.9
  - **Strength bias**: Movement × 1.15, HR weight × 0.9
  - **Mixed**: No adjustment

- **Smoothing**: 
  - 10-sample rolling average for instantaneous effort
  - EMA (exponential moving average) with α=0.08 for session score
  - Clamp final score to 0-100 range

#### 3. Interactive Controls (Left Column)

**KPI Dashboard** (Top of left column):
- **Effort Score Card**:
  - Large display of current EMA score (0-100)
  - Pulsing animation when score ≥ 80
  - Sparkline chart showing last 80 samples
  - Badges for "Cardio load" and "Strength load"

- **Calories Card**:
  - Estimated calories burned (formula: `kcalPerMinute = 0.06 * hr + 0.5 * m`)
  - Display: "X.X" format

- **Duration Card**:
  - Session timer in HH:MM:SS format
  - Reset on pause/reset

**Control Panel**:
- **Status Indicator**: Shows "Streaming" (green) or "Paused" (gray)
- **Heart Rate Override Slider**: 60-190 bpm range
  - Triggers 3-second override that blends back to generated signal
  - Auto-plays when dragged
- **Movement Override Slider**: 0-4 g range (0.05 step)
  - Same override behavior as HR slider
- **Focus Mode Dropdown**: 
  - Options: "Mixed", "Cardio bias", "Strength bias"
- **Play/Pause Button**: Toggle data streaming
- **Reset Button**: Clear all data and reset metrics
- **Speed Selector**: Dropdown with 0.5x, 1x, 2x options
- **Randomize Button**: Generate new random seed for signal patterns

**Helper Text**: 
- Show instructional message when paused/empty: "Press Play or drag a slider to start the stream."

#### 4. Visualizations (Right Column)

**Tabbed Interface** (Tabs: "Live", "Last 5 min", "Summary"):

**Live/Last 5 min Tabs**:
- **Heart Rate Line Chart**:
  - X-axis: Timestamp (formatted as MM:SS)
  - Y-axis: 60-190 bpm
  - Colored zone bands (5 zones with different opacities):
    - 60-100: rgba(56,189,248,0.10) - light blue
    - 100-119: rgba(34,197,94,0.12) - green
    - 119-139: rgba(250,204,21,0.14) - yellow
    - 139-159: rgba(249,115,22,0.16) - orange
    - 159-190: rgba(239,68,68,0.18) - red
  - Line: Sky blue (#38bdf8), 2px width
  - Cursor synchronization: Yellow dashed reference line when hovering
  - Tooltip: Shows bpm and effort instant value
  - Data: Last 160 samples for "Live", last 600 for "Last 5 min"

- **Movement Area Chart**:
  - X-axis: Timestamp
  - Y-axis: 0-4.5 g
  - Orange gradient fill (#f97316)
  - Same cursor synchronization as HR chart
  - Tooltip: Shows g-force and effort instant value

**Summary Tab**:
- **Zone Distribution Bar Chart**:
  - X-axis: Zone labels (Zone 1, Zone 2, etc.)
  - Y-axis: Percentage of time spent in each zone
  - Bar color: Sky blue (#38bdf8)
  - Tooltip: Shows actual minutes spent in zone
  - Rounded top corners on bars

- **Intensity Radar Chart**:
  - Metrics: Cardio load, Strength load, Consistency, Recovery
  - Values calculated from last 600 samples:
    - Cardio load: `(avgHR / 170) * 100`
    - Strength load: `(avgAcc / 3.5) * 100`
    - Consistency: Based on time above 70 effort
    - Recovery: Based on mix of high/low effort periods
  - Pink/magenta fill (#f472b6) with 35% opacity

#### 5. Information Panel
- **"What affects the score"** section:
  - List of factors with dynamic badges that highlight based on current state:
    - **HR bias** (highlighted when cardio focus selected)
    - **Movement bias** (highlighted when strength focus selected)
    - **Consistency** (highlighted when effort > 60)
    - **Sprint spikes** (highlighted when recent effort > 85)

#### 6. Header Actions
- **Info Button**: Opens modal explaining the effort score formula
- **Copy Effort Timeline Button**: Copies last 120 samples as CSV to clipboard
  - CSV format: `timestamp_iso,hr,acc,zone,effort_instant,effort_ema`
  - Shows toast notification on success/failure

### Data Generation Algorithm

Generate realistic Apple Watch signals:

**Heart Rate Pattern**:
- Base: 120 + 32 × sin(phase) + 10 × sin(phase × 0.27) + random noise
- Random "sprint" events (1.5% chance per tick):
  - Duration: 3-5 minutes
  - Adds +18 × sin(sprintPhase) during sprint
- Phase increments by 0.02 × speed each tick

**Movement Pattern**:
- Base: 0.5 + 0.9 × |sin(phase)| + 0.4 × |sin(phase × 1.7)| + random
- Boosted during sprint events: +0.8
- Phase increments by 0.035 × speed each tick

**Override Blending**:
- When user drags slider, override value blends in over 3 seconds
- Smooth transition back to generated signal after override expires

### Animation & Interaction Details

- **KPI Pulse Animation**: When effort score ≥ 80, card pulses with expanding shadow
  ```css
  @keyframes kpiPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.45); }
    50% { box-shadow: 0 0 0 18px rgba(74, 222, 128, 0); }
  }
  ```
- **Smooth Transitions**: All state changes should use smooth transitions
- **Responsive Design**: Grid collapses to single column on mobile
- **Accessibility**: 
  - ARIA labels on interactive elements
  - Keyboard navigation support
  - Focus indicators (ring-2 ring-sky-400)
  - Respects `prefers-reduced-motion`

## Technical Implementation Notes

### Dependencies (All via CDN)
- React 18 (development build)
- ReactDOM 18
- Recharts (UMD build)
- Babel Standalone (for JSX transformation)
- Tailwind CSS

### Key React Hooks Pattern
- `useEffortStream` custom hook manages:
  - Data buffer (useRef)
  - Interval-based updates (useEffect)
  - State for metrics, tick counter, helper visibility
  - Methods: triggerHr, triggerAcc, reset, randomize

### Recharts Components Needed
- `ResponsiveContainer`
- `LineChart`, `Line`
- `AreaChart`, `Area`
- `BarChart`, `Bar`
- `RadarChart`, `Radar`, `PolarGrid`, `PolarAngleAxis`, `PolarRadiusAxis`
- `XAxis`, `YAxis`, `Tooltip`, `CartesianGrid`
- `ReferenceLine`, `ReferenceArea`

### Code Organization
- All code in single HTML file with inline `<script type="text/babel">`
- Use functional React components with hooks
- Separate utility functions (clamp, computeZone, computeEffort, formatDuration, createCsv, createSeed)

## HTML File Requirements

### Meta Tags & Security
Include proper meta tags:
- Charset UTF-8
- Viewport for responsive design
- Content Security Policy (CSP) for iframe embedding:
  ```html
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdn.tailwindcss.com; connect-src 'self'; img-src 'self' data:; font-src 'self';">
  ```

### CSS Requirements
- Use Tailwind CSS via CDN
- Include custom CSS in `<style>` tag for:
  - Dark color scheme (`:root { color-scheme: dark; }`)
  - Glassmorphism effect (`.glass` class)
  - KPI pulse animation (`@keyframes kpiPulse`)
- Set body background to dark gradient

### JavaScript Requirements
- All React code in a single `<script type="text/babel" data-presets="react">` block
- Wait for all CDN scripts to load before rendering (check for React, ReactDOM, Recharts)
- Error handling if scripts fail to load
- Use functional React components with hooks (no class components)

## Testing Checklist
- [ ] Data streams correctly when Play is pressed
- [ ] Sliders override values and blend smoothly back
- [ ] Focus mode changes affect score calculation
- [ ] Speed controls work (0.5x, 1x, 2x)
- [ ] Charts update in real-time
- [ ] Tab switching works smoothly
- [ ] Reset clears all data
- [ ] Randomize generates different patterns
- [ ] CSV export works
- [ ] Info modal displays correctly
- [ ] Responsive on mobile devices
- [ ] Accessibility features work (keyboard nav, screen readers)
- [ ] Respects prefers-reduced-motion

## Success Criteria
The demo should be:
1. **Visually polished**: Dark glassmorphism theme matching portfolio aesthetic
2. **Functionally complete**: All controls work, data generates correctly
3. **Performant**: Smooth 60fps updates, no lag
4. **Interactive**: Engaging and responsive to user input
5. **Educational**: Clear visualization of how effort score is calculated
6. **Professional**: Production-ready code with error handling

---

## Code Generation Checklist

Before providing the code, ensure:
- [ ] Complete HTML file with proper DOCTYPE and structure
- [ ] All CDN dependencies included and loaded correctly
- [ ] CSP meta tag for iframe security
- [ ] All React components functional and using hooks
- [ ] Recharts properly configured for all chart types
- [ ] Custom CSS includes glassmorphism styles and animations
- [ ] Data generation algorithm implemented correctly
- [ ] Effort score calculation matches specifications exactly
- [ ] All interactive controls wired up
- [ ] Charts update in real-time
- [ ] Responsive design works on mobile
- [ ] Error handling for missing dependencies
- [ ] Accessibility features (ARIA labels, keyboard nav)

## Expected Output
Provide the complete HTML file code that can be copied and pasted directly into `effort-score-demo.html`. The file should:
1. Work immediately when opened in a browser
2. Display all features described above
3. Be production-ready with proper error handling
4. Match the visual design specifications exactly
5. Function correctly when embedded in an iframe

**Note**: Do not reference external files or dependencies not included via CDN. Everything must be self-contained in this single HTML file.

---

## Summary for AI Generating Code

**Goal**: Generate a complete, working HTML file for an interactive Effort Score demo.

**Input**: Use all the specifications above to understand what to build.

**Output**: Provide the complete HTML code (with all CSS and JavaScript inline) that can be copied and pasted into a file. The code should:
1. Start with `<!DOCTYPE html>`
2. Include all dependencies via CDN links
3. Have all custom styles in a `<style>` tag
4. Have all React components in a `<script type="text/babel">` tag
5. Work immediately when saved as an HTML file and opened in a browser
6. Match all visual and functional requirements listed above

**The user will copy your generated HTML code and paste it back to another AI assistant who will save it to the correct file location.**

