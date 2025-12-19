# Math Tool Core System - Technical Specification v1.2

**Purpose:** Complete technical reference for building interactive mathematics teaching tools  
**Format:** All tools use TypeScript (.tsx) for web integration  
**Updated:** December 2024

---

## 📋 TABLE OF CONTENTS

1. [Core Three-Mode Structure](#core-structure)
2. [TSX/TypeScript Requirements](#tsx-requirements)
3. [Complete Component Template](#component-template)
4. [Mode Specifications](#mode-specs)
5. [Modular Features (Add On Request)](#modular-features)
6. [Question Generation Patterns](#question-generation)
7. [Mathematical Formatting](#math-formatting)
8. [Visual Standards](#visual-standards)
9. [Bar Model Patterns](#bar-models)
10. [Requirements Checklist](#checklist)
11. [Requesting Tools](#requesting)

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
- Standard 2-column OR differentiated 3-column layout
- Show/hide answers
- Print-friendly design

---

<a name="tsx-requirements"></a>
## 💻 TSX/TYPESCRIPT REQUIREMENTS

### **File Format**
- **Extension:** `.tsx` (not .jsx)
- **Import syntax:** No React import needed for modern setups
- **Export:** `export default function ToolName()`

### **Type Annotations**

```tsx
import { useState, useEffect } from 'react';
import { RefreshCw, Eye } from 'lucide-react';

// State declarations
const [mode, setMode] = useState<string>('whiteboard');
const [difficulty, setDifficulty] = useState<string>('level1');
const [question, setQuestion] = useState<any>(null);
const [worksheet, setWorksheet] = useState<any[]>([]);

// Function parameters
const generateQuestion = (level: string): any => {
  // Implementation
};

const handleNewQuestion = (): void => {
  setQuestion(generateQuestion(difficulty));
};
```

**Note:** Using `any` type is acceptable for prototyping. Specific type definitions optional.

---

<a name="component-template"></a>
## 🗂️ COMPLETE COMPONENT TEMPLATE

```tsx
import { useState, useEffect } from 'react';
import { RefreshCw, Eye } from 'lucide-react';

export default function ToolName() {
  // ===== STATE MANAGEMENT =====
  const [mode, setMode] = useState<string>('whiteboard');
  const [difficulty, setDifficulty] = useState<string>('level1');
  
  // Whiteboard mode
  const [question, setQuestion] = useState<any>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  
  // Single Q mode (uses same question state in this template)
  // Or separate state if needed:
  // const [singleQuestion, setSingleQuestion] = useState<any>(null);
  // const [showSingleAnswer, setShowSingleAnswer] = useState<boolean>(false);
  
  // Worksheet mode
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [worksheet, setWorksheet] = useState<any[]>([]);
  const [showWorksheetAnswers, setShowWorksheetAnswers] = useState<boolean>(false);
  const [isDifferentiated, setIsDifferentiated] = useState<boolean>(false);

  // ===== QUESTION GENERATION =====
  const generateQuestion = (level: string): any => {
    let values: any;
    
    if (level === 'level1') {
      // Simple: small positive integers
      values = {
        a: Math.floor(Math.random() * 8) + 2,  // 2-9
        b: Math.floor(Math.random() * 8) + 2   // 2-9
      };
    } else if (level === 'level2') {
      // Medium: larger ranges
      values = {
        a: Math.floor(Math.random() * 15) + 5,  // 5-19
        b: Math.floor(Math.random() * 15) + 5   // 5-19
      };
    } else {
      // Hard: including negatives
      values = {
        a: Math.floor(Math.random() * 19) - 9,  // -9 to 9
        b: Math.floor(Math.random() * 19) - 9   // -9 to 9
      };
      if (values.a === 0) values.a = 1;
      if (values.b === 0) values.b = 1;
    }
    
    // Calculate answer (MUST BE CORRECT)
    const answer = values.a + values.b;
    
    // Create display string
    const display = `${values.a} + ${values.b} = ?`;
    
    // Create working steps
    const working = [
      {
        type: 'given',
        content: `${values.a} + ${values.b}`
      },
      {
        type: 'answer',
        content: `= ${answer}`
      }
    ];
    
    return {
      display,
      answer: answer.toString(),
      working,
      values,
      difficulty: level
    };
  };

  // ===== EVENT HANDLERS =====
  const handleNewQuestion = (): void => {
    setQuestion(generateQuestion(difficulty));
    setShowAnswer(false);
  };

  const handleGenerateWorksheet = (): void => {
    const questions: any[] = [];
    const usedKeys = new Set<string>();
    
    const generateUniqueQuestion = (lvl: string): any => {
      let attempts = 0;
      let q: any;
      let uniqueKey: string;
      
      do {
        q = generateQuestion(lvl);
        uniqueKey = `${q.values.a}-${q.values.b}`;
        attempts++;
        if (attempts > 100) break;
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
    if ((mode === 'whiteboard' || mode === 'single') && !question) {
      handleNewQuestion();
    }
  }, [mode]);

  useEffect(() => {
    if ((mode === 'whiteboard' || mode === 'single') && question) {
      handleNewQuestion();
    }
  }, [difficulty]);

  // ===== RENDER =====
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-5xl font-bold text-center mb-8" style={{ color: '#000000' }}>
          Tool Name
        </h1>

        {/* Dividing Line */}
        <div className="flex justify-center mb-8">
          <div style={{ width: '90%', height: '1px', backgroundColor: '#d1d5db' }}></div>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          {['whiteboard', 'single', 'worksheet'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={'px-8 py-4 rounded-xl font-bold text-xl transition-all border-2 border-gray-200 ' +
                (mode === m
                  ? 'bg-blue-900 text-white shadow-lg'
                  : 'bg-white text-gray-800 hover:bg-gray-100 hover:text-blue-900 shadow')}>
              {m === 'whiteboard' ? 'Whiteboard' : m === 'single' ? 'Single Q' : 'Worksheet'}
            </button>
          ))}
        </div>

        {/* MODE CONTENT */}
        {(mode === 'whiteboard' || mode === 'single') && (
          <div className="flex flex-col gap-4" style={mode === 'single' ? { minHeight: '120vh' } : {}}>
            {/* Control Bar - IDENTICAL FOR BOTH MODES */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between">
                {/* Difficulty */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-600">Difficulty:</span>
                  <div className="flex gap-2">
                    {['level1', 'level2', 'level3'].map((lvl, idx) => (
                      <button
                        key={lvl}
                        onClick={() => setDifficulty(lvl)}
                        className={'px-4 py-2 rounded-lg font-bold text-sm w-24 ' +
                          (difficulty === lvl
                            ? (lvl === 'level1' ? 'bg-green-600 text-white' :
                               lvl === 'level2' ? 'bg-yellow-600 text-white' :
                               'bg-red-600 text-white')
                            : (lvl === 'level1' ? 'bg-white text-green-600 border-2 border-green-600' :
                               lvl === 'level2' ? 'bg-white text-yellow-600 border-2 border-yellow-600' :
                               'bg-white text-red-600 border-2 border-red-600'))}>
                        Level {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Options - stacked vertically */}
                <div className="flex flex-col gap-1">
                  {/* Add checkboxes here if needed */}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleNewQuestion}
                    className="px-6 py-2 bg-blue-900 text-white rounded-xl font-bold text-base shadow-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 w-52">
                    <RefreshCw size={18} />
                    New Question
                  </button>
                  <button
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="px-6 py-2 bg-blue-900 text-white rounded-xl font-bold text-base shadow-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 w-52">
                    <Eye size={18} />
                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                  </button>
                </div>
              </div>
            </div>

            {/* Question Display */}
            {question && (
              <div className="bg-white rounded-xl shadow-2xl p-8">
                {mode === 'whiteboard' ? (
                  <>
                    {!showAnswer ? (
                      <div className="text-6xl font-bold text-center mb-6" style={{ color: '#000000' }}>
                        {question.display}
                      </div>
                    ) : (
                      <div className="text-6xl font-bold text-center mb-6" style={{ color: '#000000' }}>
                        {question.answer}
                      </div>
                    )}
                    
                    {/* 500px Annotation Workspace */}
                    <div className="bg-gray-100 rounded-xl" style={{ height: '500px' }}></div>
                  </>
                ) : (
                  <>
                    <div className="text-6xl font-bold text-center mb-8" style={{ color: '#000000' }}>
                      {question.display}
                    </div>
                    
                    {showAnswer && question.working && (
                      <div className="mt-8 space-y-6">
                        <h3 className="text-3xl font-bold mb-6 text-center" style={{ color: '#000000' }}>
                          Solution:
                        </h3>
                        {question.working.map((step: any, idx: number) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <div className="text-3xl font-medium" style={{ color: '#000000' }}>
                              {step.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* WORKSHEET MODE */}
        {mode === 'worksheet' && (
          <>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="space-y-6">
                {/* Line 1: Questions & Differentiated */}
                <div className="flex justify-center items-center gap-8">
                  <div className="flex items-center gap-3">
                    <label className="text-lg font-semibold">Questions per level:</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(Math.max(1, Math.min(20, parseInt(e.target.value) || 5)))}
                      className="w-20 px-4 py-2 border-2 border-gray-300 rounded-lg text-lg"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="diff"
                      checked={isDifferentiated}
                      onChange={(e) => setIsDifferentiated(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <label htmlFor="diff" className="text-lg font-semibold">Differentiated</label>
                  </div>
                </div>

                {/* Line 2: Difficulty & Actions */}
                <div className="flex justify-center items-center gap-8">
                  {!isDifferentiated && (
                    <div className="flex items-center gap-3">
                      <label className="text-lg font-semibold">Difficulty:</label>
                      <div className="flex gap-2">
                        {['level1', 'level2', 'level3'].map((lvl, idx) => (
                          <button
                            key={lvl}
                            onClick={() => setDifficulty(lvl)}
                            className={'px-6 py-2 rounded-lg font-semibold ' +
                              (difficulty === lvl
                                ? (lvl === 'level1' ? 'bg-green-600 text-white' :
                                   lvl === 'level2' ? 'bg-yellow-600 text-white' :
                                   'bg-red-600 text-white')
                                : 'bg-gray-200')}>
                            Level {idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={handleGenerateWorksheet}
                      className="px-8 py-3 bg-blue-900 text-white rounded-lg font-semibold text-lg hover:bg-blue-800 shadow-lg">
                      Generate Worksheet
                    </button>
                    {worksheet.length > 0 && (
                      <button
                        onClick={() => setShowWorksheetAnswers(!showWorksheetAnswers)}
                        className="px-8 py-3 bg-blue-900 text-white rounded-lg font-semibold text-lg flex items-center gap-2 hover:bg-blue-800 shadow-lg">
                        <Eye size={20} />
                        {showWorksheetAnswers ? 'Hide' : 'Show'} Answers
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Worksheet Display */}
            {worksheet.length > 0 && (
              <div className="bg-white rounded-xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#000000' }}>
                  Worksheet
                </h2>

                {isDifferentiated ? (
                  <div className="grid grid-cols-3 gap-6">
                    {['level1', 'level2', 'level3'].map((lvl, idx) => (
                      <div
                        key={lvl}
                        className={'rounded-xl p-6 border-4 ' +
                          (lvl === 'level1' ? 'bg-green-50 border-green-500' :
                           lvl === 'level2' ? 'bg-yellow-50 border-yellow-500' :
                           'bg-red-50 border-red-500')}>
                        <h3 className="text-2xl font-bold text-center mb-6" style={{ color: '#000000' }}>
                          Level {idx + 1}
                        </h3>
                        <div className="space-y-3">
                          {worksheet.filter(q => q.difficulty === lvl).map((q, i) => (
                            <div key={i} className="text-xl" style={{ color: '#000000' }}>
                              <span className="font-semibold">{i + 1}.</span>
                              <span className="ml-3 font-bold">{q.display}</span>
                              {showWorksheetAnswers && (
                                <div className="ml-8 font-semibold mt-1">= {q.answer}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    {worksheet.map((q, i) => (
                      <div key={i} className="text-xl" style={{ color: '#000000' }}>
                        <span className="font-semibold">{i + 1}.</span>
                        <span className="ml-2 font-bold">{q.display}</span>
                        {showWorksheetAnswers && (
                          <span className="ml-3 font-semibold">= {q.answer}</span>
                        )}
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

### **Key Principle: Whiteboard & Single Q Share Identical Control Bars**

Both modes use the **exact same toolbar** for consistency. Only the question display area differs.

### **Graphical Layout Option**

For tools with visual components (geometry, circles, graphs), use side-by-side layout:

```tsx
<div className="flex gap-6">
  {/* Diagram (Left) */}
  <div className="bg-white rounded-xl flex items-center justify-center"
       style={{ width: '450px', height: '500px' }}>
    {renderDiagram(question, 400)}
  </div>
  
  {/* Annotation Space (Right) */}
  <div className="flex-1 bg-gray-100 rounded-xl p-6"
       style={{ minHeight: '500px' }}>
  </div>
</div>
```

---

<a name="modular-features"></a>
## 🔧 MODULAR FEATURES (Add On Request)

Tools are created in **standard form by default**. These features can be:
- Requested during creation: *"Create [tool] with header bar and dyslexia coloring"*
- Added later: *"Add dyslexia coloring to this tool"*

**Code rewrites expected and acceptable when adding features.**

---

### **🎨 FEATURE 1: Dyslexia-Friendly Color Scheme**

**Request:** *"Add dyslexia-friendly coloring"* OR *"Include color scheme options"*

#### **Integration Steps:**

**1. Add state and helper functions (after existing state):**

```tsx
const [colorScheme, setColorScheme] = useState<string>('default');

// Color helper functions
const getStepBg = () => colorScheme === 'blue' ? '#B3D9F2' : '#f3f4f6';
const getQuestionBg = () => colorScheme === 'blue' ? '#D1E7F8' : '#ffffff';
const getWhiteboardWorkingBg = () => colorScheme === 'blue' ? '#B3D9F2' : '#f3f4f6';
const getBarEmptyBg = () => colorScheme === 'blue' ? '#D1E7F8' : '#ffffff';
const getBarFilledBg = () => colorScheme === 'blue' ? '#9ec9e3' : '#d1d5db';
const getBarKnownBg = () => colorScheme === 'blue' ? '#7eb8e0' : '#93c5fd';
const getBarDiffBg = () => colorScheme === 'blue' ? '#d8b4fe' : '#e9d5ff';
```

**2. Replace hardcoded backgrounds:**

```tsx
// BEFORE
<div className="bg-gray-50 rounded-lg p-6">

// AFTER
<div className="rounded-lg p-6" style={{ backgroundColor: getStepBg() }}>
```

**3. Apply to all background elements:**
- Step containers → `getStepBg()`
- Question display → `getQuestionBg()`
- Whiteboard workspace → `getWhiteboardWorkingBg()`
- Bar model boxes → appropriate helper

**4. Add color scheme selector (if no header bar, create standalone control):**

See Feature 2 for integration with header bar menu.

---

### **🏠 FEATURE 2: Header Bar with Navigation**

**Request:** *"Add header bar"* OR *"Include navigation header"*

#### **Integration Steps:**

**1. Add imports:**

```tsx
import { RefreshCw, Eye, Home, Menu, X } from 'lucide-react';
```

**2. Add state:**

```tsx
const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
```

**3. Wrap return with header bar:**

```tsx
return (
  <>
    {/* Header Bar */}
    <div className="bg-blue-900 shadow-lg">
      <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
        <button
          onClick={() => {/* Navigate to homepage */}}
          className="flex items-center gap-2 text-white hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors">
          <Home size={24} />
          <span className="font-semibold text-lg">Home</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:bg-blue-800 p-2 rounded-lg transition-colors">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border-2 border-gray-200 overflow-hidden z-50">
              <div className="py-2">
                <div className="px-6 py-2 font-bold text-gray-700 text-sm uppercase tracking-wide">
                  Options
                </div>
                
                {/* If Feature 1 included, add color scheme buttons here */}
                {typeof colorScheme !== 'undefined' && (
                  <>
                    <div className="px-6 py-2 font-bold text-gray-700 text-sm uppercase tracking-wide">
                      Color Schemes
                    </div>
                    <button
                      onClick={() => setColorScheme('default')}
                      className={'w-full text-left px-6 py-3 font-semibold transition-colors ' +
                        (colorScheme === 'default' ? 'bg-blue-100 text-blue-900' : 'text-gray-800 hover:bg-gray-100')}>
                      Default
                    </button>
                    <button
                      onClick={() => setColorScheme('blue')}
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

    {/* Existing content */}
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Rest of tool */}
    </div>
  </>
);
```

---

### **📊 FEATURE 3: Worksheet Column Control**

**Request:** *"Add column control"* OR *"Make columns adjustable"*

#### **Integration Steps:**

**1. Add state:**

```tsx
const [numColumns, setNumColumns] = useState<number>(2);
```

**2. Add control in worksheet mode (line 2, with difficulty):**

```tsx
{!isDifferentiated && (
  <>
    {/* Existing difficulty buttons */}
    
    <div className="flex items-center gap-3">
      <label className="text-lg font-semibold">Columns:</label>
      <input
        type="number"
        min="1"
        max="4"
        value={numColumns}
        onChange={(e) => setNumColumns(Math.max(1, Math.min(4, parseInt(e.target.value) || 2)))}
        className="w-20 px-4 py-2 border-2 border-gray-300 rounded-lg text-lg"
      />
    </div>
  </>
)}
```

**3. Update worksheet grid:**

```tsx
<div className={`grid gap-x-6 gap-y-3 ${
  numColumns === 1 ? 'grid-cols-1' :
  numColumns === 2 ? 'grid-cols-2' :
  numColumns === 3 ? 'grid-cols-3' :
  'grid-cols-4'
}`}>
```

---

<a name="question-generation"></a>
## 🎲 QUESTION GENERATION PATTERNS

### **Level-Based Value Ranges**

```tsx
const generateQuestion = (level: string): any => {
  let values: any;
  
  if (level === 'level1') {
    // Simple: small positive integers
    values = {
      a: Math.floor(Math.random() * 8) + 2,  // 2-9
      b: Math.floor(Math.random() * 5) + 1   // 1-5
    };
  } else if (level === 'level2') {
    // Medium: larger ranges, some negatives
    values = {
      a: Math.floor(Math.random() * 15) + 5,  // 5-19
      b: Math.floor(Math.random() * 10) - 3   // -3 to 6
    };
  } else {
    // Hard: full range including negatives
    values = {
      a: Math.floor(Math.random() * 19) - 9,  // -9 to 9
      b: Math.floor(Math.random() * 21) - 10  // -10 to 10
    };
    
    // Avoid problematic values
    if (values.a === 0) values.a = 1;
    if (values.b === 0) values.b = 1;
  }
  
  // Calculate answer
  const answer = values.a * values.b;
  
  // Format display
  const display = `${values.a} × ${values.b} = ?`;
  
  // Create working steps
  const working = [
    { type: 'calculation', content: `${values.a} × ${values.b} = ${answer}` }
  ];
  
  return { display, answer: answer.toString(), working, values, difficulty: level };
};
```

### **Duplicate Prevention**

```tsx
const handleGenerateWorksheet = (): void => {
  const questions: any[] = [];
  const usedKeys = new Set<string>();
  
  const generateUniqueQuestion = (lvl: string): any => {
    let attempts = 0;
    let q: any;
    let uniqueKey: string;
    
    do {
      q = generateQuestion(lvl);
      uniqueKey = `${q.values.a}-${q.values.b}-${lvl}`;
      attempts++;
      if (attempts > 100) break; // Safety
    } while (usedKeys.has(uniqueKey));
    
    usedKeys.add(uniqueKey);
    return q;
  };
  
  // Generate questions...
};
```

---

<a name="math-formatting"></a>
## 🔢 MATHEMATICAL FORMATTING

### **Terms and Coefficients**

```tsx
const formatTerm = (coeff: number, variable: string, power: number = 1): string => {
  if (coeff === 0) return '';
  
  let term = Math.abs(coeff) === 1 && power > 0 
    ? variable 
    : Math.abs(coeff) + variable;
  
  if (power === 2) term += '²';
  if (power === 3) term += '³';
  
  return term;
};
```

### **Signs**

```tsx
const formatSign = (value: number, isFirst: boolean = false): string => {
  if (isFirst) return value < 0 ? '−' : '';
  return value < 0 ? ' − ' : ' + ';
};

// CRITICAL: Use minus sign '−' (U+2212) NOT hyphen '-'
```

### **Fractions**

```tsx
const formatFraction = (num: number, den: number): string => {
  if (den === 1) return num.toString();
  return `${num}/${den}`;
};

// For display with fraction slash: use '⁄' (U+2044)
// For LaTeX-style: use \frac{num}{den}
```

---

<a name="visual-standards"></a>
## 🎨 VISUAL STANDARDS

### **Color Palette**

```tsx
// PRIMARY COLORS (Blue-First Design)
'bg-blue-900'        // Primary buttons (was purple-600)
'hover:bg-blue-800'  // Primary hover
'text-blue-900'      // Can use for emphasis if needed

// BACKGROUNDS
'bg-gray-50'         // Main page background
'bg-white'           // Cards and question displays
'bg-gray-100'        // Whiteboard workspace (or use helper function)
'bg-gray-50'         // Step backgrounds (or use helper function)

// TEXT COLORS - USE INLINE STYLES
style={{ color: '#000000' }}  // Main text (replaces text-purple-900, text-indigo-900)
style={{ color: '#4B5563' }}  // Headings and labels (replaces text-gray-700)

// DIFFICULTY COLORS
'bg-green-600'       // Level 1
'bg-yellow-600'      // Level 2
'bg-red-600'         // Level 3

// DIFFERENTIATED BACKGROUNDS
'bg-green-50 border-green-500'   // Level 1 column
'bg-yellow-50 border-yellow-500' // Level 2 column
'bg-red-50 border-red-500'       // Level 3 column

// BORDERS AND DIVIDERS
'border-gray-200'    // Card borders
'#d1d5db'           // Dividing lines (inline style)
```

### **Font Sizes**

```tsx
'text-6xl'   // Whiteboard & Single Q questions/answers
'text-5xl'   // Page title
'text-3xl'   // Working steps, worksheet heading, step content
'text-2xl'   // Level headings (differentiated), bar model labels
'text-xl'    // Worksheet questions, mode buttons
'text-lg'    // Worksheet controls, difficulty labels
'text-base'  // Action buttons, worksheet options
'text-sm'    // Whiteboard/Single Q difficulty label & checkboxes
'text-xs'    // Dropdown labels
```

### **Spacing and Layout**

```tsx
// Dividing lines
<div className="flex justify-center mb-8">
  <div style={{ width: '90%', height: '1px', backgroundColor: '#d1d5db' }}></div>
</div>

// Workspace dimensions
style={{ height: '500px' }}  // Whiteboard annotation area
style={{ width: '450px', height: '500px' }}  // Diagram area (graphical layout)

// Button widths
'w-52'   // Action buttons (New Question, Show Answer)
'w-24'   // Difficulty buttons
'w-20'   // Number inputs (questions, columns)
```

---

<a name="bar-models"></a>
## 📊 BAR MODEL PATTERNS (For Ratio/Proportion Tools)

### **Bar Model Color Helpers**

When implementing bar models, add these to your color helper functions:

```tsx
const getBarEmptyBg = () => colorScheme === 'blue' ? '#D1E7F8' : '#ffffff';
const getBarFilledBg = () => colorScheme === 'blue' ? '#9ec9e3' : '#d1d5db';
const getBarKnownBg = () => colorScheme === 'blue' ? '#7eb8e0' : '#93c5fd';
const getBarDiffBg = () => colorScheme === 'blue' ? '#d8b4fe' : '#e9d5ff';
```

### **Bar Model Layout**

```tsx
<div className="flex flex-col gap-3 items-start" style={{ marginLeft: '25%' }}>
  {bars.map((bar, i) => (
    <div key={i} className="flex items-center">
      {/* Person/Label */}
      <div className="w-32 text-2xl font-bold text-left flex-shrink-0"
           style={{ color: '#000000' }}>
        {bar.person}
      </div>
      
      {/* Boxes */}
      <div className="flex gap-1">
        {Array(bar.boxes).fill(0).map((_, boxIdx) => (
          <div
            key={boxIdx}
            className="w-20 h-20 border-4 rounded flex-shrink-0"
            style={{
              borderColor: bar.isKnown ? '#1e3a8a' : '#9ca3af',
              backgroundColor: bar.isKnown ? getBarKnownBg() : getBarEmptyBg()
            }}>
          </div>
        ))}
      </div>
      
      {/* Total/Value Label */}
      {bar.total && (
        <span className="text-2xl font-bold ml-4" style={{ color: '#000000' }}>
          = {bar.total}
        </span>
      )}
    </div>
  ))}
</div>
```

### **Border Colors**

```tsx
'#9ca3af'  // Neutral gray (standard boxes)
'#1e3a8a'  // Dark blue (known values)
'#a855f7'  // Purple (difference/special highlight)
```

---

<a name="checklist"></a>
## ✅ COMPREHENSIVE REQUIREMENTS CHECKLIST

### **Mathematical Accuracy**
- [ ] All calculations correct
- [ ] Questions mathematically valid (no division by zero, etc.)
- [ ] Working shows actual computation steps
- [ ] Edge cases handled appropriately
- [ ] No duplicate questions in worksheets
- [ ] Answer format matches question type

### **Visual & Layout**
- [ ] Whiteboard text is text-6xl
- [ ] Single Q text is text-6xl (matches Whiteboard)
- [ ] Main text uses `style={{ color: '#000000' }}`
- [ ] Headings use `style={{ color: '#4B5563' }}`
- [ ] Primary buttons use `bg-blue-900`
- [ ] Background is `bg-gray-50` (or uses helper functions)
- [ ] Large touch-friendly buttons
- [ ] High contrast throughout
- [ ] Dividing lines: 1px, #d1d5db, 90% width, centered
- [ ] Graphical layout (if applicable) has diagram beside workspace

### **Three-Mode Functionality**
- [ ] Whiteboard mode present and functional
- [ ] Single Q mode present and functional
- [ ] Worksheet mode present and functional
- [ ] Whiteboard has 500px workspace (or graphical layout)
- [ ] Whiteboard & Single Q use identical control bars
- [ ] Controls positioned: Difficulty (left), Options (middle), Actions (right)
- [ ] Single Q has min-height: 120vh for long solutions
- [ ] Difficulty buttons functional in all modes
- [ ] Show/hide works correctly in all modes
- [ ] Mode switching smooth without errors

### **Worksheet Mode**
- [ ] Two-line layout implemented
- [ ] Line 1: Questions per level + Differentiated checkbox
- [ ] Line 2: Difficulty/Columns (left) + Actions (right)
- [ ] Differentiated mode creates 3 columns correctly
- [ ] Standard mode uses 2 columns (or adjustable if Feature 3)
- [ ] Questions per level: 1-20 input works
- [ ] No duplicate questions generated
- [ ] Show/Hide answers toggles correctly

### **UI Standards**
- [ ] Mode buttons: "Whiteboard", "Single Q", "Worksheet"
- [ ] Difficulty buttons: "Level 1", "Level 2", "Level 3"
- [ ] Internal values: 'level1', 'level2', 'level3'
- [ ] Difficulty buttons (not dropdowns)
- [ ] Shortened checkbox labels (e.g., "In π" not "In terms of π")
- [ ] Checkboxes stacked vertically
- [ ] NO icon on worksheet Generate button
- [ ] Consistent button widths (w-52 for actions, w-24 for difficulty)
- [ ] Mode toggle active state: bg-blue-900
- [ ] Mode toggle inactive state: bg-white with borders

### **TypeScript**
- [ ] File extension is .tsx
- [ ] Function parameters have type annotations
- [ ] State variables use appropriate types or `any`
- [ ] Arrays typed as `any[]` or specific type
- [ ] No TypeScript errors when compiling

### **Optional Features (If Included)**
- [ ] Header bar with Home button functional (Feature 2)
- [ ] Menu dropdown opens/closes correctly (Feature 2)
- [ ] Color scheme system implemented with helper functions (Feature 1)
- [ ] All backgrounds use helper function calls (Feature 1)
- [ ] Color scheme selector in header menu (Features 1+2)
- [ ] Column control works in worksheet mode (Feature 3)
- [ ] Column control hidden when differentiated (Feature 3)

### **Testing**
- [ ] Tested in Claude Artifacts (if applicable)
- [ ] Tested in production environment (Replit, Vercel, etc.)
- [ ] All three modes tested
- [ ] Difficulty switching tested
- [ ] Worksheet generation tested (standard and differentiated)
- [ ] Optional features tested (if included)

---

<a name="requesting"></a>
## 📋 REQUESTING TOOLS

### **Standard Request**

```
"Create a [topic] tool following the specification"
```

Examples:
- "Create an integer addition tool following the specification"
- "Create a simplifying fractions tool following the specification"

### **With Specific Layout**

```
"Create a [topic] tool with graphical whiteboard layout"
```

Examples:
- "Create a circle properties tool with graphical whiteboard layout"
- "Create a sector area tool with graphical whiteboard layout showing the angle"

### **With Modular Features**

```
"Create a [topic] tool with [feature names]"
```

Examples:
- "Create a ratio tool with dyslexia-friendly coloring"
- "Create an algebra tool with header bar and color scheme options"
- "Create a geometry tool with header bar, dyslexia coloring, and column control"

### **Adding Features Later**

```
"Add [feature name] to this tool"
```

Examples:
- "Add dyslexia-friendly coloring to this tool"
- "Add header bar with navigation to this tool"
- "Add worksheet column control to this tool"
- "Add all modular features to this tool"

---

## 📝 VERSION HISTORY

**v1.2 (December 2024)**
- Added modular features system (header bar, color schemes, column control)
- Shifted to blue-first color palette (bg-blue-900)
- Standardized text colors with inline styles (#000000, #4B5563)
- Added bar model patterns for ratio/proportion tools
- Enhanced checklist with comprehensive requirements
- Added Single Q min-height: 120vh for long solutions
- Improved integration steps for optional features

**v1.1**
- Centered dividing lines between sections
- Matching toolbars for Whiteboard and Single Q modes
- Unified question size (text-6xl) for both modes
- Increased checkbox font (text-sm) in control bars
- Two-line worksheet layout
- White topic selectors

**v1.0**
- Initial specification
- Three-mode structure established
- TypeScript requirements defined

---

## 🎯 SPECIFICATION GOALS

This specification is designed to:

1. **Enable error-free tool creation** - Clear structure and complete examples
2. **Support modular development** - Core features + optional add-ons
3. **Ensure consistency** - All tools look and feel professional
4. **Facilitate web integration** - TSX format, production-ready
5. **Maintain flexibility** - Adapt to different mathematical topics

**When in doubt, prioritize:**
- Mathematical accuracy over complexity
- Clarity over brevity
- Consistency over customization
- Functionality over aesthetics

---

**End of Specification v1.2**