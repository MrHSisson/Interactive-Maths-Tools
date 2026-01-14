# Tool Specification v2.0

**Purpose:** Complete reference for creating interactive mathematics teaching tools  
**Format:** TypeScript React (.tsx)

---

## 1. PAGE STRUCTURE

```tsx
return (
  <>
    {/* Header Bar */}
    <div className="bg-blue-900 shadow-lg">...</div>
    
    {/* Main Content */}
    <div className="min-h-screen p-8" style={{ backgroundColor: '#f5f3f0' }}>
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        {/* Divider */}
        {/* Tool Selectors */}
        {/* Divider */}
        {/* Mode Selectors */}
        {/* Mode Content */}
      </div>
    </div>
  </>
);
```

| Property | Value |
|----------|-------|
| Page Background | `#f5f3f0` |
| Content Container | `max-w-6xl mx-auto` |
| Padding | `p-8` |

---

## 2. HEADER BAR

```tsx
<div className="bg-blue-900 shadow-lg">
  <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
    {/* Home Button */}
    <button onClick={() => window.location.href = '/'}
      className="flex items-center gap-2 text-white hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors">
      <Home size={24} />
      <span className="font-semibold text-lg">Home</span>
    </button>
    
    {/* Menu Dropdown */}
    <div className="relative">
      <button onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-white hover:bg-blue-800 p-2 rounded-lg transition-colors">
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border-2 border-gray-200 overflow-hidden z-50">
          <div className="py-2">
            <div className="px-6 py-2 font-bold text-gray-700 text-sm uppercase tracking-wide">Color Schemes</div>
            {['default', 'blue', 'pink', 'yellow'].map((scheme) => (
              <button key={scheme} onClick={() => setColorScheme(scheme)}
                className={'w-full text-left px-6 py-3 font-semibold transition-colors ' +
                  (colorScheme === scheme ? 'bg-blue-100 text-blue-900' : 'text-gray-800 hover:bg-gray-100')}>
                {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
</div>
```

| Property | Value |
|----------|-------|
| Background | `bg-blue-900` |
| Shadow | `shadow-lg` |
| Home Icon | `size={24}` |
| Menu Icons | `size={28}` |
| Dropdown Width | `w-64` |
| Menu Labels | Default, Blue, Pink, Yellow |

---

## 3. TITLE

```tsx
<h1 className="text-5xl font-bold text-center mb-8" style={{ color: '#000000' }}>
  Tool Name
</h1>
```

**Note:** Title is STATIC - does not change with tool selection

---

## 4. TOOL & MODE SELECTORS

```tsx
{/* Tool Selectors */}
<div className="flex justify-center gap-4 mb-6">
  {['tool1', 'tool2', 'tool3'].map((tool) => (
    <button key={tool} onClick={() => setCurrentTool(tool)}
      className={'px-8 py-4 rounded-xl font-bold text-xl transition-all shadow-xl ' +
        (currentTool === tool 
          ? 'bg-blue-900 text-white' 
          : 'bg-white text-gray-800 hover:bg-gray-100 hover:text-blue-900')}>
      {toolNames[tool]}
    </button>
  ))}
</div>

{/* Mode Selectors */}
<div className="flex justify-center gap-4 mb-8">
  {['whiteboard', 'single', 'worksheet'].map((m) => (
    <button key={m} onClick={() => setMode(m)}
      className={'px-8 py-4 rounded-xl font-bold text-xl transition-all shadow-xl ' +
        (mode === m 
          ? 'bg-blue-900 text-white' 
          : 'bg-white text-gray-800 hover:bg-gray-100 hover:text-blue-900')}>
      {m === 'whiteboard' ? 'Whiteboard' : m === 'single' ? 'Worked Example' : 'Worksheet'}
    </button>
  ))}
</div>
```

| Property | Value |
|----------|-------|
| Padding | `px-8 py-4` |
| Border Radius | `rounded-xl` |
| Font | `font-bold text-xl` |
| Shadow | `shadow-xl` |
| Gap | `gap-4` |
| Active | `bg-blue-900 text-white` |
| Inactive | `bg-white text-gray-800` |
| Hover | `hover:bg-gray-100 hover:text-blue-900` |

**Note:** NO borders on buttons - shadow only

---

## 5. DIVIDERS

```tsx
<div className="flex justify-center mb-8">
  <div style={{ width: '90%', height: '2px', backgroundColor: '#d1d5db' }}></div>
</div>
```

