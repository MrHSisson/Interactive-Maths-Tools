# Math Tool Core System - Technical Specification

**Purpose:** Technical reference for building interactive math teaching tools

## 🎯 THREE-MODE STRUCTURE

Every tool has three modes supporting "I Do, We Do, You Do" pedagogy:

1. **Whiteboard Mode** - Teacher demonstration with large display and 500px workspace
2. **Single Question Mode** - One question at a time with step-by-step solutions  
3. **Worksheet Mode** - Multiple questions (1-20), standard or differentiated layout

---

## 🗂️ REACT COMPONENT TEMPLATE

```jsx
import React, { useState, useEffect } from 'react';
import { RefreshCw, Eye } from 'lucide-react';

export default function [TopicName]Tool() {
  // State
  const [mode, setMode] = useState('whiteboard');
  const [difficulty, setDifficulty] = useState('level1');
  const [question, setQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [whiteboardQuestion, setWhiteboardQuestion] = useState(null);
  const [showWhiteboardAnswer, setShowWhiteboardAnswer] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);
  const [worksheet, setWorksheet] = useState([]);
  const [showWorksheetAnswers, setShowWorksheetAnswers] = useState(false);
  const [isDifferentiated, setIsDifferentiated] = useState(false);

  // Question generation
  const generateQuestion = (level) => {
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
    const questions = [];
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
        
        {/* Mode Toggle */}
        <div className="flex justify-center gap-4 mb-8">
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

        {/* Render modes */}
      </div>
    </div>
  );
}
```

---

## 🎨 MODE UI SPECIFICATIONS

### **Whiteboard Mode (Standard Text-Based)**

