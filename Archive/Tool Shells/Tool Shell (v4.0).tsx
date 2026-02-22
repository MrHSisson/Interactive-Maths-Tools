import { useState, useEffect } from 'react';
import { RefreshCw, Eye, ChevronUp, ChevronDown, Home, Menu, X } from 'lucide-react';

// v4.0 TYPESCRIPT-STRICT SHELL
// CUSTOMIZE: TOOL_CONFIG, ToolType, generateQuestion(), getQuestionUniqueKey(), renderDiagram()

const TOOL_CONFIG = {
  pageTitle: 'Tool Name',
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
      variables: [
        { key: 'includeNegatives', label: 'Negatives', defaultValue: false },
      ],
      dropdown: {
        key: 'questionType',
        label: 'Type',
        options: [
          { value: 'standard', label: 'Standard' },
          { value: 'worded', label: 'Worded' },
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
        level1: {
          dropdown: {
            key: 'method',
            label: 'Method',
            options: [{ value: 'method1', label: 'Simple' }],
            defaultValue: 'method1',
          },
        },
        level2: {
          dropdown: {
            key: 'method',
            label: 'Method',
            options: [
              { value: 'method1', label: 'Method 1' },
              { value: 'method2', label: 'Method 2' },
            ],
            defaultValue: 'method1',
          },
        },
        level3: {
          dropdown: {
            key: 'method',
            label: 'Method',
            options: [
              { value: 'method1', label: 'Method 1' },
              { value: 'method2', label: 'Method 2' },
              { value: 'method3', label: 'Advanced' },
            ],
            defaultValue: 'method1',
          },
        },
      },
    },
  },
  useGraphicalLayout: false,
};

// TYPE DEFINITIONS
type ColorScheme = 'default' | 'blue' | 'pink' | 'yellow';
type DifficultyLevel = 'level1' | 'level2' | 'level3';
type Mode = 'whiteboard' | 'single' | 'worksheet';
type ToolType = 'tool1' | 'tool2' | 'tool3';

type WorkingStep = {
  type: string;
  content: string;
};

type Question = {
  display: string;
  answer: string;
  working: WorkingStep[];
  values: Record<string, any>;
  difficulty: string;
};

type VariableConfig = {
  key: string;
  label: string;
  defaultValue: boolean;
};

type DropdownOption = {
  value: string;
  label: string;
};

type DropdownConfig = {
  key: string;
  label: string;
  options: DropdownOption[];
  defaultValue: string;
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

// QUESTION GENERATION
const generateQuestion = (
  tool: ToolType,
  level: DifficultyLevel,
  variables: Record<string, boolean>,
  dropdownValue: string
): Question => {
  const questionNumber = Math.floor(Math.random() * 1000);
  
  return {
    display: `[Q - ${level}]`,
    answer: `[A]`,
    working: [
      { type: 'step', content: '[Step 1]' },
      { type: 'step', content: '[Step 2]' },
      { type: 'step', content: '[Step 3]' },
    ],
    values: { id: questionNumber },
    difficulty: level,
  };
};

const getQuestionUniqueKey = (q: Question): string => {
  return `${q.values.id}`;
};

const generateUniqueQuestion = (
  tool: ToolType,
  level: DifficultyLevel,
  variables: Record<string, boolean>,
  dropdownValue: string,
  usedKeys: Set<string>
): Question => {
  let attempts = 0;
  let q: Question;
  let uniqueKey = '';
  
  do {
    q = generateQuestion(tool, level, variables, dropdownValue);
    uniqueKey = getQuestionUniqueKey(q);
    if (++attempts > 100) break;
  } while (usedKeys.has(uniqueKey));
  
  usedKeys.add(uniqueKey);
  return q;
};

// DIAGRAM RENDERER (for useGraphicalLayout: true)
const renderDiagram = (question: Question | null, size: number): JSX.Element => {
  if (!question) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-xl">
        Generate question
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <p className="text-gray-500 text-lg mb-2">Diagram</p>
        <p className="text-gray-400 text-sm">{size}px</p>
      </div>
    </div>
  );
};