| Property | Value |
|----------|-------|
| Width | `90%` |
| Height | `2px` |
| Color | `#d1d5db` (gray-300) |

**Placement:** After Title, After Tool Selectors

---

## 6. CONTROL BARS

### Container
```tsx
<div className="bg-white rounded-xl shadow-lg p-6 mb-8">
```

### Whiteboard/Worked Example Layout
```tsx
<div className="flex items-center justify-between">
  <div className="flex items-center gap-6">
    {/* Difficulty */}
    {/* Variables (conditional) */}
    {/* Dropdown (conditional) */}
  </div>
  <div className="flex gap-3">
    {/* Action Buttons */}
  </div>
</div>
```

### Difficulty Buttons
```tsx
<div className="flex items-center gap-3">
  <span className="text-sm font-semibold" style={{ color: '#000000' }}>Difficulty:</span>
  <div className="flex gap-2">
    {['level1', 'level2', 'level3'].map((lvl, idx) => (
      <button key={lvl} onClick={() => setDifficulty(lvl)}
        className={'px-4 py-2 rounded-lg font-bold text-sm w-24 ' + 
          getDifficultyButtonClass(lvl, idx, difficulty === lvl)}>
        Level {idx + 1}
      </button>
    ))}
  </div>
</div>
```

```tsx
const getDifficultyButtonClass = (lvl: string, idx: number, isActive: boolean): string => {
  if (isActive) {
    return idx === 0 ? 'bg-green-600 text-white' 
         : idx === 1 ? 'bg-yellow-600 text-white' 
         : 'bg-red-600 text-white';
  }
  return idx === 0 ? 'bg-white text-green-600 border-2 border-green-600' 
       : idx === 1 ? 'bg-white text-yellow-600 border-2 border-yellow-600' 
       : 'bg-white text-red-600 border-2 border-red-600';
};
```

### Variable Checkboxes (Stacked)
```tsx
<div className="flex flex-col gap-1">
  <label className="flex items-center gap-2 cursor-pointer">
    <input type="checkbox" checked={variable1} 
      onChange={(e) => setVariable1(e.target.checked)} className="w-4 h-4" />
    <span className="text-sm font-semibold" style={{ color: '#000000' }}>Variable 1</span>
  </label>
</div>
```

### Dropdown
```tsx
<select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}
  className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold bg-white">
  <option value="option1">Option 1</option>
</select>
```

### Action Buttons
```tsx
<button className="px-6 py-2 bg-blue-900 text-white rounded-xl font-bold text-base shadow-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 w-52">
  <RefreshCw size={18} /> New Question
</button>
```

| Property | Value |
|----------|-------|
| Button Width | `w-52` |
| Difficulty Width | `w-24` |
| Icon Size | `size={18}` |
| All buttons | `bg-blue-900` (including Show Answer) |

---

## 7. GRAPHICAL LAYOUT OPTION

For tools with visual components (geometry, graphs, bar models):

```tsx
<div className="rounded-xl shadow-2xl p-8" style={{ backgroundColor: getQuestionBg() }}>
  <div className="flex gap-6">
    {/* Diagram Area */}
    <div className="rounded-xl flex items-center justify-center"
         style={{ width: '450px', height: '500px', backgroundColor: getStepBg() }}>
      {renderDiagram(currentQuestion, 400)}
    </div>
    {/* Working Area */}
    <div className="flex-1 rounded-xl p-6" style={{ minHeight: '500px', backgroundColor: getStepBg() }}></div>
  </div>
</div>
```

| Property | Value |
|----------|-------|
| Diagram Width | `450px` |
| Diagram Height | `500px` |
| Diagram Render Size | `400` (with padding) |
| Working Area | `flex-1`, `minHeight: 500px` |

---

## 8. WHITEBOARD MODE

```tsx
<div className="rounded-xl shadow-2xl p-8" style={{ backgroundColor: getQuestionBg() }}>
  <div className="text-center">
    <span className="text-6xl font-bold" style={{ color: '#000000' }}>
      {currentQuestion.display}
    </span>
    {showWhiteboardAnswer && (
      <span className="text-6xl font-bold ml-4" style={{ color: '#166534' }}>
        = {currentQuestion.answer}
      </span>
    )}
  </div>
  <div className="rounded-xl mt-8" style={{ height: '500px', backgroundColor: getWhiteboardWorkingBg() }}></div>
</div>
```

