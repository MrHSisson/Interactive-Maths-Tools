import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Eye, ChevronUp, ChevronDown, Home, Menu, X } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// ToolShell v1.5.1
//
// CUSTOMISE:
//   1. TOOL_CONFIG        — page title, tool names, variables, dropdowns
//   2. ToolType           — union of your tool keys
//   3. INFO_SECTIONS      — Tool Information modal content
//   4. generateQuestion() — your question logic
//   5. getQuestionUniqueKey() — uniqueness key for worksheet deduplication
//   6. renderDiagram()    — only used when useGraphicalLayout: true
// ─────────────────────────────────────────────────────────────────────────────

// ── TYPES ────────────────────────────────────────────────────────────────────

type ColorScheme = 'default' | 'blue' | 'pink' | 'yellow';
type DifficultyLevel = 'level1' | 'level2' | 'level3';
type Mode = 'whiteboard' | 'single' | 'worksheet';

type WorkingStep = { type: string; content: string };

type Question = {
  display: string;
  answer: string;
  working: WorkingStep[];
  values: Record<string, unknown>;
  difficulty: string;
};

type VariableConfig = { key: string; label: string; defaultValue: boolean };

type DropdownOption = {
  value: string;
  label: string;
  sub?: string; // #5: optional second line label
};

type DropdownConfig = {
  key: string;
  label: string;
  options: DropdownOption[];
  defaultValue: string;
  useTwoLineButtons?: boolean; // #5: render two-line buttons in popover
};

type DifficultySettings = {
  dropdown?: DropdownConfig;
  variables?: VariableConfig[];
};

type ToolSettings = {
  name: string;
  useSubstantialBoxes: boolean;
  variables: VariableConfig[];
  dropdown: DropdownConfig | null;
  difficultySettings: Record<string, DifficultySettings> | null;
};

type InfoItem = { label: string; detail: string };
type InfoSection = { title: string; icon: string; content: InfoItem[] };

// ── STEP 1: TOOL_CONFIG ──────────────────────────────────────────────────────

const TOOL_CONFIG: {
  pageTitle: string;
  useGraphicalLayout: boolean;
  tools: Record<string, ToolSettings>;
} = {
  pageTitle: 'Tool Name',
  useGraphicalLayout: false,
  tools: {
    tool1: {
      name: 'Sub-Tool 1',
      useSubstantialBoxes: false,
      variables: [
        { key: 'variable1', label: 'Option 1', defaultValue: false },
        { key: 'variable2', label: 'Option 2', defaultValue: false },
      ],
      dropdown: null,
      difficultySettings: null,
    },
    tool2: {
      name: 'Sub-Tool 2',
      useSubstantialBoxes: true,
      variables: [{ key: 'includeNegatives', label: 'Negatives', defaultValue: false }],
      dropdown: {
        key: 'questionType',
        label: 'Type',
        useTwoLineButtons: true,
        options: [
          { value: 'standard', label: 'Standard', sub: 'Numeric only' },
          { value: 'worded', label: 'Worded', sub: 'In context' },
        ],
        defaultValue: 'standard',
      },
      difficultySettings: null,
    },
    tool3: {
      name: 'Sub-Tool 3',
      useSubstantialBoxes: false,
      variables: [],
      dropdown: {
        key: 'method',
        label: 'Method',
        options: [
          { value: 'method1', label: 'Method 1' },
          { value: 'method2', label: 'Method 2' },
          { value: 'method3', label: 'Method 3' },
        ],
        defaultValue: 'method1',
      },
      difficultySettings: {
        level1: { dropdown: { key: 'method', label: 'Method', options: [{ value: 'method1', label: 'Simple' }], defaultValue: 'method1' } },
        level2: { dropdown: { key: 'method', label: 'Method', options: [{ value: 'method1', label: 'Method 1' }, { value: 'method2', label: 'Method 2' }], defaultValue: 'method1' } },
        level3: { dropdown: { key: 'method', label: 'Method', options: [{ value: 'method1', label: 'Method 1' }, { value: 'method2', label: 'Method 2' }, { value: 'method3', label: 'Advanced' }], defaultValue: 'method1' } },
      },
    },
  },
};

// ── STEP 2: ToolType ─────────────────────────────────────────────────────────
type ToolType = 'tool1' | 'tool2' | 'tool3';

