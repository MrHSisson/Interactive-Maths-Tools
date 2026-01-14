# SHELL CUSTOMIZATION v4.0

## CRITICAL STEPS

### 1. UPDATE ToolType (match tool count)
```tsx
type ToolType = 'tool1' | 'tool2' | 'tool3';  // Match TOOL_CONFIG.tools keys
```

### 2. TOOL_CONFIG
```tsx
const TOOL_CONFIG = {
  pageTitle: 'Your Tool Name',
  tools: {
    tool1: { 
      name: 'Sub-Tool Name',
      useSubstantialBoxes: false,  // true for complex/multi-part questions
      variables: [{ key: 'varName', label: 'Label', defaultValue: false }],
      dropdown: null,  // or { key, label, options: [{value, label}], defaultValue }
      difficultySettings: null,  // or per-level overrides
    },
  },
  useGraphicalLayout: false,  // true if diagrams essential
};
```

### 3. generateQuestion()
```tsx
const generateQuestion = (
  tool: ToolType,
  level: DifficultyLevel,
  variables: Record<string, boolean>,
  dropdownValue: string
): Question => {
  // Initialize ALL variables
  let a = 0, b = 0, display = '', answer = '';
  let working: WorkingStep[] = [];
  
  // Level-based generation
  if (level === 'level1') {
    a = Math.floor(Math.random() * 9) + 2;  // 2-10, positive
  } else if (level === 'level2') {
    a = Math.floor(Math.random() * 15) + 5;  // 5-19, medium
  } else {
    a = Math.floor(Math.random() * 20) - 10;  // -10 to 9, full range
  }
  
  // Build question
  display = `${a} + ${b}`;
  answer = `${a + b}`;
  working = [{ type: 'step', content: 'Step content' }];
  
  return { display, answer, working, values: { a, b }, difficulty: level };
};
```

### 4. getQuestionUniqueKey()
```tsx
const getQuestionUniqueKey = (q: Question): string => {
  return `${q.values.a}-${q.values.b}`;  // Use values that make question unique
};
```

## TYPESCRIPT RULES

**Variables**
```tsx
let a = 0;  // ✅ Initialize
let a: number;  // ❌ Uninitialized
let working: WorkingStep[] = [];  // ✅ Type arrays
```

**Functions**
```tsx
const fn = (...): Question => { }  // ✅ Return type
const fn = (...) => { }  // ❌ No return type
```

**Return Object**
```tsx
return {
  display,
  answer,
  working,
  values: { a, b },
  difficulty: level,
};
```

## MATH FORMATTING

| Char | Use | ❌ Wrong |
|------|-----|----------|
| − | Minus | `-` |
| × | Multiply | `x` or `*` |
| ÷ | Divide | `/` |

**Coefficients**
```tsx
if (coeff === 1) return 'x';  // NOT '1x'
if (coeff === -1) return '−x';  // NOT '−1x'
```

**Spacing**: `2 + 3` NOT `2+3`

## HELPER FUNCTIONS

```tsx
const gcd = (a: number, b: number): number => 
  b === 0 ? Math.abs(a) : gcd(b, a % b);

const formatRatio = (a: number, b: number): string => {
  const d = gcd(a, b);
  return `${a/d} : ${b/d}`;
};

const formatMinus = (value: number): string => {
  return value < 0 ? '−' + Math.abs(value) : String(value);
};
```

## INTEGER ANSWERS (work backwards)
```tsx
const answer = Math.floor(Math.random() * 9) + 2;
const divisor = Math.floor(Math.random() * 4) + 2;
const dividend = answer * divisor;  // ✅ Guarantees integer
```

## DIFFICULTY RANGES
- **L1**: 2-12, positive only, simple
- **L2**: 5-25, medium complexity
- **L3**: Full range, negatives, edge cases

## WORKING STEPS
```tsx
working: [
  { type: 'step', content: 'Operation: result' },  // One op per step, no teaching
]
```
- L1: 1-2 steps
- L2: 2-4 steps  
- L3: 3-5 steps

## ANSWER FORMATS
- Algebra: `x = 5`
- Ratios: `2 : 3`
- Percentages: `25%`
- Money: `£45.50`

## CHECKLIST BEFORE REQUESTING ARTIFACT

- [ ] ToolType matches tool count in TOOL_CONFIG
- [ ] All variables initialized
- [ ] generateQuestion returns `: Question`
- [ ] Return object has all 5 fields
- [ ] Using `−` not `-` for minus
- [ ] Spaces around operators
- [ ] Coefficient 1 shows as `x` not `1x`

## ROUTING (final step)
Request: "Add routing for web integration"
