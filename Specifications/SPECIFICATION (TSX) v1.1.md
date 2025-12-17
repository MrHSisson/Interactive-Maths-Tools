# Math Tool Core System - Technical Specification (Updated)

**Purpose:** Technical reference for building interactive math teaching tools

## 🎯 THREE-MODE STRUCTURE

Every tool has three modes supporting "I Do, We Do, You Do" pedagogy:

1. **Whiteboard Mode** - Teacher demonstration with large display and 500px workspace
2. **Single Question Mode** - One question at a time with step-by-step solutions  
3. **Worksheet Mode** - Multiple questions (1-20), standard or differentiated layout

---

## 💻 TYPESCRIPT FORMAT

**All tools must be written in TypeScript** for compatibility with both Claude Artifacts and Replit/production deployment.

### Key TypeScript Syntax

```typescript
// Imports (no React import needed)
import { useState, useEffect } from 'react';
import { RefreshCw, Eye } from 'lucide-react';

// State with type annotations
const [question, setQuestion] = useState<any>(null);
const [worksheet, setWorksheet] = useState<any[]>([]);

// Function parameters with types
const generateQuestion = (level: string) => {
  // ...
};
```

**Note:** Using `any` type is acceptable for rapid prototyping. Full type definitions are optional.

---

## 🎨 VISUAL STRUCTURE & DIVIDING LINES

### **Page Layout with Dividers**

Tools now include **centered dividing lines** between major sections for visual clarity:

```tsx
{/* Topic Selector (if multi-topic) */}
<div className="flex justify-center gap-3 flex-wrap mb-6">
  <button onClick={() => setQuestionType('topic1')}
    className={'px-8 py-4 rounded-xl font-bold text-xl transition-all ' +
      (questionType === 'topic1' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-purple-600 shadow')}>
    Topic 1
  </button>
</div>

{/* Dividing Line 1 */}
<div className="flex justify-center mb-8">
  <div style={{width: '90%', height: '1px', backgroundColor: '#d1d5db'}}></div>
</div>

{/* Mode Toggle */}
<div className="flex justify-center gap-4 mb-6">
  <button onClick={() => setMode('whiteboard')}
    className={'px-8 py-4 rounded-xl font-bold text-xl transition-all ' + 
      (mode === 'whiteboard' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-purple-600 shadow')}>
    Whiteboard
  </button>
  <button onClick={() => setMode('single')}
    className={'px-8 py-4 rounded-xl font-bold text-xl transition-all ' + 
      (mode === 'single' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-purple-600 shadow')}>
    Single Q
  </button>
  <button onClick={() => setMode('worksheet')}
    className={'px-8 py-4 rounded-xl font-bold text-xl transition-all ' + 
      (mode === 'worksheet' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-purple-600 shadow')}>
    Worksheet
  </button>
</div>

**Divider Specifications:**
- Height: 1px (inline style)
- Color: #d1d5db (light gray-300)
- Width: 90% of container
- Centered horizontally with flex
- Spacing: mb-8 (2rem margin below)

---

## 🗂️ REACT COMPONENT TEMPLATE (TypeScript)

```tsx
import { useState, useEffect } from 'react';
import { RefreshCw, Eye } from 'lucide-react';

