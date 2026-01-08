# GENERIC SHELL CUSTOMIZATION GUIDE v3.0

**Purpose:** Customize GenericToolShell.tsx for mathematics teaching tools  
**Shell:** Already contains complete UI, state management, and rendering  
**Customize:** Only 4 functions below

---

## 1. WORKFLOW

1. User provides: this spec + tool requirements
2. Claude customizes: TOOL_CONFIG, generateQuestion(), getQuestionUniqueKey(), renderDiagram() (optional)
3. Preview and iterate

**DO NOT modify UI, state, or rendering logic - already complete**

---

## 2. TOOL_CONFIG

```tsx
const TOOL_CONFIG = {
  pageTitle: 'Tool Name',     // Static main title
  tools: {
    tool1: { 
      name: 'Sub-Tool 1',
      useSubstantialBoxes: false,      // Background boxes for questions?
      variables: [                     // Checkboxes
        { key: 'includeNegatives', label: 'Include Negatives', defaultValue: false }
      ],
      dropdown: {                      // Mutually exclusive options (or null)
        key: 'questionType',
        label: 'Type',
        options: [{ value: 'standard', label: 'Standard' }],
        defaultValue: 'standard'
      },
      difficultySettings: null         // Per-level overrides (or null)
    }
  },
  useGraphicalLayout: false            // Diagram + working area side-by-side?
};
```

### Decision Guide

**useSubstantialBoxes: true** → Iteration, multi-part questions, ratios needing space  
**useSubstantialBoxes: false** → Simple arithmetic, brief expressions

**useGraphicalLayout: true** → Geometry, graphs, bar models (diagrams essential)  
**useGraphicalLayout: false** → Algebra, arithmetic, text-based content

**variables** → Toggles that combine (negatives + worded)  
**dropdown** → Choose one method/context (or null if not needed)

**difficultySettings** → When options differ by level (advanced methods at L3 only)

---

## 3. QUESTION GENERATION

### Function Structure
```tsx
const generateQuestion = (
  tool: string,           // 'tool1' | 'tool2' | 'tool3'
  level: string,          // 'level1' | 'level2' | 'level3'
  variables: Record<string, boolean>,
  dropdownValue: string
): Question => {
  // 1. Generate values based on level
  // 2. Apply variable/dropdown modifications
  // 3. Calculate answer
  // 4. Build display string
  // 5. Create working steps
  
  return {
    display: string,      // Question text
    answer: string,       // Answer text
    working: [{ type: 'step', content: string }],
    values: object,       // For duplicate detection
    difficulty: level
  };
};
```

### Difficulty Ranges

**Level 1:** 2-12, positive only, simple, no edge cases  
**Level 2:** 5-25, medium complexity, simple negatives possible  
**Level 3:** Full range including negatives, complex, edge cases

### Integer Answers

Work **backwards** from answer:
```tsx
// ✅ RIGHT
const answer = random(2, 10);
const divisor = random(2, 5);
const dividend = answer * divisor;  // Guarantees integer

// ❌ WRONG
const a = random(2, 10);
const answer = a / random(2, 5);    // Might be decimal
```

### Uniqueness

```tsx
// Store defining values
values: { a: 5, b: 3, operation: 'multiply' }

// Define what makes questions unique
const getQuestionUniqueKey = (q: Question): string => {
  return `${q.values.a}-${q.values.b}-${q.values.operation}`;
};
```

---

## 4. MATHEMATICAL FORMATTING

### Special Characters (CRITICAL)

| Char | Code | Use | ❌ Wrong |
|------|------|-----|----------|
| − | U+2212 | Minus | `-` hyphen |
| × | U+00D7 | Multiply | `x` or `*` |
| ÷ | U+00F7 | Divide | `/` |
| ² ³ | U+00B2/B3 | Powers | `^2` `^3` |

### Coefficient Rules

```tsx
// Coefficient of 1: show 'x' not '1x'
if (coeff === 1) return 'x';
if (coeff === -1) return '−x';

// First term: no leading +
if (isFirst && coeff > 0) return `${coeff}x`;
if (isFirst && coeff < 0) return `−${Math.abs(coeff)}x`;

// Subsequent terms: always show sign
if (coeff > 0) return ` + ${coeff}x`;
if (coeff < 0) return ` − ${Math.abs(coeff)}x`;
```

### Helper Functions

```tsx
const gcd = (a: number, b: number): number => 
  b === 0 ? Math.abs(a) : gcd(b, a % b);

const formatRatio = (a: number, b: number): string => {
  const d = gcd(a, b);
  return `${a/d} : ${b/d}`;
};

const formatSign = (value: number, isFirst: boolean = false): string => {
  if (isFirst) return value < 0 ? '−' : '';
  return value < 0 ? ' − ' : ' + ';
};
```

**Spacing:** Always space operators: `2 + 3` not `2+3`, `x = 5` not `x=5`, `2 : 3` not `2:3`

