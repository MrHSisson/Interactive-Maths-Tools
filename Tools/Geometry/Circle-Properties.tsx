import { useState, useEffect } from 'react';
import { RefreshCw, Eye } from 'lucide-react';

export default function CircleProperties() {
  const PI = 3.142592;
  
  const [mode, setMode] = useState('whiteboard');
  const [difficulty, setDifficulty] = useState('level1');
  const [questionType, setQuestionType] = useState('circumference');
  const [sectorQuestionStyle, setSectorQuestionStyle] = useState('mixed');
  
  const [question, setQuestion] = useState<any>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  
  const [whiteboardQuestion, setWhiteboardQuestion] = useState<any>(null);
  const [showWhiteboardAnswer, setShowWhiteboardAnswer] = useState(false);
  
  const [numQuestions, setNumQuestions] = useState(5);
  const [worksheet, setWorksheet] = useState<any[]>([]);
  const [showWorksheetAnswers, setShowWorksheetAnswers] = useState(false);
  const [isDifferentiated, setIsDifferentiated] = useState(false);
  
  const [allowDecimals, setAllowDecimals] = useState(false);
  const [answerInPi, setAnswerInPi] = useState(false);

  const formatNumber = (num: any) => {
    if (typeof num === 'string') return num;
    return Number.isInteger(num) ? num.toString() : num.toFixed(1);
  };

  const renderSector = (q: any, size = 200) => {
    const centerX = size / 2;
    const centerY = size / 2;
    const circleRadius = size * 0.35;
    
    let startAngle, endAngle;
    if (q.theta === 180) {
      const isTopHalf = Math.random() > 0.5;
      if (isTopHalf) {
        startAngle = 180;
        endAngle = 0;
      } else {
        startAngle = 0;
        endAngle = 180;
      }
    } else if (q.theta === 90) {
      startAngle = -90;
      endAngle = 0;
    } else {
      startAngle = -90;
      endAngle = startAngle + q.theta;
    }
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const startX = centerX + Math.cos(startRad) * circleRadius;
    const startY = centerY + Math.sin(startRad) * circleRadius;
    const endX = centerX + Math.cos(endRad) * circleRadius;
    const endY = centerY + Math.sin(endRad) * circleRadius;
    
    const largeArcFlag = q.theta > 180 ? 1 : 0;
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${startX} ${startY}`,
      `A ${circleRadius} ${circleRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      `Z`
    ].join(' ');
    
    let dimensionLine, labelX, labelY, labelText, labelAngle = 0;
    
    if (q.level === 1) {
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      labelAngle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
      dimensionLine = { x1: startX, y1: startY, x2: endX, y2: endY };
      labelX = midX;
      labelY = midY;
      labelText = `${formatNumber(q.diameter)} cm`;
    } else if (q.level === 2) {
      const midX = (centerX + startX) / 2;
      const midY = (centerY + startY) / 2;
      labelAngle = Math.atan2(startY - centerY, startX - centerX) * (180 / Math.PI);
      dimensionLine = { x1: centerX, y1: centerY, x2: startX, y2: startY };
      labelX = midX;
      labelY = midY;
      labelText = `${formatNumber(q.radius)} cm`;
    } else {
      const midX = (centerX + startX) / 2;
      const midY = (centerY + startY) / 2;
      labelAngle = Math.atan2(startY - centerY, startX - centerX) * (180 / Math.PI);
      dimensionLine = { x1: centerX, y1: centerY, x2: startX, y2: startY };
      labelX = midX;
      labelY = midY;
      labelText = `${formatNumber(q.radius)} cm`;
    }
    
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <path d={pathData} fill="#C8E6C9" stroke="#2E7D32" strokeWidth="3" />
        {q.level !== 1 && <circle cx={centerX} cy={centerY} r="3" fill="#2E7D32" />}
        <line x1={dimensionLine.x1} y1={dimensionLine.y1} x2={dimensionLine.x2} y2={dimensionLine.y2} stroke="#000000" strokeWidth="2" />
        {(() => {
          const dx = dimensionLine.x2 - dimensionLine.x1;
          const dy = dimensionLine.y2 - dimensionLine.y1;
          const length = Math.sqrt(dx * dx + dy * dy);
          const unitX = dx / length;
          const unitY = dy / length;
          const perpX = -unitY;
          const perpY = unitX;
          const arrowLength = 10;
          const arrowWidth = 4;
          const arrow1X = dimensionLine.x1 + unitX * arrowLength;
          const arrow1Y = dimensionLine.y1 + unitY * arrowLength;
          const arrow2X = dimensionLine.x2 - unitX * arrowLength;
          const arrow2Y = dimensionLine.y2 - unitY * arrowLength;
          return (
            <>
              <line x1={dimensionLine.x1} y1={dimensionLine.y1} x2={arrow1X + perpX * arrowWidth} y2={arrow1Y + perpY * arrowWidth} stroke="#000000" strokeWidth="2" />
              <line x1={dimensionLine.x1} y1={dimensionLine.y1} x2={arrow1X - perpX * arrowWidth} y2={arrow1Y - perpY * arrowWidth} stroke="#000000" strokeWidth="2" />
              <line x1={dimensionLine.x2} y1={dimensionLine.y2} x2={arrow2X + perpX * arrowWidth} y2={arrow2Y + perpY * arrowWidth} stroke="#000000" strokeWidth="2" />
              <line x1={dimensionLine.x2} y1={dimensionLine.y2} x2={arrow2X - perpX * arrowWidth} y2={arrow2Y - perpY * arrowWidth} stroke="#000000" strokeWidth="2" />
            </>
          );
        })()}
        <g transform={`translate(${labelX}, ${labelY}) rotate(${q.level === 1 ? 0 : labelAngle})`}>
          <rect x="-35" y="-14" width="70" height="28" fill="white" opacity="0.95" rx="3" />
          <text x="0" y="0" fill="#000000" fontSize="18" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">{labelText}</text>
        </g>
        {q.level === 3 && (
          <>
            <path d={`M ${centerX + Math.cos(startRad) * 25} ${centerY + Math.sin(startRad) * 25} A 25 25 0 ${q.theta > 180 ? 1 : 0} 1 ${centerX + Math.cos(endRad) * 25} ${centerY + Math.sin(endRad) * 25}`} fill="none" stroke="#2E7D32" strokeWidth="2" />
            {(() => {
              const midAngleRad = (startRad + endRad) / 2;
              const labelDistance = 35;
              const thetaLabelX = centerX + Math.cos(midAngleRad) * labelDistance;
              const thetaLabelY = centerY + Math.sin(midAngleRad) * labelDistance;
              return <text x={thetaLabelX} y={thetaLabelY} fill="#2E7D32" fontSize="18" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">θ</text>;
            })()}
          </>
        )}
        {q.level !== 1 && (
          <text x={centerX} y={centerY + circleRadius + 45} fill="#2E7D32" fontSize="18" fontWeight="bold" textAnchor="middle">θ = {q.theta}°</text>
        )}
      </svg>
    );
  };

  const generateCircumferenceQuestion = (level: string, angle: number) => {
    if (level === 'level1') {
      const diameter = allowDecimals ? Math.round((Math.random() * 24 + 1) * 10) / 10 : Math.floor(Math.random() * 25) + 1;
      const circumference = diameter * PI;
      const circumferencePi = diameter;
      return {
        level: 1, diameter, radius: diameter / 2, given: 'diameter', find: 'circumference',
        displayQuestion: `Find the circumference`,
        circumference: answerInPi ? `${formatNumber(circumferencePi)}π` : formatNumber(Math.round(circumference * 10) / 10),
        circumferenceNumeric: Math.round(circumference * 10) / 10,
        circumferencePi: `${formatNumber(circumferencePi)}π`,
        angle, type: 'circumference',
        working: [
          { type: 'given', text: `Diameter (d) = ${formatNumber(diameter)} cm` },
          { type: 'formula', text: 'Circumference = πd' },
          { type: 'substitution', text: `Circumference = π × ${formatNumber(diameter)}` },
          { type: 'calculation', textPi: `Circumference = ${formatNumber(circumferencePi)}π cm`, textNumeric: `Circumference = ${formatNumber(diameter)} × 3.142592 = ${formatNumber(Math.round(circumference * 10) / 10)} cm` },
          { type: 'final', answerPi: `${formatNumber(circumferencePi)}π cm`, answerNumeric: `${formatNumber(Math.round(circumference * 10) / 10)} cm` }
        ]
      };
    } else if (level === 'level2') {
      const radius = allowDecimals ? Math.round((Math.random() * 24 + 1) * 10) / 10 : Math.floor(Math.random() * 25) + 1;
      const circumference = 2 * PI * radius;
      const circumferencePi = 2 * radius;
      return {
        level: 2, diameter: radius * 2, radius, given: 'radius', find: 'circumference',
        displayQuestion: `Find the circumference`,
        circumference: answerInPi ? `${formatNumber(circumferencePi)}π` : formatNumber(Math.round(circumference * 10) / 10),
        circumferenceNumeric: Math.round(circumference * 10) / 10,
        circumferencePi: `${formatNumber(circumferencePi)}π`,
        angle, type: 'circumference',
        working: [
          { type: 'given', text: `Radius (r) = ${formatNumber(radius)} cm` },
          { type: 'formula', text: 'Circumference = 2πr' },
          { type: 'substitution', text: `Circumference = 2 × π × ${formatNumber(radius)}` },
          { type: 'calculation', textPi: `Circumference = ${formatNumber(circumferencePi)}π cm`, textNumeric: `Circumference = 2 × 3.142592 × ${formatNumber(radius)} = ${formatNumber(Math.round(circumference * 10) / 10)} cm` },
          { type: 'final', answerPi: `${formatNumber(circumferencePi)}π cm`, answerNumeric: `${formatNumber(Math.round(circumference * 10) / 10)} cm` }
        ]
      };
    } else {
      const findWhat = Math.random() > 0.5 ? 'radius' : 'diameter';
      let radius, diameter, circumference, circumferencePi;
      if (findWhat === 'radius') {
        radius = allowDecimals ? Math.round((Math.random() * 24 + 1) * 10) / 10 : Math.floor(Math.random() * 25) + 1;
        diameter = radius * 2;
        circumference = 2 * PI * radius;
        circumferencePi = 2 * radius;
      } else {
        diameter = allowDecimals ? Math.round((Math.random() * 24 + 1) * 10) / 10 : Math.floor(Math.random() * 25) + 1;
        radius = diameter / 2;
        circumference = PI * diameter;
        circumferencePi = diameter;
      }
      const working = findWhat === 'radius' ? [
        { type: 'given', text: `Circumference (C) = ${answerInPi ? `${formatNumber(circumferencePi)}π` : formatNumber(Math.round(circumference * 10) / 10)} cm` },
        { type: 'formula', text: 'Circumference = 2πr' },
        { type: 'rearrange', text: 'r = C ÷ (2π)' },
        { type: 'substitution', textPi: `r = ${formatNumber(circumferencePi)}π ÷ (2π)`, textNumeric: `r = ${formatNumber(Math.round(circumference * 10) / 10)} ÷ (2π)` },
        { type: 'calculation', textPi: `r = ${formatNumber(radius)} cm`, textNumeric: `r = ${formatNumber(Math.round(circumference * 10) / 10)} ÷ (2 × 3.142592) = ${formatNumber(radius)} cm` },
        { type: 'final', answer: `${formatNumber(radius)} cm` }
      ] : [
        { type: 'given', text: `Circumference (C) = ${answerInPi ? `${formatNumber(circumferencePi)}π` : formatNumber(Math.round(circumference * 10) / 10)} cm` },
        { type: 'formula', text: 'Circumference = πd' },
        { type: 'rearrange', text: 'd = C ÷ π' },
        { type: 'substitution', textPi: `d = ${formatNumber(circumferencePi)}π ÷ π`, textNumeric: `d = ${formatNumber(Math.round(circumference * 10) / 10)} ÷ π` },
        { type: 'calculation', textPi: `d = ${formatNumber(diameter)} cm`, textNumeric: `d = ${formatNumber(Math.round(circumference * 10) / 10)} ÷ 3.142592 = ${formatNumber(diameter)} cm` },
        { type: 'final', answer: `${formatNumber(diameter)} cm` }
      ];
      return {
        level: 3, diameter, radius, given: 'circumference', find: findWhat,
        displayQuestion: `Find the ${findWhat}`,
        circumference: answerInPi ? `${formatNumber(circumferencePi)}π` : formatNumber(Math.round(circumference * 10) / 10),
        circumferenceNumeric: Math.round(circumference * 10) / 10,
        circumferencePi: `${formatNumber(circumferencePi)}π`,
        answer: formatNumber(findWhat === 'radius' ? radius : diameter),
        angle, type: 'circumference', working
      };
    }
  };

  const generateAreaQuestion = (level: string, angle: number) => {
    if (level === 'level1') {
      const radius = allowDecimals ? Math.round((Math.random() * 24 + 1) * 10) / 10 : Math.floor(Math.random() * 25) + 1;
      const area = PI * radius * radius;
      const areaPi = radius * radius;
      return {
        level: 1, diameter: radius * 2, radius, given: 'radius', find: 'area',
        displayQuestion: `Find the area`,
        area: answerInPi ? `${formatNumber(areaPi)}π` : formatNumber(Math.round(area * 10) / 10),
        areaNumeric: Math.round(area * 10) / 10, areaPi: `${formatNumber(areaPi)}π`,
        angle, type: 'area',
        working: [
          { type: 'given', text: `Radius (r) = ${formatNumber(radius)} cm` },
          { type: 'formula', text: 'Area = πr²' },
          { type: 'substitution', text: `Area = π × ${formatNumber(radius)}²` },
          { type: 'simplify', text: `Area = π × ${formatNumber(radius * radius)}` },
          { type: 'calculation', textPi: `Area = ${formatNumber(areaPi)}π cm²`, textNumeric: `Area = 3.142592 × ${formatNumber(radius * radius)} = ${formatNumber(Math.round(area * 10) / 10)} cm²` },
          { type: 'final', answerPi: `${formatNumber(areaPi)}π cm²`, answerNumeric: `${formatNumber(Math.round(area * 10) / 10)} cm²` }
        ]
      };
    } else if (level === 'level2') {
      const diameter = allowDecimals ? Math.round((Math.random() * 24 + 1) * 10) / 10 : Math.floor(Math.random() * 25) + 1;
      const radius = diameter / 2;
      const area = PI * radius * radius;
      const areaPi = radius * radius;
      return {
        level: 2, diameter, radius, given: 'diameter', find: 'area',
        displayQuestion: `Find the area`,
        area: answerInPi ? `${formatNumber(areaPi)}π` : formatNumber(Math.round(area * 10) / 10),
        areaNumeric: Math.round(area * 10) / 10, areaPi: `${formatNumber(areaPi)}π`,
        angle, type: 'area',
        working: [
          { type: 'given', text: `Diameter (d) = ${formatNumber(diameter)} cm` },
          { type: 'findRadius', text: `Radius (r) = d ÷ 2 = ${formatNumber(diameter)} ÷ 2 = ${formatNumber(radius)} cm` },
          { type: 'formula', text: 'Area = πr²' },
          { type: 'substitution', text: `Area = π × ${formatNumber(radius)}²` },
          { type: 'simplify', text: `Area = π × ${formatNumber(radius * radius)}` },
          { type: 'calculation', textPi: `Area = ${formatNumber(areaPi)}π cm²`, textNumeric: `Area = 3.142592 × ${formatNumber(radius * radius)} = ${formatNumber(Math.round(area * 10) / 10)} cm²` },
          { type: 'final', answerPi: `${formatNumber(areaPi)}π cm²`, answerNumeric: `${formatNumber(Math.round(area * 10) / 10)} cm²` }
        ]
      };
    } else {
      const findWhat = Math.random() > 0.5 ? 'radius' : 'diameter';
      let radius, diameter, area, areaPi;
      if (findWhat === 'radius') {
        radius = allowDecimals ? Math.round((Math.random() * 24 + 1) * 10) / 10 : Math.floor(Math.random() * 25) + 1;
        diameter = radius * 2;
      } else {
        diameter = allowDecimals ? Math.round((Math.random() * 24 + 1) * 10) / 10 : Math.floor(Math.random() * 25) + 1;
        radius = diameter / 2;
      }
      area = PI * radius * radius;
      areaPi = radius * radius;
      const working = findWhat === 'radius' ? [
        { type: 'given', text: `Area (A) = ${answerInPi ? `${formatNumber(areaPi)}π` : formatNumber(Math.round(area * 10) / 10)} cm²` },
        { type: 'formula', text: 'Area = πr²' },
        { type: 'rearrange', text: 'r² = A ÷ π' },
        { type: 'substitution', textPi: `r² = ${formatNumber(areaPi)}π ÷ π`, textNumeric: `r² = ${formatNumber(Math.round(area * 10) / 10)} ÷ π` },
        { type: 'simplify', textPi: `r² = ${formatNumber(radius * radius)}`, textNumeric: `r² = ${formatNumber(Math.round(area * 10) / 10)} ÷ 3.142592 = ${formatNumber(radius * radius)}` },
        { type: 'calculation', text: `r = √${formatNumber(radius * radius)} = ${formatNumber(radius)} cm` },
        { type: 'final', answer: `${formatNumber(radius)} cm` }
      ] : [
        { type: 'given', text: `Area (A) = ${answerInPi ? `${formatNumber(areaPi)}π` : formatNumber(Math.round(area * 10) / 10)} cm²` },
        { type: 'formula', text: 'Area = πr²' },
        { type: 'rearrange', text: 'r² = A ÷ π' },
        { type: 'substitution', textPi: `r² = ${formatNumber(areaPi)}π ÷ π`, textNumeric: `r² = ${formatNumber(Math.round(area * 10) / 10)} ÷ π` },
        { type: 'simplify', textPi: `r² = ${formatNumber(radius * radius)}`, textNumeric: `r² = ${formatNumber(Math.round(area * 10) / 10)} ÷ 3.142592 = ${formatNumber(radius * radius)}` },
        { type: 'calculation', text: `r = √${formatNumber(radius * radius)} = ${formatNumber(radius)} cm` },
        { type: 'findDiameter', text: `Diameter (d) = 2r = 2 × ${formatNumber(radius)} = ${formatNumber(diameter)} cm` },
        { type: 'final', answer: `${formatNumber(diameter)} cm` }
      ];
      return {
        level: 3, diameter, radius, given: 'area', find: findWhat,
        displayQuestion: `Find the ${findWhat}`,
        area: answerInPi ? `${formatNumber(areaPi)}π` : formatNumber(Math.round(area * 10) / 10),
        areaNumeric: Math.round(area * 10) / 10, areaPi: `${formatNumber(areaPi)}π`,
        answer: formatNumber(findWhat === 'radius' ? radius : diameter),
        angle, type: 'area', working
      };
    }
  };

  const generateSectorQuestion = (level: string, angle: number) => {
    let theta, radius, diameter;
    let questionStyle = sectorQuestionStyle;
    if (questionStyle === 'mixed') {
      const styles = ['area', 'perimeter', 'arcLength'];
      questionStyle = styles[Math.floor(Math.random() * styles.length)];
    }
    
    if (level === 'level1') {
      theta = 180;
      diameter = allowDecimals ? Math.round((Math.random() * 24 + 2) * 10) / 10 : Math.floor(Math.random() * 24) + 2;
      radius = diameter / 2;
      const area = (PI * radius * radius) / 2;
      const areaPi = (radius * radius) / 2;
      const arcLength = PI * radius;
      const arcLengthPi = radius;
      const perimeter = PI * radius + diameter;
      const perimeterPi = radius;
      let displayQuestion, answer, answerNumeric, answerPi, working: any[];
      if (questionStyle === 'area') {
        displayQuestion = 'Find the area of the semi-circle';
        answerNumeric = formatNumber(Math.round(area * 10) / 10);
        answerPi = `${formatNumber(areaPi)}π`;
        answer = answerInPi ? answerPi : answerNumeric;
        working = [
          { type: 'given', text: `Diameter (d) = ${formatNumber(diameter)} cm, θ = 180°` },
          { type: 'findRadius', text: `Radius (r) = d ÷ 2 = ${formatNumber(diameter)} ÷ 2 = ${formatNumber(radius)} cm` },
          { type: 'formula', text: 'Area of sector = (θ/360) × πr²' },
          { type: 'substitution', text: `Area = (180/360) × π × ${formatNumber(radius)}²` },
          { type: 'simplify', text: `Area = (1/2) × π × ${formatNumber(radius * radius)}` },
          { type: 'calculation', textPi: `Area = ${formatNumber(areaPi)}π cm²`, textNumeric: `Area = 0.5 × 3.142592 × ${formatNumber(radius * radius)} = ${answerNumeric} cm²` },
          { type: 'final', answerPi: `${answerPi} cm²`, answerNumeric: `${answerNumeric} cm²` }
        ];
      } else if (questionStyle === 'arcLength') {
        displayQuestion = 'Find the arc length of the semi-circle';
        answerNumeric = formatNumber(Math.round(arcLength * 10) / 10);
        answerPi = `${formatNumber(arcLengthPi)}π`;
        answer = answerInPi ? answerPi : answerNumeric;
        working = [
          { type: 'given', text: `Diameter (d) = ${formatNumber(diameter)} cm, θ = 180°` },
          { type: 'findRadius', text: `Radius (r) = d ÷ 2 = ${formatNumber(diameter)} ÷ 2 = ${formatNumber(radius)} cm` },
          { type: 'formula', text: 'Arc length = (θ/360) × 2πr' },
          { type: 'substitution', text: `Arc length = (180/360) × 2 × π × ${formatNumber(radius)}` },
          { type: 'simplify', text: `Arc length = (1/2) × 2 × π × ${formatNumber(radius)}` },
          { type: 'calculation', textPi: `Arc length = ${formatNumber(arcLengthPi)}π cm`, textNumeric: `Arc length = ${formatNumber(radius)} × 3.142592 = ${answerNumeric} cm` },
          { type: 'final', answerPi: `${answerPi} cm`, answerNumeric: `${answerNumeric} cm` }
        ];
      } else {
        displayQuestion = 'Find the perimeter of the semi-circle';
        answerNumeric = formatNumber(Math.round(perimeter * 10) / 10);
        answerPi = `${formatNumber(perimeterPi)}π + ${formatNumber(diameter)}`;
        answer = answerInPi ? answerPi : answerNumeric;
        working = [
          { type: 'given', text: `Diameter (d) = ${formatNumber(diameter)} cm, θ = 180°` },
          { type: 'findRadius', text: `Radius (r) = d ÷ 2 = ${formatNumber(diameter)} ÷ 2 = ${formatNumber(radius)} cm` },
          { type: 'formula', text: 'Perimeter = arc length + diameter = (θ/360) × 2πr + d' },
          { type: 'substitution', text: `Perimeter = (180/360) × 2 × π × ${formatNumber(radius)} + ${formatNumber(diameter)}` },
          { type: 'simplify', text: `Perimeter = π × ${formatNumber(radius)} + ${formatNumber(diameter)}` },
          { type: 'calculation', textPi: `Perimeter = ${answerPi} cm`, textNumeric: `Perimeter = ${formatNumber(Math.round(arcLength * 10) / 10)} + ${formatNumber(diameter)} = ${answerNumeric} cm` },
          { type: 'final', answerPi: `${answerPi} cm`, answerNumeric: `${answerNumeric} cm` }
        ];
      }
      return { level: 1, theta, radius, diameter, displayQuestion, answer, answerNumeric, answerPi, questionStyle, angle, type: 'sector', working };
    } else if (level === 'level2') {
      theta = 90;
      diameter = allowDecimals ? Math.round((Math.random() * 24 + 2) * 10) / 10 : Math.floor(Math.random() * 24) + 2;
      radius = diameter / 2;
      const area = (PI * radius * radius) / 4;
      const areaPi = (radius * radius) / 4;
      const arcLength = (PI * radius) / 2;
      const arcLengthPi = radius / 2;
      const perimeter = (PI * radius) / 2 + 2 * radius;
      const perimeterPi = radius / 2;
      let displayQuestion, answer, answerNumeric, answerPi, working: any[];
      if (questionStyle === 'area') {
        displayQuestion = 'Find the area of the quarter-circle';
        answerNumeric = formatNumber(Math.round(area * 10) / 10);
        answerPi = `${formatNumber(areaPi)}π`;
        answer = answerInPi ? answerPi : answerNumeric;
        working = [
          { type: 'given', text: `Diameter (d) = ${formatNumber(diameter)} cm, θ = 90°` },
          { type: 'findRadius', text: `Radius (r) = d ÷ 2 = ${formatNumber(diameter)} ÷ 2 = ${formatNumber(radius)} cm` },
          { type: 'formula', text: 'Area of sector = (θ/360) × πr²' },
          { type: 'substitution', text: `Area = (90/360) × π × ${formatNumber(radius)}²` },
          { type: 'simplify', text: `Area = (1/4) × π × ${formatNumber(radius * radius)}` },
          { type: 'calculation', textPi: `Area = ${formatNumber(areaPi)}π cm²`, textNumeric: `Area = 0.25 × 3.142592 × ${formatNumber(radius * radius)} = ${answerNumeric} cm²` },
          { type: 'final', answerPi: `${answerPi} cm²`, answerNumeric: `${answerNumeric} cm²` }
        ];
      } else if (questionStyle === 'arcLength') {
        displayQuestion = 'Find the arc length of the quarter-circle';
        answerNumeric = formatNumber(Math.round(arcLength * 10) / 10);
        answerPi = `${formatNumber(arcLengthPi)}π`;
        answer = answerInPi ? answerPi : answerNumeric;
        working = [
          { type: 'given', text: `Diameter (d) = ${formatNumber(diameter)} cm, θ = 90°` },
          { type: 'findRadius', text: `Radius (r) = d ÷ 2 = ${formatNumber(diameter)} ÷ 2 = ${formatNumber(radius)} cm` },
          { type: 'formula', text: 'Arc length = (θ/360) × 2πr' },
          { type: 'substitution', text: `Arc length = (90/360) × 2 × π × ${formatNumber(radius)}` },
          { type: 'simplify', text: `Arc length = (1/4) × 2 × π × ${formatNumber(radius)}` },
          { type: 'calculation', textPi: `Arc length = ${formatNumber(arcLengthPi)}π cm`, textNumeric: `Arc length = 0.5 × ${formatNumber(radius)} × 3.142592 = ${answerNumeric} cm` },
          { type: 'final', answerPi: `${answerPi} cm`, answerNumeric: `${answerNumeric} cm` }
        ];
      } else {
        displayQuestion = 'Find the perimeter of the quarter-circle';
        answerNumeric = formatNumber(Math.round(perimeter * 10) / 10);
        answerPi = `${formatNumber(perimeterPi)}π + ${formatNumber(2 * radius)}`;
        answer = answerInPi ? answerPi : answerNumeric;
        working = [
          { type: 'given', text: `Diameter (d) = ${formatNumber(diameter)} cm, θ = 90°` },
          { type: 'findRadius', text: `Radius (r) = d ÷ 2 = ${formatNumber(diameter)} ÷ 2 = ${formatNumber(radius)} cm` },
          { type: 'formula', text: 'Perimeter = arc length + 2r = (θ/360) × 2πr + 2r' },
          { type: 'substitution', text: `Perimeter = (90/360) × 2 × π × ${formatNumber(radius)} + 2 × ${formatNumber(radius)}` },
          { type: 'simplify', text: `Perimeter = 0.5 × π × ${formatNumber(radius)} + ${formatNumber(2 * radius)}` },
          { type: 'calculation', textPi: `Perimeter = ${answerPi} cm`, textNumeric: `Perimeter = ${formatNumber(Math.round(arcLength * 10) / 10)} + ${formatNumber(2 * radius)} = ${answerNumeric} cm` },
          { type: 'final', answerPi: `${answerPi} cm`, answerNumeric: `${answerNumeric} cm` }
        ];
      }
      return { level: 2, theta, radius, diameter, displayQuestion, answer, answerNumeric, answerPi, questionStyle, angle, type: 'sector', working };
    } else {
      theta = Math.floor(Math.random() * 359) + 1;
      diameter = allowDecimals ? Math.round((Math.random() * 24 + 2) * 10) / 10 : Math.floor(Math.random() * 24) + 2;
      radius = diameter / 2;
      const area = (theta / 360) * PI * radius * radius;
      const areaPi = (theta / 360) * radius * radius;
      const arcLength = (theta / 360) * 2 * PI * radius;
      const arcLengthPi = (theta / 360) * 2 * radius;
      const perimeter = (theta / 360) * 2 * PI * radius + 2 * radius;
      const perimeterPi = (theta / 360) * 2 * radius;
      let displayQuestion, answer, answerNumeric, answerPi, working: any[];
      if (questionStyle === 'area') {
        displayQuestion = 'Find the area of the sector';
        answerNumeric = formatNumber(Math.round(area * 10) / 10);
        answerPi = `${formatNumber(Math.round(areaPi * 100) / 100)}π`;
        answer = answerInPi ? answerPi : answerNumeric;
        working = [
          { type: 'given', text: `Diameter (d) = ${formatNumber(diameter)} cm, θ = ${theta}°` },
          { type: 'findRadius', text: `Radius (r) = d ÷ 2 = ${formatNumber(diameter)} ÷ 2 = ${formatNumber(radius)} cm` },
          { type: 'formula', text: 'Area of sector = (θ/360) × πr²' },
          { type: 'substitution', text: `Area = (${theta}/360) × π × ${formatNumber(radius)}²` },
          { type: 'simplify', text: `Area = (${theta}/360) × π × ${formatNumber(radius * radius)}` },
          { type: 'calculation', textPi: `Area = ${answerPi} cm²`, textNumeric: `Area = ${formatNumber(theta/360)} × 3.142592 × ${formatNumber(radius * radius)} = ${answerNumeric} cm²` },
          { type: 'final', answerPi: `${answerPi} cm²`, answerNumeric: `${answerNumeric} cm²` }
        ];
      } else if (questionStyle === 'arcLength') {
        displayQuestion = 'Find the arc length of the sector';
        answerNumeric = formatNumber(Math.round(arcLength * 10) / 10);
        answerPi = `${formatNumber(Math.round(arcLengthPi * 100) / 100)}π`;
        answer = answerInPi ? answerPi : answerNumeric;
        working = [
          { type: 'given', text: `Diameter (d) = ${formatNumber(diameter)} cm, θ = ${theta}°` },
          { type: 'findRadius', text: `Radius (r) = d ÷ 2 = ${formatNumber(diameter)} ÷ 2 = ${formatNumber(radius)} cm` },
          { type: 'formula', text: 'Arc length = (θ/360) × 2πr' },
          { type: 'substitution', text: `Arc length = (${theta}/360) × 2 × π × ${formatNumber(radius)}` },
          { type: 'simplify', text: `Arc length = (${theta}/360) × ${formatNumber(2 * radius)} × π` },
          { type: 'calculation', textPi: `Arc length = ${answerPi} cm`, textNumeric: `Arc length = ${formatNumber(theta/360)} × 2 × 3.142592 × ${formatNumber(radius)} = ${answerNumeric} cm` },
          { type: 'final', answerPi: `${answerPi} cm`, answerNumeric: `${answerNumeric} cm` }
        ];
      } else {
        displayQuestion = 'Find the perimeter of the sector';
        answerNumeric = formatNumber(Math.round(perimeter * 10) / 10);
        answerPi = `${formatNumber(Math.round(perimeterPi * 100) / 100)}π + ${formatNumber(2 * radius)}`;
        answer = answerInPi ? answerPi : answerNumeric;
        working = [
          { type: 'given', text: `Diameter (d) = ${formatNumber(diameter)} cm, θ = ${theta}°` },
          { type: 'findRadius', text: `Radius (r) = d ÷ 2 = ${formatNumber(diameter)} ÷ 2 = ${formatNumber(radius)} cm` },
          { type: 'formula', text: 'Perimeter = arc length + 2r = (θ/360) × 2πr + 2r' },
          { type: 'substitution', text: `Perimeter = (${theta}/360) × 2 × π × ${formatNumber(radius)} + 2 × ${formatNumber(radius)}` },
          { type: 'simplify', text: `Perimeter = (${theta}/360) × ${formatNumber(2 * radius)} × π + ${formatNumber(2 * radius)}` },
          { type: 'calculation', textPi: `Perimeter = ${answerPi} cm`, textNumeric: `Perimeter = ${formatNumber(Math.round(arcLength * 10) / 10)} + ${formatNumber(2 * radius)} = ${answerNumeric} cm` },
          { type: 'final', answerPi: `${answerPi} cm`, answerNumeric: `${answerNumeric} cm` }
        ];
      }
      return { level: 3, theta, radius, diameter, displayQuestion, answer, answerNumeric, answerPi, questionStyle, angle, type: 'sector', working };
    }
  };

  const generateQuestion = (level: string) => {
    const angle = Math.floor(Math.random() * 24) * 15;
    if (questionType === 'circumference') return generateCircumferenceQuestion(level, angle);
    else if (questionType === 'area') return generateAreaQuestion(level, angle);
    else return generateSectorQuestion(level, angle);
  };

  const handleNewQuestion = () => { setQuestion(generateQuestion(difficulty)); setShowAnswer(false); };
  const handleNewWhiteboardQuestion = () => { setWhiteboardQuestion(generateQuestion(difficulty)); setShowWhiteboardAnswer(false); };

  const handleGenerateWorksheet = () => {
    const questions: any[] = [];
    const usedKeys = new Set();
    const generateUniqueQuestion = (lvl: string) => {
      let attempts = 0, q, uniqueKey;
      do {
        q = generateQuestion(lvl);
        if (questionType === 'sectors') uniqueKey = `${q.theta}-${q.diameter}-${q.questionStyle}`;
        else if (questionType === 'circumference') {
          if (q.given === 'radius') uniqueKey = `circ-r${q.radius}-${q.level}`;
          else if (q.given === 'diameter') uniqueKey = `circ-d${q.diameter}-${q.level}`;
          else uniqueKey = `circ-c${q.circumferenceNumeric}-find${q.find}`;
        } else {
          if (q.given === 'radius') uniqueKey = `area-r${q.radius}-${q.level}`;
          else if (q.given === 'diameter') uniqueKey = `area-d${q.diameter}-${q.level}`;
          else uniqueKey = `area-a${q.areaNumeric}-find${q.find}`;
        }
        attempts++;
        if (attempts > 100) break;
      } while (usedKeys.has(uniqueKey));
      usedKeys.add(uniqueKey);
      return q;
    };
    if (isDifferentiated) {
      ['level1', 'level2', 'level3'].forEach(lvl => {
        for (let i = 0; i < numQuestions; i++) questions.push({ ...generateUniqueQuestion(lvl), difficulty: lvl });
      });
    } else {
      for (let i = 0; i < numQuestions; i++) questions.push({ ...generateUniqueQuestion(difficulty), difficulty });
    }
    setWorksheet(questions);
    setShowWorksheetAnswers(false);
  };

  useEffect(() => { if (mode === 'single' && !question) handleNewQuestion(); if (mode === 'whiteboard' && !whiteboardQuestion) handleNewWhiteboardQuestion(); }, [mode, questionType]);
  useEffect(() => { if (mode === 'single' && question) handleNewQuestion(); if (mode === 'whiteboard' && whiteboardQuestion) handleNewWhiteboardQuestion(); }, [difficulty, allowDecimals, answerInPi, questionType]);

  const renderCircle = (q: any, size = 200) => {
    if (q.type === 'sector') return renderSector(q, size);
    const centerX = size / 2, centerY = size / 2, circleRadius = size * 0.35;
    const angleRad = (q.angle * Math.PI) / 180;
    const diamEndX = centerX + Math.cos(angleRad) * circleRadius, diamEndY = centerY + Math.sin(angleRad) * circleRadius;
    const diamStartX = centerX - Math.cos(angleRad) * circleRadius, diamStartY = centerY - Math.sin(angleRad) * circleRadius;
    const radEndX = centerX + Math.cos(angleRad) * circleRadius, radEndY = centerY + Math.sin(angleRad) * circleRadius;
    const diamLabelX = centerX + Math.cos(angleRad) * circleRadius * 0.3, diamLabelY = centerY + Math.sin(angleRad) * circleRadius * 0.3;
    const radLabelX = centerX + Math.cos(angleRad) * circleRadius * 0.5, radLabelY = centerY + Math.sin(angleRad) * circleRadius * 0.5;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={centerX} cy={centerY} r={circleRadius} fill="none" stroke="#7C3AED" strokeWidth="3" />
        <circle cx={centerX} cy={centerY} r="3" fill="#7C3AED" />
        {(q.given === 'diameter' || q.find === 'diameter') && (
          <>
            <line x1={diamStartX} y1={diamStartY} x2={diamEndX} y2={diamEndY} stroke="#DC2626" strokeWidth="2" strokeDasharray="5,5" />
            <rect x={diamLabelX - 28} y={diamLabelY - 12} width="56" height="24" fill="white" opacity="0.9" rx="3" />
            <text x={diamLabelX} y={diamLabelY} fill="#DC2626" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">{q.given === 'diameter' ? `d = ${formatNumber(q.diameter)}` : 'd = ?'}</text>
          </>
        )}
        {(q.given === 'radius' || q.find === 'radius') && (
          <>
            <line x1={centerX} y1={centerY} x2={radEndX} y2={radEndY} stroke="#059669" strokeWidth="2" strokeDasharray="5,5" />
            <rect x={radLabelX - 26} y={radLabelY - 12} width="52" height="24" fill="white" opacity="0.9" rx="3" />
            <text x={radLabelX} y={radLabelY} fill="#059669" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">{q.given === 'radius' ? `r = ${formatNumber(q.radius)}` : 'r = ?'}</text>
          </>
        )}
        {q.given === 'circumference' && <text x={centerX} y={centerY + circleRadius + 45} fill="#7C3AED" fontSize="18" fontWeight="bold" textAnchor="middle">C = {q.circumference} cm</text>}
        {q.given === 'area' && <text x={centerX} y={centerY + circleRadius + 45} fill="#7C3AED" fontSize="18" fontWeight="bold" textAnchor="middle">A = {q.area} cm²</text>}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8 text-purple-900">Circle Properties</h1>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-center gap-3 flex-wrap">
            <button onClick={() => setQuestionType('circumference')} className={'px-8 py-4 rounded-xl font-bold text-xl transition-all ' + (questionType === 'circumference' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-indigo-600 border-2 border-indigo-300 shadow')}>Circumference</button>
            <button onClick={() => setQuestionType('area')} className={'px-8 py-4 rounded-xl font-bold text-xl transition-all ' + (questionType === 'area' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-indigo-600 border-2 border-indigo-300 shadow')}>Area</button>
            <button onClick={() => setQuestionType('sectors')} className={'px-8 py-4 rounded-xl font-bold text-xl transition-all ' + (questionType === 'sectors' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-indigo-600 border-2 border-indigo-300 shadow')}>Sectors</button>
          </div>
        </div>
        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => setMode('whiteboard')} className={'px-8 py-4 rounded-xl font-bold text-xl transition-all ' + (mode === 'whiteboard' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-purple-600 shadow')}>Whiteboard</button>
          <button onClick={() => setMode('single')} className={'px-8 py-4 rounded-xl font-bold text-xl transition-all ' + (mode === 'single' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-purple-600 shadow')}>Single Q</button>
          <button onClick={() => setMode('worksheet')} className={'px-8 py-4 rounded-xl font-bold text-xl transition-all ' + (mode === 'worksheet' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-purple-600 shadow')}>Worksheet</button>
        </div>

        {mode === 'whiteboard' && (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-600">Difficulty:</span>
                  <div className="flex gap-2">
                    <button onClick={() => setDifficulty('level1')} className={'px-4 py-2 rounded-lg font-bold text-sm w-24 ' + (difficulty === 'level1' ? 'bg-green-600 text-white' : 'bg-white text-green-600 border-2 border-green-600')}>Level 1</button>
                    <button onClick={() => setDifficulty('level2')} className={'px-4 py-2 rounded-lg font-bold text-sm w-24 ' + (difficulty === 'level2' ? 'bg-yellow-600 text-white' : 'bg-white text-yellow-600 border-2 border-yellow-600')}>Level 2</button>
                    <button onClick={() => setDifficulty('level3')} className={'px-4 py-2 rounded-lg font-bold text-sm w-24 ' + (difficulty === 'level3' ? 'bg-red-600 text-white' : 'bg-white text-red-600 border-2 border-red-600')}>Level 3</button>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-600"><input type="checkbox" checked={allowDecimals} onChange={(e) => setAllowDecimals(e.target.checked)} className="w-3 h-3" />Decimals</label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-600"><input type="checkbox" checked={answerInPi} onChange={(e) => setAnswerInPi(e.target.checked)} className="w-3 h-3" />In π</label>
                </div>
                {questionType === 'sectors' && (
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-gray-600">Type:</label>
                    <select value={sectorQuestionStyle} onChange={(e) => setSectorQuestionStyle(e.target.value)} className="px-2 py-1 border-2 border-gray-300 rounded-lg text-xs font-semibold">
                      <option value="mixed">Mixed</option><option value="area">Area</option><option value="arcLength">Arc Length</option><option value="perimeter">Perimeter</option>
                    </select>
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={handleNewWhiteboardQuestion} className="px-6 py-2 bg-purple-600 text-white rounded-xl font-bold text-base shadow-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 w-52"><RefreshCw size={18} />New Question</button>
                  <button onClick={() => setShowWhiteboardAnswer(!showWhiteboardAnswer)} className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-base shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 w-52"><Eye size={18} />{showWhiteboardAnswer ? 'Hide Answer' : 'Show Answer'}</button>
                </div>
              </div>
            </div>
            {whiteboardQuestion && (
              <div className="bg-white rounded-xl shadow-2xl p-8">
                <div className="text-6xl font-bold text-center text-purple-900 mb-6">
                  {!showWhiteboardAnswer ? whiteboardQuestion.displayQuestion : (
                    <span className="text-emerald-600">
                      {whiteboardQuestion.type === 'circumference' ? (whiteboardQuestion.level === 3 ? `${whiteboardQuestion.answer} cm` : `${whiteboardQuestion.circumference} cm`) : whiteboardQuestion.type === 'sector' ? whiteboardQuestion.answer : (whiteboardQuestion.level === 3 ? `${whiteboardQuestion.answer} cm` : `${whiteboardQuestion.area} cm²`)}
                    </span>
                  )}
                </div>
                <div className="flex gap-6">
                  <div className="bg-white rounded-xl flex items-center justify-center" style={{width: '450px', height: '500px'}}><div>{renderCircle(whiteboardQuestion, 400)}</div></div>
                  <div className="flex-1 bg-gray-100 rounded-xl p-6" style={{minHeight: '500px'}}></div>
                </div>
              </div>
            )}
          </div>
        )}

        {mode === 'single' && (
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex justify-center items-center gap-6 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold">Difficulty:</span>
                  <div className="flex gap-3">
                    <button onClick={() => setDifficulty('level1')} className={'px-6 py-3 rounded-lg font-bold text-lg ' + (difficulty === 'level1' ? 'bg-green-600 text-white' : 'bg-white text-green-600 border-2 border-green-600')}>Level 1</button>
                    <button onClick={() => setDifficulty('level2')} className={'px-6 py-3 rounded-lg font-bold text-lg ' + (difficulty === 'level2' ? 'bg-yellow-600 text-white' : 'bg-white text-yellow-600 border-2 border-yellow-600')}>Level 2</button>
                    <button onClick={() => setDifficulty('level3')} className={'px-6 py-3 rounded-lg font-bold text-lg ' + (difficulty === 'level3' ? 'bg-red-600 text-white' : 'bg-white text-red-600 border-2 border-red-600')}>Level 3</button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-base font-semibold"><input type="checkbox" checked={allowDecimals} onChange={(e) => setAllowDecimals(e.target.checked)} className="w-4 h-4" />Decimals</label>
                  <label className="flex items-center gap-2 text-base font-semibold"><input type="checkbox" checked={answerInPi} onChange={(e) => setAnswerInPi(e.target.checked)} className="w-4 h-4" />In π</label>
                </div>
                {questionType === 'sectors' && (
                  <div className="flex items-center gap-2">
                    <label className="text-base font-semibold">Type:</label>
                    <select value={sectorQuestionStyle} onChange={(e) => setSectorQuestionStyle(e.target.value)} className="px-3 py-2 border-2 border-purple-300 rounded-lg text-base font-semibold">
                      <option value="mixed">Mixed</option><option value="area">Area</option><option value="arcLength">Arc Length</option><option value="perimeter">Perimeter</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            {question && (
              <div className="bg-white rounded-xl shadow-2xl p-12">
                <div className="text-5xl font-bold text-center text-purple-900 mb-8">{question.displayQuestion}</div>
                <div className="flex justify-center mb-8">{renderCircle(question, 400)}</div>
                <div className="flex gap-4 justify-center mb-8">
                  <button onClick={handleNewQuestion} className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold text-xl shadow-lg hover:bg-purple-700 transition-colors flex items-center gap-2"><RefreshCw size={24} />New Question</button>
                  <button onClick={() => setShowAnswer(!showAnswer)} className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-xl shadow-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"><Eye size={24} />{showAnswer ? 'Hide' : 'Show'} Answer</button>
                </div>
                {showAnswer && (
                  <div className="mt-8 space-y-6">
                    {question.working.map((step: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-6">
                        {step.type === 'given' && <div><h4 className="text-xl font-semibold text-gray-700 mb-3">Given:</h4><div className="text-3xl font-medium text-blue-600">{step.text}</div></div>}
                        {step.type === 'formula' && <div><h4 className="text-xl font-semibold text-gray-700 mb-3">Formula:</h4><div className="text-3xl font-medium text-blue-600">{step.text}</div></div>}
                        {step.type === 'rearrange' && <div><h4 className="text-xl font-semibold text-gray-700 mb-3">Rearrange:</h4><div className="text-3xl font-medium text-blue-600">{step.text}</div></div>}
                        {step.type === 'substitution' && <div><h4 className="text-xl font-semibold text-gray-700 mb-3">Substitute:</h4><div className="text-3xl font-medium text-blue-600">{answerInPi ? step.textPi : step.textNumeric || step.text}</div></div>}
                        {step.type === 'calculation' && <div><h4 className="text-xl font-semibold text-gray-700 mb-3">Calculate:</h4><div className="text-3xl font-medium text-blue-600">{answerInPi ? step.textPi : step.textNumeric || step.text}</div></div>}
                        {step.type === 'findRadius' && <div><h4 className="text-xl font-semibold text-gray-700 mb-3">Find Radius:</h4><div className="text-3xl font-medium text-blue-600">{step.text}</div></div>}
                        {step.type === 'simplify' && <div><h4 className="text-xl font-semibold text-gray-700 mb-3">Simplify:</h4><div className="text-3xl font-medium text-blue-600">{answerInPi ? step.textPi : step.textNumeric || step.text}</div></div>}
                        {step.type === 'findDiameter' && <div><h4 className="text-xl font-semibold text-gray-700 mb-3">Find Diameter:</h4><div className="text-3xl font-medium text-blue-600">{step.text}</div></div>}
                        {step.type === 'final' && <div><h4 className="text-xl font-semibold text-gray-700 mb-3">Answer:</h4><div className="text-5xl font-bold text-emerald-600 bg-emerald-50 p-6 rounded-lg text-center">{answerInPi ? step.answerPi : step.answerNumeric || step.answer}</div></div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {mode === 'worksheet' && (
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="space-y-4">
                <div className="flex justify-center items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-3">
                    <label className="text-lg font-semibold">Questions per level:</label>
                    <input type="number" min="1" max="20" value={numQuestions} onChange={(e) => setNumQuestions(Math.max(1, Math.min(20, parseInt(e.target.value) || 5)))} className="w-20 px-4 py-2 border-2 border-purple-300 rounded-lg text-lg" />
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="diff" checked={isDifferentiated} onChange={(e) => setIsDifferentiated(e.target.checked)} className="w-5 h-5" />
                    <label htmlFor="diff" className="text-lg font-semibold">Differentiated</label>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-base font-semibold"><input type="checkbox" checked={allowDecimals} onChange={(e) => setAllowDecimals(e.target.checked)} className="w-4 h-4" />Decimals</label>
                    <label className="flex items-center gap-2 text-base font-semibold"><input type="checkbox" checked={answerInPi} onChange={(e) => setAnswerInPi(e.target.checked)} className="w-4 h-4" />In π</label>
                  </div>
                  {questionType === 'sectors' && (
                    <div className="flex items-center gap-2">
                      <label className="text-base font-semibold">Type:</label>
                      <select value={sectorQuestionStyle} onChange={(e) => setSectorQuestionStyle(e.target.value)} className="px-3 py-2 border-2 border-purple-300 rounded-lg text-base font-semibold">
                        <option value="mixed">Mixed</option><option value="area">Area</option><option value="arcLength">Arc Length</option><option value="perimeter">Perimeter</option>
                      </select>
                    </div>
                  )}
                </div>
                {!isDifferentiated && (
                  <div className="flex justify-center items-center gap-4">
                    <label className="text-lg font-semibold">Difficulty:</label>
                    <div className="flex gap-2">
                      <button onClick={() => setDifficulty('level1')} className={'px-6 py-2 rounded-lg font-semibold ' + (difficulty === 'level1' ? 'bg-green-600 text-white' : 'bg-gray-200')}>Level 1</button>
                      <button onClick={() => setDifficulty('level2')} className={'px-6 py-2 rounded-lg font-semibold ' + (difficulty === 'level2' ? 'bg-yellow-600 text-white' : 'bg-gray-200')}>Level 2</button>
                      <button onClick={() => setDifficulty('level3')} className={'px-6 py-2 rounded-lg font-semibold ' + (difficulty === 'level3' ? 'bg-red-600 text-white' : 'bg-gray-200')}>Level 3</button>
                    </div>
                  </div>
                )}
                <div className="flex justify-center gap-4">
                  <button onClick={handleGenerateWorksheet} className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-purple-700"><RefreshCw size={20} />Generate</button>
                  {worksheet.length > 0 && <button onClick={() => setShowWorksheetAnswers(!showWorksheetAnswers)} className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-emerald-700"><Eye size={20} />{showWorksheetAnswers ? 'Hide' : 'Show'} Answers</button>}
                </div>
              </div>
            </div>
            {worksheet.length > 0 && (
              <div className="bg-white rounded-xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-purple-900">Worksheet</h2>
                {isDifferentiated ? (
                  <div className="grid grid-cols-3 gap-6">
                    {['level1', 'level2', 'level3'].map((lvl, idx) => (
                      <div key={lvl} className={'rounded-xl p-6 border-4 ' + (lvl === 'level1' ? 'bg-green-50 border-green-500' : lvl === 'level2' ? 'bg-yellow-50 border-yellow-500' : 'bg-red-50 border-red-500')}>
                        <h3 className={'text-2xl font-bold text-center mb-6 ' + (lvl === 'level1' ? 'text-green-700' : lvl === 'level2' ? 'text-yellow-700' : 'text-red-700')}>Level {idx + 1}</h3>
                        <div className="space-y-4">
                          {worksheet.filter(q => q.difficulty === lvl).map((q, i) => (
                            <div key={i} className="bg-white rounded-lg p-4 border-2 border-gray-200">
                              <div className="font-bold text-xl text-gray-800 mb-2">{i + 1}. {q.displayQuestion}</div>
                              <div className="flex justify-center">{renderCircle(q, 200)}</div>
                              {showWorksheetAnswers && (
                                <div className="mt-3 pt-3 border-t-2 border-emerald-300">
                                  <div className="text-2xl font-bold text-emerald-700 text-center">
                                    {q.type === 'circumference' ? (q.level === 3 ? `${q.answer} cm` : `${q.circumference} cm`) : q.type === 'sector' ? q.answer : (q.level === 3 ? `${q.answer} cm` : `${q.area} cm²`)}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-6">
                    {worksheet.map((q, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                        <div className="font-bold text-xl text-indigo-900 mb-3 text-center">{i + 1}. {q.displayQuestion}</div>
                        <div className="flex justify-center mb-2">{renderCircle(q, 180)}</div>
                        {showWorksheetAnswers && (
                          <div className="text-2xl font-bold text-emerald-700 text-center mt-3 pt-3 border-t-2 border-emerald-300">
                            {q.type === 'circumference' ? (q.level === 3 ? `${q.answer} cm` : `${q.circumference} cm`) : q.type === 'sector' ? q.answer : (q.level === 3 ? `${q.answer} cm` : `${q.area} cm²`)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
