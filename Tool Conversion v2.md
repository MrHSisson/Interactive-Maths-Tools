# Tool Conversion Prompt for Website Integration (v2.0)

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

If your tool generates questions, worksheets, or complex objects, define their types at the top of the file (after imports, before the component).

**Example:**
```tsx
type QuestionType = {
  display: string;
  answer: string;
  difficulty: string;
  ratio?: string;
  ratioParts?: number[];
  total?: number;
  partValue?: number;
  shares?: number[];
  questionType?: string;
  working?: any[];
  names?: string[];
  // Add ALL properties your objects might have
  // Use ? for optional properties
  // Use any[] for complex nested structures
};
```

**How to identify what types you need:**
- Look at what your generator functions return
- Check what properties you access with `.property`
- Include ALL properties, even optional ones (with `?`)
- Use `any` for deeply nested or variable structures

---

### 4. **Update State Declarations with Generic Types**

All state variables must have explicit types:

```tsx
// For nullable objects:
const [question, setQuestion] = useState<QuestionType | null>(null);

// For arrays:
const [worksheet, setWorksheet] = useState<QuestionType[]>([]);

// For primitives (usually OK as-is, but can be explicit):
const [count, setCount] = useState<number>(0);
const [name, setName] = useState<string>('');
const [isOpen, setIsOpen] = useState<boolean>(false);
```

---

### 5. **Annotate ALL Function Parameters and Return Types**

Every function that processes data needs type annotations:

```tsx
// Generator functions:
const generateQuestion = (level: string): QuestionType => {
  // ...
}

// Helper functions:
const formatCurrency = (amount: number): string => {
  // ...
}

const randomInt = (min: number, max: number): number => {
  // ...
}

const randomChoice = (arr: any[]): any => {
  // ...
}

// Functions with no return:
const handleClick = (): void => {
  // ...
}
```

**Key principle:** If a function returns something, specify what type it returns.

---

### 6. **Add Type Annotations to ALL Callbacks**

This is **CRITICAL** and the most commonly missed step. Every callback in `.map()`, `.filter()`, `.reduce()`, `.forEach()`, etc. needs explicit types.

**Common patterns:**

```tsx
// Array.map() with items and index:
array.map((item: string, i: number) => ...)
array.map((item: number, i: number) => ...)
array.map((item: any, i: number) => ...)  // Use 'any' if type is complex

// Array.filter():
array.filter((item: TypeName) => item.property > 5)

// Array.reduce():
array.reduce((acc: number, item: number) => acc + item, 0)
array.reduce((a: number, b: number) => a + b, 0)

// React children rendering:
{items.map((item: ItemType, index: number) => (
  <div key={index}>{item.name}</div>
))}

// Object methods:
Object.keys(obj).map((key: string) => ...)
Object.values(obj).map((value: any) => ...)
Object.entries(obj).map(([key, value]: [string, any]) => ...)
```

**Search your code for these patterns and add types:**
- `.map(`
- `.filter(`
- `.reduce(`
- `.forEach(`
- `.find(`
- `.some(`
- `.every(`

---

### 7. **Fix Uninitialized Variables**

TypeScript strict mode requires all variables to have initial values:

```tsx
// Change from:
let a: number, b: number, answer: number
let display: string, operation: string

// To:
let a = 0, b = 0, answer = 0
let display = '', operation = ''

// For complex types, initialize appropriately:
let ratioParts: number[] = []
let total = 0
let partValue = 0
let knownPerson = 0
```

**Pattern:** Find all `let variableName: type` declarations and add `= initialValue`

---

### 8. **Handle Render Functions with Type Annotations**

If you have helper render functions, add types to their parameters:

```tsx
const renderStep = (step: any, idx: number) => {
  return (
    <div key={idx}>
      {/* ... */}
    </div>
  );
};
```

Then in JSX:
```tsx
{items.map((item: any, idx: number) => renderStep(item, idx))}
```

---

## Complete Conversion Process

