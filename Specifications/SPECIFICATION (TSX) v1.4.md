# Math Tool Core System - Technical Specification v1.4

**Purpose:** Complete technical reference for building interactive mathematics teaching tools  
**Format:** All tools use TypeScript (.tsx) for web integration  
**Updated:** December 2024

---

## 📋 TABLE OF CONTENTS

1. [Core Three-Mode Structure](#core-structure)
2. [TSX/TypeScript Requirements](#tsx-requirements)
3. [Complete Component Template](#component-template)
4. [Mode Specifications](#mode-specs)
5. [Modular Features](#modular-features)
6. [Dynamic Styling for Visual Representations](#dynamic-styling)
7. [Question Generation](#question-generation)
8. [Mathematical Formatting](#math-formatting)
9. [Visual Standards](#visual-standards)
10. [Common Mistakes](#common-mistakes)
11. [Requirements Checklist](#checklist)
12. [Requesting Tools](#requesting)

---

<a name="core-structure"></a>
## 🎯 CORE THREE-MODE STRUCTURE

Every tool has three modes supporting "I Do, We Do, You Do" pedagogy:

**1. Whiteboard Mode**
- Teacher-led demonstration
- Large text display (text-6xl)
- 500px annotation workspace OR side-by-side diagram layout
- Question visible, answer toggleable

**2. Single Question Mode**
- Individual practice with solutions
- Large text display (text-6xl) - MATCHES Whiteboard
- Step-by-step working revealed on demand
- Identical control bar to Whiteboard

**3. Worksheet Mode**
- Multiple questions (1-20 per level)
- Adjustable columns (1-4)
- Standard OR differentiated 3-column layout
- Show/hide answers

---

<a name="tsx-requirements"></a>
## 💻 TSX/TYPESCRIPT REQUIREMENTS

**File Format:** `.tsx` extension  
**Export:** `export default function ToolName()`  
**Types:** Use `any` for prototyping, specific types optional

```tsx
import { useState, useEffect } from 'react';
import { RefreshCw, Eye } from 'lucide-react';

const [mode, setMode] = useState<string>('whiteboard');
const [question, setQuestion] = useState<any>(null);
const [worksheet, setWorksheet] = useState<any[]>([]);

const generateQuestion = (level: string): any => { /* ... */ };
const handleNewQuestion = (): void => { /* ... */ };
```

---

<a name="component-template"></a>
## 🗂️ COMPLETE COMPONENT TEMPLATE

```tsx
import { useState, useEffect } from 'react';
import { RefreshCw, Eye } from 'lucide-react';

export default function ToolName() {
  // ===== STATE =====
  const [mode, setMode] = useState<string>('whiteboard');
  const [difficulty, setDifficulty] = useState<string>('level1');
  const [whiteboardQuestion, setWhiteboardQuestion] = useState<any>(null);
  const [showWhiteboardAnswer, setShowWhiteboardAnswer] = useState<boolean>(false);
  const [question, setQuestion] = useState<any>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [worksheet, setWorksheet] = useState<any[]>([]);
  const [showWorksheetAnswers, setShowWorksheetAnswers] = useState<boolean>(false);
  const [isDifferentiated, setIsDifferentiated] = useState<boolean>(false);
  const [numColumns, setNumColumns] = useState<number>(2);

  // ===== QUESTION GENERATION =====
  const generateQuestion = (level: string): any => {
    // Generate values based on level
    // Calculate answer
    // Create display string
    // Create working steps
    // Return { display, answer, working, values, difficulty }
  };

  // ===== EVENT HANDLERS =====
  const handleNewWhiteboardQuestion = (): void => {
    setWhiteboardQuestion(generateQuestion(difficulty));
    setShowWhiteboardAnswer(false);
  };

  const handleNewQuestion = (): void => {
    setQuestion(generateQuestion(difficulty));
    setShowAnswer(false);
  };

  const handleGenerateWorksheet = (): void => {
    const questions: any[] = [];
    const usedKeys = new Set<string>();
    
    const generateUniqueQuestion = (lvl: string): any => {
      let attempts = 0, q: any, uniqueKey: string;
      do {
        q = generateQuestion(lvl);
        uniqueKey = `${q.values.a}-${q.values.b}`;
        if (++attempts > 100) break;
      } while (usedKeys.has(uniqueKey));
      usedKeys.add(uniqueKey);
      return q;
    };
    
    if (isDifferentiated) {
      ['level1', 'level2', 'level3'].forEach(lvl => {
        for (let i = 0; i < numQuestions; i++) {
          questions.push({ ...generateUniqueQuestion(lvl), difficulty: lvl });
        }
      });
    } else {
      for (let i = 0; i < numQuestions; i++) {
        questions.push({ ...generateUniqueQuestion(difficulty), difficulty });
      }
    }
    setWorksheet(questions);
    setShowWorksheetAnswers(false);
  };

  // ===== EFFECTS =====
  useEffect(() => {
    if (mode === 'whiteboard' && !whiteboardQuestion) handleNewWhiteboardQuestion();
    if (mode === 'single' && !question) handleNewQuestion();
  }, [mode]);

  useEffect(() => {
    if (mode === 'whiteboard' && whiteboardQuestion) handleNewWhiteboardQuestion();
    if (mode === 'single' && question) handleNewQuestion();
  }, [difficulty]);

  // ===== RENDER =====
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8" style={{ color: '#000000' }}>Tool Name</h1>
        
        <div className="flex justify-center mb-8">
          <div style={{ width: '90%', height: '1px', backgroundColor: '#d1d5db' }}></div>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          {['whiteboard', 'single', 'worksheet'].map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={'px-8 py-4 rounded-xl font-bold text-xl transition-all border-2 border-gray-200 ' +
                (mode === m ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-gray-800 hover:bg-gray-100 hover:text-blue-900 shadow')}>
              {m === 'whiteboard' ? 'Whiteboard' : m === 'single' ? 'Single Q' : 'Worksheet'}
            </button>
          ))}
        </div>

        {/* WHITEBOARD & SINGLE Q */}
        {(mode === 'whiteboard' || mode === 'single') && (
          <div className="flex flex-col gap-4" style={mode === 'single' ? { minHeight: '120vh' } : {}}>
            {/* Control Bar */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-600">Difficulty:</span>
                  <div className="flex gap-2">
                    {['level1', 'level2', 'level3'].map((lvl, idx) => (
                      <button key={lvl} onClick={() => setDifficulty(lvl)}
                        className={'px-4 py-2 rounded-lg font-bold text-sm w-24 ' +
                          (difficulty === lvl
                            ? (lvl === 'level1' ? 'bg-green-600 text-white' : lvl === 'level2' ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white')
                            : (lvl === 'level1' ? 'bg-white text-green-600 border-2 border-green-600' : lvl === 'level2' ? 'bg-white text-yellow-600 border-2 border-yellow-600' : 'bg-white text-red-600 border-2 border-red-600'))}>
                        Level {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1">{/* Options */}</div>
                <div className="flex gap-3">
                  <button onClick={mode === 'whiteboard' ? handleNewWhiteboardQuestion : handleNewQuestion}
                    className="px-6 py-2 bg-blue-900 text-white rounded-xl font-bold text-base shadow-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 w-52">
                    <RefreshCw size={18} />New Question
                  </button>
                  <button onClick={() => mode === 'whiteboard' ? setShowWhiteboardAnswer(!showWhiteboardAnswer) : setShowAnswer(!showAnswer)}
                    className="px-6 py-2 bg-blue-900 text-white rounded-xl font-bold text-base shadow-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 w-52">
                    <Eye size={18} />{(mode === 'whiteboard' ? showWhiteboardAnswer : showAnswer) ? 'Hide Answer' : 'Show Answer'}
                  </button>
                </div>
              </div>
            </div>

            {/* WHITEBOARD */}
            {mode === 'whiteboard' && whiteboardQuestion && (
              <div className="bg-white rounded-xl shadow-2xl p-8">
                <div className="text-6xl font-bold text-center mb-6" style={{ color: '#000000' }}>
                  {showWhiteboardAnswer ? whiteboardQuestion.answer : whiteboardQuestion.display}
                </div>
                <div className="bg-gray-100 rounded-xl" style={{ height: '500px' }}></div>
              </div>
            )}

            {/* SINGLE Q */}
            {mode === 'single' && question && (
              <div className="bg-white rounded-xl shadow-2xl p-12">
                <div className="text-6xl font-bold text-center mb-8" style={{ color: '#000000' }}>{question.display}</div>
                {showAnswer && question.working && (
                  <div className="mt-8 space-y-6">
                    <h3 className="text-3xl font-bold mb-6 text-center" style={{ color: '#000000' }}>Solution:</h3>
                    {question.working.map((step: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="text-3xl font-medium" style={{ color: '#000000' }}>{step.content}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* WORKSHEET */}
        {mode === 'worksheet' && (
          <>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="space-y-6">
                <div className="flex justify-center items-center gap-8">
                  <div className="flex items-center gap-3">
                    <label className="text-lg font-semibold">Questions per level:</label>
                    <input type="number" min="1" max="20" value={numQuestions}
                      onChange={(e) => setNumQuestions(Math.max(1, Math.min(20, parseInt(e.target.value) || 5)))}
                      className="w-20 px-4 py-2 border-2 border-gray-300 rounded-lg text-lg" />
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="diff" checked={isDifferentiated}
                      onChange={(e) => setIsDifferentiated(e.target.checked)} className="w-5 h-5" />
                    <label htmlFor="diff" className="text-lg font-semibold">Differentiated</label>
                  </div>
                </div>
                <div className="flex justify-center items-center gap-8">
                  {!isDifferentiated && (
                    <>
                      <div className="flex items-center gap-3">
                        <label className="text-lg font-semibold">Difficulty:</label>
                        <div className="flex gap-2">
                          {['level1', 'level2', 'level3'].map((lvl, idx) => (
                            <button key={lvl} onClick={() => setDifficulty(lvl)}
                              className={'px-6 py-2 rounded-lg font-semibold ' +
                                (difficulty === lvl ? (lvl === 'level1' ? 'bg-green-600 text-white' : lvl === 'level2' ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white') : 'bg-gray-200')}>
                              Level {idx + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-lg font-semibold">Columns:</label>
                        <input type="number" min="1" max="4" value={numColumns}
                          onChange={(e) => setNumColumns(Math.max(1, Math.min(4, parseInt(e.target.value) || 2)))}
                          className="w-20 px-4 py-2 border-2 border-gray-300 rounded-lg text-lg" />
                      </div>
                    </>
                  )}
                  <div className="flex gap-4">
                    <button onClick={handleGenerateWorksheet}
                      className="px-8 py-3 bg-blue-900 text-white rounded-lg font-semibold text-lg hover:bg-blue-800 shadow-lg">
                      Generate Worksheet
                    </button>
                    {worksheet.length > 0 && (
                      <button onClick={() => setShowWorksheetAnswers(!showWorksheetAnswers)}
                        className="px-8 py-3 bg-blue-900 text-white rounded-lg font-semibold text-lg flex items-center gap-2 hover:bg-blue-800 shadow-lg">
                        <Eye size={20} />{showWorksheetAnswers ? 'Hide' : 'Show'} Answers
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {worksheet.length > 0 && (
              <div className="bg-white rounded-xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#000000' }}>Worksheet</h2>
                {isDifferentiated ? (
                  <div className="grid grid-cols-3 gap-6">
                    {['level1', 'level2', 'level3'].map((lvl, idx) => (
                      <div key={lvl}
                        className={'rounded-xl p-6 border-4 ' + (lvl === 'level1' ? 'bg-green-50 border-green-500' : lvl === 'level2' ? 'bg-yellow-50 border-yellow-500' : 'bg-red-50 border-red-500')}>
                        <h3 className="text-2xl font-bold text-center mb-6" style={{ color: '#000000' }}>Level {idx + 1}</h3>
                        <div className="space-y-3">
                          {worksheet.filter(q => q.difficulty === lvl).map((q, i) => (
                            <div key={i} className="text-xl" style={{ color: '#000000' }}>
                              <span className="font-semibold">{i + 1}.</span>
                              <span className="ml-3 font-bold">{q.display}</span>
                              {showWorksheetAnswers && <div className="ml-8 font-semibold mt-1">= {q.answer}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`grid gap-x-6 gap-y-3 ${numColumns === 1 ? 'grid-cols-1' : numColumns === 2 ? 'grid-cols-2' : numColumns === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                    {worksheet.map((q, i) => (
                      <div key={i} className="text-xl" style={{ color: '#000000' }}>
                        <span className="font-semibold">{i + 1}.</span>
                        <span className="ml-2 font-bold">{q.display}</span>
                        {showWorksheetAnswers && <span className="ml-3 font-semibold">= {q.answer}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
```

---

<a name="mode-specs"></a>
## 🎨 MODE SPECIFICATIONS

### **Whiteboard & Single Q: Identical Control Bars**
Both modes use the exact same toolbar. Only the question display area differs.

### **Worksheet Mode: Two-Line Layout**
**Line 1:** Questions per level (1-20) + Differentiated checkbox  
**Line 2:** Difficulty selector + Column selector (1-4) + Action buttons

When differentiated: Hide difficulty and column selectors.

### **Graphical Layout Option**
For tools with visual components (geometry, graphs):

```tsx
<div className="flex gap-6">
  <div className="bg-white rounded-xl flex items-center justify-center"
       style={{ width: '450px', height: '500px' }}>
    {renderDiagram(question, 400)}
  </div>
  <div className="flex-1 bg-gray-100 rounded-xl p-6" style={{ minHeight: '500px' }}></div>
</div>
```

---

<a name="modular-features"></a>
## 🔧 MODULAR FEATURES

Tools are created in **standard form by default**. Features can be requested during creation or added later.

---

### **FEATURE 1: Dyslexia-Friendly Color Scheme**

**Request:** *"Add dyslexia-friendly coloring"*

**1. Add state and helpers:**
```tsx
const [colorScheme, setColorScheme] = useState<string>('default');

const getStepBg = () => colorScheme === 'blue' ? '#B3D9F2' : '#f3f4f6';
const getQuestionBg = () => colorScheme === 'blue' ? '#D1E7F8' : '#ffffff';
const getWhiteboardWorkingBg = () => colorScheme === 'blue' ? '#B3D9F2' : '#f3f4f6';
const getFinalAnswerBg = () => colorScheme === 'blue' ? '#B3D9F2' : '#f3f4f6';
```

**2. Visual Hierarchy Principle**

**CORE RULE:** ALL visual elements in question display areas must use dynamic backgrounds.

**Areas affected:**
- Whiteboard: Question box + workspace
- Single Q: Question box + working steps + final answer box
- Worksheet: Questions display container

**Two-Blue System:**

**PRIMARY (Lighter): `#D1E7F8`** → Main content (question displays, calculation areas)  
**SECONDARY (Darker): `#B3D9F2`** → Support elements (labels, steps, workspaces)

**Usage rule:**
- Main content → PRIMARY (lighter)
- Containers/labels/support → SECONDARY (darker)
- Matching elements → SAME color

**3. Universal Text Color Rule**

**ALL text on colored backgrounds MUST be `#000000` (black)**

```tsx
// ❌ WRONG
<h4 style={{ color: '#4B5563' }}>Step 1</h4>
<p className="text-gray-600">Explanation</p>

// ✅ CORRECT
<h4 style={{ color: '#000000' }}>Step 1</h4>
<p style={{ color: '#000000' }}>Explanation</p>
```

**Exception:** White text on dark backgrounds (e.g., `bg-blue-900` buttons).

---

### **FEATURE 2: Header Bar with Navigation**

**Request:** *"Add header bar"*

**1. Add imports:**
```tsx
import { RefreshCw, Eye, Home, Menu, X } from 'lucide-react';
```

**2. Add state:**
```tsx
const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
```

**3. Wrap return:**
```tsx
return (
  <>
    <div className="bg-blue-900 shadow-lg">
      <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
        <button onClick={() => window.location.href = '/'}
          className="flex items-center gap-2 text-white hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors">
          <Home size={24} /><span className="font-semibold text-lg">Home</span>
        </button>
        <div className="relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:bg-blue-800 p-2 rounded-lg transition-colors">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border-2 border-gray-200 overflow-hidden z-50">
              <div className="py-2">
                {typeof colorScheme !== 'undefined' && (
                  <>
                    <div className="px-6 py-2 font-bold text-gray-700 text-sm uppercase tracking-wide">Color Schemes</div>
                    <button onClick={() => setColorScheme('default')}
                      className={'w-full text-left px-6 py-3 font-semibold transition-colors ' +
                        (colorScheme === 'default' ? 'bg-blue-100 text-blue-900' : 'text-gray-800 hover:bg-gray-100')}>
                      Default
                    </button>
                    <button onClick={() => setColorScheme('blue')}
                      className={'w-full text-left px-6 py-3 font-semibold transition-colors ' +
                        (colorScheme === 'blue' ? 'bg-blue-100 text-blue-900' : 'text-gray-800 hover:bg-gray-100')}>
                      Blue (Dyslexia-friendly)
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    <div className="min-h-screen bg-gray-50 p-8">{/* Rest of tool */}</div>
  </>
);
```

---

<a name="dynamic-styling"></a>
## 🎨 DYNAMIC STYLING FOR VISUAL REPRESENTATIONS

### **Implementation Pattern**

**Step 1: Identify ALL backgrounds** in Whiteboard, Single Q, and Worksheet displays.

**Step 2: Create helpers for each visual role:**
```tsx
// Main content (lighter)
const getQuestionBg = () => colorScheme === 'blue' ? '#D1E7F8' : '#ffffff';

// Support (darker)
const getStepBg = () => colorScheme === 'blue' ? '#B3D9F2' : '#f3f4f6';
const getFinalAnswerBg = () => colorScheme === 'blue' ? '#B3D9F2' : '#f3f4f6';

// Representation-specific
const getRepresentationLabel = () => colorScheme === 'blue' ? '#B3D9F2' : '#dbeafe';
const getRepresentationContent = () => colorScheme === 'blue' ? '#D1E7F8' : '#ffffff';
```

**Step 3: Replace static classes:**
```tsx
// ❌ BEFORE
<div className="bg-white">Content</div>
<div className="bg-gray-100">Support</div>

// ✅ AFTER
<div style={{ backgroundColor: getQuestionBg() }}>Content</div>
<div style={{ backgroundColor: getStepBg() }}>Support</div>
```

**Step 4: Make text black:**
```tsx
<div style={{ backgroundColor: getStepBg() }}>
  <h4 style={{ color: '#000000' }}>Title</h4>
  <p style={{ color: '#000000' }}>Content</p>
</div>
```

**Step 5: Maintain consistency** - Matching elements use the same helper.

---

### **Examples by Type**

**Tables/Grids:**
```tsx
const getTableLabelBg = () => colorScheme === 'blue' ? '#B3D9F2' : '#dbeafe';
const getTableCellBg = () => colorScheme === 'blue' ? '#D1E7F8' : '#ffffff';

<table>
  <tr>
    <td style={{ backgroundColor: getTableLabelBg(), color: '#000000' }}>Header</td>
    <td style={{ backgroundColor: getTableCellBg(), color: '#000000' }}>Value</td>
  </tr>
</table>
```

**Bar Models (for ratio/proportion tools):**
```tsx
const getBarEmptyBg = () => colorScheme === 'blue' ? '#D1E7F8' : '#ffffff';
const getBarKnownBg = () => colorScheme === 'blue' ? '#B3D9F2' : '#93c5fd';

<div className="flex gap-1">
  <div className="w-20 h-20 border-4" style={{ 
    backgroundColor: bar.isKnown ? getBarKnownBg() : getBarEmptyBg(),
    borderColor: bar.isKnown ? '#1e3a8a' : '#9ca3af'
  }}></div>
</div>
```

**Diagrams (SVG):**
```tsx
const getDiagramRegion1 = () => colorScheme === 'blue' ? '#B3D9F2' : '#dbeafe';
const getDiagramRegion2 = () => colorScheme === 'blue' ? '#D1E7F8' : '#fef3c7';

<svg>
  <circle fill={getDiagramRegion1()} />
  <rect fill={getDiagramRegion2()} />
</svg>
```

---

### **Verification Process**

**Phase 1: Background Search**
- Search `bg-white` → Replace in display areas with `getQuestionBg()`
- Search `bg-gray-50`, `bg-gray-100` → Replace with helpers
- Search `bg-blue-`, `bg-purple-`, `bg-pink-` → Replace with helpers
- Keep: `bg-green-50`, `bg-yellow-50`, `bg-red-50` (differentiated only)

**Phase 2: Text Color Search**
- Search `text-gray-600`, `text-gray-500`, `text-gray-700` → Replace with `color: '#000000'`
- Search `color: '#4B5563'`, `color: '#6B7280'` → Replace with `color: '#000000'`

**Phase 3: Visual Check**
- [ ] Toggle color schemes - all backgrounds change
- [ ] Matching elements are same shade
- [ ] Main content lighter than support areas
- [ ] All text on blue is black and readable
- [ ] Visual hierarchy maintained

**Phase 4: Specific Areas**
- [ ] Whiteboard: Question + workspace use helpers
- [ ] Single Q: Question + steps + answer use helpers
- [ ] Worksheet: Container uses helper
- [ ] All visual representations use helpers

---

<a name="question-generation"></a>
## 🎲 QUESTION GENERATION

### **Level-Based Ranges**
```tsx
const generateQuestion = (level: string): any => {
  let values: any;
  
  if (level === 'level1') {
    values = { a: Math.floor(Math.random() * 8) + 2 };  // Simple: 2-9
  } else if (level === 'level2') {
    values = { a: Math.floor(Math.random() * 15) + 5 };  // Medium: 5-19
  } else {
    values = { a: Math.floor(Math.random() * 19) - 9 };  // Hard: -9 to 9
    if (values.a === 0) values.a = 1;
  }
  
  const answer = /* calculate */;
  const display = /* format */;
  const working = [{ type: 'step', content: '...' }];
  
  return { display, answer: answer.toString(), working, values, difficulty: level };
};
```

### **Duplicate Prevention**
```tsx
const generateUniqueQuestion = (lvl: string): any => {
  let attempts = 0, q: any, uniqueKey: string;
  do {
    q = generateQuestion(lvl);
    uniqueKey = `${q.values.a}-${q.values.b}`;
    if (++attempts > 100) break;
  } while (usedKeys.has(uniqueKey));
  usedKeys.add(uniqueKey);
  return q;
};
```

---

<a name="math-formatting"></a>
## 🔢 MATHEMATICAL FORMATTING

### **Signs**
```tsx
const formatSign = (value: number, isFirst: boolean = false): string => {
  if (isFirst) return value < 0 ? '−' : '';
  return value < 0 ? ' − ' : ' + ';
};
// CRITICAL: Use minus '−' (U+2212) NOT hyphen '-'
```

### **Terms**
```tsx
const formatTerm = (coeff: number, variable: string, power: number = 1): string => {
  if (coeff === 0) return '';
  let term = Math.abs(coeff) === 1 && power > 0 ? variable : Math.abs(coeff) + variable;
  if (power === 2) term += '²';
  if (power === 3) term += '³';
  return term;
};
```

### **Fractions**
```tsx
const formatFraction = (num: number, den: number): string => {
  if (den === 1) return num.toString();
  return `${num}/${den}`;  // Or use '⁄' (U+2044) for display
};
```

---

<a name="visual-standards"></a>
## 🎨 VISUAL STANDARDS

### **Colors**
```tsx
// Primary
'bg-blue-900'        // Buttons
'hover:bg-blue-800'  // Hover

// Backgrounds (without Feature 1)
'bg-gray-50'   // Page
'bg-white'     // Cards
'bg-gray-100'  // Workspace

// Backgrounds (with Feature 1) - use helpers
style={{ backgroundColor: getQuestionBg() }}
style={{ backgroundColor: getStepBg() }}

// Text
style={{ color: '#000000' }}  // On colored backgrounds
'text-gray-600'               // Control areas only

// Difficulty
'bg-green-600'   'bg-yellow-600'   'bg-red-600'

// Differentiated (keep as-is)
'bg-green-50 border-green-500'
'bg-yellow-50 border-yellow-500'
'bg-red-50 border-red-500'
```

### **Typography**
```tsx
'text-6xl'   // Questions/answers (Whiteboard & Single Q)
'text-5xl'   // Page title
'text-3xl'   // Steps, worksheet heading
'text-2xl'   // Level headings
'text-xl'    // Worksheet questions, mode buttons
'text-lg'    // Controls, labels
'text-base'  // Action buttons
'text-sm'    // Difficulty label, checkboxes
```

### **Layout**
```tsx
// Dividing lines
<div style={{ width: '90%', height: '1px', backgroundColor: '#d1d5db' }}></div>

// Dimensions
style={{ height: '500px' }}  // Workspaces
style={{ width: '450px', height: '500px' }}  // Diagrams

// Buttons
'w-52'  // Actions
'w-24'  // Difficulty
'w-20'  // Inputs
```

---

<a name="common-mistakes"></a>
## ⚠️ COMMON MISTAKES

### **Mistake 1: Forgetting Major Containers**
❌ Wrong: Converting steps but leaving worksheet as `bg-white`  
✅ Right: ALL display areas use helpers

### **Mistake 2: Random Blue Shades**
❌ Wrong: 4+ different blues without purpose  
✅ Right: Exactly 2 blues - lighter for main, darker for support

### **Mistake 3: Inconsistent Elements**
❌ Wrong: Step boxes using different shades  
✅ Right: All similar elements use identical helper

### **Mistake 4: Grey Text on Blue**
❌ Wrong: `text-gray-600` or `color: '#4B5563'` on colored backgrounds  
✅ Right: ALL text on colored backgrounds is `color: '#000000'`

### **Mistake 5: Partial Implementation**
❌ Wrong: Converting 2 of 4 cells in a grid  
✅ Right: If ANY part has color, ALL parts use helpers

### **Mistake 6: Hardcoding Colors**
❌ Wrong: `backgroundColor: colorScheme === 'blue' ? '#D1E7F8' : '#ffffff'` everywhere  
✅ Right: Named helper functions used consistently

### **Mistake 7: Wrong Hierarchy**
❌ Wrong: Main content darker than support  
✅ Right: Main content (lighter) stands out from support (darker)

### **Mistake 8: Mismatched Elements**
❌ Wrong: Answer box different blue than step boxes  
✅ Right: Matching elements use same helper

---

<a name="checklist"></a>
## ✅ REQUIREMENTS CHECKLIST

### **Core Functionality**
- [ ] Three modes (Whiteboard, Single Q, Worksheet) present and functional
- [ ] Whiteboard & Single Q use identical control bars
- [ ] Difficulty switching works in all modes
- [ ] Show/hide toggles correctly
- [ ] Questions mathematically valid and correct
- [ ] No duplicate questions in worksheets
- [ ] Worksheet column selector (1-4) functional
- [ ] Differentiated mode hides difficulty/column selectors

### **Visual Standards**
- [ ] Whiteboard & Single Q text is text-6xl
- [ ] Main text on colored backgrounds: `color: '#000000'`
- [ ] Primary buttons: `bg-blue-900`
- [ ] Page background: `bg-gray-50`
- [ ] High contrast throughout
- [ ] Dividing lines: 1px, #d1d5db, 90% width, centered
- [ ] Button widths: w-52 (actions), w-24 (difficulty), w-20 (inputs)

### **TypeScript**
- [ ] File extension is .tsx
- [ ] Function parameters have type annotations
- [ ] No TypeScript errors

### **Feature 1 (if included)**
- [ ] Color scheme state and helpers implemented
- [ ] Whiteboard question display uses `getQuestionBg()`
- [ ] Whiteboard workspace uses `getWhiteboardWorkingBg()`
- [ ] Single Q question display uses `getQuestionBg()`
- [ ] Single Q step boxes use `getStepBg()`
- [ ] Single Q answer box uses `getFinalAnswerBg()` matching `getStepBg()`
- [ ] Worksheet container uses `getQuestionBg()`
- [ ] All visual representations use helpers
- [ ] ALL text on blue backgrounds is black `#000000`
- [ ] No `text-gray-`, `bg-gray-5`, `bg-gray-1`, `bg-blue-`, `bg-purple-`, `bg-pink-` remain
- [ ] Elements that should match use same blue shade
- [ ] Color scheme toggle tested - all visuals change

### **Feature 2 (if included)**
- [ ] Header bar with Home button functional
- [ ] Menu dropdown opens/closes correctly
- [ ] Color scheme selector in menu (if Feature 1 also included)

---

<a name="requesting"></a>
## 📋 REQUESTING TOOLS

### **Standard Request**
```
"Create a [topic] tool following the specification"
```
Creates: Three modes, difficulty levels, adjustable columns

### **With Layout**
```
"Create a [topic] tool with graphical whiteboard layout"
```

### **With Features**
```
"Create a [topic] tool with [feature names]"
```
Examples:
- "Create a ratio tool with dyslexia-friendly coloring"
- "Create an algebra tool with header bar and color scheme options"

### **Adding Features Later**
```
"Add [feature name] to this tool"
```

---

## 📝 VERSION HISTORY

**v1.4 (December 2024)**
- Added principle-based Visual Hierarchy rules for Feature 1
- Added Universal Text Color Rule (black on all colored backgrounds)
- Replaced implementation-specific examples with general patterns
- Added 4-phase verification process
- Reorganized Common Mistakes to be non-implementation-specific
- Updated checklist with Feature 1 verification items
- Fixed template: worksheet display uses `getQuestionBg()`
- Clarified Feature 1 applies to ANY visual representation
- Emphasized two-blue system: lighter main, darker support

**v1.3 (December 2024)**
- Made column selector standard feature
- Added Dynamic Styling section
- Strengthened Feature 1 integration
- Added helper function naming conventions
- Enhanced checklist with visual requirements

**v1.2 (December 2024)**
- Added modular features system
- Blue-first color palette
- Standardized text colors
- Bar model patterns
- Single Q min-height: 120vh

**v1.1**
- Centered dividing lines
- Matching toolbars
- Unified question size
- Two-line worksheet layout

**v1.0**
- Initial specification

---

## 🎯 SPECIFICATION GOALS

This specification:
1. Enables error-free tool creation
2. Supports modular development
3. Ensures consistency
4. Facilitates web integration
5. Maintains flexibility
6. Prevents common mistakes
7. Supports accessibility

**When in doubt, prioritize:**
- Mathematical accuracy
- Clarity over brevity
- Consistency over customization
- Functionality over aesthetics
- Dynamic styling when Feature 1 enabled
- Visual hierarchy (lighter = main, darker = support)
- Black text on all colored backgrounds

---

**End of Specification v1.4**