export default function [TopicName]() {
  // State
  const [mode, setMode] = useState('whiteboard');
  const [difficulty, setDifficulty] = useState('level1');
  const [question, setQuestion] = useState<any>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [whiteboardQuestion, setWhiteboardQuestion] = useState<any>(null);
  const [showWhiteboardAnswer, setShowWhiteboardAnswer] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);
  const [worksheet, setWorksheet] = useState<any[]>([]);
  const [showWorksheetAnswers, setShowWorksheetAnswers] = useState(false);
  const [isDifferentiated, setIsDifferentiated] = useState(false);

  // Question generation
  const generateQuestion = (level: string) => {
    // Generate values based on difficulty
    // Calculate answer (MUST BE CORRECT)
    // Return { display, answer, working, values, difficulty: level }
  };

  // Handlers
  const handleNewQuestion = () => {
    setQuestion(generateQuestion(difficulty));
    setShowAnswer(false);
  };

  const handleNewWhiteboardQuestion = () => {
    setWhiteboardQuestion(generateQuestion(difficulty));
    setShowWhiteboardAnswer(false);
  };

  const handleGenerateWorksheet = () => {
    const questions: any[] = [];
    if (isDifferentiated) {
      ['level1', 'level2', 'level3'].forEach(lvl => {
        for (let i = 0; i < numQuestions; i++) {
          questions.push({ ...generateQuestion(lvl), difficulty: lvl });
        }
      });
    } else {
      for (let i = 0; i < numQuestions; i++) {
        questions.push({ ...generateQuestion(difficulty), difficulty });
      }
    }
    setWorksheet(questions);
    setShowWorksheetAnswers(false);
  };

  // Effects
  useEffect(() => {
    if (mode === 'single' && !question) handleNewQuestion();
    if (mode === 'whiteboard' && !whiteboardQuestion) handleNewWhiteboardQuestion();
  }, [mode]);

  useEffect(() => {
    if (mode === 'single' && question) handleNewQuestion();
    if (mode === 'whiteboard' && whiteboardQuestion) handleNewWhiteboardQuestion();
  }, [difficulty]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8 text-purple-900">
          [Topic Name]
        </h1>
        
        {/* Dividing lines and mode structure as shown above */}
      </div>
    </div>
  );
}
```

---

## 🎨 MODE UI SPECIFICATIONS

### **Whiteboard Mode & Single Q Mode - IDENTICAL TOOLBARS**

**CRITICAL:** Whiteboard and Single Q modes now share the **exact same control bar layout** for consistency:

```tsx
{(mode === 'whiteboard' || mode === 'single') && (
  <div className="flex flex-col gap-4">
    {/* Compact Control Bar - IDENTICAL FOR BOTH MODES */}
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between">
        {/* Difficulty Buttons */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-600">Difficulty:</span>
          <div className="flex gap-2">
            {['level1', 'level2', 'level3'].map((lvl, idx) => (
              <button key={lvl}
                onClick={() => setDifficulty(lvl)}
                className={'px-4 py-2 rounded-lg font-bold text-sm w-24 ' + 
                  (difficulty === lvl 
                    ? `bg-${['green', 'yellow', 'red'][idx]}-600 text-white`
                    : `bg-white text-${['green', 'yellow', 'red'][idx]}-600 border-2 border-${['green', 'yellow', 'red'][idx]}-600`)}>
                Level {idx + 1}
              </button>
            ))}
          </div>
        </div>
        
        {/* Stacked Options */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
            <input type="checkbox" checked={allowDecimals}
              onChange={(e) => setAllowDecimals(e.target.checked)}
              className="w-3 h-3" />
            Decimals
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
            <input type="checkbox" checked={answerInPi}
              onChange={(e) => setAnswerInPi(e.target.checked)}
              className="w-3 h-3" />
            In π
          </label>
        </div>
        
        {/* Optional Dropdown (if needed) */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-600">Type:</label>
          <select className="px-2 py-1 border-2 border-gray-300 rounded-lg text-xs font-semibold">
            <option>Mixed</option>
          </select>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button onClick={mode === 'whiteboard' ? handleNewWhiteboardQuestion : handleNewQuestion}
            className="px-6 py-2 bg-purple-600 text-white rounded-xl font-bold text-base shadow-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 w-52">
            <RefreshCw size={18} />
            New Question
          </button>
          <button onClick={() => mode === 'whiteboard' ? setShowWhiteboardAnswer(!showWhiteboardAnswer) : setShowAnswer(!showAnswer)}
            className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-base shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 w-52">
            <Eye size={18} />
            {(mode === 'whiteboard' ? showWhiteboardAnswer : showAnswer) ? 'Hide Answer' : 'Show Answer'}
          </button>
        </div>
      </div>
    </div>
    
    {/* Question Display - Both use text-6xl */}
    {(mode === 'whiteboard' ? whiteboardQuestion : question) && (
      <div className="bg-white rounded-xl shadow-2xl p-8">
        <div className="text-6xl font-bold text-center text-purple-900 mb-6">
          {/* Question text here */}
        </div>
        {/* Content continues... */}
      </div>
    )}
  </div>
)}
```

### **Standard Text-Based Whiteboard Mode**

```tsx
{mode === 'whiteboard' && (
  <div className="flex flex-col gap-4">
    {/* Control Bar (as shown above) */}
    
    {whiteboardQuestion && (
      <div className="bg-white rounded-xl shadow-2xl p-8">
        {!showWhiteboardAnswer ? (
          <div className="text-6xl font-bold text-center text-purple-900 mb-6">
            {whiteboardQuestion.display}
          </div>
        ) : (
          <div className="text-6xl font-bold text-center text-emerald-600 mb-6">
            {whiteboardQuestion.answer}
          </div>
        )}
        
        {/* 500px Annotation Workspace */}
        <div className="bg-gray-100 rounded-xl" style={{height: '500px'}}></div>
      </div>
    )}
  </div>
)}
```

---

## 🖼️ GRAPHICAL LAYOUT OPTION (FOR VISUAL TOOLS)

For tools with significant visual/diagram components (geometry, circles, sectors, coordinate graphs, etc.), use the **graphical whiteboard layout** where the diagram sits alongside the annotation workspace.

### **Graphical Whiteboard Mode**

```tsx
{mode === 'whiteboard' && (
  <div className="flex flex-col gap-4">
    {/* Control Bar (identical to standard) */}
    
    {whiteboardQuestion && (
      <div className="bg-white rounded-xl shadow-2xl p-8">
        <div className="text-6xl font-bold text-center text-purple-900 mb-6">
          {!showWhiteboardAnswer ? (
            whiteboardQuestion.display
          ) : (
            <span className="text-emerald-600">{whiteboardQuestion.answer}</span>
          )}
        </div>
        
        <div className="flex gap-6">
          {/* Diagram Box (Left Side) */}
          <div className="bg-white rounded-xl flex items-center justify-center" 
               style={{width: '450px', height: '500px'}}>
            {renderDiagram(whiteboardQuestion, 400)}
          </div>
          
          {/* Annotation Workspace (Right Side) */}
          <div className="flex-1 bg-gray-100 rounded-xl p-6" 
               style={{minHeight: '500px'}}>
          </div>
        </div>
      </div>
    )}
  </div>
)}
```

**When to use graphical layout:**
- Circle properties (circumference, area, sectors)
- Geometry (angles, triangles, polygons, shapes)
- Coordinate graphs and transformations
- Any tool where visual representation is central to understanding

---

### **Single Question Mode**

**Note:** Single Q mode now uses the **same control bar** as Whiteboard mode (shown above). Only the question display section differs:

```tsx
{mode === 'single' && (
  <div className="flex flex-col gap-4">
    {/* Control Bar - IDENTICAL TO WHITEBOARD (see above) */}

    {question && (
      <div className="bg-white rounded-xl shadow-2xl p-12">
        <div className="text-6xl font-bold text-center text-purple-900 mb-8">
          {question.displayQuestion}
        </div>
        
        <div className="flex justify-center mb-8">
          {/* Diagram or visual content if applicable */}
        </div>
        
        {showAnswer && (
          <div className="mt-8 space-y-6">
            {question.working.map((step: any, idx: number) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-6">
                {step.type === 'given' && (
                  <div>
                    <h4 className="text-xl font-semibold text-gray-700 mb-3">Given:</h4>
                    <div className="text-3xl font-medium text-blue-600">{step.text}</div>
                  </div>
                )}
                {/* Additional step types... */}
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
)}
```

---

### **Worksheet Mode**

Worksheet mode uses a **two-line layout** for controls:

```tsx
{mode === 'worksheet' && (
  <div>
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="space-y-4">
        {/* First Line: Questions and Differentiated */}
        <div className="flex justify-center items-center gap-6">
          <div className="flex items-center gap-3">
            <label className="text-lg font-semibold">Questions per level:</label>
            <input type="number" min="1" max="20" value={numQuestions}
              onChange={(e) => setNumQuestions(Math.max(1, Math.min(20, parseInt(e.target.value) || 5)))}
              className="w-20 px-4 py-2 border-2 border-purple-300 rounded-lg text-lg" />
          </div>
          
          <div className="flex items-center gap-3">
            <input type="checkbox" id="diff" checked={isDifferentiated}
              onChange={(e) => setIsDifferentiated(e.target.checked)} className="w-5 h-5" />
            <label htmlFor="diff" className="text-lg font-semibold">Differentiated</label>
          </div>
        </div>

        {/* Second Line: Difficulty, Options, and Buttons */}
        <div className="flex justify-between items-center">
          {/* Difficulty Selector (only if not differentiated) */}
          {!isDifferentiated && (
            <div className="flex items-center gap-4">
              <label className="text-lg font-semibold">Difficulty:</label>
              <div className="flex gap-2">
                {['level1', 'level2', 'level3'].map((lvl, idx) => (
                  <button key={lvl} onClick={() => setDifficulty(lvl)}
                    className={'px-6 py-2 rounded-lg font-semibold ' + 
                      (difficulty === lvl ? `bg-${['green', 'yellow', 'red'][idx]}-600 text-white` : 'bg-gray-200')}>
                    Level {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Empty div for spacing when differentiated */}
          {isDifferentiated && <div></div>}
          
          <div className="flex items-center gap-6">
            {/* Stacked Checkboxes */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-base font-semibold">
                <input type="checkbox" checked={allowDecimals}
                  onChange={(e) => setAllowDecimals(e.target.checked)} className="w-4 h-4" />
                Decimals
              </label>
              <label className="flex items-center gap-2 text-base font-semibold">
                <input type="checkbox" checked={answerInPi}
                  onChange={(e) => setAnswerInPi(e.target.checked)} className="w-4 h-4" />
                In π
              </label>
            </div>
            
            {/* Optional Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-base font-semibold">Type:</label>
              <select className="px-3 py-2 border-2 border-purple-300 rounded-lg text-base font-semibold">
                <option>Mixed</option>
              </select>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4">
              <button onClick={handleGenerateWorksheet}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-purple-700">
                <RefreshCw size={20} />
                Generate
              </button>
              {worksheet.length > 0 && (
                <button onClick={() => setShowWorksheetAnswers(!showWorksheetAnswers)}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-emerald-700">
                  <Eye size={20} />
                  {showWorksheetAnswers ? 'Hide' : 'Show'} Answers
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Worksheet Display */}
    {worksheet.length > 0 && (
      <div className="bg-white rounded-xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-purple-900">Worksheet</h2>
        {/* Worksheet content... */}
      </div>
    )}
  </div>
)}
```

---

## 🎲 QUESTION GENERATION PATTERNS

```typescript
const generateQuestion = (level: string) => {
  let values;
  
  if (level === 'level1') {
    // Simple: small positive integers
    // Example: 2-9, 1-5
  } else if (level === 'level2') {
    // Medium: larger ranges, some negatives
    // Example: 5-19, -3 to 6
  } else {
    // Hard: full range including negatives
    // Example: -9 to 9, -10 to 10
  }
  
  const answer = /* calculate correct answer */;
  const display = /* format question string */;
  const working = [
    { title: "Step 1: ...", content: "...", explanation: "..." },
    // More steps
  ];
  
  return { display, answer, working, values, difficulty: level };
};
```

### Random Value Patterns

```typescript
// Level 1
const a = Math.floor(Math.random() * 8) + 2;  // 2-9

// Level 2
const a = Math.floor(Math.random() * 15) + 5;  // 5-19

// Level 3
const a = Math.floor(Math.random() * 19) - 9;  // -9 to 9

// Avoid zero when it breaks question
if (a === 0) a = 1;
```

### Duplicate Prevention

```typescript
const handleGenerateWorksheet = () => {
  const questions: any[] = [];
  const usedKeys = new Set();
  
  const generateUniqueQuestion = (lvl: string) => {
    let attempts = 0;
    let q: any;
    let uniqueKey: string;
    
    do {
      q = generateQuestion(lvl);
      
      // Create unique key based on question parameters
      uniqueKey = `${q.type}-${q.mainValue}-${q.level}`;
      
      attempts++;
      if (attempts > 100) break; // Safety break
    } while (usedKeys.has(uniqueKey));
    
    usedKeys.add(uniqueKey);
    return q;
  };
  
  // Generate questions...
};
```

---

## 🔢 MATHEMATICAL FORMATTING

```typescript
// Format coefficient with variable
const formatTerm = (coeff: number, variable: string, power = 1) => {
  if (coeff === 0) return '';
  let term = Math.abs(coeff) === 1 && power > 0 ? variable : Math.abs(coeff) + variable;
  if (power === 2) term += '²';
  if (power === 3) term += '³';
  return term;
};

// Format sign
const formatSign = (value: number, isFirst = false) => {
  if (isFirst) return value < 0 ? '−' : '';
  return value < 0 ? ' − ' : ' + ';
};

// Use minus sign '−' (U+2212) not hyphen '-'
```

---

## 🚨 CRITICAL LAYOUT REQUIREMENTS

### **Matching Toolbars (NEW)**

**CRITICAL CHANGE:** Whiteboard and Single Q modes now have **identical control bars**:
- Same layout, spacing, and button positioning
- Action buttons (New Question, Show Answer) are integrated into the toolbar
- Both modes use `text-6xl` for question display
- Ensures consistent user experience across presentation modes

### **Dividing Lines (NEW)**

All tools must include centered dividing lines:
- **Specification:** 1px height, #d1d5db color, 90% width
- **Implementation:** Inline styles for height/color, centered with flex
- **Placement:** 
  - Between topic selector and mode toggle
  - Between mode toggle and question section
- **Purpose:** Visual separation and improved page hierarchy

### **Two-Line Worksheet Layout (NEW)**

Worksheet controls are organized across two lines:
- **Line 1 (centered):** Questions per level + Differentiated checkbox
- **Line 2 (space-between):** Difficulty selector (left) + Options/Buttons (right)

### **Consistent Sizing Across Modes**

Text sizes, button dimensions, and checkbox sizes are **standardized**:

**Whiteboard & Single Q Mode Controls (IDENTICAL):**
- Question text: `text-6xl` (both modes)
- Labels: `text-sm` (Difficulty label, checkbox labels)
- Dropdown labels: `text-xs`
- Checkboxes: `w-3 h-3`, `text-sm`
- Difficulty buttons: `text-sm`, `w-24`, `px-4 py-2`
- Action buttons: `text-base`, `w-52`, `px-6 py-2`

**Worksheet Mode Controls:**
- Labels: `text-lg` or `text-base`
- Checkboxes: `w-4 h-4`, `text-base`
- Difficulty buttons: `text-lg`, `px-6 py-3`
- Action buttons: `text-base`

### **Universal Layout Rules**

**Checkbox Options:**
- Always stacked vertically using `flex-col gap-1` (whiteboard/single Q) or `gap-2` (worksheet)
- Shortened labels: "In π" not "In terms of π", "Type:" not "Question Type:"

**Difficulty Buttons:**
- Colors: green (Level 1), yellow (Level 2), red (Level 3)
- Always show "Level 1, 2, 3" text

---

## 🎨 STANDARDS

### Colors

```typescript
// Backgrounds
'bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100'  // Main
'bg-white'           // Cards
'bg-gray-100'        // Whiteboard workspace
'bg-green-50'        // Level 1 (differentiated)
'bg-yellow-50'       // Level 2 (differentiated)
'bg-red-50'          // Level 3 (differentiated)

// Buttons
'bg-purple-600'      // Actions & selected state
'bg-emerald-600'     // Show/Hide
'bg-green-600'       // Level 1
'bg-yellow-600'      // Level 2
'bg-red-600'         // Level 3

// Text
'text-purple-900'    // Questions
'text-emerald-600'   // Answers (whiteboard)
'text-blue-600'      // Working content

// Dividers
'#d1d5db'            // Light gray dividing lines (gray-300)
```

### Font Sizes

```typescript
'text-6xl'   // Whiteboard & Single Q questions/answers (UPDATED)
'text-5xl'   // Page title
'text-3xl'   // Working steps, worksheet heading
'text-2xl'   // Level headings (differentiated)
'text-xl'    // Worksheet questions, mode buttons
'text-lg'    // Worksheet controls, difficulty labels
'text-base'  // Action buttons, worksheet options
'text-sm'    // Whiteboard/Single Q difficulty label & checkboxes (UPDATED)
'text-xs'    // Dropdown labels
```

---

## ✅ REQUIREMENTS CHECKLIST

**Mathematical:**
- [ ] All calculations correct
- [ ] Questions mathematically valid
- [ ] Working shows actual computation
- [ ] Edge cases handled
- [ ] No duplicate questions in worksheets

**Visual:**
- [ ] Whiteboard text is text-6xl
- [ ] Single Q text is text-6xl (UPDATED - matches Whiteboard)
- [ ] Large touch-friendly buttons
- [ ] High contrast throughout
- [ ] Graphical layout (if applicable) has diagram beside workspace
- [ ] Dividing lines present and properly styled

**Functionality:**
- [ ] Three modes present (Whiteboard, Single Q, Worksheet)
- [ ] Whiteboard has 500px workspace (or side-by-side layout for graphical tools)
- [ ] Difficulty buttons functional
- [ ] Show/hide works in all modes
- [ ] Differentiated mode works
- [ ] Mode switching smooth
- [ ] Checkboxes stacked vertically
- [ ] Consistent formatting across all modes

**Layout:**
- [ ] Whiteboard & Single Q use identical control bars (NEW)
- [ ] Controls: Difficulty (left), Options (middle), Actions (right)
- [ ] Dividing lines: 1px, #d1d5db, 90% width, centered (NEW)
- [ ] Worksheet two-line layout implemented (NEW)
- [ ] Consistent sizing across all three modes
- [ ] Tested in both artifacts AND actual deployment

**UI:**
- [ ] NO icon on worksheet Generate button (text only)
- [ ] Use "Level 1, 2, 3" (not Easy/Medium/Hard)
- [ ] Internal values: 'level1', 'level2', 'level3'
- [ ] Difficulty buttons (not dropdowns)
- [ ] Shortened labels: "In π", "Type:"
- [ ] Topic selectors use white background (not indigo) (NEW)
- [ ] Checkbox labels are text-sm in Whiteboard/Single Q (NEW)

**TypeScript:**
- [ ] Function parameters have type annotations
- [ ] State variables use `<any>` or specific types
- [ ] Arrays typed as `any[]` or specific type
- [ ] File uses TypeScript syntax throughout

---

## 🎯 MULTI-TOPIC SUPPORT (OPTIONAL)

When user requests multi-topic tool, add topic selector ABOVE first dividing line:

```tsx
{/* Topic Selector */}
<div className="flex justify-center gap-3 flex-wrap mb-6">
  {Object.entries(topics).map(([key, topic]) => (
    <button key={key}
      onClick={() => setQuestionType(key)}
      className={'px-8 py-4 rounded-xl font-bold text-xl transition-all ' +
        (questionType === key ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-purple-600 shadow')}>
      {topic.name}
    </button>
  ))}
</div>

{/* Dividing Line 1 */}
<div className="flex justify-center mb-8">
  <div style={{width: '90%', height: '1px', backgroundColor: '#d1d5db'}}></div>
</div>
```

**IMPORTANT:** Topic selectors use **white background** (`bg-white`) matching mode toggles, NOT indigo color.

---

## 📋 REQUESTING TOOLS WITH SPECIFICATIONS

**For standard text-based tools:**
```
"Create a tool for [topic] following the core system specification"
```

**For graphical/visual tools:**
```
"Create a tool for [topic] using the graphical whiteboard layout where the diagram sits beside the annotation workspace"
```

**Specific examples:**
- "Create a circle properties tool with graphical layout showing diameter/radius dimensions"
- "Build a sector tool with graphical whiteboard mode and angle visualization"
- "Make a coordinate geometry tool with graph display alongside working space"
- "Create an algebra expansion tool following standard text layout"

**Important:** 
- All tools are generated in **TypeScript format** for maximum compatibility
- Tools work in both Claude Artifacts (testing) and production environments (Replit, etc.)
- Whiteboard and Single Q modes have **identical control bars**
- Dividing lines separate major sections for visual clarity
- Consistent sizing maintained across all three modes

---

## 📝 SUMMARY OF KEY UPDATES

**New in this version:**
1. **Centered dividing lines** (1px, light gray, 90% width) between sections
2. **Matching toolbars** for Whiteboard and Single Q modes
3. **Unified question size** (text-6xl) for both Whiteboard and Single Q
4. **Increased checkbox font** (text-sm) in Whiteboard and Single Q toolbars
5. **White topic selectors** matching mode toggle styling
6. **Two-line worksheet layout** for better organization
7. **Updated checklist** reflecting all new requirements
