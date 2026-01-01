# Tool Conversion Specification v4.0

## Conversion Checklist

### 1. Routing
```tsx
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate()
// Change: onClick={() => window.location.href = '/'}
// To: onClick={() => navigate('/')}
```

### 2. React Import
```tsx
// Change: import React, { useState, useEffect } from 'react';
// To: import { useState, useEffect } from 'react';
// Only keep React if using React.Something
```

### 3. Type Definitions (Bottom-Up)

```tsx
// Simple objects
type SimpleTerm = {
  coefficient: number;
  variable: string;
};

// Objects with dynamic keys (Index Signatures)
type AlgebraicTerm = {
  coeff: number;
  vars: { [key: string]: number };  // For term.vars[variableName]
};

// Objects with varying properties (Optional Properties)
type WorkingStep = {
  type: string;
  ratio?: number[] | string[];
  dividedBy?: number | string;
  answer?: string;
};

// Main type using nested types
type QuestionType = {
  display: string;
  answer: string;
  difficulty: string;
  working?: WorkingStep[];
  values?: any;  // Use 'any' for complex/variable structures
};

// Union types for specific values
type ColorScheme = 'default' | 'blue' | 'pink' | 'yellow';
type DifficultyLevel = 'level1' | 'level2' | 'level3';
type Mode = 'whiteboard' | 'workedExample' | 'worksheet';
```

**When to use:**
- Index signatures `{ [key: string]: type }`: When accessing properties with variables
- Optional `?`: When property exists conditionally
- `any`: When structure is too complex or variable

### 4. State Declarations
```tsx
const [question, setQuestion] = useState<QuestionType | null>(null);
const [worksheet, setWorksheet] = useState<QuestionType[]>([]);
const [count, setCount] = useState<number>(0);
const [mode, setMode] = useState<Mode>('default');
```

### 5. Function Annotations
```tsx
const generateQuestion = (level: DifficultyLevel): QuestionType => { }
const formatTerm = (coeff: number): string => { }
const handleClick = (): void => { }
const getColor = (): string => { }
```

### 6. Callback Type Annotations
```tsx
.map((item: TypeName, i: number) => ...)
.filter((item: TypeName) => ...)
.reduce((acc: number, item: number) => acc + item, 0)
.forEach((item: TypeName, i: number) => ...)
Object.keys(obj).forEach((key: string) => ...)
Object.entries(obj).forEach(([key, value]: [string, any]) => ...)
```

### 7. Initialize All Variables
```tsx
// Wrong: let a: number, b: number;
// Correct: let a = 0, b = 0;
let display = '';
let parts: number[] = [];
let term: AlgebraicTerm = { coeff: 1, vars: {} };
```

### 8. **CRITICAL: Fix level/lvl Unused Variables (TS6133)**

**Common Error Pattern:**
```tsx
// ❌ WRONG: lvl declared but never used in function
const getDifficultyClass = (lvl: string, idx: number, isActive: boolean): string => {
  // Function only uses idx and isActive, NOT lvl!
  return idx === 0 ? 'bg-green-600' : 'bg-red-600';
}

['level1', 'level2', 'level3'].map((lvl: DifficultyLevel, idx: number) => (
  <button className={getDifficultyClass(lvl, idx, difficulty === lvl)}>
```

**Fix Process:**

**Step 1: Search for patterns**
```
.map((lvl
.map((level
.forEach((lvl
.forEach((level
```

**Step 2: Check function signatures receiving level/lvl**
```tsx
// For EACH function with level/lvl parameter:
// Search function body for references to that parameter
// If NOT found → Remove from signature
```

**Step 3: Apply fixes**
```tsx
// ✅ Fix 1: Remove unused parameter from function
const getDifficultyClass = (idx: number, isActive: boolean): string => {
  return idx === 0 ? 'bg-green-600' : 'bg-red-600';
}
// Update ALL call sites: getDifficultyClass(idx, difficulty === lvl)

// ✅ Fix 2: Use underscore for intentionally unused
.map((_lvl: string, idx: number) => <div>Level {idx + 1}</div>)

// ✅ Fix 3: Actually use the variable if it should be used
['level1', 'level2', 'level3'].forEach((lvl: DifficultyLevel) => {
  questions.push(generateQuestion(lvl));  // Now using lvl
});
```

**Detection Checklist:**
- [ ] Search all `.map((lvl` and `.map((level` patterns
- [ ] For each: Is lvl/level used in callback body?
- [ ] If NO: Fix function signature OR use underscore
- [ ] Search all function definitions with `level:` or `lvl:` parameters
- [ ] For each: Is parameter referenced in function body?
- [ ] If NO: Remove from signature AND update all call sites

---

## Conversion Order