| Element | Style |
|---------|-------|
| Container Shadow | `shadow-2xl` |
| Question | `text-6xl font-bold` color `#000000` |
| Answer | `text-6xl font-bold` color `#166534` |
| Working Area | `height: 500px` |

---

## 9. WORKED EXAMPLE MODE

```tsx
<div className="overflow-y-auto" style={{ height: '120vh' }}>
  <div className="rounded-xl shadow-lg p-8 w-full" style={{ backgroundColor: getQuestionBg() }}>
    {/* Question */}
    <div className="text-center">
      <span className="text-6xl font-bold" style={{ color: '#000000' }}>{currentQuestion.display}</span>
    </div>
    
    {showAnswer && (
      <>
        {/* Working Steps */}
        <div className="space-y-4 mt-8">
          {currentQuestion.working.map((step: any, i: number) => (
            <div key={i} className="rounded-xl p-6" style={{ backgroundColor: getStepBg() }}>
              <h4 className="text-xl font-bold mb-2" style={{ color: '#000000' }}>Step {i + 1}</h4>
              <p className="text-3xl" style={{ color: '#000000' }}>{step.content}</p>
            </div>
          ))}
        </div>
        
        {/* Final Answer */}
        <div className="rounded-xl p-6 text-center mt-4" style={{ backgroundColor: getFinalAnswerBg() }}>
          <span className="text-5xl font-bold" style={{ color: '#166534' }}>= {currentQuestion.answer}</span>
        </div>
      </>
    )}
  </div>
</div>
```

| Element | Style |
|---------|-------|
| Container | `shadow-lg` (not shadow-2xl) |
| Outer Height | `120vh` with `overflow-y-auto` |
| Step Title | `text-xl font-bold` - "Step {n}" (NO colon) |
| Step Content | `text-3xl` |
| Final Answer | `text-5xl font-bold` color `#166534` |

**Note:** All content INSIDE one expandable box

---

## 10. WORKSHEET MODE

### Control Bar Structure (4 Lines)

**Line 1:** Questions + Differentiated
```tsx
<div className="flex justify-center items-center gap-6">
  <div className="flex items-center gap-3">
    <label className="text-lg font-semibold" style={{ color: '#000000' }}>Questions per level:</label>
    <input type="number" min="1" max="20" value={numQuestions}
      onChange={(e) => setNumQuestions(Math.max(1, Math.min(20, parseInt(e.target.value) || 5)))}
      className="w-20 px-4 py-2 border-2 border-gray-300 rounded-lg text-lg" />
  </div>
  <div className="flex items-center gap-3">
    <input type="checkbox" id="diff" checked={isDifferentiated}
      onChange={(e) => setIsDifferentiated(e.target.checked)} className="w-5 h-5" />
    <label htmlFor="diff" className="text-lg font-semibold" style={{ color: '#000000' }}>Differentiated</label>
  </div>
</div>
```

**Line 2:** Difficulty + Columns (hidden if differentiated)
**Line 3:** Variables + Dropdown (conditional per difficulty)
**Line 4:** Action Buttons

```tsx
<div className="flex justify-center gap-4">
  <button onClick={handleGenerateWorksheet}
    className="px-6 py-3 bg-blue-900 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-800">
    <RefreshCw size={20} /> Generate Worksheet
  </button>
</div>
```

### Worksheet Display
```tsx
<div className="rounded-xl shadow-2xl p-8 relative" style={{ backgroundColor: getQuestionBg() }}>
  {/* Font Size Controls - top right */}
  <div className="absolute top-4 right-4 flex items-center gap-1">
    <button className="w-8 h-8 ..."><ChevronDown size={20} /></button>
    <button className="w-8 h-8 ..."><ChevronUp size={20} /></button>
  </div>
  
  <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#000000' }}>
    {toolNames[currentTool]} - Worksheet
  </h2>
</div>
```

### Font Sizes
```tsx
const fontSizes: string[] = ['text-xl', 'text-2xl', 'text-3xl', 'text-4xl'];
// Default: index 1 (text-2xl)
```

### Differentiated Layout Colors
```tsx
const colorConfig = {
  level1: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700' },
  level2: { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-700' },
  level3: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700' }
};
```

### Answer Color
Worksheet answers: `#059669` (green)

---

## 11. COLOR SCHEME SYSTEM

