# Tool Conversion Prompt for Website Integration (v3.0)

Use this prompt when converting a maths tool artifact to be website-ready for the Vercel-hosted site.

---

## Conversion Checklist

### 1. **Add Routing (Required for Navigation)**

Add this import at the very top:
```tsx
import { useNavigate } from 'react-router-dom'
```

Add this hook inside the component (after the component function declaration):
```tsx
const navigate = useNavigate()
```

Update the Home button to use proper navigation:
```tsx
// Change from:
onClick={() => window.location.href = '/'}

// To:
onClick={() => navigate('/')}
```

---

### 2. **Fix React Import (Modern React)**

Modern React doesn't require the React import for JSX.

```tsx
// Change from:
import React, { useState, useEffect } from 'react';

// To:
import { useState, useEffect } from 'react';
```

**Only keep `React` if you're using `React.Something` in your code.**

---

### 3. **Add Type Definitions for Complex Data Structures**

This is the most critical step. You need to define types for ALL complex objects in your tool.

#### **Step 3a: Identify All Data Structures**

Look for:
- Objects returned by generator functions (`generateQuestion`, `generateWorking`, etc.)
- Objects stored in state
- Objects passed to render functions
- Objects in arrays (worksheet items, steps, etc.)

#### **Step 3b: Build Type Hierarchy (Bottom-Up)**

Define types from innermost to outermost:

**Pattern 1: Simple objects without dynamic keys**
```tsx
type SimpleTerm = {
  coefficient: number;
  variable: string;
  power: number;
};
```

**Pattern 2: Objects with dynamic keys (Index Signatures)**
```tsx
// When properties are accessed/set using variables
type AlgebraicTerm = {
  coeff: number;
  vars: { [key: string]: number };  // ← Index signature
};

// Usage that requires index signature:
term.vars[variableName] = power;  // variableName is a variable
const power = term.vars[variable];
```

**When to use index signatures:**
- `object[variableName] = value` where variableName is a variable
- `Object.keys(obj).forEach(key => obj[key]...)`
- `Object.entries(obj).forEach(([key, value]) => ...)`
- Objects used as dictionaries/maps
- When you see TypeScript error **TS7053**

**Pattern 3: Objects with varying properties (Conditional Properties)**
```tsx
// When different instances have different properties
type WorkingStep = {
  type: string;                    // All steps have this
  ratio?: number[] | string[];     // Some steps have this
  dividedBy?: number | string;     // Only 'step' type has this
  answer?: string;                 // Only 'final' type has this
};

// Use ? for optional properties
// Use | for properties that can be different types
```

**When to use optional properties:**
- Property exists only on some instances
- Property depends on another property's value (like `type`)
- When you see TypeScript error **TS2353**

**Pattern 4: Nested type definitions**
```tsx
// Define inner types first
type AlgebraicTerm = {
  coeff: number;
  vars: { [key: string]: number };
};

type WorkingStep = {
  type: string;
  ratio?: any;
  dividedBy?: any;
  answer?: string;
};

// Then use them in outer types
type QuestionType = {
  display: string;
  answer: string;
  working?: WorkingStep[];           // Uses WorkingStep
  original?: AlgebraicTerm[];        // Uses AlgebraicTerm
  simplified?: AlgebraicTerm[];      // Uses AlgebraicTerm
  difficulty: string;
  // Add ALL other properties your questions might have
  isAlgebraic?: boolean;
  hcf?: number;
  originalParts?: number[];
  simplifiedParts?: number[];
};
```

#### **Step 3c: Complete Type Definition Template**

```tsx
// Place ALL type definitions at the top of the file, after imports

// 1. Define smallest/innermost types first
type SmallType = {
  property: type;
};

// 2. Define types that use the small types
type MediumType = {
  nested: SmallType;
  other: string;
};

// 3. Define your main question/data type
type QuestionType = {
  // Required properties (no ?)
  display: string;
  answer: string;
  difficulty: string;
  
  // Optional properties (with ?)
  working?: WorkingStep[];
  nested?: MediumType;
  
  // Properties that can be different types
  ratio?: string | number;
  parts?: number[] | string[];
  
  // Add EVERY property that might exist
  // even if only used sometimes
};
```