---

## 5. WORKED SOLUTIONS

### Step Format

```tsx
working: [
  { type: 'step', content: 'Multiply both sides by 5: 2x = 10' },
  { type: 'step', content: 'Divide both sides by 2: x = 5' }
]
```

**Rules:**
- Heading: "Step {n}" (NO colon - UI adds this)
- Content: One operation per step
- Focus: Show transformation, not teaching commentary
- Count: L1: 1-2 steps, L2: 2-4 steps, L3: 3-5 steps

**Avoid:**
- ❌ "First we need to..."
- ❌ Multiple operations in one step
- ❌ "Remember to..."
- ❌ Explanatory text

---

## 6. ANSWER FORMATS

| Topic | Format | Example |
|-------|--------|---------|
| Algebra | `x = value` | `x = 5` |
| Ratios | `a : b` | `2 : 3` |
| Percentages | `value%` | `25%` |
| Money | `£value` | `£45.50` |
| Expressions | Simplified | `2x² − 3x + 1` |

---

## 7. COMPLETE EXAMPLE

**Requirements:** "One-step linear equations: ax = b and x + a = b. Three difficulty levels, integer answers."

```tsx
const TOOL_CONFIG = {
  pageTitle: 'Linear Equations',
  tools: {
    oneStep: { 
      name: 'One-Step Equations', 
      useSubstantialBoxes: false,
      variables: [{ key: 'includeNegatives', label: 'Include Negatives', defaultValue: false }],
      dropdown: null,
      difficultySettings: null,
    },
  },
  useGraphicalLayout: false,
};

const generateQuestion = (tool, level, variables, dropdownValue) => {
  const isMult = Math.random() < 0.5;
  let x, a, b;
  
  if (level === 'level1') {
    x = Math.floor(Math.random() * 9) + 2;
    a = Math.floor(Math.random() * 8) + 2;
  } else if (level === 'level2') {
    x = Math.floor(Math.random() * 15) + 5;
    a = Math.floor(Math.random() * 10) + 2;
    if (variables.includeNegatives && Math.random() < 0.3) a = -a;
  } else {
    x = Math.floor(Math.random() * 19) - 9;
    if (x === 0) x = 1;
    a = Math.floor(Math.random() * 19) - 9;
    if (a === 0) a = 2;
  }
  
  if (isMult) {
    b = a * x;
    const aDisplay = a === 1 ? '' : a === -1 ? '−' : a;
    return {
      display: `${aDisplay}x = ${b}`,
      answer: `x = ${x}`,
      working: [
        { type: 'step', content: `Divide both sides by ${Math.abs(a)}: x = ${b} ÷ ${Math.abs(a)}` },
        { type: 'step', content: `x = ${x}` }
      ],
      values: { x, a, b, type: 'mult' },
      difficulty: level
    };
  } else {
    b = x + a;
    const sign = a < 0 ? '−' : '+';
    return {
      display: `x ${sign} ${Math.abs(a)} = ${b}`,
      answer: `x = ${x}`,
      working: [
        { type: 'step', content: `${a < 0 ? 'Add' : 'Subtract'} ${Math.abs(a)} from both sides: x = ${b} ${a < 0 ? '+' : '−'} ${Math.abs(a)}` },
        { type: 'step', content: `x = ${x}` }
      ],
      values: { x, a, b, type: 'add' },
      difficulty: level
    };
  }
};

const getQuestionUniqueKey = (q) => `${q.values.type}-${q.values.a}-${q.values.b}`;
```

---

## 8. VALIDATION CHECKLIST

**Question Generation**
- [ ] Three distinct difficulty levels
- [ ] Integer answers (unless decimals required)
- [ ] No duplicates in worksheets
- [ ] Variables/dropdowns change questions

**Mathematical Formatting**
- [ ] Using `−` (U+2212) NOT `-`
- [ ] Coefficient 1: `x` NOT `1x`
- [ ] Spaces around operators
- [ ] Simplified ratios

**Worked Solutions**
- [ ] "Step {n}" (no colon)
- [ ] One operation per step
- [ ] No explanatory text
- [ ] Appropriate step count

**Configuration**
- [ ] `values` object complete
- [ ] `getQuestionUniqueKey()` correct
- [ ] Features match question type

---

## 9. COMMON MISTAKES

**Mathematical**
- ❌ `-` instead of `−`
- ❌ `1x` instead of `x`
- ❌ `2+3` instead of `2 + 3`
- ❌ Non-integer answers

**Difficulty**
- ❌ L1 with negatives/large numbers
- ❌ L3 same as L1

**Steps**
- ❌ "Step 1:" with colon
- ❌ Multiple operations per step
- ❌ Teaching commentary

**Config**
- ❌ Missing values for uniqueness
- ❌ Wrong feature choices

---

**END OF SPECIFICATION v3.0**