```tsx
const getQuestionBg = (): string => {
  if (colorScheme === 'blue') return '#D1E7F8';
  if (colorScheme === 'pink') return '#F8D1E7';
  if (colorScheme === 'yellow') return '#F8F4D1';
  return '#ffffff';
};

const getStepBg = (): string => {
  if (colorScheme === 'blue') return '#B3D9F2';
  if (colorScheme === 'pink') return '#F2B3D9';
  if (colorScheme === 'yellow') return '#F2EBB3';
  return '#f3f4f6';
};

// getWhiteboardWorkingBg() and getFinalAnswerBg() same as getStepBg()
```

| Scheme | Primary | Secondary |
|--------|---------|-----------|
| Default | `#ffffff` | `#f3f4f6` |
| Blue | `#D1E7F8` | `#B3D9F2` |
| Pink | `#F8D1E7` | `#F2B3D9` |
| Yellow | `#F8F4D1` | `#F2EBB3` |

---

## 12. STATE MANAGEMENT

```tsx
// Tool & Mode
const [currentTool, setCurrentTool] = useState<string>('tool1');
const [mode, setMode] = useState<string>('whiteboard');
const [difficulty, setDifficulty] = useState<string>('level1');

// Questions (SHARED between Whiteboard & Worked Example)
const [currentQuestion, setCurrentQuestion] = useState<any>(null);
const [showWhiteboardAnswer, setShowWhiteboardAnswer] = useState<boolean>(false);
const [showAnswer, setShowAnswer] = useState<boolean>(false);

// Worksheet
const [numQuestions, setNumQuestions] = useState<number>(5);
const [worksheet, setWorksheet] = useState<any[]>([]);
const [showWorksheetAnswers, setShowWorksheetAnswers] = useState<boolean>(false);
const [isDifferentiated, setIsDifferentiated] = useState<boolean>(false);
const [numColumns, setNumColumns] = useState<number>(2);
const [worksheetFontSize, setWorksheetFontSize] = useState<number>(1);

// UI
const [colorScheme, setColorScheme] = useState<string>('default');
const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
```

**Key:** Question persists when switching between Whiteboard and Worked Example

---

## 13. IMPORTS

```tsx
import { useState, useEffect } from 'react';
import { RefreshCw, Eye, ChevronUp, ChevronDown, Home, Menu, X } from 'lucide-react';
```

---

## 14. QUICK REFERENCE

### Typography
| Element | Class |
|---------|-------|
| Page Title | `text-5xl font-bold` |
| Selector Buttons | `text-xl font-bold` |
| Question | `text-6xl font-bold` |
| Whiteboard Answer | `text-6xl font-bold` |
| Worked Example Answer | `text-5xl font-bold` |
| Step Title | `text-xl font-bold` |
| Step Content | `text-3xl` |
| Control Labels | `text-sm font-semibold` |
| Worksheet Labels | `text-lg font-semibold` |

### Colors
| Purpose | Value |
|---------|-------|
| Page Background | `#f5f3f0` |
| Primary Buttons | `bg-blue-900` |
| All Text | `#000000` |
| Whiteboard/Worked Answer | `#166534` |
| Worksheet Answer | `#059669` |
| Dividers | `#d1d5db` |

### Sizing
| Element | Value |
|---------|-------|
| Action Button | `w-52` |
| Difficulty Button | `w-24` |
| Input Fields | `w-20` |
| Font Controls | `w-8 h-8` |
| Whiteboard Working | `500px` |
| Worked Example Container | `120vh` |

---

## 15. QUESTION GENERATION

### Object Structure
```tsx
interface Question {
  display: string;
  answer: string;
  working: { type: string; content: string }[];
  values: Record<string, any>;
  difficulty: string;
}
```

### Difficulty Ranges
```tsx
if (level === 'level1') {
  a = Math.floor(Math.random() * 8) + 2;    // 2-9, positive only
}
if (level === 'level2') {
  a = Math.floor(Math.random() * 15) + 5;   // 5-19, simple negatives possible
}
if (level === 'level3') {
  a = Math.floor(Math.random() * 19) - 9;   // -9 to 9
  if (a === 0) a = 1;
}
```

### Duplicate Prevention
```tsx
const generateUniqueQuestion = (lvl: string, usedKeys: Set<string>): Question => {
  let attempts = 0, q: Question, uniqueKey: string;
  do {
    q = generateQuestion(lvl);
    uniqueKey = `${q.values.a}-${q.values.b}`;
    if (++attempts > 100) break;
  } while (usedKeys.has(uniqueKey));
  usedKeys.add(uniqueKey);
  return q;
};
```

