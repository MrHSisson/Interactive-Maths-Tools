# Tool Conversion Prompt for Website Integration

Use this prompt when converting a maths tool artifact to be website-ready for the Vercel-hosted site.

---

## Prompt to Copy:

```
I have a maths tool built to the TSX v1.5 specification. I need you to convert it for my website without changing any functionality or appearance.

Make ONLY these changes:

1. **Add routing import** at the top:
   ```tsx
   import { useNavigate } from 'react-router-dom'
   ```

2. **Add navigate hook** inside the component (after the component function declaration):
   ```tsx
   const navigate = useNavigate()
   ```

3. **Update Home button** - change:
   ```tsx
   onClick={() => window.location.href = '/'}
   ```
   to:
   ```tsx
   onClick={() => navigate('/')}
   ```

4. **Fix uninitialized variables** - TypeScript strict mode requires initial values. Change patterns like:
   ```tsx
   let a: number, b: number, answer: number
   ```
   to:
   ```tsx
   let a = 0, b = 0, answer = 0
   ```
   
   And for strings:
   ```tsx
   let display: string, operation: string
   ```
   to:
   ```tsx
   let display = '', operation = ''
   ```

5. **Keep everything else identical** - do not simplify, remove features, or change any logic, styling, or structure.

Here is my tool:

[PASTE TOOL CODE HERE]
```

---

## After Conversion Checklist:

- [ ] Tool has `import { useNavigate } from 'react-router-dom'`
- [ ] Tool has `const navigate = useNavigate()` inside component
- [ ] Home button uses `navigate('/')` not `window.location.href`
- [ ] All variables have initial values (no `let x: type` without `= value`)
- [ ] All original functionality preserved

---

## To Add Tool to Website:

1. Save converted code as `src/tools/[ToolName].tsx`

2. Update `src/App.tsx`:
   ```tsx
   import ToolName from './tools/ToolName'
   // ...
   <Route path="/tool-path" element={<ToolName />} />
   ```

3. Update `src/components/LandingPage.tsx`:
   - Change `ready: false` to `ready: true` for the tool

4. Push to GitHub - Vercel auto-deploys