#### **Step 3d: When to Use `any`**

Use `any` strategically when:
- A property can have many different shapes and defining them all is impractical
- A property contains deeply nested variable structures
- You need to get the build working quickly (can refine later)

```tsx
type WorkingStep = {
  type: string;
  ratio?: any;  // Can be number[], string[], mixed array, etc.
  dividedBy?: any;  // Can be number, string, or algebraic expression
  answer?: string;
};
```

**Principle:** Better to use `any` and have a working build than to struggle with overly complex union types.

---

### 4. **Update State Declarations with Generic Types**

All state variables must have explicit types:

```tsx
// For nullable objects (starts as null):
const [question, setQuestion] = useState<QuestionType | null>(null);

// For arrays (starts empty):
const [worksheet, setWorksheet] = useState<QuestionType[]>([]);

// For primitives:
const [count, setCount] = useState<number>(0);
const [name, setName] = useState<string>('');
const [isOpen, setIsOpen] = useState<boolean>(false);
const [mode, setMode] = useState<string>('default');
```

---

### 5. **Annotate ALL Function Parameters and Return Types**

Every function needs type annotations:

```tsx
// Generator functions returning your custom types:
const generateQuestion = (level: string): QuestionType => {
  // ...
}

const generateWorking = (original: number[], simplified: number[]): WorkingStep[] => {
  // ...
}

// Helper functions with primitive returns:
const formatCurrency = (amount: number): string => {
  return `£${amount}`;
}

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomChoice = (arr: any[]): any => {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Functions with custom type parameters:
const formatTerm = (coeff: number, vars: { [key: string]: number }): string => {
  // ...
}

const renderStep = (step: WorkingStep, idx: number): JSX.Element => {
  // ...
}

// Functions with no return value:
const handleClick = (): void => {
  // ...
}

// Functions returning your UI helper strings:
const getBackgroundColor = (): string => {
  if (colorScheme === 'blue') return '#B3D9F2';
  return '#ffffff';
}
```

**Key principle:** If a function returns something, specify what type it returns. If it returns nothing, use `: void`.

---

### 6. **Add Type Annotations to ALL Callbacks**

This is **CRITICAL** and the most commonly missed step. Every callback needs explicit types.

**Common patterns:**

```tsx
// Array.map() with items and index:
numbers.map((item: number, i: number) => item * 2)
strings.map((item: string, i: number) => item.toUpperCase())
questions.map((item: QuestionType, i: number) => ...)
steps.map((step: WorkingStep, idx: number) => renderStep(step, idx))

// When item type is complex, use the type you defined:
worksheet.map((q: QuestionType, i: number) => ...)

// Array.filter():
array.filter((item: QuestionType) => item.difficulty === 'level1')
numbers.filter((n: number) => n > 5)

// Array.reduce():
numbers.reduce((acc: number, item: number) => acc + item, 0)
array.reduce((a: number, b: number) => gcd(a, b))

// Array.forEach():
items.forEach((item: QuestionType) => console.log(item))
array.forEach((n: number, i: number) => { ... })

// Array.find(), .some(), .every():
items.find((item: QuestionType) => item.id === targetId)
numbers.some((n: number) => n > 10)
parts.every((p: number) => p % hcf === 0)

// React children rendering:
{items.map((item: ItemType, index: number) => (
  <div key={index}>{item.name}</div>
))}

// Object methods:
Object.keys(obj).forEach((key: string) => ...)
Object.values(obj).forEach((value: any) => ...)
Object.entries(obj).forEach(([key, value]: [string, any]) => ...)

// Array literal with as const:
['level1', 'level2', 'level3'].map((lvl: string) => ...)
// or with as const for strict typing:
(['level1', 'level2', 'level3'] as const).map((lvl: string) => ...)
```

**Search your code for these patterns and add types:**
- `.map(`
- `.filter(`
- `.reduce(`
- `.forEach(`
- `.find(`
- `.some(`
- `.every(`
- `.sort(`

---

### 7. **Fix Uninitialized Variables**