export default function GenericToolShell() {
  const [currentTool, setCurrentTool] = useState<ToolType>('tool1');
  const [mode, setMode] = useState<Mode>('whiteboard');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('level1');
  
  // Per-tool variable and dropdown states (keyed by tool)
  const [toolVariables, setToolVariables] = useState<Record<string, Record<string, boolean>>>(() => {
    const initial: Record<string, Record<string, boolean>> = {};
    Object.entries(TOOL_CONFIG.tools).forEach(([toolKey, tool]: [string, ToolSettings]) => {
      initial[toolKey] = {};
      tool.variables.forEach((v: VariableConfig) => {
        initial[toolKey][v.key] = v.defaultValue;
      });
    });
    return initial;
  });
  
  const [toolDropdowns, setToolDropdowns] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    Object.entries(TOOL_CONFIG.tools).forEach(([toolKey, tool]: [string, ToolSettings]) => {
      if (tool.dropdown) {
        initial[toolKey] = tool.dropdown.defaultValue;
      }
    });
    return initial;
  });
  

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showWhiteboardAnswer, setShowWhiteboardAnswer] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  

  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [worksheet, setWorksheet] = useState<Question[]>([]);
  const [showWorksheetAnswers, setShowWorksheetAnswers] = useState<boolean>(false);
  const [isDifferentiated, setIsDifferentiated] = useState<boolean>(false);
  const [numColumns, setNumColumns] = useState<number>(2);
  const [worksheetFontSize, setWorksheetFontSize] = useState<number>(1);
  
  const [colorScheme, setColorScheme] = useState<ColorScheme>('default');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  
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
  
  const getWhiteboardWorkingBg = (): string => getStepBg();
  const getFinalAnswerBg = (): string => getStepBg();
  
  // Get background for substantial question boxes (uses darker shade from color scheme)
  const getQuestionBoxBg = (): string => getStepBg();
  

  
  const getDifficultyButtonClass = (idx: number, isActive: boolean): string => {
    if (isActive) {
      return idx === 0 ? 'bg-green-600 text-white' 
           : idx === 1 ? 'bg-yellow-600 text-white' 
           : 'bg-red-600 text-white';
    }
    return idx === 0 ? 'bg-white text-green-600 border-2 border-green-600' 
         : idx === 1 ? 'bg-white text-yellow-600 border-2 border-yellow-600' 
         : 'bg-white text-red-600 border-2 border-red-600';
  };
  

  
  const handleNewQuestion = (): void => {
    const variables = toolVariables[currentTool] || {};
    const dropdownValue = toolDropdowns[currentTool] || '';
    const q = generateQuestion(currentTool, difficulty, variables, dropdownValue);
    setCurrentQuestion(q);
    setShowWhiteboardAnswer(false);
    setShowAnswer(false);
  };
  
  const handleShowAnswer = (): void => {
    if (mode === 'whiteboard') {
      setShowWhiteboardAnswer(!showWhiteboardAnswer);
    } else {
      setShowAnswer(!showAnswer);
    }
  };
  

  
  const handleGenerateWorksheet = (): void => {
    const usedKeys = new Set<string>();
    const questions: Question[] = [];
    const variables = toolVariables[currentTool] || {};
    const dropdownValue = toolDropdowns[currentTool] || '';
    
    if (isDifferentiated) {
      // Generate questions for each level
      const levels: DifficultyLevel[] = ['level1', 'level2', 'level3'];
      levels.forEach((level: DifficultyLevel) => {
        for (let i = 0; i < numQuestions; i++) {
          const q = generateUniqueQuestion(currentTool, level, variables, dropdownValue, usedKeys);
          questions.push(q);
        }
      });
    } else {
      // Generate questions for current difficulty only
      for (let i = 0; i < numQuestions; i++) {
        const q = generateUniqueQuestion(currentTool, difficulty, variables, dropdownValue, usedKeys);
        questions.push(q);
      }
    }
    
    setWorksheet(questions);
    setShowWorksheetAnswers(false);
  };
  

  
  const fontSizes: string[] = ['text-xl', 'text-2xl', 'text-3xl', 'text-4xl'];
  
  const canIncreaseFontSize = (): boolean => worksheetFontSize < fontSizes.length - 1;
  const canDecreaseFontSize = (): boolean => worksheetFontSize > 0;
  
  const increaseFontSize = (): void => {
    if (canIncreaseFontSize()) {
      setWorksheetFontSize(worksheetFontSize + 1);
    }
  };
  
  const decreaseFontSize = (): void => {
    if (canDecreaseFontSize()) {
      setWorksheetFontSize(worksheetFontSize - 1);
    }
  };
  

  
  const getCurrentToolSettings = (): ToolSettings => {
    return TOOL_CONFIG.tools[currentTool];
  };
  
  const toolNames: Record<string, string> = Object.fromEntries(
    Object.entries(TOOL_CONFIG.tools).map(([key, value]: [string, ToolSettings]) => [key, value.name])
  );
  
  // Get the current dropdown config (accounting for difficulty-specific settings)
  const getCurrentDropdownConfig = (): DropdownConfig | null => {
    const toolSettings = getCurrentToolSettings();
    if (toolSettings.difficultySettings?.[difficulty]?.dropdown) {
      return toolSettings.difficultySettings[difficulty].dropdown!;
    }
    return toolSettings.dropdown;
  };
  
  // Get the current variables config (accounting for difficulty-specific settings)
  const getCurrentVariablesConfig = (): VariableConfig[] => {
    const toolSettings = getCurrentToolSettings();
    if (toolSettings.difficultySettings?.[difficulty]?.variables) {
      return toolSettings.difficultySettings[difficulty].variables!;
    }
    return toolSettings.variables;
  };
  
  // Get current variable value
  const getVariableValue = (key: string): boolean => {
    return toolVariables[currentTool]?.[key] ?? false;
  };
  
  // Set variable value
  const setVariableValue = (key: string, value: boolean): void => {
    setToolVariables((prev: Record<string, Record<string, boolean>>) => ({
      ...prev,
      [currentTool]: {
        ...prev[currentTool],
        [key]: value,
      },
    }));
  };
  
  // Get current dropdown value
  const getDropdownValue = (): string => {
    return toolDropdowns[currentTool] ?? '';
  };
  
  // Set dropdown value
  const setDropdownValue = (value: string): void => {
    setToolDropdowns((prev: Record<string, string>) => ({
      ...prev,
      [currentTool]: value,
    }));
  };
  

  
  const colorConfig: Record<string, { bg: string; border: string; text: string }> = {
    level1: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700' },
    level2: { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-700' },
    level3: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700' },
  };
  

  
  const renderControlBar = (): JSX.Element => {
    const toolSettings = getCurrentToolSettings();
    const currentVariables = getCurrentVariablesConfig();
    const currentDropdown = getCurrentDropdownConfig();
    
    if (mode === 'worksheet') {
      return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {/* Line 1: Questions + Differentiated */}
          <div className="flex justify-center items-center gap-6 mb-4">
            <div className="flex items-center gap-3">
              <label className="text-lg font-semibold" style={{ color: '#000000' }}>Questions:</label>
              <input 
                type="number" 
                min="1" 
                max="20" 
                value={numQuestions}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumQuestions(Math.max(1, Math.min(20, parseInt(e.target.value) || 5)))}
                className="w-20 px-4 py-2 border-2 border-gray-300 rounded-lg text-lg"
              />
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="diff" 
                checked={isDifferentiated}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsDifferentiated(e.target.checked)} 
                className="w-5 h-5"
              />
              <label htmlFor="diff" className="text-lg font-semibold" style={{ color: '#000000' }}>Differentiated</label>
            </div>
          </div>
          
          {/* Line 2: Difficulty + Columns (hidden if differentiated) */}
          {!isDifferentiated && (
            <div className="flex justify-center items-center gap-6 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold" style={{ color: '#000000' }}>Difficulty:</span>
                <div className="flex gap-2">
                  {(['level1', 'level2', 'level3'] as const).map((lvl: DifficultyLevel, idx: number) => (
                    <button 
                      key={lvl} 
                      onClick={() => setDifficulty(lvl)}
                      className={'px-4 py-2 rounded-lg font-bold text-sm w-24 ' + getDifficultyButtonClass(idx, difficulty === lvl)}
                    >
                      Level {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-lg font-semibold" style={{ color: '#000000' }}>Columns:</label>
                <input 
                  type="number" 
                  min="1" 
                  max="4" 
                  value={numColumns}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumColumns(Math.max(1, Math.min(4, parseInt(e.target.value) || 2)))}
                  className="w-20 px-4 py-2 border-2 border-gray-300 rounded-lg text-lg"
                />
              </div>
            </div>
          )}
          
          {/* Line 3: Variables + Dropdown (conditional per tool and difficulty) */}
          {(currentVariables.length > 0 || currentDropdown) && (
            <div className="flex justify-center items-center gap-6 mb-4">
              {currentVariables.length > 0 && (
                <div className="flex flex-col gap-1">
                  {currentVariables.map((variable: VariableConfig) => (
                    <label key={variable.key} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={getVariableValue(variable.key)} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVariableValue(variable.key, e.target.checked)} 
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-semibold" style={{ color: '#000000' }}>{variable.label}</span>
                    </label>
                  ))}
                </div>
              )}
              {currentDropdown && (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold" style={{ color: '#000000' }}>{currentDropdown.label}:</span>
                  <select 
                    value={getDropdownValue()} 
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDropdownValue(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold bg-white"
                  >
                    {currentDropdown.options.map((opt: DropdownOption) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
          
          {/* Line 4: Action Buttons */}
          <div className="flex justify-center gap-4">
            <button 
              onClick={handleGenerateWorksheet}
              className="px-6 py-3 bg-blue-900 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-800"
            >
              <RefreshCw size={20} /> Generate Worksheet
            </button>
            {worksheet.length > 0 && (
              <button 
                onClick={() => setShowWorksheetAnswers(!showWorksheetAnswers)}
                className="px-6 py-3 bg-blue-900 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-800"
              >
                <Eye size={20} /> {showWorksheetAnswers ? 'Hide Answers' : 'Show Answers'}
              </button>
            )}
          </div>
        </div>
      );
    }
    
    // Whiteboard / Worked Example Control Bar
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Difficulty */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold" style={{ color: '#000000' }}>Difficulty:</span>
              <div className="flex gap-2">
                {(['level1', 'level2', 'level3'] as const).map((lvl: DifficultyLevel, idx: number) => (
                  <button 
                    key={lvl} 
                    onClick={() => setDifficulty(lvl)}
                    className={'px-4 py-2 rounded-lg font-bold text-sm w-24 ' + getDifficultyButtonClass(idx, difficulty === lvl)}
                  >
                    Level {idx + 1}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Variables (per tool and difficulty) */}
            {currentVariables.length > 0 && (
              <div className="flex flex-col gap-1">
                {currentVariables.map((variable: VariableConfig) => (
                  <label key={variable.key} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={getVariableValue(variable.key)} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVariableValue(variable.key, e.target.checked)} 
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold" style={{ color: '#000000' }}>{variable.label}</span>
                  </label>
                ))}
              </div>
            )}
            
            {/* Dropdown (per tool and difficulty) */}
            {currentDropdown && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold" style={{ color: '#000000' }}>{currentDropdown.label}:</span>
                <select 
                  value={getDropdownValue()} 
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDropdownValue(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold bg-white"
                >
                  {currentDropdown.options.map((opt: DropdownOption) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={handleNewQuestion}
              className="px-6 py-2 bg-blue-900 text-white rounded-xl font-bold text-base shadow-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 w-52"
            >
              <RefreshCw size={18} /> New Question
            </button>
            <button 
              onClick={handleShowAnswer}
              className="px-6 py-2 bg-blue-900 text-white rounded-xl font-bold text-base shadow-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 w-52"
            >
              <Eye size={18} /> {(mode === 'whiteboard' ? showWhiteboardAnswer : showAnswer) ? 'Hide Answer' : 'Show Answer'}
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
            {/* Diagram Area */}
            <div 
              className="rounded-xl flex items-center justify-center"
              style={{ width: '450px', height: '500px', backgroundColor: getStepBg() }}
            >
              {renderDiagram(currentQuestion, 400)}
            </div>
            {/* Working Area */}
            <div 
              className="flex-1 rounded-xl p-6" 
              style={{ minHeight: '500px', backgroundColor: getStepBg() }}
            >
              {currentQuestion && (
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold" style={{ color: '#000000' }}>
                    {currentQuestion.display}
                  </span>
                  {showWhiteboardAnswer && (
                    <span className="text-4xl font-bold ml-4" style={{ color: '#166534' }}>
                      = {currentQuestion.answer}
                    </span>
                  )}
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
              <span className="text-6xl font-bold" style={{ color: '#000000' }}>
                {currentQuestion.display}
              </span>
              {showWhiteboardAnswer && (
                <span className="text-6xl font-bold ml-4" style={{ color: '#166534' }}>
                  = {currentQuestion.answer}
                </span>
              )}
            </>
          ) : (
            <span className="text-4xl text-gray-400">Generate question</span>
          )}
        </div>
        <div 
          className="rounded-xl mt-8" 
          style={{ height: '500px', backgroundColor: getWhiteboardWorkingBg() }}
        ></div>
      </div>
    );
  };
  

  
  const renderWorkedExampleMode = (): JSX.Element => {
    if (TOOL_CONFIG.useGraphicalLayout) {
      return (
        <div className="overflow-y-auto" style={{ height: '120vh' }}>
          <div className="rounded-xl shadow-lg p-8 w-full" style={{ backgroundColor: getQuestionBg() }}>
            <div className="flex gap-6">
              {/* Diagram Area */}
              <div 
                className="rounded-xl flex items-center justify-center"
                style={{ width: '450px', height: '500px', backgroundColor: getStepBg() }}
              >
                {renderDiagram(currentQuestion, 400)}
              </div>
              {/* Working Area */}
              <div className="flex-1">
                {currentQuestion ? (
                  <>
                    {/* Question */}
                    <div className="text-center mb-6">
                      <span className="text-4xl font-bold" style={{ color: '#000000' }}>
                        {currentQuestion.display}
                      </span>
                    </div>
                    
                    {showAnswer && (
                      <>
                        {/* Working Steps */}
                        <div className="space-y-4">
                          {currentQuestion.working.map((step: WorkingStep, i: number) => (
                            <div key={i} className="rounded-xl p-6" style={{ backgroundColor: getStepBg() }}>
                              <h4 className="text-xl font-bold mb-2" style={{ color: '#000000' }}>Step {i + 1}</h4>
                              <p className="text-3xl" style={{ color: '#000000' }}>{step.content}</p>
                            </div>
                          ))}
                        </div>
                        
                        {/* Final Answer */}
                        <div className="rounded-xl p-6 text-center mt-4" style={{ backgroundColor: getFinalAnswerBg() }}>
                          <span className="text-5xl font-bold" style={{ color: '#166534' }}>= {currentQuestion.answer}</span>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center text-gray-400 text-2xl">
                    Generate question
                  </div>
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
              {/* Question */}
              <div className="text-center">
                <span className="text-6xl font-bold" style={{ color: '#000000' }}>{currentQuestion.display}</span>
              </div>
              
              {showAnswer && (
                <>
                  {/* Working Steps */}
                  <div className="space-y-4 mt-8">
                    {currentQuestion.working.map((step: WorkingStep, i: number) => (
                      <div key={i} className="rounded-xl p-6" style={{ backgroundColor: getStepBg() }}>
                        <h4 className="text-xl font-bold mb-2" style={{ color: '#000000' }}>Step {i + 1}</h4>
                        <p className="text-3xl" style={{ color: '#000000' }}>{step.content}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Final Answer */}
                  <div className="rounded-xl p-6 text-center mt-4" style={{ backgroundColor: getFinalAnswerBg() }}>
                    <span className="text-5xl font-bold" style={{ color: '#166534' }}>= {currentQuestion.answer}</span>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-center text-gray-400 text-4xl py-16">
              Generate question
            </div>
          )}
        </div>
      </div>
    );
  };
  

  
  const renderWorksheetMode = (): JSX.Element => {
    if (worksheet.length === 0) {
      return (
        <div className="rounded-xl shadow-2xl p-8 text-center" style={{ backgroundColor: getQuestionBg() }}>
          <span className="text-2xl text-gray-400">Generate worksheet</span>
        </div>
      );
    }
    
    if (isDifferentiated) {
      // Differentiated layout - 3 columns, one per level
      const levels = ['level1', 'level2', 'level3'];
      const levelNames = ['Level 1', 'Level 2', 'Level 3'];
      const toolSettings = getCurrentToolSettings();
      
      // Get level-specific background colors for question boxes
      const getLevelQuestionBoxBg = (level: string): string => {
        const levelColors: Record<string, string> = {
          level1: '#dcfce7', // green-100
          level2: '#fef9c3', // yellow-100
          level3: '#fee2e2', // red-100
        };
        return levelColors[level] || '#f3f4f6';
      };
      
      return (
        <div className="rounded-xl shadow-2xl p-8 relative" style={{ backgroundColor: getQuestionBg() }}>
          {/* Font Size Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-1">
            <button 
              onClick={decreaseFontSize}
              disabled={!canDecreaseFontSize()}
              className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                canDecreaseFontSize() 
                  ? 'bg-blue-900 text-white hover:bg-blue-800' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ChevronDown size={20} />
            </button>
            <button 
              onClick={increaseFontSize}
              disabled={!canIncreaseFontSize()}
              className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                canIncreaseFontSize() 
                  ? 'bg-blue-900 text-white hover:bg-blue-800' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ChevronUp size={20} />
            </button>
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#000000' }}>
            {toolNames[currentTool]} - Worksheet
          </h2>
          
          {/* 3 columns - one per level */}
          <div className="grid grid-cols-3 gap-4">
            {levels.map((level: string, levelIdx: number) => {
              const levelQuestions = worksheet.filter((q: Question) => q.difficulty === level);
              const config = colorConfig[level];
              
              return (
                <div key={level} className={`${config.bg} border-2 ${config.border} rounded-xl p-4`}>
                  <h3 className={`text-xl font-bold mb-4 text-center ${config.text}`}>{levelNames[levelIdx]}</h3>
                  <div className="space-y-3">
                    {levelQuestions.map((q: Question, idx: number) => (
                      toolSettings.useSubstantialBoxes ? (
                        <div key={idx} className="rounded-lg p-3" style={{ backgroundColor: getLevelQuestionBoxBg(level) }}>
                          <span className={`${fontSizes[worksheetFontSize]} font-semibold`} style={{ color: '#000000' }}>
                            {idx + 1}. {q.display}
                          </span>
                          {showWorksheetAnswers && (
                            <span className={`${fontSizes[worksheetFontSize]} font-semibold ml-2`} style={{ color: '#059669' }}>
                              = {q.answer}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div key={idx} className="p-2">
                          <span className={`${fontSizes[worksheetFontSize]} font-semibold`} style={{ color: '#000000' }}>
                            {idx + 1}. {q.display}
                          </span>
                          {showWorksheetAnswers && (
                            <span className={`${fontSizes[worksheetFontSize]} font-semibold ml-2`} style={{ color: '#059669' }}>
                              = {q.answer}
                            </span>
                          )}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    
    // Non-differentiated layout
    const toolSettings = getCurrentToolSettings();
    
    return (
      <div className="rounded-xl shadow-2xl p-8 relative" style={{ backgroundColor: getQuestionBg() }}>
        {/* Font Size Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <button 
            onClick={decreaseFontSize}
            disabled={!canDecreaseFontSize()}
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
              canDecreaseFontSize() 
                ? 'bg-blue-900 text-white hover:bg-blue-800' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ChevronDown size={20} />
          </button>
          <button 
            onClick={increaseFontSize}
            disabled={!canIncreaseFontSize()}
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
              canIncreaseFontSize() 
                ? 'bg-blue-900 text-white hover:bg-blue-800' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ChevronUp size={20} />
          </button>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#000000' }}>
          {toolNames[currentTool]} - Worksheet
        </h2>
        
        <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${numColumns}, 1fr)` }}>
          {worksheet.map((q: Question, idx: number) => (
            toolSettings.useSubstantialBoxes ? (
              <div key={idx} className="rounded-lg p-4 shadow" style={{ backgroundColor: getQuestionBoxBg() }}>
                <span className={`${fontSizes[worksheetFontSize]} font-semibold`} style={{ color: '#000000' }}>
                  {idx + 1}. {q.display}
                </span>
                {showWorksheetAnswers && (
                  <span className={`${fontSizes[worksheetFontSize]} font-semibold ml-2`} style={{ color: '#059669' }}>
                    = {q.answer}
                  </span>
                )}
              </div>
            ) : (
              <div key={idx} className="p-3">
                <span className={`${fontSizes[worksheetFontSize]} font-semibold`} style={{ color: '#000000' }}>
                  {idx + 1}. {q.display}
                </span>
                {showWorksheetAnswers && (
                  <span className={`${fontSizes[worksheetFontSize]} font-semibold ml-2`} style={{ color: '#059669' }}>
                    = {q.answer}
                  </span>
                )}
              </div>
            )
          ))}
        </div>
      </div>
    );
  };
  

  
  useEffect(() => {
    if (mode !== 'worksheet') {
      handleNewQuestion();
    }
  }, [difficulty, currentTool]);
  

  
  return (
    <>
      {/* Header Bar */}
      <div className="bg-blue-900 shadow-lg">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          {/* Home Button */}
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 text-white hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors"
          >
            <Home size={24} />
            <span className="font-semibold text-lg">Home</span>
          </button>
          
          {/* Menu Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-blue-800 p-2 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border-2 border-gray-200 overflow-hidden z-50">
                <div className="py-2">
                  <div className="px-6 py-2 font-bold text-gray-700 text-sm uppercase tracking-wide">Color Schemes</div>
                  {(['default', 'blue', 'pink', 'yellow'] as const).map((scheme: ColorScheme) => (
                    <button 
                      key={scheme} 
                      onClick={() => { setColorScheme(scheme); setIsMenuOpen(false); }}
                      className={'w-full text-left px-6 py-3 font-semibold transition-colors ' +
                        (colorScheme === scheme ? 'bg-blue-100 text-blue-900' : 'text-gray-800 hover:bg-gray-100')}
                    >
                      {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="min-h-screen p-8" style={{ backgroundColor: '#f5f3f0' }}>
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <h1 className="text-5xl font-bold text-center mb-8" style={{ color: '#000000' }}>
            {TOOL_CONFIG.pageTitle}
          </h1>
          
          {/* Divider */}
          <div className="flex justify-center mb-8">
            <div style={{ width: '90%', height: '2px', backgroundColor: '#d1d5db' }}></div>
          </div>
          
          {/* Tool Selectors */}
          <div className="flex justify-center gap-4 mb-6">
            {(Object.keys(TOOL_CONFIG.tools) as ToolType[]).map((tool: ToolType) => (
              <button 
                key={tool} 
                onClick={() => setCurrentTool(tool)}
                className={'px-8 py-4 rounded-xl font-bold text-xl transition-all shadow-xl ' +
                  (currentTool === tool 
                    ? 'bg-blue-900 text-white' 
                    : 'bg-white text-gray-800 hover:bg-gray-100 hover:text-blue-900')}
              >
                {toolNames[tool]}
              </button>
            ))}
          </div>
          
          {/* Divider */}
          <div className="flex justify-center mb-8">
            <div style={{ width: '90%', height: '2px', backgroundColor: '#d1d5db' }}></div>
          </div>
          
          {/* Mode Selectors */}
          <div className="flex justify-center gap-4 mb-8">
            {(['whiteboard', 'single', 'worksheet'] as const).map((m: Mode) => (
              <button 
                key={m} 
                onClick={() => setMode(m)}
                className={'px-8 py-4 rounded-xl font-bold text-xl transition-all shadow-xl ' +
                  (mode === m 
                    ? 'bg-blue-900 text-white' 
                    : 'bg-white text-gray-800 hover:bg-gray-100 hover:text-blue-900')}
              >
                {m === 'whiteboard' ? 'Whiteboard' : m === 'single' ? 'Worked Example' : 'Worksheet'}
              </button>
            ))}
          </div>
          
          {/* Control Bar */}
          {renderControlBar()}
          
          {/* Mode Content */}
          {mode === 'whiteboard' && renderWhiteboardMode()}
          {mode === 'single' && renderWorkedExampleMode()}
          {mode === 'worksheet' && renderWorksheetMode()}
        </div>
      </div>
    </>
  );
}

// WEB INTEGRATION: Add routing (3 lines at end)
// 1. Top: import routing library hook
// 2. After state: initialize navigation
// 3. Home button: use navigation function