Follow these steps **in order**:

1. ✅ Add `import { useNavigate } from 'react-router-dom'`
2. ✅ Add `const navigate = useNavigate()` inside component
3. ✅ Update Home button to use `navigate('/')`
4. ✅ Remove `React` from imports if not used
5. ✅ Add type definitions for all data structures
6. ✅ Update all `useState` declarations with generic types
7. ✅ Add return types to all functions
8. ✅ Add parameter types to all functions
9. ✅ Search for `.map(` and add types to all callbacks
10. ✅ Search for `.reduce(` and add types to all callbacks
11. ✅ Search for `.filter(` and add types to all callbacks
12. ✅ Fix all uninitialized variables
13. ✅ Check for any remaining TypeScript errors

---

## Quick Search & Replace Guide

Use your editor's search feature to find and fix these patterns:

### Pattern 1: Map callbacks without types
**Search for:** `.map((item, i) =>`  
**Add types:** `.map((item: any, i: number) =>`

### Pattern 2: Reduce callbacks without types
**Search for:** `.reduce((a, b) =>`  
**Add types:** `.reduce((a: number, b: number) =>`

### Pattern 3: Uninitialized variables
**Search for:** `let variableName: type;`  
**Fix:** `let variableName = initialValue;`

### Pattern 4: Functions without return types
**Search for:** `const functionName = (param) => {`  
**Add types:** `const functionName = (param: type): returnType => {`

---

## Testing Before Deployment

Before pushing to GitHub:

1. Run `npm run build` locally
2. Check for ANY TypeScript errors (TS6133, TS7006, TS2339, etc.)
3. Fix all errors before pushing
4. Verify the tool works in development mode
5. Push to GitHub and monitor Vercel deployment logs

---

## Common TypeScript Errors and Fixes

### Error: `'X' is declared but its value is never read (TS6133)`
**Fix:** Remove unused imports or variables

### Error: `Parameter 'x' implicitly has an 'any' type (TS7006)`
**Fix:** Add type annotation to the parameter: `(x: type)`

### Error: `Property 'X' does not exist on type 'never' (TS2339)`
**Fix:** Add proper type definition to the state or variable

### Error: `Variable 'x' is used before being assigned`
**Fix:** Initialize the variable: `let x = initialValue`

---

## After Conversion Checklist

- [ ] Tool has `import { useNavigate } from 'react-router-dom'`
- [ ] Tool has `const navigate = useNavigate()` inside component
- [ ] Home button uses `navigate('/')` not `window.location.href`
- [ ] React import is correct (no unused `React`)
- [ ] All type definitions added at top of file
- [ ] All state declarations use generic types
- [ ] All functions have parameter and return types
- [ ] All `.map()` callbacks have types
- [ ] All `.reduce()` callbacks have types
- [ ] All `.filter()` callbacks have types
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
    const shares = [10, 20].map((x) => x * 2);
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

type QuestionType = {
  display: string;
  answer: string;
};

const MyTool = () => {
  const navigate = useNavigate();
  
  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [worksheet, setWorksheet] = useState<QuestionType[]>([]);
  
  const generateQuestion = (level: string): QuestionType => {
    let total = 0, partValue = 0;
    const shares = [10, 20].map((x: number) => x * 2);
    return { display: "Question", answer: "Answer" };
  };
  
  return (
    <button onClick={() => navigate('/')}>Home</button>
  );
};
```

---

## Key Principles

1. **TypeScript is strict** - Every variable, parameter, and return value needs a type
2. **Callbacks need types** - This is the most commonly missed requirement
3. **Initialize everything** - No uninitialized variables allowed
4. **Test before pushing** - Run `npm run build` locally first
5. **When in doubt, use `any`** - Better than build failures, can refine later

---

## Notes

- This guide assumes TypeScript strict mode is enabled
- All conversions must maintain original functionality
- Visual appearance and behavior should remain identical
- These changes are ONLY for TypeScript compatibility, not improvements