### Mathematical Formatting
```tsx
// CRITICAL: Use '−' (U+2212) NOT hyphen '-'
const formatSign = (value: number, isFirst: boolean = false): string => {
  if (isFirst) return value < 0 ? '−' : '';
  return value < 0 ? ' − ' : ' + ';
};

const formatTerm = (coeff: number, variable: string, power: number = 1): string => {
  if (coeff === 0) return '';
  const abs = Math.abs(coeff);
  let term = (abs === 1 && power > 0) ? variable : abs + variable;
  if (power === 2) term += '²';
  if (power === 3) term += '³';
  if (power === 0) term = abs.toString();
  return term;
};

const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
```

### Special Characters
| Char | Use |
|------|-----|
| − | Minus (U+2212) |
| × | Multiply |
| ÷ | Divide |
| ² | Squared |
| ³ | Cubed |

### Answer Formats
| Type | Format |
|------|--------|
| Variable | `x = 5` |
| Ratio | `2 : 3` |
| Expression | `2x² + 5x − 3` |

### Common Patterns
```tsx
// Coefficient of 1: display 'x' not '1x'
const display = (coeff === 1) ? 'x' : (coeff === -1) ? '−x' : `${coeff}x`;

// Ensure integer answers - generate answer first
const answer = Math.floor(Math.random() * 10) + 1;
const divisor = Math.floor(Math.random() * 9) + 2;
const dividend = answer * divisor;
```

---

## 16. COMMON MISTAKES

### UI/Layout Mistakes
| ❌ Wrong | ✅ Right |
|----------|----------|
| Borders on selector buttons | Shadow only (`shadow-xl`) |
| `bg-gray-50` page background | `#f5f3f0` (warm cream) |
| 1px dividers | 2px dividers |
| Separate Whiteboard/Worked Example questions | Shared `currentQuestion` state |
| Green Show Answer button | Blue (`bg-blue-900`) - all action buttons blue |
| `minHeight: 120vh` on Worked Example box | `height: 120vh` on outer container, box expands naturally |

### Color Scheme Mistakes
| ❌ Wrong | ✅ Right |
|----------|----------|
| Grey text on colored backgrounds | All text `#000000` (except answers) |
| 4+ different color shades | Exactly 2 per scheme (lighter main, darker support) |
| Step boxes different shades | All matching elements use same helper |
| Main content darker than support | Main content LIGHTER, support darker |
| Hardcoded colors everywhere | Named helper functions |

### Answer Color Mistakes
| ❌ Wrong | ✅ Right |
|----------|----------|
| Black Whiteboard/Worked Example answers | Dark green `#166534` |
| Worksheet green (`#059669`) on Whiteboard | Dark green `#166534` |
| `text-6xl` Worked Example final answer | `text-5xl` |
| Black worksheet answers | Green `#059669` |

### Question Generation Mistakes
| ❌ Wrong | ✅ Right |
|----------|----------|
| Hyphen `-` for minus | Minus symbol `−` (U+2212) |
| `1x` or `-1x` | `x` or `−x` |
| "Step 1:" (with colon) | "Step {n}" (no colon) |
| No duplicate prevention | `usedKeys` Set with 100 attempt limit |

---

## 17. CHECKLIST

### UI/Layout
- [ ] Page background `#f5f3f0`
- [ ] Header bar with Home + Menu dropdown
- [ ] Tool/Mode selectors: `shadow-xl`, NO borders
- [ ] Dividers: 90%, 2px, `#d1d5db`
- [ ] All action buttons `bg-blue-900`
- [ ] Control bar `shadow-lg`, content boxes `shadow-2xl`

### Modes
- [ ] Question shared between Whiteboard & Worked Example
- [ ] Whiteboard: 500px working area
- [ ] Worked Example: single expandable box, 120vh container
- [ ] Worksheet: 4-line control structure, font size controls

### Question Generation
- [ ] Returns `{ display, answer, working, values, difficulty }`
- [ ] Three difficulty levels with appropriate ranges
- [ ] Uses minus `−` not hyphen `-`
- [ ] Coefficient of 1 displays as `x` not `1x`
- [ ] Working steps: "Step {n}" (no colon), one operation each
- [ ] Duplicate prevention with unique key

---

**End of Specification v1.8**