```jsx
{mode === 'whiteboard' && (
  <div className="flex flex-col gap-4">
    {/* Compact Control Bar */}
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
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
            <input type="checkbox" checked={allowDecimals}
              onChange={(e) => setAllowDecimals(e.target.checked)}
              className="w-3 h-3" />
            Decimals
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
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
          <button onClick={handleNewWhiteboardQuestion}
            className="px-6 py-2 bg-purple-600 text-white rounded-xl font-bold text-base shadow-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 w-52">
            <RefreshCw size={18} />
            New Question
          </button>
          <button onClick={() => setShowWhiteboardAnswer(!showWhiteboardAnswer)}
            className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-base shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 w-52">
            <Eye size={18} />
            {showWhiteboardAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
        </div>
      </div>
    </div>
    
    {/* Question Display */}
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

### **Whiteboard Mode (Graphical Layout)**

```jsx
{mode === 'whiteboard' && (
  <div className="flex flex-col gap-4">
    {/* Compact Control Bar (same as standard) */}
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between">
        {/* Difficulty, Options, Dropdown, Actions - same as standard */}
      </div>
    </div>
    
    {/* Question Display with Side-by-Side Layout */}
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

**Key features:**
- Diagram in white box (left side, 450px × 500px)
- Annotation workspace (right side, gray, flexible width, 500px min height)
- Answer replaces question text at top when shown
- Diagram remains visible at all times for reference

---

### **Single Question Mode**

```jsx
{mode === 'single' && (
  <>
    {/* Control Panel */}
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex justify-center items-center gap-6 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">Difficulty:</span>
          <div className="flex gap-3">
            {['level1', 'level2', 'level3'].map((lvl, idx) => (
              <button key={lvl}
                onClick={() => setDifficulty(lvl)}
                className={'px-6 py-3 rounded-lg font-bold text-lg ' + 
                  (difficulty === lvl 
                    ? `bg-${['green', 'yellow', 'red'][idx]}-600 text-white`
                    : `bg-white text-${['green', 'yellow', 'red'][idx]}-600 border-2 border-${['green', 'yellow', 'red'][idx]}-600`)}>
                Level {idx + 1}
              </button>
            ))}
          </div>
        </div>
        
        {/* Stacked Options */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-base font-semibold">
            <input type="checkbox" checked={allowDecimals}
              onChange={(e) => setAllowDecimals(e.target.checked)}
              className="w-4 h-4" />
            Decimals
          </label>
          <label className="flex items-center gap-2 text-base font-semibold">
            <input type="checkbox" checked={answerInPi}
              onChange={(e) => setAnswerInPi(e.target.checked)}
              className="w-4 h-4" />
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
      </div>
    </div>

    {/* Question Display */}
    {question && (
      <div className="bg-white rounded-xl shadow-2xl p-12">
        <div className="text-5xl font-bold text-center text-purple-900 mb-8">
          {question.display}
        </div>
        
        <div className="flex gap-4 justify-center mb-8">
          <button onClick={handleNewQuestion}
            className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold text-xl shadow-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
            <RefreshCw size={24} />
            New Question
          </button>
          <button onClick={() => setShowAnswer(!showAnswer)}
            className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-xl shadow-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <Eye size={24} />
            {showAnswer ? 'Hide' : 'Show'} Answer
          </button>
        </div>
        
        {showAnswer && (
          <div className="mt-8 space-y-6">
            {question.working.map((step, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-6">
                <div className="text-xl font-semibold text-gray-700 mb-2">
                  {step.title}
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {step.content}
                </div>
                {step.explanation && (
                  <div className="text-lg text-gray-600 mt-2">
                    {step.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </>
)}
```

### **Worksheet Mode**

```jsx
{mode === 'worksheet' && (
  <>
    {/* Control Panel */}
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="space-y-4">
        <div className="flex justify-center items-center gap-6 flex-wrap">
          <div className="flex items-center gap-3">
            <label className="text-lg font-semibold">Questions per level:</label>
            <input type="number" min="1" max="20" value={numQuestions}
              onChange={(e) => setNumQuestions(Math.max(1, Math.min(20, parseInt(e.target.value) || 5)))}
              className="w-20 px-4 py-2 border-2 border-purple-300 rounded-lg text-lg" />
          </div>
          
          <div className="flex items-center gap-3">
            <input type="checkbox" id="diff" checked={isDifferentiated}
              onChange={(e) => setIsDifferentiated(e.target.checked)}
              className="w-5 h-5" />
            <label htmlFor="diff" className="text-lg font-semibold">Differentiated</label>
          </div>
          
          {/* Stacked Options */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-base font-semibold">
              <input type="checkbox" checked={allowDecimals}
                onChange={(e) => setAllowDecimals(e.target.checked)}
                className="w-4 h-4" />
              Decimals
            </label>
            <label className="flex items-center gap-2 text-base font-semibold">
              <input type="checkbox" checked={answerInPi}
                onChange={(e) => setAnswerInPi(e.target.checked)}
                className="w-4 h-4" />
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
        </div>

        {!isDifferentiated && (
          <div className="flex justify-center items-center gap-4">
            <label className="text-lg font-semibold">Difficulty:</label>
            <div className="flex gap-2">
              {['level1', 'level2', 'level3'].map((lvl, idx) => (
                <button key={lvl}
                  onClick={() => setDifficulty(lvl)}
                  className={'px-6 py-2 rounded-lg font-semibold ' + 
                    (difficulty === lvl ? `bg-${['green', 'yellow', 'red'][idx]}-600 text-white` : 'bg-gray-200')}>
                  Level {idx + 1}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-center gap-4">
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

    {/* Worksheet Display */}
    {worksheet.length > 0 && (
      <div className="bg-white rounded-xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-purple-900">Worksheet</h2>
        
        {isDifferentiated ? (
          <div className="grid grid-cols-3 gap-6">
            {['level1', 'level2', 'level3'].map((lvl, idx) => (
              <div key={lvl} className={`rounded-xl p-6 border-4 bg-${['green', 'yellow', 'red'][idx]}-50 border-${['green', 'yellow', 'red'][idx]}-500`}>
                <h3 className={`text-2xl font-bold text-center mb-6 text-${['green', 'yellow', 'red'][idx]}-700`}>
                  Level {idx + 1}
                </h3>
                <div className="space-y-3">
                  {worksheet.filter(q => q.difficulty === lvl).map((q, i) => (
                    <div key={i} className="text-xl">
                      <span className="font-semibold text-gray-800">{i + 1}.</span>
                      <span className="ml-3 font-bold text-gray-900">{q.display}</span>
                      {showWorksheetAnswers && (
                        <div className="ml-8 text-emerald-700 font-semibold mt-1">= {q.answer}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {worksheet.map((q, i) => (
              <div key={i} className="text-lg">
                <span className="font-semibold text-indigo-900">{i + 1}.</span>
                <span className="ml-2 font-bold text-indigo-900">{q.display}</span>
                {showWorksheetAnswers && (
                  <span className="ml-3 text-emerald-700 font-semibold">= {q.answer}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </>
)}
```

---

## 🎲 QUESTION GENERATION PATTERNS

```jsx
const generateQuestion = (level) => {
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

```jsx
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

```jsx
const handleGenerateWorksheet = () => {
  const questions = [];
  const usedKeys = new Set();
  
  const generateUniqueQuestion = (lvl) => {
    let attempts = 0;
    let q;
    let uniqueKey;
    
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

```jsx
// Format coefficient with variable
const formatTerm = (coeff, variable, power = 1) => {
  if (coeff === 0) return '';
  let term = Math.abs(coeff) === 1 && power > 0 ? variable : Math.abs(coeff) + variable;
  if (power === 2) term += '²';
  if (power === 3) term += '³';
  return term;
};

// Format sign
const formatSign = (value, isFirst = false) => {
  if (isFirst) return value < 0 ? '−' : '';
  return value < 0 ? ' − ' : ' + ';
};

// Use minus sign '−' (U+2212) not hyphen '-'
```

---

## 🎨 CONTROL PANEL FORMATTING STANDARDS

### **Consistent Formatting Rules:**

**Checkbox Options (Decimals, In π, etc.):**
- Always stacked vertically using `flex-col gap-1` (whiteboard) or `gap-2` (other modes)
- Whiteboard: `text-xs`, `w-3 h-3` checkboxes
- Single Q & Worksheet: `text-base`, `w-4 h-4` checkboxes
- Shortened labels: "In π" not "In terms of π"

**Dropdown Selectors:**
- Label: "Type:" not "Question Type:"
- Whiteboard: `text-xs`, `px-2 py-1`
- Single Q & Worksheet: `text-base`, `px-3 py-2`

**Difficulty Buttons:**
- Whiteboard: `text-sm`, `w-24`, `px-4 py-2`
- Single Q & Worksheet: `text-lg`, `px-6 py-3`
- Colors: green (Level 1), yellow (Level 2), red (Level 3)

**Action Buttons:**
- Whiteboard: `text-base`, `w-52`, `px-6 py-2`
- Single Q: `text-xl`, `px-8 py-4`
- Worksheet: Standard size `px-6 py-3`

---

## 🎨 STANDARDS

### Colors

```jsx
// Backgrounds
'bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100'  // Main
'bg-white'           // Cards
'bg-gray-100'        // Whiteboard workspace
'bg-green-50'        // Level 1 (differentiated)
'bg-yellow-50'       // Level 2 (differentiated)
'bg-red-50'          // Level 3 (differentiated)

// Buttons
'bg-purple-600'      // Actions
'bg-emerald-600'     // Show/Hide
'bg-green-600'       // Level 1
'bg-yellow-600'      // Level 2
'bg-red-600'         // Level 3

// Text
'text-purple-900'    // Questions
'text-emerald-600'   // Answers (whiteboard)
'text-blue-600'      // Working content
```

### Font Sizes

```jsx
'text-6xl'   // Whiteboard questions/answers
'text-5xl'   // Single Q questions
'text-3xl'   // Working steps, worksheet heading
'text-2xl'   // Level headings (differentiated)
'text-xl'    // Worksheet questions, mode buttons, Single Q buttons
'text-lg'    // Single Q/Worksheet controls
'text-base'  // Whiteboard action buttons, standard options
'text-sm'    // Whiteboard difficulty label
'text-xs'    // Whiteboard options (checkboxes, dropdowns)
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
- [ ] Single Q text is text-5xl
- [ ] Large touch-friendly buttons
- [ ] High contrast throughout
- [ ] Graphical layout (if applicable) has diagram beside workspace

**Functionality:**
- [ ] Three modes present (Whiteboard, Single Q, Worksheet)
- [ ] Whiteboard has 500px workspace (or side-by-side layout for graphical tools)
- [ ] Difficulty buttons functional
- [ ] Show/hide works in all modes
- [ ] Differentiated mode works
- [ ] Mode switching smooth
- [ ] Checkboxes stacked vertically
- [ ] Consistent formatting across all modes

**UI:**
- [ ] NO icon on worksheet button (text only)
- [ ] Use "Level 1, 2, 3" (not Easy/Medium/Hard)
- [ ] Internal values: 'level1', 'level2', 'level3'
- [ ] Difficulty buttons (not dropdowns)
- [ ] Shortened labels: "In π", "Type:"
- [ ] Compact whiteboard control bar

---

## 🎯 MULTI-TOPIC SUPPORT (OPTIONAL)

When user requests multi-topic tool, add topic selector ABOVE mode toggle:

```jsx
<div className="bg-white rounded-xl shadow-lg p-6 mb-8">
  <div className="flex justify-center gap-3 flex-wrap">
    {Object.entries(topics).map(([key, topic]) => (
      <button key={key}
        onClick={() => setQuestionType(key)}
        className={'px-8 py-4 rounded-xl font-bold text-xl transition-all ' +
          (questionType === key ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-indigo-600 border-2 border-indigo-300 shadow')}>
        {topic.name}
      </button>
    ))}
  </div>
</div>
```

**Use indigo color** to distinguish from purple mode buttons.

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
- "Create an algebra expansion