TypeScript strict mode requires all variables to have initial values:

```tsx
// ❌ Wrong - uninitialized:
let a: number, b: number, answer: number;
let display: string, operation: string;
let simplified: number[];

// ✅ Correct - initialized:
let a = 0, b = 0, answer = 0;
let display = '', operation = '';
let simplified: number[] = [];

// For objects with index signatures:
let term1: AlgebraicTerm = { coeff: 1, vars: {} };
let term2: AlgebraicTerm = { coeff: 1, vars: {} };

// For complex types:
let currentStep: WorkingStep = { type: 'initial' };
let ratioParts: number[] = [];
let total = 0;
let partValue = 0;
```

**Pattern:** Find all `let variableName: type` or `let a, b, c` declarations and add `= initialValue`

---

### 8. **Handle Render Functions with Type Annotations**

If you have helper render functions, add types to their parameters:

```tsx
const renderStep = (step: WorkingStep, idx: number): JSX.Element => {
  return (
    <div key={idx}>
      {/* ... */}
    </div>
  );
};

const renderQuestion = (question: QuestionType, index: number): JSX.Element => {
  return <div>{question.display}</div>;
};
```

Then in JSX:
```tsx
{items.map((item: WorkingStep, idx: number) => renderStep(item, idx))}
{worksheet.map((q: QuestionType, i: number) => renderQuestion(q, i))}
```

---

## Complete Conversion Process

Follow these steps **in order**:

1. ✅ Add `import { useNavigate } from 'react-router-dom'`
2. ✅ Add `const navigate = useNavigate()` inside component
3. ✅ Update Home button to use `navigate('/')`
4. ✅ Remove `React` from imports if not used
5. ✅ **IDENTIFY all data structures** (objects, nested objects, arrays)
6. ✅ **CREATE type definitions** bottom-up (innermost types first)
7. ✅ **ADD index signatures** for objects with dynamic keys
8. ✅ **MARK optional properties** with `?`
9. ✅ Update all `useState` declarations with generic types
10. ✅ Add return types to all functions
11. ✅ Add parameter types to all functions
12. ✅ Search for `.map(` and add types to all callbacks
13. ✅ Search for `.reduce(` and add types to all callbacks
14. ✅ Search for `.filter(` and add types to all callbacks
15. ✅ Search for `.forEach(` and add types to all callbacks
16. ✅ Search for `Object.keys(`, `Object.entries(` and add types
17. ✅ Fix all uninitialized variables
18. ✅ Check for any remaining TypeScript errors
19. ✅ Run `npm run build` and fix any errors

---

## Quick Search & Replace Guide

Use your editor's search feature to find and fix these patterns:

### Pattern 1: Map callbacks without types
**Search for:** `.map((item, i) =>`  
**Add types:** `.map((item: TypeName, i: number) =>`

### Pattern 2: Map with your custom types
**Search for:** `.map((q,`  
**Add types:** `.map((q: QuestionType, i: number) =>`

### Pattern 3: Reduce callbacks without types
**Search for:** `.reduce((a, b) =>`  
**Add types:** `.reduce((a: number, b: number) =>`

### Pattern 4: Filter callbacks without types
**Search for:** `.filter((item) =>`  
**Add types:** `.filter((item: TypeName) =>`

### Pattern 5: forEach callbacks without types
**Search for:** `.forEach((item) =>`  
**Add types:** `.forEach((item: TypeName) =>`

### Pattern 6: Uninitialized variables
**Search for:** `let variableName: type;`  
**Fix:** `let variableName = initialValue;`

### Pattern 7: Functions without return types
**Search for:** `const functionName = (param) => {`  
**Add types:** `const functionName = (param: type): returnType => {`

### Pattern 8: Object methods
**Search for:** `Object.keys(obj).forEach((key) =>`  
**Add types:** `Object.keys(obj).forEach((key: string) =>`

---

## Common TypeScript Errors and Fixes

### **TS7053: Element implicitly has an 'any' type**
```
Error: Element implicitly has an 'any' type because expression of type 
       'string' can't be used to index type '{}'
```

**Cause:** You're accessing an object property with a variable, but the object type doesn't have an index signature.