// ── STEP 3: INFO_SECTIONS ────────────────────────────────────────────────────
const INFO_SECTIONS: InfoSection[] = [
  {
    title: 'Sub-Tool 1', icon: '📐',
    content: [
      { label: 'Overview', detail: 'Describe what this sub-tool does.' },
      { label: 'Level 1 — Green', detail: 'Describe Level 1 questions.' },
      { label: 'Level 2 — Yellow', detail: 'Describe Level 2 questions.' },
      { label: 'Level 3 — Red', detail: 'Describe Level 3 questions.' },
    ],
  },
  {
    title: 'Modes', icon: '🖥️',
    content: [
      { label: 'Whiteboard', detail: 'Single large question with blank working space. Ideal for whole-class teaching.' },
      { label: 'Worked Example', detail: 'Question with step-by-step solution revealed on demand.' },
      { label: 'Worksheet', detail: 'Grid of questions with adjustable columns and count.' },
    ],
  },
  {
    title: 'Differentiated Worksheet', icon: '📋',
    content: [
      { label: 'What it does', detail: 'Generates three colour-coded columns — one per difficulty level.' },
      { label: 'Layout', detail: 'Level 1 (green), Level 2 (yellow), Level 3 (red) side by side on one sheet.' },
    ],
  },
];

// ── LEVEL CONSTANTS (single source of truth) ─────────────────────────────────

const LV_LABELS: Record<DifficultyLevel, string> = {
  level1: 'Level 1',
  level2: 'Level 2',
  level3: 'Level 3',
};

const LV_HEADER_COLORS: Record<DifficultyLevel, string> = {
  level1: 'text-green-600',
  level2: 'text-yellow-500',
  level3: 'text-red-600',
};