1. ✅ Add routing imports and navigate hook
2. ✅ Fix React import
3. ✅ Create type definitions (bottom-up: innermost first)
4. ✅ Add index signatures for dynamic object access
5. ✅ Mark optional properties with `?`
6. ✅ Update all useState with generic types
7. ✅ Add function return types
8. ✅ Add function parameter types
9. ✅ Add types to all `.map()` callbacks
10. ✅ Add types to all `.filter()`, `.reduce()`, `.forEach()` callbacks
11. ✅ **Search `.map((lvl` - check for unused variables**
12. ✅ **Check ALL function signatures for unused level/difficulty params**
13. ✅ Add types to `Object.keys/values/entries` callbacks
14. ✅ Initialize all variables
15. ✅ Run `npm run build` - fix TS6133 errors first
16. ✅ Fix remaining errors

---

## Quick Search Patterns

```bash
# Add types to callbacks
.map((
.filter((
.reduce((
.forEach((
Object.keys(
Object.entries(

# Check for unused variables (CRITICAL)
.map((lvl
.map((level
.forEach((lvl
.forEach((level

# Check function signatures
const.*=.*\(.*lvl.*:
const.*=.*\(.*level.*:

# Find uninitialized variables
let.*:.*;
```

---

## TypeScript Error Reference

### TS7053: Index signature missing
```tsx
// Error: Can't use string to index type
// Fix: Add index signature
type Term = {
  vars: { [key: string]: number }  // ✅
};
```

### TS2353: Unknown property
```tsx
// Error: Property doesn't exist in type
// Fix: Add property as optional
type Step = {
  type: string;
  dividedBy?: number;  // ✅
};
```

### TS6133: Variable never read (MOST COMMON)
```tsx
// Error: 'lvl' declared but never read
// Fix 1: Remove from function signature
const getClass = (idx: number) => { }  // ✅ Removed lvl

// Fix 2: Use underscore
.map((_lvl: string, idx: number) => ...)  // ✅

// Fix 3: Actually use it
.forEach((lvl: DifficultyLevel) => {
  generateQuestion(lvl);  // ✅ Now using lvl
});
```

### TS7006: Implicit any type
```tsx
// Error: Parameter has implicit any
// Fix: Add type annotation
.map((item: ItemType) => ...)  // ✅
```

### TS2339: Type 'never'
```tsx
// Error: Inferred as never[]
// Fix: Add generic type
const [items, setItems] = useState<ItemType[]>([]);  // ✅
```

### Variable used before assigned
```tsx
// Error: Variable used before assignment
// Fix: Initialize
let total = 0;  // ✅
```

---

## Common Conversions

### Difficulty Buttons (COMMON ERROR SOURCE)
```tsx
// ❌ WRONG - lvl unused
const getDifficultyButtonClass = (lvl: DifficultyLevel, idx: number, isActive: boolean): string => {
  if (isActive) {
    return idx === 0 ? 'bg-green-600 text-white' 
         : idx === 1 ? 'bg-yellow-600 text-white' 
         : 'bg-red-600 text-white';
  }
  return idx === 0 ? 'bg-white border-green-600' 
       : idx === 1 ? 'bg-white border-yellow-600' 
       : 'bg-white border-red-600';
};

// ✅ CORRECT - removed unused lvl parameter
const getDifficultyButtonClass = (idx: number, isActive: boolean): string => {
  if (isActive) {
    return idx === 0 ? 'bg-green-600 text-white' 
         : idx === 1 ? 'bg-yellow-600 text-white' 
         : 'bg-red-600 text-white';
  }
  return idx === 0 ? 'bg-white border-green-600' 
       : idx === 1 ? 'bg-white border-yellow-600' 
       : 'bg-white border-red-600';
};

// Update call sites
{(['level1', 'level2', 'level3'] as const).map((lvl: DifficultyLevel, idx: number) => (
  <button key={lvl} onClick={() => setDifficulty(lvl)}
    className={'px-4 py-2 rounded-lg font-bold ' + 
      getDifficultyButtonClass(idx, difficulty === lvl)}>  {/* ✅ Removed lvl argument */}
    Level {idx + 1}
  </button>
))}
```

### Worksheet Generation
```tsx
// ✅ CORRECT - lvl is actually used
if (isDifferentiated) {
  (['level1', 'level2', 'level3'] as const).forEach((lvl: DifficultyLevel) => {
    for (let i = 0; i < numQuestions; i++) {
      questions.push({ ...generateUniqueQuestion(lvl), difficulty: lvl });  // ✅ Using lvl
    }
  });
}
```

### Event Handlers
```tsx
onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumQuestions(parseInt(e.target.value))}
onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsDifferentiated(e.target.checked)}
```

### Array Literals with Strict Types
```tsx
(['level1', 'level2', 'level3'] as const).map((lvl: DifficultyLevel) => ...)
```

---

## Final Checks Before Push

```bash
npm run build
# Check specifically for:
# - TS6133 errors (unused variables - usually lvl/level)
# - TS7053 errors (missing index signatures)
# - TS2353 errors (missing optional properties)
```

**If TS6133 appears:**
1. Note the variable name and line number
2. Search for that variable in function signatures
3. Check if variable is used in function body
4. Remove from signature if unused
5. Update all call sites

---

## Tool Integration

1. Save as `src/tools/[ToolName].tsx`
2. Update `src/App.tsx`: Add route
3. Update `src/components/LandingPage.tsx`: Set `ready: true`
4. Push to GitHub → Vercel auto-deploys