**Example causing error:**
```tsx
type Term = {
  vars: {}  // ❌ No index signature
};
const variable = 'x';
term.vars[variable] = 2;  // ❌ Error TS7053
```

**Fix:** Add index signature to the type:
```tsx
type Term = {
  vars: { [key: string]: number }  // ✅ Index signature added
};
const variable = 'x';
term.vars[variable] = 2;  // ✅ Works
```

---

### **TS2353: Object literal may only specify known properties**
```
Error: Object literal may only specify known properties, and 
       'dividedBy' does not exist in type 'X'
```

**Cause:** You're creating an object with a property that isn't in the type definition.

**Example causing error:**
```tsx
type Step = {
  type: string;
  ratio: number[];
  // dividedBy is NOT defined
};

const step = { 
  type: 'step', 
  ratio: [2, 3],
  dividedBy: 5  // ❌ Error TS2353
};
```

**Fix:** Add the property to the type (as optional if it's not always present):
```tsx
type Step = {
  type: string;
  ratio?: number[];        // Made optional with ?
  dividedBy?: number;      // ✅ Added as optional
  answer?: string;         // ✅ Added as optional
};

const step1 = { type: 'original', ratio: [6, 9] };
const step2 = { type: 'step', ratio: [2, 3], dividedBy: 3 };  // ✅ Works
const step3 = { type: 'final', answer: '2:3' };  // ✅ Works
```

---

### **TS6133: 'X' is declared but its value is never read**
```
Error: 'variableName' is declared but its value is never read
```

**Fix:** Remove unused imports or variables:
```tsx
// ❌ Remove if not used:
import React from 'react';  // Remove if not using React.Something

// ❌ Remove unused variables:
const unusedVar = 5;
```

---

### **TS7006: Parameter 'x' implicitly has an 'any' type**
```
Error: Parameter 'x' implicitly has an 'any' type
```

**Fix:** Add type annotation to the parameter:
```tsx
// ❌ Wrong:
items.map((item) => ...)

// ✅ Correct:
items.map((item: ItemType) => ...)
```

---

### **TS2339: Property 'X' does not exist on type 'never'**
```
Error: Property 'X' does not exist on type 'never'
```

**Cause:** TypeScript inferred the type as `never` (usually empty array or object without type).

**Fix:** Add proper type annotation:
```tsx
// ❌ Wrong:
const [items, setItems] = useState([]);

// ✅ Correct:
const [items, setItems] = useState<ItemType[]>([]);
```

---

### **Variable 'x' is used before being assigned**
```
Error: Variable 'x' is used before being assigned
```

**Fix:** Initialize the variable:
```tsx
// ❌ Wrong:
let total: number;
console.log(total);

// ✅ Correct:
let total = 0;
console.log(total);
```

---

## Testing Before Deployment

Before pushing to GitHub:

1. Run `npm run build` locally
2. Check for ANY TypeScript errors
3. Fix all errors before pushing
4. Verify the tool works in development mode (`npm run dev`)
5. Test all features (modes, difficulty levels, color schemes)
6. Push to GitHub and monitor Vercel deployment logs

---

## After Conversion Checklist

- [ ] Tool has `import { useNavigate } from 'react-router-dom'`
- [ ] Tool has `const navigate = useNavigate()` inside component
- [ ] Home button uses `navigate('/')` not `window.location.href`
- [ ] React import is correct (no unused `React`)
- [ ] All type definitions added at top of file (bottom-up hierarchy)
- [ ] Index signatures added for objects with dynamic keys
- [ ] Optional properties marked with `?`
- [ ] All state declarations use generic types
- [ ] All functions have parameter and return types
- [ ] All `.map()` callbacks have types
- [ ] All `.reduce()` callbacks have types
- [ ] All `.filter()` callbacks have types
- [ ] All `.forEach()` callbacks have types
- [ ] All `Object.keys/values/entries` callbacks have types
- [ ] All variables have initial values
- [ ] `npm run build` succeeds with NO errors
- [ ] All original functionality preserved

---

## To Add Tool to Website

1. Save converted code as `src/tools/[ToolName].tsx`

2. Update `src/App.tsx`:
   ```tsx
   import ToolName from './tools/ToolName'
   // ...
   <Route path="/tool-path" element={<ToolName />} />
   ```

3. Update `src/components/LandingPage.tsx`:
   - Change `ready: false` to `ready: true` for the tool
   - Ensure `path` matches the route in App.tsx

4. Push to GitHub - Vercel auto-deploys

---

## Example: Complete Conversion

**Before:**
```tsx
import React, { useState, useEffect } from 'react';

const MyTool = () => {
  const [question, setQuestion] = useState(null);
  const [worksheet, setWorksheet] = useState([]);
  
  const generateQuestion = (level) => {
    let total, partValue;
    let term = { coeff: 1, vars: {} };
    const shares = [10, 20].map((x) => x * 2);
    const steps = [{ type: 'step', ratio: [2, 3], dividedBy: 5 }];
    
    Object.keys(term.vars).forEach((v) => {
      term.vars[v] = term.vars[v] * 2;
    });
    
    return { display: "Question", answer: "Answer" };
  };
  
  return (
    <button onClick={() => window.location.href = '/'}>Home</button>
  );
};
```

**After:**
```tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Type definitions (bottom-up)
type AlgebraicTerm = {
  coeff: number;
  vars: { [key: string]: number };  // Index signature for dynamic keys
};

type WorkingStep = {
  type: string;
  ratio?: number[];
  dividedBy?: number;  // Optional property
};

type QuestionType = {
  display: string;
  answer: string;
  working?: WorkingStep[];
  term?: AlgebraicTerm;
};

const MyTool = () => {
  const navigate = useNavigate();
  
  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [worksheet, setWorksheet] = useState<QuestionType[]>([]);
  
  const generateQuestion = (level: string): QuestionType => {
    let total = 0, partValue = 0;
    let term: AlgebraicTerm = { coeff: 1, vars: {} };
    const shares = [10, 20].map((x: number) => x * 2);
    const steps: WorkingStep[] = [{ type: 'step', ratio: [2, 3], dividedBy: 5 }];
    
    Object.keys(term.vars).forEach((v: string) => {
      term.vars[v] = term.vars[v] * 2;
    });
    
    return { display: "Question", answer: "Answer", working: steps, term };
  };
  
  return (
    <button onClick={() => navigate('/')}>Home</button>
  );
};

export default MyTool;
```

---

## Key Principles

1. **TypeScript is strict** - Every variable, parameter, and return value needs a type
2. **Index signatures are required** - For objects accessed with variables
3. **Optional properties with ?** - For properties that exist conditionally
4. **Bottom-up type definitions** - Define inner types before outer types
5. **Callbacks need types** - This is the most commonly missed requirement
6. **Initialize everything** - No uninitialized variables allowed
7. **Test before pushing** - Run `npm run build` locally first
8. **When in doubt, use `any`** - Better than build failures, can refine later

---

## Type Definition Decision Tree

```
Is it an object?
├─ Yes: Does it have properties accessed with variables?
│  ├─ Yes: Use index signature { [key: string]: type }
│  └─ No: Use regular object type { prop: type }
│
├─ Are all properties always present?
│  ├─ No: Mark conditional properties with ?
│  └─ Yes: No ? needed
│
├─ Does it nest other complex objects?
│  ├─ Yes: Define inner types first, then reference them
│  └─ No: Define as single type
│
└─ Can properties have multiple types?
   ├─ Yes: Use union types (type1 | type2) or any
   └─ No: Use single type
```

---

## Notes

- This guide assumes TypeScript strict mode is enabled
- All conversions must maintain original functionality
- Visual appearance and behavior should remain identical
- These changes are ONLY for TypeScript compatibility, not improvements
- v3.0 adds comprehensive guidance on index signatures, nested types, and common errors
- When you encounter TS7053 or TS2353, refer to the error sections above

---

## Version History

- **v1.0**: Initial conversion guide
- **v2.0**: Added comprehensive callback typing and function annotations
- **v3.0**: Added index signatures, nested type hierarchies, optional properties, and expanded error reference