const LV_COLORS: Record<DifficultyLevel, { bg: string; border: string; text: string; fill: string; activeBg: string; activeText: string }> = {
  level1: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700', fill: '#dcfce7', activeBg: 'bg-green-600', activeText: 'text-white' },
  level2: { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-700', fill: '#fef9c3', activeBg: 'bg-yellow-500', activeText: 'text-white' },
  level3: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700', fill: '#fee2e2', activeBg: 'bg-red-600', activeText: 'text-white' },
};

// ── STEP 4: generateQuestion ─────────────────────────────────────────────────

const generateQuestion = (
  tool: ToolType,
  level: DifficultyLevel,
  _variables: Record<string, boolean>,
  _dropdownValue: string,
): Question => ({
  display: `[Q — ${tool} ${level}]`,
  answer: `[A]`,
  working: [
    { type: 'step', content: '[Step 1]' },
    { type: 'step', content: '[Step 2]' },
    { type: 'step', content: '[Step 3]' },
  ],
  values: { id: Math.floor(Math.random() * 1_000_000) },
  difficulty: level,
});

// ── STEP 5: getQuestionUniqueKey ─────────────────────────────────────────────

const getQuestionUniqueKey = (q: Question): string => `${q.values.id}`;

const generateUniqueQuestion = (
  tool: ToolType,
  level: DifficultyLevel,
  variables: Record<string, boolean>,
  dropdownValue: string,
  usedKeys: Set<string>,
): Question => {
  let q: Question;
  let key = '';
  let attempts = 0;
  do {
    q = generateQuestion(tool, level, variables, dropdownValue);
    key = getQuestionUniqueKey(q);
    if (++attempts > 100) break;
  } while (usedKeys.has(key));
  usedKeys.add(key);
  return q;
};

// ── STEP 6: renderDiagram ────────────────────────────────────────────────────

const renderDiagram = (_question: Question | null, size: number): JSX.Element => (
  <div className="flex items-center justify-center h-full text-gray-400 text-xl">
    Diagram ({size}px)
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// ── Difficulty toggle ────────────────────────────────────────────────────────

interface DifficultyToggleProps {
  value: DifficultyLevel;
  onChange: (v: DifficultyLevel) => void;
}

const DifficultyToggle: React.FC<DifficultyToggleProps> = ({ value, onChange }) => (
  <div className="flex rounded-xl border-2 border-gray-300 overflow-hidden shadow-sm">
    {(
      [
        ['level1', 'Level 1', 'bg-green-600'],
        ['level2', 'Level 2', 'bg-yellow-500'],
        ['level3', 'Level 3', 'bg-red-600'],
      ] as [DifficultyLevel, string, string][]
    ).map(([val, label, activeCol]) => (
      <button
        key={val}
        onClick={() => onChange(val)}
        className={`px-5 py-2 font-bold text-base transition-colors ${
          value === val ? `${activeCol} text-white` : 'bg-white text-gray-500 hover:bg-gray-50'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

// ── Shared: dropdown section ─────────────────────────────────────────────────

interface DropdownSectionProps {
  dropdown: DropdownConfig;
  value: string;
  onChange: (v: string) => void;
}

const DropdownSection: React.FC<DropdownSectionProps> = ({ dropdown, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{dropdown.label}</span>
    <div className="flex rounded-lg border-2 border-gray-200 overflow-hidden">
      {dropdown.options.map((opt) =>
        dropdown.useTwoLineButtons ? (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 px-3 py-2.5 text-center transition-colors flex flex-col items-center justify-center ${
              value === opt.value ? 'bg-blue-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-sm font-bold leading-tight">{opt.label}</span>
            {opt.sub !== undefined && (
              <span className={`text-xs leading-tight mt-0.5 ${value === opt.value ? 'text-blue-200' : 'text-gray-400'}`}>
                {opt.sub}
              </span>
            )}
          </button>
        ) : (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 px-4 py-2.5 text-base font-bold transition-colors ${
              value === opt.value ? 'bg-blue-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {opt.label}
          </button>
        )
      )}
    </div>
  </div>
);

// ── Shared: variables section ────────────────────────────────────────────────

interface VariablesSectionProps {
  variables: VariableConfig[];
  values: Record<string, boolean>;
  onChange: (key: string, value: boolean) => void;
}

const VariablesSection: React.FC<VariablesSectionProps> = ({ variables, values, onChange }) => (
  <div className="flex flex-col gap-3">
    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Options</span>
    {variables.map((v) => (
      <label key={v.key} className="flex items-center gap-3 cursor-pointer py-1">
        <div
          onClick={() => onChange(v.key, !values[v.key])}
          className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
            values[v.key] ? 'bg-blue-900' : 'bg-gray-300'
          }`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${values[v.key] ? 'translate-x-7' : 'translate-x-1'}`} />
        </div>
        <span className="text-base font-semibold text-gray-700">{v.label}</span>
      </label>
    ))}
  </div>
);

// ── Standard QO popover (#1: no difficulty toggle inside) ────────────────────

interface StandardQOPopoverProps {
  variables: VariableConfig[];
  variableValues: Record<string, boolean>;
  onVariableChange: (key: string, value: boolean) => void;
  dropdown: DropdownConfig | null;
  dropdownValue: string;
  onDropdownChange: (v: string) => void;
}

const StandardQOPopover: React.FC<StandardQOPopoverProps> = ({
  variables, variableValues, onVariableChange, dropdown, dropdownValue, onDropdownChange,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const hasContent = variables.length > 0 || dropdown !== null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`px-4 py-2 rounded-xl border-2 font-bold text-base transition-colors shadow-sm flex items-center gap-2 ${
          open ? 'bg-blue-900 border-blue-900 text-white' : 'bg-white border-gray-300 text-gray-600 hover:border-blue-900 hover:text-blue-900'
        }`}
      >
        Question Options
        <ChevronDown size={18} style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 min-w-72 p-5 flex flex-col gap-5">
          {dropdown !== null && <DropdownSection dropdown={dropdown} value={dropdownValue} onChange={onDropdownChange} />}
          {variables.length > 0 && <VariablesSection variables={variables} values={variableValues} onChange={onVariableChange} />}
          {!hasContent && <p className="text-sm text-gray-400">No additional options for this tool.</p>}
        </div>
      )}
    </div>
  );
};

// ── Differentiated QO popover (#3 + #4) ─────────────────────────────────────

interface DiffQOPopoverProps {
  tool: ToolType;
  toolSettings: ToolSettings;
  levelVariables: Record<DifficultyLevel, Record<string, boolean>>;
  onLevelVariableChange: (level: DifficultyLevel, key: string, value: boolean) => void;
  levelDropdowns: Record<DifficultyLevel, string>;
  onLevelDropdownChange: (level: DifficultyLevel, value: string) => void;
}

const DiffQOPopover: React.FC<DiffQOPopoverProps> = ({
  toolSettings, levelVariables, onLevelVariableChange, levelDropdowns, onLevelDropdownChange,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const levels: DifficultyLevel[] = ['level1', 'level2', 'level3'];
  const getDropdownForLevel = (lv: DifficultyLevel): DropdownConfig | null =>
    toolSettings.difficultySettings?.[lv]?.dropdown ?? toolSettings.dropdown;
  const getVariablesForLevel = (lv: DifficultyLevel): VariableConfig[] =>
    toolSettings.difficultySettings?.[lv]?.variables ?? toolSettings.variables;
  const anyContent = levels.some((lv) => getDropdownForLevel(lv) !== null || getVariablesForLevel(lv).length > 0);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`px-4 py-2 rounded-xl border-2 font-bold text-base transition-colors shadow-sm flex items-center gap-2 ${
          open ? 'bg-blue-900 border-blue-900 text-white' : 'bg-white border-gray-300 text-gray-600 hover:border-blue-900 hover:text-blue-900'
        }`}
      >
        Question Options
        <ChevronDown size={18} style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 min-w-80 p-5 flex flex-col gap-5">
          {!anyContent ? (
            <p className="text-sm text-gray-400">No additional options for this tool.</p>
          ) : (
            levels.map((lv) => {
              const dd = getDropdownForLevel(lv);
              const vars = getVariablesForLevel(lv);
              return (
                <div key={lv} className="flex flex-col gap-2">
                  <span className={`text-sm font-extrabold uppercase tracking-wider ${LV_HEADER_COLORS[lv]}`}>
                    {LV_LABELS[lv]}
                  </span>
                  <div className="flex flex-col gap-3 pl-1">
                    {dd !== null && (
                      <DropdownSection dropdown={dd} value={levelDropdowns[lv]} onChange={(v) => onLevelDropdownChange(lv, v)} />
                    )}
                    {vars.length > 0 && (
                      <VariablesSection variables={vars} values={levelVariables[lv]} onChange={(key, val) => onLevelVariableChange(lv, key, val)} />
                    )}
                    {!dd && vars.length === 0 && (
                      <p className="text-xs text-gray-400">No options at this level.</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

// ── Tool Information modal ───────────────────────────────────────────────────

const InfoModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center"
    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    onClick={onClose}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col"
      style={{ height: '80vh' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tool Information</h2>
          <p className="text-sm text-gray-400 mt-0.5">A guide to all features and options</p>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="overflow-y-auto px-7 py-6 flex flex-col gap-6 flex-1">
        {INFO_SECTIONS.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{section.icon}</span>
              <h3 className="text-lg font-bold text-blue-900">{section.title}</h3>
            </div>
            <div className="flex flex-col gap-2">
              {section.content.map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl px-4 py-3">
                  <span className="font-bold text-gray-800 text-sm">{item.label}</span>
                  <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="px-7 py-4 border-t border-gray-100 flex justify-end flex-shrink-0">
        <button onClick={onClose} className="px-6 py-2 bg-blue-900 text-white rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors">
          Close
        </button>
      </div>
    </div>
  </div>
);

// ── Menu dropdown ────────────────────────────────────────────────────────────

interface MenuDropdownProps {
  colorScheme: ColorScheme;
  setColorScheme: (s: ColorScheme) => void;
  onClose: () => void;
  onOpenInfo: () => void;
}

const MenuDropdown: React.FC<MenuDropdownProps> = ({ colorScheme, setColorScheme, onClose, onOpenInfo }) => {
  const [colorOpen, setColorOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const schemes: ColorScheme[] = ['default', 'blue', 'pink', 'yellow'];

  return (
    <div ref={ref} className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden" style={{ minWidth: '200px' }}>
      <div className="py-1">
        <button
          onClick={() => setColorOpen(!colorOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${colorOpen ? '-rotate-90' : ''}`} />
            <span>Colour Scheme</span>
          </div>
          <span className="text-xs text-gray-400 font-normal capitalize">{colorScheme}</span>
        </button>
        {colorOpen && (
          <div className="border-t border-gray-100">
            {schemes.map((s) => (
              <button
                key={s}
                onClick={() => { setColorScheme(s); onClose(); }}
                className={`w-full flex items-center justify-between pl-10 pr-4 py-2.5 text-sm font-semibold transition-colors capitalize ${
                  colorScheme === s ? 'bg-blue-900 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="border-t border-gray-100 my-1" />
        <button
          onClick={() => { onOpenInfo(); onClose(); }}
          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400 flex-shrink-0">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 7v5M8 5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Tool Information
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const GenericToolShell: React.FC = () => {
  const navigate = useNavigate();

  const [currentTool, setCurrentTool] = useState<ToolType>('tool1');
  const [mode, setMode] = useState<Mode>('whiteboard');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('level1');

  const [toolVariables, setToolVariables] = useState<Record<string, Record<string, boolean>>>(() => {
    const init: Record<string, Record<string, boolean>> = {};
    Object.entries(TOOL_CONFIG.tools).forEach(([k, t]) => {
      init[k] = {};
      (t as ToolSettings).variables.forEach((v) => { init[k][v.key] = v.defaultValue; });
    });
    return init;
  });

  const [toolDropdowns, setToolDropdowns] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    Object.entries(TOOL_CONFIG.tools).forEach(([k, t]) => {
      const ts = t as ToolSettings;
      if (ts.dropdown) init[k] = ts.dropdown.defaultValue;
    });
    return init;
  });

  const [levelVariables, setLevelVariables] = useState<Record<DifficultyLevel, Record<string, boolean>>>(() => ({
    level1: {}, level2: {}, level3: {},
  }));

  const [levelDropdowns, setLevelDropdowns] = useState<Record<DifficultyLevel, string>>(() => ({
    level1: '', level2: '', level3: '',
  }));

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showWhiteboardAnswer, setShowWhiteboardAnswer] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);
  const [worksheet, setWorksheet] = useState<Question[]>([]);
  const [showWorksheetAnswers, setShowWorksheetAnswers] = useState(false);
  const [isDifferentiated, setIsDifferentiated] = useState(false);
  const [numColumns, setNumColumns] = useState(2);
  const [worksheetFontSize, setWorksheetFontSize] = useState(1);
  const [colorScheme, setColorScheme] = useState<ColorScheme>('default');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const getQuestionBg = (): string => {
    if (colorScheme === 'blue') return '#D1E7F8';
    if (colorScheme === 'pink') return '#F8D1E7';
    if (colorScheme === 'yellow') return '#F8F4D1';
    return '#ffffff';
  };

  const getStepBg = (): string => {
    if (colorScheme === 'blue') return '#B3D9F2';
    if (colorScheme === 'pink') return '#F2B3D9';
    if (colorScheme === 'yellow') return '#F2EBB3';
    return '#f3f4f6';
  };

  const getToolSettings = (): ToolSettings => TOOL_CONFIG.tools[currentTool] as ToolSettings;
  const getDropdownConfig = (): DropdownConfig | null => {
    const t = getToolSettings();
    return t.difficultySettings?.[difficulty]?.dropdown ?? t.dropdown;
  };
  const getVariablesConfig = (): VariableConfig[] => {
    const t = getToolSettings();
    return t.difficultySettings?.[difficulty]?.variables ?? t.variables;
  };
  const getDropdownValue = (): string => toolDropdowns[currentTool] ?? '';
  const setDropdownValue = (v: string): void => setToolDropdowns((prev) => ({ ...prev, [currentTool]: v }));
  const setVariableValue = (key: string, value: boolean): void =>
    setToolVariables((prev) => ({ ...prev, [currentTool]: { ...prev[currentTool], [key]: value } }));
  const handleLevelVariableChange = (level: DifficultyLevel, key: string, value: boolean): void =>
    setLevelVariables((prev) => ({ ...prev, [level]: { ...prev[level], [key]: value } }));
  const handleLevelDropdownChange = (level: DifficultyLevel, value: string): void =>
    setLevelDropdowns((prev) => ({ ...prev, [level]: value }));

  useEffect(() => {
    const t = getToolSettings();
    setLevelDropdowns((prev) => {
      const next = { ...prev };
      (['level1', 'level2', 'level3'] as DifficultyLevel[]).forEach((lv) => {
        const dd = t.difficultySettings?.[lv]?.dropdown ?? t.dropdown;
        if (dd && !next[lv]) next[lv] = dd.defaultValue;
      });
      return next;
    });
  }, [currentTool]);

  const handleNewQuestion = (): void => {
    const q = generateQuestion(currentTool, difficulty, toolVariables[currentTool] || {}, getDropdownValue());
    setCurrentQuestion(q);
    setShowWhiteboardAnswer(false);
    setShowAnswer(false);
  };

  const handleGenerateWorksheet = (): void => {
    const usedKeys = new Set<string>();
    const questions: Question[] = [];
    if (isDifferentiated) {
      (['level1', 'level2', 'level3'] as DifficultyLevel[]).forEach((lv) => {
        for (let i = 0; i < numQuestions; i++) {
          questions.push(generateUniqueQuestion(currentTool, lv, levelVariables[lv], levelDropdowns[lv], usedKeys));
        }
      });
    } else {
      for (let i = 0; i < numQuestions; i++) {
        questions.push(generateUniqueQuestion(currentTool, difficulty, toolVariables[currentTool] || {}, getDropdownValue(), usedKeys));
      }
    }
    setWorksheet(questions);
    setShowWorksheetAnswers(false);
  };

  useEffect(() => {
    if (mode !== 'worksheet') handleNewQuestion();
  }, [difficulty, currentTool]);

  const fontSizes = ['text-xl', 'text-2xl', 'text-3xl', 'text-4xl'];
  const canIncrease = worksheetFontSize < fontSizes.length - 1;
  const canDecrease = worksheetFontSize > 0;

  const stdQOProps: StandardQOPopoverProps = {
    variables: getVariablesConfig(),
    variableValues: toolVariables[currentTool] || {},
    onVariableChange: setVariableValue,
    dropdown: getDropdownConfig(),
    dropdownValue: getDropdownValue(),
    onDropdownChange: setDropdownValue,
  };

  const diffQOProps: DiffQOPopoverProps = {
    tool: currentTool,
    toolSettings: getToolSettings(),
    levelVariables,
    onLevelVariableChange: handleLevelVariableChange,
    levelDropdowns,
    onLevelDropdownChange: handleLevelDropdownChange,
  };

  const renderControlBar = (): JSX.Element => {
    if (mode === 'worksheet') return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-center items-center gap-6 mb-4">
          <div className="flex items-center gap-3">
            <label className="text-base font-semibold text-gray-700">Questions:</label>
            <input
              type="number" min="1" max="20" value={numQuestions}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNumQuestions(Math.max(1, Math.min(20, parseInt(e.target.value) || 5)))
              }
              className="w-20 px-4 py-2 border-2 border-gray-300 rounded-lg text-base"
            />
          </div>
          {isDifferentiated ? <DiffQOPopover {...diffQOProps} /> : <StandardQOPopover {...stdQOProps} />}
          <button
            onClick={() => setIsDifferentiated(!isDifferentiated)}
            className={`px-6 py-2 rounded-xl font-bold text-base shadow-sm border-2 transition-colors ${
              isDifferentiated ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-900 hover:text-blue-900'
            }`}
          >
            Differentiated
          </button>
        </div>
        {!isDifferentiated && (
          <div className="flex justify-center items-center gap-6 mb-4">
            <DifficultyToggle value={difficulty} onChange={setDifficulty} />
            <div className="flex items-center gap-3">
              <label className="text-base font-semibold text-gray-700">Columns:</label>
              <input
                type="number" min="1" max="4" value={numColumns}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNumColumns(Math.max(1, Math.min(4, parseInt(e.target.value) || 2)))
                }
                className="w-20 px-4 py-2 border-2 border-gray-300 rounded-lg text-base"
              />
            </div>
          </div>
        )}
        <div className="flex justify-center items-center gap-4">
          <button onClick={handleGenerateWorksheet} className="px-6 py-2 bg-blue-900 text-white rounded-xl font-bold text-base shadow-sm hover:bg-blue-800 flex items-center gap-2">
            <RefreshCw size={18} /> Generate Worksheet
          </button>
          {worksheet.length > 0 && (
            <button onClick={() => setShowWorksheetAnswers(!showWorksheetAnswers)} className="px-6 py-2 bg-blue-900 text-white rounded-xl font-bold text-base shadow-sm hover:bg-blue-800 flex items-center gap-2">
              <Eye size={18} /> {showWorksheetAnswers ? 'Hide Answers' : 'Show Answers'}
            </button>
          )}
        </div>
      </div>
    );

    return (
      <div className="bg-white rounded-xl shadow-lg p-5 mb-8">
        <div className="flex items-center justify-between gap-4">
          <DifficultyToggle value={difficulty} onChange={setDifficulty} />
          <StandardQOPopover {...stdQOProps} />
          <div className="flex gap-3">
            <button onClick={handleNewQuestion} className="px-6 py-2 bg-blue-900 text-white rounded-xl font-bold text-base shadow-sm hover:bg-blue-800 flex items-center gap-2">
              <RefreshCw size={18} /> New Question
            </button>
            <button
              onClick={() => mode === 'whiteboard' ? setShowWhiteboardAnswer(!showWhiteboardAnswer) : setShowAnswer(!showAnswer)}
              className="px-6 py-2 bg-blue-900 text-white rounded-xl font-bold text-base shadow-sm hover:bg-blue-800 flex items-center gap-2"
            >
              <Eye size={18} />
              {(mode === 'whiteboard' ? showWhiteboardAnswer : showAnswer) ? 'Hide Answer' : 'Show Answer'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderWhiteboardMode = (): JSX.Element => {
    if (TOOL_CONFIG.useGraphicalLayout) {
      return (
        <div className="rounded-xl shadow-2xl p-8" style={{ backgroundColor: getQuestionBg() }}>
          <div className="flex gap-6">
            <div className="rounded-xl flex items-center justify-center" style={{ width: '450px', height: '500px', backgroundColor: getStepBg() }}>
              {renderDiagram(currentQuestion, 400)}
            </div>
            <div className="flex-1 rounded-xl p-6" style={{ minHeight: '500px', backgroundColor: getStepBg() }}>
              {currentQuestion && (
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold">{currentQuestion.display}</span>
                  {showWhiteboardAnswer && <span className="text-4xl font-bold ml-4" style={{ color: '#166534' }}>= {currentQuestion.answer}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="rounded-xl shadow-2xl p-8" style={{ backgroundColor: getQuestionBg() }}>
        <div className="text-center">
          {currentQuestion ? (
            <>
              <span className="text-6xl font-bold" style={{ color: '#000000' }}>{currentQuestion.display}</span>
              {showWhiteboardAnswer && <span className="text-6xl font-bold ml-4" style={{ color: '#166534' }}>= {currentQuestion.answer}</span>}
            </>
          ) : (
            <span className="text-4xl text-gray-400">Generate question</span>
          )}
        </div>
        <div className="rounded-xl mt-8" style={{ height: '500px', backgroundColor: getStepBg() }} />
      </div>
    );
  };

  const renderWorkedExampleMode = (): JSX.Element => {
    if (TOOL_CONFIG.useGraphicalLayout) {
      return (
        <div className="overflow-y-auto" style={{ height: '120vh' }}>
          <div className="rounded-xl shadow-lg p-8 w-full" style={{ backgroundColor: getQuestionBg() }}>
            <div className="flex gap-6">
              <div className="rounded-xl flex items-center justify-center" style={{ width: '450px', height: '500px', backgroundColor: getStepBg() }}>
                {renderDiagram(currentQuestion, 400)}
              </div>
              <div className="flex-1">
                {currentQuestion && (
                  <>
                    <div className="text-center mb-6"><span className="text-4xl font-bold">{currentQuestion.display}</span></div>
                    {showAnswer && (
                      <>
                        <div className="space-y-4">
                          {currentQuestion.working.map((step, i) => (
                            <div key={i} className="rounded-xl p-6" style={{ backgroundColor: getStepBg() }}>
                              <h4 className="text-xl font-bold mb-2" style={{ color: '#000000' }}>Step {i + 1}</h4>
                              <p className="text-3xl" style={{ color: '#000000' }}>{step.content}</p>
                            </div>
                          ))}
                        </div>
                        <div className="rounded-xl p-6 text-center mt-4" style={{ backgroundColor: getStepBg() }}>
                          <span className="text-5xl font-bold" style={{ color: '#166534' }}>= {currentQuestion.answer}</span>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="overflow-y-auto" style={{ height: '120vh' }}>
        <div className="rounded-xl shadow-lg p-8 w-full" style={{ backgroundColor: getQuestionBg() }}>
          {currentQuestion ? (
            <>
              <div className="text-center"><span className="text-6xl font-bold" style={{ color: '#000000' }}>{currentQuestion.display}</span></div>
              {showAnswer && (
                <>
                  <div className="space-y-4 mt-8">
                    {currentQuestion.working.map((step, i) => (
                      <div key={i} className="rounded-xl p-6" style={{ backgroundColor: getStepBg() }}>
                        <h4 className="text-xl font-bold mb-2" style={{ color: '#000000' }}>Step {i + 1}</h4>
                        <p className="text-3xl" style={{ color: '#000000' }}>{step.content}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl p-6 text-center mt-4" style={{ backgroundColor: getStepBg() }}>
                    <span className="text-5xl font-bold" style={{ color: '#166534' }}>= {currentQuestion.answer}</span>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-center text-gray-400 text-4xl py-16">Generate question</div>
          )}
        </div>
      </div>
    );
  };

  const renderWorksheetMode = (): JSX.Element => {
    const toolSettings = getToolSettings();
    const fsz = fontSizes[worksheetFontSize];

    if (worksheet.length === 0) return (
      <div className="rounded-xl shadow-2xl p-8 text-center" style={{ backgroundColor: getQuestionBg() }}>
        <span className="text-2xl text-gray-400">Generate worksheet</span>
      </div>
    );

    const fontSizeControls = (
      <div className="absolute top-4 right-4 flex items-center gap-1">
        <button disabled={!canDecrease} onClick={() => canDecrease && setWorksheetFontSize(worksheetFontSize - 1)}
          className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${canDecrease ? 'bg-blue-900 text-white hover:bg-blue-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          <ChevronDown size={20} />
        </button>
        <button disabled={!canIncrease} onClick={() => canIncrease && setWorksheetFontSize(worksheetFontSize + 1)}
          className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${canIncrease ? 'bg-blue-900 text-white hover:bg-blue-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          <ChevronUp size={20} />
        </button>
      </div>
    );

    const renderQCell = (q: Question, idx: number, bgOverride?: string): JSX.Element => {
      const bg = bgOverride ?? getStepBg();
      return toolSettings.useSubstantialBoxes ? (
        <div className="rounded-lg p-4 shadow" style={{ backgroundColor: bg }}>
          <span className={`${fsz} font-semibold`} style={{ color: '#000000' }}>{idx + 1}. {q.display}</span>
          {showWorksheetAnswers && <span className={`${fsz} font-semibold ml-2`} style={{ color: '#059669' }}>= {q.answer}</span>}
        </div>
      ) : (
        <div className="p-3">
          <span className={`${fsz} font-semibold`} style={{ color: '#000000' }}>{idx + 1}. {q.display}</span>
          {showWorksheetAnswers && <span className={`${fsz} font-semibold ml-2`} style={{ color: '#059669' }}>= {q.answer}</span>}
        </div>
      );
    };

    if (isDifferentiated) return (
      <div className="rounded-xl shadow-2xl p-8 relative" style={{ backgroundColor: getQuestionBg() }}>
        {fontSizeControls}
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#000000' }}>{TOOL_CONFIG.tools[currentTool].name} — Worksheet</h2>
        <div className="grid grid-cols-3 gap-4">
          {(['level1', 'level2', 'level3'] as DifficultyLevel[]).map((lv, li) => {
            const lqs = worksheet.filter((q) => q.difficulty === lv);
            const c = LV_COLORS[lv];
            return (
              <div key={lv} className={`${c.bg} border-2 ${c.border} rounded-xl p-4`}>
                <h3 className={`text-xl font-bold mb-4 text-center ${c.text}`}>Level {li + 1}</h3>
                <div className="space-y-3">{lqs.map((q, idx) => <div key={idx}>{renderQCell(q, idx, c.fill)}</div>)}</div>
              </div>
            );
          })}
        </div>
      </div>
    );

    return (
      <div className="rounded-xl shadow-2xl p-8 relative" style={{ backgroundColor: getQuestionBg() }}>
        {fontSizeControls}
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#000000' }}>{TOOL_CONFIG.tools[currentTool].name} — Worksheet</h2>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${numColumns}, 1fr)` }}>
          {worksheet.map((q, idx) => <div key={idx}>{renderQCell(q, idx)}</div>)}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-blue-900 shadow-lg">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors">
            <Home size={24} /><span className="font-semibold text-lg">Home</span>
          </button>
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white hover:bg-blue-800 p-2 rounded-lg transition-colors">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            {isMenuOpen && (
              <MenuDropdown colorScheme={colorScheme} setColorScheme={setColorScheme} onClose={() => setIsMenuOpen(false)} onOpenInfo={() => setIsInfoOpen(true)} />
            )}
          </div>
        </div>
      </div>

      {isInfoOpen && <InfoModal onClose={() => setIsInfoOpen(false)} />}

      <div className="min-h-screen p-8" style={{ backgroundColor: '#f5f3f0' }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-8" style={{ color: '#000000' }}>{TOOL_CONFIG.pageTitle}</h1>
          <div className="flex justify-center mb-8"><div style={{ width: '90%', height: '2px', backgroundColor: '#d1d5db' }} /></div>

          <div className="flex justify-center gap-4 mb-6">
            {(Object.keys(TOOL_CONFIG.tools) as ToolType[]).map((tool) => (
              <button key={tool} onClick={() => setCurrentTool(tool)}
                className={`px-8 py-4 rounded-xl font-bold text-xl transition-all shadow-xl ${
                  currentTool === tool ? 'bg-blue-900 text-white' : 'bg-white text-gray-800 hover:bg-gray-100 hover:text-blue-900'
                }`}>
                {(TOOL_CONFIG.tools[tool] as ToolSettings).name}
              </button>
            ))}
          </div>

          <div className="flex justify-center mb-8"><div style={{ width: '90%', height: '2px', backgroundColor: '#d1d5db' }} /></div>

          <div className="flex justify-center gap-4 mb-8">
            {(['whiteboard', 'single', 'worksheet'] as Mode[]).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-8 py-4 rounded-xl font-bold text-xl transition-all shadow-xl ${
                  mode === m ? 'bg-blue-900 text-white' : 'bg-white text-gray-800 hover:bg-gray-100 hover:text-blue-900'
                }`}>
                {m === 'whiteboard' ? 'Whiteboard' : m === 'single' ? 'Worked Example' : 'Worksheet'}
              </button>
            ))}
          </div>

          {renderControlBar()}
          {mode === 'whiteboard' && renderWhiteboardMode()}
          {mode === 'single' && renderWorkedExampleMode()}
          {mode === 'worksheet' && renderWorksheetMode()}
        </div>
      </div>
    </>
  );
};

export default GenericToolShell;

// ─────────────────────────────────────────────────────────────────────────────
// INTEGRATION NOTES
//
// Dependencies: lucide-react, react-router-dom, tailwindcss
//
// Routing: navigate('/') in the Home button uses react-router-dom v6.
//
// To start a new tool, copy this file and edit:
//   • TOOL_CONFIG   — pageTitle, tools, variables, dropdowns, difficultySettings
//   • ToolType      — union of your tool keys
//   • INFO_SECTIONS — Tool Information modal content
//   • generateQuestion()
//   • getQuestionUniqueKey()
//   • renderDiagram() — only if useGraphicalLayout: true
// ─────────────────────────────────────────────────────────────────────────────
