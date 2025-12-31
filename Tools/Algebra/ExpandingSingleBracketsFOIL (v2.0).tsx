import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Eye, ChevronUp, ChevronDown, Home, Menu, X } from 'lucide-react';

export default function ExpandingSingleBrackets() {
  // State
  const [mode, setMode] = useState('whiteboard');
  const [difficulty, setDifficulty] = useState('level1');
  const [questionType, setQuestionType] = useState('expanding');
  const [multiplierType, setMultiplierType] = useState('numerical');
  
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showWhiteboardAnswer, setShowWhiteboardAnswer] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  
  const [numQuestions, setNumQuestions] = useState(5);
  const [worksheet, setWorksheet] = useState([]);
  const [showWorksheetAnswers, setShowWorksheetAnswers] = useState(false);
  const [isDifferentiated, setIsDifferentiated] = useState(false);
  const [numColumns, setNumColumns] = useState(2);
  const [worksheetFontSize, setWorksheetFontSize] = useState(1);
  
  const [colorScheme, setColorScheme] = useState('default');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Font sizes
  const fontSizes = ['text-xl', 'text-2xl', 'text-3xl', 'text-4xl'];
  const getFontSize = () => fontSizes[worksheetFontSize];

  // Color scheme helpers
  const getQuestionBg = () => {
    if (colorScheme === 'blue') return '#D1E7F8';
    if (colorScheme === 'pink') return '#F8D1E7';
    if (colorScheme === 'yellow') return '#F8F4D1';
    return '#ffffff';
  };

  const getStepBg = () => {
    if (colorScheme === 'blue') return '#B3D9F2';
    if (colorScheme === 'pink') return '#F2B3D9';
    if (colorScheme === 'yellow') return '#F2EBB3';
    return '#f3f4f6';
  };

  const getWhiteboardWorkingBg = () => getStepBg();
  const getFinalAnswerBg = () => getStepBg();

  // Difficulty button styling
  const getDifficultyButtonClass = (lvl, idx, isActive) => {
    if (isActive) {
      return idx === 0 ? 'bg-green-600 text-white' 
           : idx === 1 ? 'bg-yellow-600 text-white' 
           : 'bg-red-600 text-white';
    }
    return idx === 0 ? 'bg-white text-green-600 border-2 border-green-600' 
         : idx === 1 ? 'bg-white text-yellow-600 border-2 border-yellow-600' 
         : 'bg-white text-red-600 border-2 border-red-600';
  };

  // Question generation helpers
  const getRandomVariable = () => {
    const vars = ['x', 'y', 'a', 'b', 'p', 'q', 'r', 's', 't', 'n', 'm'];
    return vars[Math.floor(Math.random() * vars.length)];
  };

  // FOIL Display Component with curved arrows
  const FoilDisplay = ({ q }) => {
    const containerRef = useRef(null);
    const outsideRef = useRef(null);
    const firstTermRef = useRef(null);
    const secondTermRef = useRef(null);
    const [positions, setPositions] = useState(null);

    useEffect(() => {
      if (outsideRef.current && firstTermRef.current && secondTermRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        
        const getTopCenter = (ref) => {
          const rect = ref.current.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2 - containerRect.left,
            y: rect.top - containerRect.top
          };
        };

        setPositions({
          outside: getTopCenter(outsideRef),
          firstTerm: getTopCenter(firstTermRef),
          secondTerm: getTopCenter(secondTermRef)
        });
      }
    }, [q]);

    const v = q.varName || 'x';
    
    // Format the terms
    let outsideTerm, firstBracketTerm, secondBracketTerm, result1, result2;
    
    if (q.withVariable) {
      if (q.outsidePower === 2) {
        outsideTerm = q.a === 1 ? v + '²' : q.a === -1 ? '−' + v + '²' : q.a + v + '²';
        firstBracketTerm = q.b === 1 ? v : q.b === -1 ? '−' + v : q.b + v;
        secondBracketTerm = q.c >= 0 ? '+' + q.c : String(q.c);
        result1 = q.x3Coeff === 1 ? v + '³' : q.x3Coeff === -1 ? '−' + v + '³' : q.x3Coeff + v + '³';
        result2 = q.x2Coeff >= 0 ? '+' + (q.x2Coeff === 1 ? v + '²' : q.x2Coeff + v + '²') : 
                  (q.x2Coeff === -1 ? '−' + v + '²' : q.x2Coeff + v + '²');
      } else {
        outsideTerm = q.a === 1 ? v : q.a === -1 ? '−' + v : q.a + v;
        firstBracketTerm = q.b === 1 ? v : q.b === -1 ? '−' + v : q.b + v;
        secondBracketTerm = q.c >= 0 ? '+' + q.c : String(q.c);
        result1 = q.x2Coeff === 1 ? v + '²' : q.x2Coeff === -1 ? '−' + v + '²' : q.x2Coeff + v + '²';
        result2 = q.xCoeff >= 0 ? '+' + (q.xCoeff === 1 ? v : q.xCoeff + v) : 
                  (q.xCoeff === -1 ? '−' + v : q.xCoeff + v);
      }
    } else {
      outsideTerm = String(q.a);
      if (q.isReversed) {
        firstBracketTerm = String(q.c);
        secondBracketTerm = '−' + (q.b === 1 ? v : q.b + v);
        result1 = String(q.constant);
        result2 = q.xCoeff >= 0 ? '+' + (q.xCoeff === 1 ? v : q.xCoeff + v) : 
                  (q.xCoeff === -1 ? '−' + v : q.xCoeff + v);
      } else {
        firstBracketTerm = q.b === 1 ? v : q.b === -1 ? '−' + v : q.b + v;
        secondBracketTerm = q.c >= 0 ? '+' + q.c : String(q.c);
        result1 = q.xCoeff === 1 ? v : q.xCoeff === -1 ? '−' + v : q.xCoeff + v;
        result2 = q.constant >= 0 ? '+' + q.constant : String(q.constant);
      }
    }

    // Curved Arrow component
    const CurvedArrow = ({ from, to, curveUp = false, color = '#ef4444' }) => {
      if (!from || !to) return null;
      
      const midX = (from.x + to.x) / 2;
      const curveHeight = curveUp ? -80 : 80;
      const controlY = Math.min(from.y, to.y) + curveHeight;
      
      // Create curved path
      const path = `M ${from.x} ${from.y} Q ${midX} ${controlY} ${to.x} ${to.y}`;
      
      // Calculate angle for arrowhead at end point
      const dx = to.x - midX;
      const dy = to.y - controlY;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      
      return (
        <g>
          <path d={path} fill="none" stroke={color} strokeWidth="4" />
          <polygon 
            points="0,-8 16,0 0,8" 
            fill={color}
            transform={`translate(${to.x},${to.y}) rotate(${angle})`}
          />
        </g>
      );
    };

    return (
      <div ref={containerRef} className="relative w-full mx-auto" style={{ minHeight: '280px', paddingTop: '60px', paddingBottom: '20px' }}>
        <div className="flex items-center justify-center gap-2">
          {/* Outside term */}
          <div ref={outsideRef} className="inline-flex items-center justify-center font-bold text-4xl px-4 py-2" 
               style={{ minWidth: '70px' }}>
            {outsideTerm}
          </div>
          
          {/* Opening bracket */}
          <span className="font-bold text-4xl">(</span>
          
          {/* First term in bracket */}
          <div ref={firstTermRef} className="inline-flex items-center justify-center font-bold text-4xl px-4 py-2" 
               style={{ minWidth: '70px' }}>
            {firstBracketTerm}
          </div>
          
          {/* Second term in bracket */}
          <div ref={secondTermRef} className="inline-flex items-center justify-center font-bold text-4xl px-4 py-2" 
               style={{ minWidth: '70px' }}>
            {secondBracketTerm}
          </div>
          
          {/* Closing bracket */}
          <span className="font-bold text-4xl">)</span>
        </div>

        {/* Results row */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {/* Empty space for outside term */}
          <div className="inline-flex items-center justify-center text-4xl px-4 py-2" 
               style={{ minWidth: '70px', visibility: 'hidden' }}>
            .
          </div>
          
          {/* Empty space for opening bracket */}
          <span className="text-4xl" style={{ visibility: 'hidden' }}>(</span>
          
          {/* Result 1 */}
          <div className="inline-flex items-center justify-center font-bold text-4xl px-4 py-2" 
               style={{ minWidth: '70px', color: '#000000' }}>
            {result1}
          </div>
          
          {/* Result 2 */}
          <div className="inline-flex items-center justify-center font-bold text-4xl px-4 py-2" 
               style={{ minWidth: '70px', color: '#000000' }}>
            {result2}
          </div>
          
          {/* Empty space for closing bracket */}
          <span className="text-4xl" style={{ visibility: 'hidden' }}>)</span>
        </div>

        {/* SVG overlay for arrows */}
        {positions && (
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
            <CurvedArrow from={positions.outside} to={positions.firstTerm} curveUp={true} color="#22c55e" />
            <CurvedArrow from={positions.outside} to={positions.secondTerm} curveUp={true} color="#ef4444" />
          </svg>
        )}
      </div>
    );
  };

  const formatAnswer = (xCoeff, constant, varName) => {
    const hasPositiveX = xCoeff > 0;
    const hasNegativeX = xCoeff < 0;
    const hasPositiveC = constant > 0;
    const hasNegativeC = constant < 0;
    
    let answer = '';
    
    if (hasPositiveX && hasNegativeC) {
      answer = (xCoeff === 1 ? varName : xCoeff + varName) + ' − ' + Math.abs(constant);
    } else if (hasNegativeX && hasPositiveC) {
      answer = constant + (xCoeff === -1 ? ' − ' + varName : ' − ' + Math.abs(xCoeff) + varName);
    } else {
      if (xCoeff === 1) answer = varName;
      else if (xCoeff === -1) answer = '−' + varName;
      else if (xCoeff !== 0) answer = xCoeff + varName;
      
      if (constant !== 0) {
        if (answer) {
          answer += constant > 0 ? ' + ' + constant : ' − ' + Math.abs(constant);
        } else {
          answer = String(constant);
        }
      }
    }
    
    return answer || '0';
  };

  const combineTerms = (q1, q2, operator, varName) => {
    // Extract coefficients from both questions
    let x3_1 = 0, x2_1 = 0, x_1 = 0, c_1 = 0;
    let x3_2 = 0, x2_2 = 0, x_2 = 0, c_2 = 0;
    
    if (q1.withVariable) {
      x3_1 = q1.x3Coeff || 0;
      x2_1 = q1.x2Coeff || 0;
      x_1 = q1.xCoeff || 0;
      c_1 = q1.constant || 0;
    } else {
      x_1 = q1.values.a * q1.values.b * (q1.isReversed ? -1 : 1);
      c_1 = q1.values.a * q1.values.c;
    }
    
    if (q2.withVariable) {
      x3_2 = q2.x3Coeff || 0;
      x2_2 = q2.x2Coeff || 0;
      x_2 = q2.xCoeff || 0;
      c_2 = q2.constant || 0;
    } else {
      x_2 = q2.values.a * q2.values.b * (q2.isReversed ? -1 : 1);
      c_2 = q2.values.a * q2.values.c;
    }
    
    // Apply operator
    const multiplier = operator === '+' ? 1 : -1;
    
    const finalX3 = x3_1 + multiplier * x3_2;
    const finalX2 = x2_1 + multiplier * x2_2;
    const finalX = x_1 + multiplier * x_2;
    const finalC = c_1 + multiplier * c_2;
    
    // Format final answer
    let result = '';
    
    if (finalX3 !== 0) {
      if (finalX3 === 1) result = varName + '³';
      else if (finalX3 === -1) result = '−' + varName + '³';
      else result = finalX3 + varName + '³';
    }
    
    if (finalX2 !== 0) {
      if (result) {
        result += finalX2 > 0 ? ' + ' : ' − ';
        result += Math.abs(finalX2) === 1 ? varName + '²' : Math.abs(finalX2) + varName + '²';
      } else {
        if (finalX2 === 1) result = varName + '²';
        else if (finalX2 === -1) result = '−' + varName + '²';
        else result = finalX2 + varName + '²';
      }
    }
    
    if (finalX !== 0) {
      if (result) {
        result += finalX > 0 ? ' + ' : ' − ';
        result += Math.abs(finalX) === 1 ? varName : Math.abs(finalX) + varName;
      } else {
        if (finalX === 1) result = varName;
        else if (finalX === -1) result = '−' + varName;
        else result = finalX + varName;
      }
    }
    
    if (finalC !== 0) {
      if (result) {
        result += finalC > 0 ? ' + ' + finalC : ' − ' + Math.abs(finalC);
      } else {
        result = String(finalC);
      }
    }
    
    return result || '0';
  };

  // Generate expanding question
  const generateQuestion = (level, multiplier, forcedVarName = null) => {
    let a, b, c, isReversed = false;
    const varName = forcedVarName || getRandomVariable();
    const useVarThisTime = multiplier === 'algebraic' ? true : multiplier === 'mixed' ? Math.random() > 0.5 : false;
    const outsidePower = useVarThisTime ? (Math.random() > 0.5 ? 1 : 2) : 0;
    
    if (level === 'level1') {
      a = Math.floor(Math.random() * 9) + 2;  // 2 to 10
      b = Math.floor(Math.random() * 5) + 1;
      c = Math.floor(Math.random() * 10);
    } else if (level === 'level2') {
      a = Math.floor(Math.random() * 9) + 2;  // 2 to 10
      if (Math.random() > 0.5) {
        b = Math.floor(Math.random() * 9) + 1;
        c = Math.floor(Math.random() * 9) + 1;
        isReversed = true;
      } else {
        b = Math.floor(Math.random() * 9) + 1;
        c = Math.floor(Math.random() * 9) - 9;
      }
    } else {
      a = Math.floor(Math.random() * 11) - 10;  // -10 to 0, then adjusted below
      if (a === 0) a = -1;  // Avoid 0
      b = Math.floor(Math.random() * 11) - 5;
      if (b === 0) b = 1;
      c = Math.floor(Math.random() * 19) - 9;
    }
    
    let xCoeff, x2Coeff, x3Coeff, constant;
    
    if (useVarThisTime) {
      if (outsidePower === 1) {
        x3Coeff = 0;
        x2Coeff = a * b;
        xCoeff = a * c;
        constant = 0;
      } else {
        x3Coeff = a * b;
        x2Coeff = a * c;
        xCoeff = 0;
        constant = 0;
      }
    } else {
      xCoeff = isReversed ? a * (-b) : a * b;
      x2Coeff = 0;
      x3Coeff = 0;
      constant = a * c;
    }
    
    let original = '';
    if (useVarThisTime) {
      const aTerm = a === 1 ? varName + (outsidePower === 2 ? '²' : '') : 
                    a === -1 ? '−' + varName + (outsidePower === 2 ? '²' : '') : 
                    a + varName + (outsidePower === 2 ? '²' : '');
      const bTerm = b === 1 ? varName : b === -1 ? '−' + varName : b + varName;
      const cTerm = c === 0 ? '' : c > 0 ? ' + ' + c : ' − ' + Math.abs(c);
      original = aTerm + '(' + bTerm + cTerm + ')';
    } else {
      if (isReversed) {
        original = (a === 1 ? '' : a === -1 ? '−' : a) + '(' + c + ' − ' + (b === 1 ? varName : b + varName) + ')';
      } else {
        const bTerm = b === 1 ? varName : b === -1 ? '−' + varName : b + varName;
        const cTerm = c === 0 ? '' : c > 0 ? ' + ' + c : ' − ' + Math.abs(c);
        original = (a === 1 ? '' : a === -1 ? '−' : a) + '(' + bTerm + cTerm + ')';
      }
    }
    
    let answer = '';
    if (useVarThisTime) {
      if (outsidePower === 2) {
        if (x3Coeff === 1) answer = varName + '³';
        else if (x3Coeff === -1) answer = '−' + varName + '³';
        else answer = x3Coeff + varName + '³';
        
        if (x2Coeff !== 0) {
          if (x2Coeff > 0) answer += ' + ' + (x2Coeff === 1 ? varName + '²' : x2Coeff + varName + '²');
          else answer += ' − ' + (Math.abs(x2Coeff) === 1 ? varName + '²' : Math.abs(x2Coeff) + varName + '²');
        }
      } else {
        if (x2Coeff === 1) answer = varName + '²';
        else if (x2Coeff === -1) answer = '−' + varName + '²';
        else answer = x2Coeff + varName + '²';
        
        if (xCoeff !== 0) {
          if (xCoeff > 0) answer += ' + ' + (xCoeff === 1 ? varName : xCoeff + varName);
          else answer += ' − ' + (Math.abs(xCoeff) === 1 ? varName : Math.abs(xCoeff) + varName);
        }
      }
    } else {
      answer = formatAnswer(xCoeff, constant, varName);
    }
    
    const working = [{
      type: 'foil',
      content: 'Multiply the outside term by each term in the bracket',
      foilData: { a, b, c, isReversed, withVariable: useVarThisTime, outsidePower, varName, xCoeff, x2Coeff, x3Coeff, constant }
    }];
    
    return { 
      type: 'expanding',
      display: original,
      answer,
      working,
      values: { a, b, c },
      difficulty: level,
      // Additional properties for table display
      a, b, c, isReversed, withVariable: useVarThisTime, outsidePower, varName, xCoeff, x2Coeff, x3Coeff, constant
    };
  };

  const generateSimplifyQuestion = (level, multiplier) => {
    const varName = getRandomVariable(); // Generate once for both questions
    let q1 = generateQuestion(level === 'level1' ? 'level1' : level === 'level2' ? 'level1' : 'level3', multiplier, varName);
    let q2 = generateQuestion(level === 'level1' ? 'level1' : level === 'level2' ? (Math.random() > 0.5 ? 'level1' : 'level2') : (Math.random() > 0.5 ? 'level1' : 'level2'), multiplier, varName);
    
    const operator = level === 'level1' ? '+' : (Math.random() > 0.5 ? '+' : '−');
    
    const original = q1.display + ' ' + operator + ' ' + q2.display;
    
    const working = [
      { 
        type: 'foil', 
        content: 'Expand first bracket: ' + q1.display,
        foilData: q1,
        isFirst: true
      },
      { 
        type: 'foil', 
        content: 'Expand second bracket: ' + q2.display,
        foilData: q2,
        isSecond: true
      },
      { 
        type: 'step', 
        content: 'Combine: (' + q1.answer + ') ' + operator + ' (' + q2.answer + ')' 
      }
    ];
    
    // Calculate final answer with like terms collected
    const finalAnswer = combineTerms(q1, q2, operator, varName);
    
    return {
      type: 'simplify',
      display: original,
      answer: finalAnswer,
      working,
      values: { q1, q2, operator },
      difficulty: level,
      q1,
      q2,
      operator,
      varName
    };
  };

  // Event handlers
  const handleNewQuestion = () => {
    let q;
    if (questionType === 'expanding') {
      q = generateQuestion(difficulty, multiplierType);
    } else {
      q = generateSimplifyQuestion(difficulty, multiplierType);
    }
    setCurrentQuestion(q);
    setShowWhiteboardAnswer(false);
    setShowAnswer(false);
  };

  const handleGenerateWorksheet = () => {
    const questions = [];
    
    if (isDifferentiated) {
      ['level1', 'level2', 'level3'].forEach(lvl => {
        for (let i = 0; i < numQuestions; i++) {
          let q;
          if (questionType === 'expanding') {
            q = generateQuestion(lvl, multiplierType);
          } else {
            q = generateSimplifyQuestion(lvl, multiplierType);
          }
          questions.push({ ...q, difficulty: lvl });
        }
      });
    } else {
      for (let i = 0; i < numQuestions; i++) {
        let q;
        if (questionType === 'expanding') {
          q = generateQuestion(difficulty, multiplierType);
        } else {
          q = generateSimplifyQuestion(difficulty, multiplierType);
        }
        questions.push({ ...q, difficulty });
      }
    }
    
    setWorksheet(questions);
    setShowWorksheetAnswers(false);
  };

  // Effects
  useEffect(() => {
    if (!currentQuestion) handleNewQuestion();
  }, [mode, difficulty, questionType, multiplierType]);

  return (
    <>
      {/* Header Bar */}
      <div className="bg-blue-900 shadow-lg">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <button onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 text-white hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors">
            <Home size={24} />
            <span className="font-semibold text-lg">Home</span>
          </button>
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-blue-800 p-2 rounded-lg transition-colors">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border-2 border-gray-200 overflow-hidden z-50">
                <div className="py-2">
                  <div className="px-6 py-2 font-bold text-gray-700 text-sm uppercase tracking-wide">Color Schemes</div>
                  {['default', 'blue', 'pink', 'yellow'].map((scheme) => (
                    <button key={scheme} onClick={() => setColorScheme(scheme)}
                      className={'w-full text-left px-6 py-3 font-semibold transition-colors ' +
                        (colorScheme === scheme ? 'bg-blue-100 text-blue-900' : 'text-gray-800 hover:bg-gray-100')}>
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
            Expanding Single Brackets (FOIL)
          </h1>

          {/* Divider */}
          <div className="flex justify-center mb-8">
            <div style={{ width: '90%', height: '2px', backgroundColor: '#d1d5db' }}></div>
          </div>

          {/* Question Type Selectors */}
          <div className="flex justify-center gap-4 mb-6">
            {['expanding', 'simplify'].map((type) => (
              <button key={type} onClick={() => setQuestionType(type)}
                className={'px-8 py-4 rounded-xl font-bold text-xl transition-all shadow-xl ' +
                  (questionType === type 
                    ? 'bg-blue-900 text-white' 
                    : 'bg-white text-gray-800 hover:bg-gray-100 hover:text-blue-900')}>
                {type === 'expanding' ? 'Expand' : 'Expand and Simplify'}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex justify-center mb-8">
            <div style={{ width: '90%', height: '2px', backgroundColor: '#d1d5db' }}></div>
          </div>

          {/* Mode Selectors */}
          <div className="flex justify-center gap-4 mb-8">
            {['whiteboard', 'single', 'worksheet'].map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={'px-8 py-4 rounded-xl font-bold text-xl transition-all shadow-xl ' +
                  (mode === m 
                    ? 'bg-blue-900 text-white' 
                    : 'bg-white text-gray-800 hover:bg-gray-100 hover:text-blue-900')}>
                {m === 'whiteboard' ? 'Whiteboard' : m === 'single' ? 'Worked Example' : 'Worksheet'}
              </button>
            ))}
          </div>

          {/* WHITEBOARD MODE */}
          {mode === 'whiteboard' && (
            <>
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold" style={{ color: '#000000' }}>Difficulty:</span>
                      <div className="flex gap-2">
                        {['level1', 'level2', 'level3'].map((lvl, idx) => (
                          <button key={lvl} onClick={() => setDifficulty(lvl)}
                            className={'px-4 py-2 rounded-lg font-bold text-sm w-24 ' + 
                              getDifficultyButtonClass(lvl, idx, difficulty === lvl)}>
                            Level {idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold" style={{ color: '#000000' }}>Multiplier:</label>
                      <select value={multiplierType} onChange={(e) => setMultiplierType(e.target.value)}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold bg-white">
                        <option value="numerical">Numerical</option>
                        <option value="algebraic">Algebraic</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={handleNewQuestion}
                      className="px-6 py-2 bg-blue-900 text-white rounded-xl font-bold text-base shadow-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 w-52">
                      <RefreshCw size={18} />
                      New Question
                    </button>
                    <button onClick={() => setShowWhiteboardAnswer(!showWhiteboardAnswer)}
                      className="px-6 py-2 bg-blue-900 text-white rounded-xl font-bold text-base shadow-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 w-52">
                      <Eye size={18} />
                      {showWhiteboardAnswer ? 'Hide Answer' : 'Show Answer'}
                    </button>
                  </div>
                </div>
              </div>

              {currentQuestion && (
                <div className="rounded-xl shadow-2xl p-8" style={{ backgroundColor: getQuestionBg() }}>
                  <div className="text-center">
                    <span className="text-6xl font-bold" style={{ color: '#000000' }}>
                      {currentQuestion.display}
                    </span>
                    {showWhiteboardAnswer && (
                      <span className="text-6xl font-bold ml-4" style={{ color: '#166534' }}>
                        = {currentQuestion.answer}
                      </span>
                    )}
                  </div>
                  <div className="rounded-xl mt-8" style={{ height: '500px', backgroundColor: getWhiteboardWorkingBg() }}></div>
                </div>
              )}
            </>
          )}

          {/* WORKED EXAMPLE MODE */}
          {mode === 'single' && (
            <>
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold" style={{ color: '#000000' }}>Difficulty:</span>
                      <div className="flex gap-2">
                        {['level1', 'level2', 'level3'].map((lvl, idx) => (
                          <button key={lvl} onClick={() => setDifficulty(lvl)}
                            className={'px-4 py-2 rounded-lg font-bold text-sm w-24 ' + 
                              getDifficultyButtonClass(lvl, idx, difficulty === lvl)}>
                            Level {idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold" style={{ color: '#000000' }}>Multiplier:</label>
                      <select value={multiplierType} onChange={(e) => setMultiplierType(e.target.value)}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold bg-white">
                        <option value="numerical">Numerical</option>
                        <option value="algebraic">Algebraic</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={handleNewQuestion}
                      className="px-6 py-2 bg-blue-900 text-white rounded-xl font-bold text-base shadow-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 w-52">
                      <RefreshCw size={18} />
                      New Question
                    </button>
                    <button onClick={() => setShowAnswer(!showAnswer)}
                      className="px-6 py-2 bg-blue-900 text-white rounded-xl font-bold text-base shadow-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 w-52">
                      <Eye size={18} />
                      {showAnswer ? 'Hide Answer' : 'Show Answer'}
                    </button>
                  </div>
                </div>
              </div>

              {currentQuestion && (
                <div className="overflow-y-auto" style={{ height: '120vh' }}>
                  <div className="rounded-xl shadow-lg p-8 w-full" style={{ backgroundColor: getQuestionBg() }}>
                    <div className="text-center">
                      <span className="text-6xl font-bold" style={{ color: '#000000' }}>
                        {currentQuestion.display}
                      </span>
                    </div>

                    {showAnswer && (
                      <>
                        <div className="space-y-4 mt-8">
                          {currentQuestion.working.map((step, i) => (
                            <div key={i} className="rounded-xl p-6" style={{ backgroundColor: getStepBg() }}>
                              {currentQuestion.working.length > 1 && (
                                <h4 className="text-xl font-bold mb-2" style={{ color: '#000000' }}>Step {i + 1}</h4>
                              )}
                              {step.type === 'foil' ? (
                                <div>
                                  <p className="text-3xl mb-4" style={{ color: '#000000' }}>{step.content}</p>
                                  <FoilDisplay q={step.foilData || currentQuestion} />
                                </div>
                              ) : (
                                <p className="text-3xl" style={{ color: '#000000' }}>{step.content}</p>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="rounded-xl p-6 text-center mt-4" style={{ backgroundColor: getFinalAnswerBg() }}>
                          <span className="text-5xl font-bold" style={{ color: '#166534' }}>
                            = {currentQuestion.answer}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* WORKSHEET MODE */}
          {mode === 'worksheet' && (
            <>
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="space-y-4">
                  {/* Line 1 */}
                  <div className="flex justify-center items-center gap-6">
                    <div className="flex items-center gap-3">
                      <label className="text-lg font-semibold" style={{ color: '#000000' }}>Questions per level:</label>
                      <input type="number" min="1" max="20" value={numQuestions}
                        onChange={(e) => setNumQuestions(Math.max(1, Math.min(20, parseInt(e.target.value) || 5)))}
                        className="w-20 px-4 py-2 border-2 border-gray-300 rounded-lg text-lg" />
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="diff" checked={isDifferentiated}
                        onChange={(e) => setIsDifferentiated(e.target.checked)} className="w-5 h-5" />
                      <label htmlFor="diff" className="text-lg font-semibold" style={{ color: '#000000' }}>Differentiated</label>
                    </div>
                  </div>

                  {/* Line 2 */}
                  {!isDifferentiated && (
                    <div className="flex justify-center items-center gap-6">
                      <div className="flex items-center gap-3">
                        <label className="text-lg font-semibold" style={{ color: '#000000' }}>Difficulty:</label>
                        <div className="flex gap-2">
                          <button onClick={() => setDifficulty('level1')}
                            className={'px-6 py-2 rounded-lg font-semibold ' + 
                              (difficulty === 'level1' ? 'bg-green-600 text-white' : 'bg-gray-200')}>
                            Level 1
                          </button>
                          <button onClick={() => setDifficulty('level2')}
                            className={'px-6 py-2 rounded-lg font-semibold ' + 
                              (difficulty === 'level2' ? 'bg-yellow-600 text-white' : 'bg-gray-200')}>
                            Level 2
                          </button>
                          <button onClick={() => setDifficulty('level3')}
                            className={'px-6 py-2 rounded-lg font-semibold ' + 
                              (difficulty === 'level3' ? 'bg-red-600 text-white' : 'bg-gray-200')}>
                            Level 3
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="text-lg font-semibold" style={{ color: '#000000' }}>Columns:</label>
                        <input type="number" min="1" max="4" value={numColumns}
                          onChange={(e) => setNumColumns(Math.max(1, Math.min(4, parseInt(e.target.value) || 2)))}
                          className="w-20 px-4 py-2 border-2 border-gray-300 rounded-lg text-lg" />
                      </div>
                    </div>
                  )}

                  {/* Line 3 */}
                  {!isDifferentiated && (
                    <div className="flex justify-center items-center">
                      <div className="flex items-center gap-3">
                        <label className="text-lg font-semibold" style={{ color: '#000000' }}>Multiplier:</label>
                        <select value={multiplierType} onChange={(e) => setMultiplierType(e.target.value)}
                          className="px-4 py-2 border-2 border-gray-300 rounded-lg text-lg font-semibold bg-white">
                          <option value="numerical">Numerical</option>
                          <option value="algebraic">Algebraic</option>
                          <option value="mixed">Mixed</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Line 4 */}
                  <div className="flex justify-center gap-4">
                    <button onClick={handleGenerateWorksheet}
                      className="px-6 py-3 bg-blue-900 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-800">
                      <RefreshCw size={20} />
                      Generate Worksheet
                    </button>
                    {worksheet.length > 0 && (
                      <button onClick={() => setShowWorksheetAnswers(!showWorksheetAnswers)}
                        className="px-6 py-3 bg-blue-900 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-800">
                        <Eye size={20} />
                        {showWorksheetAnswers ? 'Hide' : 'Show'} Answers
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {worksheet.length > 0 && (
                <div className="rounded-xl shadow-2xl p-8 relative" style={{ backgroundColor: getQuestionBg() }}>
                  <div className="absolute top-4 right-4 flex items-center gap-1">
                    <button onClick={() => setWorksheetFontSize(Math.max(0, worksheetFontSize - 1))} 
                      disabled={worksheetFontSize === 0} 
                      className={'w-8 h-8 rounded-lg font-bold flex items-center justify-center transition-colors ' + 
                        (worksheetFontSize === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-900 text-white hover:bg-blue-800')}>
                      <ChevronDown size={20} />
                    </button>
                    <button onClick={() => setWorksheetFontSize(Math.min(3, worksheetFontSize + 1))} 
                      disabled={worksheetFontSize === 3} 
                      className={'w-8 h-8 rounded-lg font-bold flex items-center justify-center transition-colors ' + 
                        (worksheetFontSize === 3 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-900 text-white hover:bg-blue-800')}>
                      <ChevronUp size={20} />
                    </button>
                  </div>

                  <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#000000' }}>
                    Expanding Single Brackets (FOIL) - Worksheet
                  </h2>

                  {isDifferentiated ? (
                    <div className="grid grid-cols-3 gap-6">
                      {['level1', 'level2', 'level3'].map((lvl, idx) => (
                        <div key={lvl} className={'rounded-xl p-6 border-4 ' +
                          (lvl === 'level1' ? 'bg-green-50 border-green-500' :
                           lvl === 'level2' ? 'bg-yellow-50 border-yellow-500' :
                           'bg-red-50 border-red-500')}>
                          <h3 className={'text-3xl font-bold text-center mb-6 ' + 
                            (lvl === 'level1' ? 'text-green-700' : 
                             lvl === 'level2' ? 'text-yellow-700' : 
                             'text-red-700')}>
                            Level {idx + 1}
                          </h3>
                          <div className="space-y-3">
                            {worksheet.filter(q => q.difficulty === lvl).map((q, i) => (
                              <div key={i} className={getFontSize()}>
                                <span className="font-semibold text-gray-800">{i + 1}.</span>
                                <span className="ml-3 font-bold text-gray-900">{q.display}</span>
                                {showWorksheetAnswers && (
                                  <div className="ml-8 font-semibold mt-1" style={{ color: '#059669' }}>
                                    = {q.answer}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`grid gap-x-6 gap-y-3 ${
                      numColumns === 1 ? 'grid-cols-1' : 
                      numColumns === 2 ? 'grid-cols-2' : 
                      numColumns === 3 ? 'grid-cols-3' : 
                      'grid-cols-4'
                    }`}>
                      {worksheet.map((q, i) => (
                        <div key={i} className={getFontSize()}>
                          <span className="font-semibold" style={{ color: '#000000' }}>{i + 1}.</span>
                          <span className="ml-3 font-bold" style={{ color: '#000000' }}>{q.display}</span>
                          {showWorksheetAnswers && (
                            <span className="ml-4 font-semibold" style={{ color: '#059669' }}>
                              = {q.answer}
                            </span>
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
    </>
  );
}
