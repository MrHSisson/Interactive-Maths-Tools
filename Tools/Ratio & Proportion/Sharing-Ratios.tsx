import React, { useState, useEffect } from 'react';
import { RefreshCw, Eye } from 'lucide-react';

const RatioTool = () => {
  const [topic, setTopic] = useState('simplifying');
  const [mode, setMode] = useState('whiteboard');
  const [difficulty, setDifficulty] = useState('level1');
  const [includeThreePart, setIncludeThreePart] = useState(false);
  const [shareQuestionType, setShareQuestionType] = useState('mixed');
  const [useAlgebraicMethod, setUseAlgebraicMethod] = useState(false);
  const [knownAmountsQuestionType, setKnownAmountsQuestionType] = useState('mixed');
  const [useNumericalMethod, setUseNumericalMethod] = useState(false);
  const [differenceQuestionType, setDifferenceQuestionType] = useState('mixed');
  const [useDifferenceNumericalMethod, setUseDifferenceNumericalMethod] = useState(false);
  
  // Single question state (shared between whiteboard and single Q modes)
  const [question, setQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showWhiteboardAnswer, setShowWhiteboardAnswer] = useState(false);
  
  // Worksheet state
  const [numQuestions, setNumQuestions] = useState(5);
  const [worksheet, setWorksheet] = useState([]);
  const [showWorksheetAnswers, setShowWorksheetAnswers] = useState(false);
  const [isDifferentiated, setIsDifferentiated] = useState(false);

  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const namesList = ['Alice', 'Ben', 'Charlie', 'Diana', 'Emma', 'Finn', 'Grace', 'Harry', 'Isla', 'Jack', 'Kate', 'Liam', 'Mia', 'Noah', 'Olivia', 'Peter'];
  
  const getRandomNames = (count) => {
    const shuffled = [...namesList].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const formatCurrency = (amount) => {
    if (amount % 1 === 0) return `£${amount}`;
    return `£${amount.toFixed(2)}`;
  };

  const findHCF = (numbers) => {
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    return numbers.reduce((acc, num) => gcd(acc, num));
  };

  const verifyHCF = (parts, hcf) => {
    const allDivisible = parts.every(p => p % hcf === 0);
    const simplified = parts.map(p => p / hcf);
    const simplifiedHCF = findHCF(simplified);
    return allDivisible && simplifiedHCF === 1;
  };

  const findSmallestCommonFactor = (numbers) => {
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    for (let prime of primes) {
      if (numbers.every(n => n % prime === 0)) return prime;
    }
    return 1;
  };

  const generateWorking = (original, simplified) => {
    const steps = [{ type: 'original', ratio: [...original] }];
    let current = [...original];
    
    while (findHCF(current) > 1) {
      const commonFactor = findSmallestCommonFactor(current);
      const next = current.map(x => x / commonFactor);
      steps.push({ type: 'step', ratio: next, dividedBy: commonFactor });
      current = next;
    }
    
    steps.push({ type: 'final', answer: simplified.join(':') });
    return steps;
  };

  const generateSimplifyingQuestion = (diff) => {
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      attempts++;

      const isThreePart = includeThreePart && Math.random() < 0.35;
      const numParts = isThreePart ? 3 : 2;

      let simplified = [];
      let hcf;
      let minPart, maxPart, hcfChoices;

      if (diff === 'level1') {
        for (let i = 0; i < numParts; i++) {
          simplified.push(randomInt(1, 5));
        }
        hcfChoices = [2, 3, 4, 5];
        minPart = 4;
        maxPart = 20;
      } else if (diff === 'level2') {
        for (let i = 0; i < numParts; i++) {
          simplified.push(randomInt(1, 8));
        }
        hcfChoices = [6, 8, 9, 10, 12, 15, 18];
        minPart = 12;
        maxPart = 60;
      } else {
        for (let i = 0; i < numParts; i++) {
          simplified.push(randomInt(1, 10));
        }
        hcfChoices = [11, 13, 14, 16, 17, 18, 20, 22, 24, 26, 28];
        minPart = 30;
        maxPart = 120;
      }

      if (findHCF(simplified) !== 1) continue;

      hcf = randomChoice(hcfChoices);
      const original = simplified.map(x => x * hcf);

      if (original.some(x => x < minPart || x > maxPart)) continue;
      if (!verifyHCF(original, hcf)) continue;

      return {
        display: `Simplify: ${original.join(':')}`,
        answer: simplified.join(':'),
        originalParts: original,
        simplifiedParts: simplified,
        hcf: hcf,
        working: generateWorking(original, simplified)
      };
    }

    return {
      display: 'Simplify: 6:9',
      answer: '2:3',
      originalParts: [6, 9],
      simplifiedParts: [2, 3],
      hcf: 3,
      working: generateWorking([6, 9], [2, 3])
    };
  };

  const generateSharingWorking = (ratioParts, total, ratioSum, partValue, shares, questionType, names, algebraic = false) => {
    if (algebraic) {
      return [
        { type: 'showRatio', parts: ratioParts, names: names },
        { type: 'explainParts', parts: ratioParts, names: names },
        { type: 'ratioSum', parts: ratioParts, names: names, sum: ratioSum },
        { type: 'partValue', total: total, sum: ratioSum, value: partValue },
        { type: 'calculateShares', parts: ratioParts, names: names, partValue: partValue, shares: shares },
        { type: 'verifyTotal', shares: shares, total: total, names: names },
        { type: 'answer', questionType: questionType, shares: shares, names: names }
      ];
    } else {
      return [
        { type: 'barModelEmpty', bars: ratioParts.map((parts, idx) => ({ person: names[idx], boxes: parts })) },
        { type: 'totalParts', sum: ratioSum },
        { type: 'partValue', total: total, sum: ratioSum, value: partValue },
        { type: 'barModelFilled', bars: ratioParts.map((parts, idx) => ({ person: names[idx], boxes: parts, value: partValue, total: shares[idx] })) },
        { type: 'answer', questionType: questionType, shares: shares, names: names }
      ];
    }
  };

  const generateSharingQuestion = (diff) => {
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      attempts++;

      const isThreePart = includeThreePart && Math.random() < 0.35;
      const numParts = isThreePart ? 3 : 2;
      const names = getRandomNames(numParts);

      let ratioParts = [];
      let total, ratioSum, partValue;

      if (diff === 'level1') {
        if (isThreePart) {
          ratioParts = [randomInt(1, 3), randomInt(1, 3), randomInt(1, 3)];
        } else {
          const options = [[1,2], [1,3], [1,4], [2,3], [3,4]];
          ratioParts = randomChoice(options);
        }
        ratioSum = ratioParts.reduce((a, b) => a + b, 0);
        const multiplier = randomInt(10, 20);
        total = ratioSum * multiplier;
      } else if (diff === 'level2') {
        if (isThreePart) {
          ratioParts = [randomInt(1, 5), randomInt(1, 5), randomInt(1, 5)];
        } else {
          ratioParts = [randomInt(1, 6), randomInt(1, 6)];
        }
        ratioSum = ratioParts.reduce((a, b) => a + b, 0);
        if (ratioSum < 5 || ratioSum > 15) continue;
        const multiplier = randomInt(8, 15);
        total = ratioSum * multiplier;
      } else {
        if (isThreePart) {
          ratioParts = [randomInt(2, 8), randomInt(2, 8), randomInt(2, 8)];
        } else {
          ratioParts = [randomInt(3, 9), randomInt(3, 9)];
        }
        ratioSum = ratioParts.reduce((a, b) => a + b, 0);
        if (ratioSum < 8 || ratioSum > 25) continue;
        
        if (Math.random() < 0.8) {
          const multiplier = randomInt(10, 30);
          total = ratioSum * multiplier;
        } else {
          const multiplier = randomInt(10, 30) + 0.5;
          total = ratioSum * multiplier;
        }
      }

      const allEqual = ratioParts.every(p => p === ratioParts[0]);
      if (allEqual) continue;

      const ratioHCF = findHCF(ratioParts);
      if (ratioHCF > 1) continue;

      partValue = total / ratioSum;
      const shares = ratioParts.map(p => p * partValue);

      if (total < 20 || total > 500) continue;

      let actualQuestionType = shareQuestionType;
      if (shareQuestionType === 'mixed') {
        actualQuestionType = randomChoice(['personA', 'personB', 'both']);
      }

      const displayText = names.length === 2
        ? `${names[0]} and ${names[1]} share ${formatCurrency(total)} in the ratio ${ratioParts.join(':')}.${
            actualQuestionType === 'personA' ? ` What is ${names[0]}'s share?` :
            actualQuestionType === 'personB' ? ` What is ${names[1]}'s share?` :
            ' Find both shares.'
          }`
        : `${names[0]}, ${names[1]} and ${names[2]} share ${formatCurrency(total)} in the ratio ${ratioParts.join(':')}.${
            actualQuestionType === 'personA' ? ` What is ${names[0]}'s share?` :
            actualQuestionType === 'personB' ? ` What is ${names[1]}'s share?` :
            ' Find all shares.'
          }`;

      let answerText;
      if (actualQuestionType === 'personA') {
        answerText = `${names[0]}: ${formatCurrency(shares[0])}`;
      } else if (actualQuestionType === 'personB') {
        answerText = `${names[1]}: ${formatCurrency(shares[1])}`;
      } else {
        answerText = shares.map((s, i) => `${names[i]}: ${formatCurrency(s)}`).join(', ');
      }

      return {
        display: displayText,
        answer: answerText,
        ratio: ratioParts.join(':'),
        ratioParts: ratioParts,
        total: total,
        ratioSum: ratioSum,
        partValue: partValue,
        shares: shares,
        questionType: actualQuestionType,
        working: generateSharingWorking(ratioParts, total, ratioSum, partValue, shares, actualQuestionType, names, useAlgebraicMethod),
        names: names
      };
    }

    const fallbackNames = getRandomNames(2);
    return {
      display: `${fallbackNames[0]} and ${fallbackNames[1]} share £90 in the ratio 1:2. What is ${fallbackNames[0]}'s share?`,
      answer: `${fallbackNames[0]}: £30`,
      ratio: '1:2',
      ratioParts: [1, 2],
      total: 90,
      ratioSum: 3,
      partValue: 30,
      shares: [30, 60],
      questionType: 'personA',
      working: generateSharingWorking([1, 2], 90, 3, 30, [30, 60], 'personA', fallbackNames, useAlgebraicMethod),
      names: fallbackNames
    };
  };

  const generateKnownAmountsWorking = (ratioParts, knownAmount, knownPerson, partValue, shares, total, questionType, names, useBarModel = true) => {
    if (useBarModel) {
      const steps = [];
      const otherPerson = knownPerson === 0 ? 1 : 0;
      
      steps.push({
        type: 'barModelKnown',
        bars: [
          { person: names[0], boxes: ratioParts[0], isKnown: knownPerson === 0, knownAmount: knownPerson === 0 ? knownAmount : null },
          { person: names[1], boxes: ratioParts[1], isKnown: knownPerson === 1, knownAmount: knownPerson === 1 ? knownAmount : null }
        ]
      });

      steps.push({
        type: 'identifyRatioPart',
        knownPerson: names[knownPerson],
        ratioPart: ratioParts[knownPerson]
      });

      steps.push({
        type: 'calculatePartValue',
        knownAmount: knownAmount,
        ratioPart: ratioParts[knownPerson],
        partValue: partValue
      });

      steps.push({
        type: 'barModelFilled',
        bars: [
          { person: names[0], boxes: ratioParts[0], value: partValue, total: shares[0] },
          { person: names[1], boxes: ratioParts[1], value: partValue, total: shares[1] }
        ]
      });

      if (questionType === 'total') {
        steps.push({
          type: 'calculateTotalFromBar',
          shares: shares,
          total: total,
          names: names
        });
      } else if (questionType === 'other') {
        steps.push({
          type: 'readOtherFromBar',
          otherPerson: names[otherPerson],
          share: shares[otherPerson]
        });
      }

      steps.push({
        type: 'answer',
        questionType: questionType,
        shares: shares,
        total: total,
        names: names,
        knownPerson: knownPerson
      });

      return steps;
    } else {
      const steps = [];
      
      steps.push({
        type: 'showGiven',
        knownPerson: names[knownPerson],
        knownAmount: knownAmount,
        ratio: ratioParts.join(':'),
        names: names
      });

      steps.push({
        type: 'identifyRatioPart',
        knownPerson: names[knownPerson],
        ratioPart: ratioParts[knownPerson]
      });

      steps.push({
        type: 'calculatePartValue',
        knownAmount: knownAmount,
        ratioPart: ratioParts[knownPerson],
        partValue: partValue
      });

      if (questionType === 'total') {
        steps.push({
          type: 'calculateTotal',
          parts: ratioParts,
          names: names,
          partValue: partValue,
          shares: shares,
          total: total
        });
      } else if (questionType === 'other') {
        const otherPerson = knownPerson === 0 ? 1 : 0;
        steps.push({
          type: 'calculateOther',
          otherPerson: names[otherPerson],
          ratioPart: ratioParts[otherPerson],
          partValue: partValue,
          share: shares[otherPerson]
        });
      }

      steps.push({
        type: 'answer',
        questionType: questionType,
        shares: shares,
        total: total,
        names: names,
        knownPerson: knownPerson
      });

      return steps;
    }
  };

  const generateKnownAmountsQuestion = (diff) => {
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      attempts++;

      const names = getRandomNames(2);
      let ratioParts = [];
      let partValue;
      let knownPerson;

      if (diff === 'level1') {
        const options = [[1,2], [1,3], [2,3], [1,4], [3,4], [1,5], [2,5], [3,5], [4,5]];
        ratioParts = randomChoice(options);
        knownPerson = Math.random() < 0.5 ? 0 : 1;
        partValue = randomInt(2, 10);
      } else if (diff === 'level2') {
        ratioParts = [randomInt(1, 7), randomInt(1, 7)];
        if (findHCF(ratioParts) > 1) continue;
        
        if (ratioParts[0] === 1 && ratioParts[1] === 1) continue;
        if (ratioParts[0] === 1) {
          knownPerson = 1;
        } else if (ratioParts[1] === 1) {
          knownPerson = 0;
        } else {
          knownPerson = Math.random() < 0.5 ? 0 : 1;
        }
        
        partValue = randomInt(5, 25);
      } else {
        ratioParts = [randomInt(5, 15), randomInt(5, 15)];
        if (findHCF(ratioParts) > 1) continue;
        if (Math.abs(ratioParts[0] - ratioParts[1]) < 2) continue;
        knownPerson = Math.random() < 0.5 ? 0 : 1;
        partValue = randomInt(3, 20);
      }

      const allEqual = ratioParts.every(p => p === ratioParts[0]);
      if (allEqual) continue;

      const knownAmount = ratioParts[knownPerson] * partValue;
      
      const shares = ratioParts.map(p => p * partValue);
      const total = shares.reduce((a, b) => a + b, 0);

      if (diff === 'level1') {
        if (knownAmount >= 50 || total >= 50) continue;
      }

      if (knownAmount < 10 || knownAmount > 400) continue;
      if (total < 20 || total > 600) continue;

      let actualQuestionType = knownAmountsQuestionType;
      if (knownAmountsQuestionType === 'mixed') {
        actualQuestionType = randomChoice(['total', 'other']);
      }

      const otherPerson = knownPerson === 0 ? 1 : 0;
      
      let displayText = `${names[0]} and ${names[1]} share money in the ratio ${ratioParts.join(':')}. `;
      displayText += `${names[knownPerson]} receives ${formatCurrency(knownAmount)}. `;
      
      if (actualQuestionType === 'total') {
        displayText += `What is the total amount shared?`;
      } else if (actualQuestionType === 'other') {
        displayText += `How much does ${names[otherPerson]} receive?`;
      }

      let answerText;
      if (actualQuestionType === 'total') {
        answerText = `Total: ${formatCurrency(total)}`;
      } else if (actualQuestionType === 'other') {
        answerText = `${names[otherPerson]}: ${formatCurrency(shares[otherPerson])}`;
      }

      const shouldUseBarModel = diff !== 'level3' && !useNumericalMethod;

      return {
        display: displayText,
        answer: answerText,
        ratio: ratioParts.join(':'),
        ratioParts: ratioParts,
        knownAmount: knownAmount,
        knownPerson: knownPerson,
        partValue: partValue,
        shares: shares,
        total: total,
        questionType: actualQuestionType,
        working: generateKnownAmountsWorking(ratioParts, knownAmount, knownPerson, partValue, shares, total, actualQuestionType, names, shouldUseBarModel),
        names: names
      };
    }

    const fallbackNames = getRandomNames(2);
    const shouldUseBarModel = diff !== 'level3' && !useNumericalMethod;
    return {
      display: `${fallbackNames[0]} and ${fallbackNames[1]} share money in the ratio 2:3. ${fallbackNames[0]} receives £40. What is the total amount shared?`,
      answer: 'Total: £100',
      ratio: '2:3',
      ratioParts: [2, 3],
      knownAmount: 40,
      knownPerson: 0,
      partValue: 20,
      shares: [40, 60],
      total: 100,
      questionType: 'total',
      working: generateKnownAmountsWorking([2, 3], 40, 0, 20, [40, 60], 100, 'total', fallbackNames, shouldUseBarModel),
      names: fallbackNames
    };
  };

  const generateDifferenceWorking = (ratioParts, difference, largerPerson, partValue, shares, total, questionType, names, useBarModel = true) => {
    if (useBarModel) {
      const steps = [];
      const smallerPerson = largerPerson === 0 ? 1 : 0;
      
      steps.push({
        type: 'barModelDifference',
        bars: [
          { person: names[0], boxes: ratioParts[0] },
          { person: names[1], boxes: ratioParts[1] }
        ],
        difference: difference,
        largerPerson: largerPerson
      });

      steps.push({
        type: 'identifyDifferenceParts',
        difference: difference,
        partDifference: Math.abs(ratioParts[1] - ratioParts[0])
      });

      steps.push({
        type: 'calculatePartValueFromDifference',
        difference: difference,
        partDifference: Math.abs(ratioParts[1] - ratioParts[0]),
        partValue: partValue
      });

      steps.push({
        type: 'barModelFilled',
        bars: [
          { person: names[0], boxes: ratioParts[0], value: partValue, total: shares[0] },
          { person: names[1], boxes: ratioParts[1], value: partValue, total: shares[1] }
        ]
      });

      if (questionType === 'total') {
        steps.push({
          type: 'calculateTotalFromBar',
          shares: shares,
          total: total,
          names: names
        });
      } else if (questionType === 'personA') {
        steps.push({
          type: 'readPersonAFromBar',
          person: names[0],
          share: shares[0]
        });
      } else if (questionType === 'personB') {
        steps.push({
          type: 'readPersonBFromBar',
          person: names[1],
          share: shares[1]
        });
      }

      steps.push({
        type: 'answerDifference',
        questionType: questionType,
        shares: shares,
        total: total,
        names: names
      });

      return steps;
    } else {
      const steps = [];
      
      steps.push({
        type: 'showGivenDifference',
        names: names,
        ratio: ratioParts.join(':'),
        difference: difference,
        largerPerson: largerPerson
      });

      steps.push({
        type: 'identifyDifferenceParts',
        difference: difference,
        partDifference: Math.abs(ratioParts[1] - ratioParts[0])
      });

      steps.push({
        type: 'calculatePartValueFromDifference',
        difference: difference,
        partDifference: Math.abs(ratioParts[1] - ratioParts[0]),
        partValue: partValue
      });

      if (questionType === 'total') {
        steps.push({
          type: 'calculateTotal',
          parts: ratioParts,
          names: names,
          partValue: partValue,
          shares: shares,
          total: total
        });
      } else if (questionType === 'personA') {
        steps.push({
          type: 'calculatePersonA',
          person: names[0],
          ratioPart: ratioParts[0],
          partValue: partValue,
          share: shares[0]
        });
      } else if (questionType === 'personB') {
        steps.push({
          type: 'calculatePersonB',
          person: names[1],
          ratioPart: ratioParts[1],
          partValue: partValue,
          share: shares[1]
        });
      }

      steps.push({
        type: 'answerDifference',
        questionType: questionType,
        shares: shares,
        total: total,
        names: names
      });

      return steps;
    }
  };

  const generateDifferenceQuestion = (diff) => {
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      attempts++;

      const names = getRandomNames(2);
      let ratioParts = [];
      let partValue;

      if (diff === 'level1') {
        const options = [[1,2], [1,3], [2,3], [1,4], [3,4], [2,5], [3,5]];
        ratioParts = randomChoice(options);
        partValue = randomInt(3, 12);
      } else if (diff === 'level2') {
        ratioParts = [randomInt(1, 8), randomInt(1, 8)];
        if (findHCF(ratioParts) > 1) continue;
        if (Math.abs(ratioParts[0] - ratioParts[1]) < 1) continue;
        partValue = randomInt(5, 20);
      } else {
        ratioParts = [randomInt(3, 12), randomInt(3, 12)];
        if (findHCF(ratioParts) > 1) continue;
        if (Math.abs(ratioParts[0] - ratioParts[1]) < 2) continue;
        partValue = randomInt(4, 25);
      }

      const allEqual = ratioParts.every(p => p === ratioParts[0]);
      if (allEqual) continue;

      const shares = ratioParts.map(p => p * partValue);
      const difference = Math.abs(shares[1] - shares[0]);
      const total = shares.reduce((a, b) => a + b, 0);
      const largerPerson = shares[0] > shares[1] ? 0 : 1;

      if (diff === 'level1') {
        if (difference >= 50 || total >= 100) continue;
      }

      if (difference < 5 || difference > 400) continue;
      if (total < 20 || total > 700) continue;

      let actualQuestionType = differenceQuestionType;
      if (differenceQuestionType === 'mixed') {
        actualQuestionType = randomChoice(['total', 'personA', 'personB']);
      }

      const smallerPerson = largerPerson === 0 ? 1 : 0;
      
      const wordingStyle = randomInt(1, 3);
      let comparisonText;
      
      if (wordingStyle === 1) {
        comparisonText = `${names[largerPerson]} receives ${formatCurrency(difference)} more than ${names[smallerPerson]}`;
      } else if (wordingStyle === 2) {
        comparisonText = `${names[smallerPerson]} receives ${formatCurrency(difference)} less than ${names[largerPerson]}`;
      } else {
        comparisonText = `The difference in amounts is ${formatCurrency(difference)}`;
      }
      
      let displayText = `${names[0]} and ${names[1]} share money in the ratio ${ratioParts.join(':')}. `;
      displayText += `${comparisonText}. `;
      
      if (actualQuestionType === 'total') {
        displayText += `What is the total amount shared?`;
      } else if (actualQuestionType === 'personA') {
        displayText += `How much does ${names[0]} receive?`;
      } else if (actualQuestionType === 'personB') {
        displayText += `How much does ${names[1]} receive?`;
      }

      let answerText;
      if (actualQuestionType === 'total') {
        answerText = `Total: ${formatCurrency(total)}`;
      } else if (actualQuestionType === 'personA') {
        answerText = `${names[0]}: ${formatCurrency(shares[0])}`;
      } else if (actualQuestionType === 'personB') {
        answerText = `${names[1]}: ${formatCurrency(shares[1])}`;
      }

      const shouldUseBarModel = diff !== 'level3' && !useDifferenceNumericalMethod;

      return {
        display: displayText,
        answer: answerText,
        ratio: ratioParts.join(':'),
        ratioParts: ratioParts,
        difference: difference,
        largerPerson: largerPerson,
        partValue: partValue,
        shares: shares,
        total: total,
        questionType: actualQuestionType,
        working: generateDifferenceWorking(ratioParts, difference, largerPerson, partValue, shares, total, actualQuestionType, names, shouldUseBarModel),
        names: names
      };
    }

    const fallbackNames = getRandomNames(2);
    const shouldUseBarModel = diff !== 'level3' && !useDifferenceNumericalMethod;
    return {
      display: `${fallbackNames[0]} and ${fallbackNames[1]} share money in the ratio 2:3. The difference in amounts is £20. What is the total amount shared?`,
      answer: 'Total: £100',
      ratio: '2:3',
      ratioParts: [2, 3],
      difference: 20,
      largerPerson: 1,
      partValue: 20,
      shares: [40, 60],
      total: 100,
      questionType: 'total',
      working: generateDifferenceWorking([2, 3], 20, 1, 20, [40, 60], 100, 'total', fallbackNames, shouldUseBarModel),
      names: fallbackNames
    };
  };

  const generateMixedSharingQuestion = (level) => {
    const questionTypes = ['sharing', 'known', 'difference'];
    const selectedType = randomChoice(questionTypes);
    
    let question;
    
    if (selectedType === 'sharing') {
      const sharingQuestion = generateSharingQuestion(level);
      if (sharingQuestion.ratioParts && sharingQuestion.ratioParts.length > 2) {
        let attempts = 0;
        while (attempts < 10) {
          const newQ = generateSharingQuestion(level);
          if (newQ.ratioParts.length === 2) {
            question = newQ;
            break;
          }
          attempts++;
        }
        if (!question) question = sharingQuestion;
      } else {
        question = sharingQuestion;
      }
      question.mixedType = 'sharing';
    } else if (selectedType === 'known') {
      question = generateKnownAmountsQuestion(level);
      question.mixedType = 'known';
    } else {
      question = generateDifferenceQuestion(level);
      question.mixedType = 'difference';
    }
    
    return question;
  };

  const generateQuestion = (level) => {
    if (topic === 'simplifying') {
      return generateSimplifyingQuestion(level);
    } else if (topic === 'sharing') {
      return generateSharingQuestion(level);
    } else if (topic === 'known') {
      return generateKnownAmountsQuestion(level);
    } else if (topic === 'difference') {
      return generateDifferenceQuestion(level);
    } else {
      return generateMixedSharingQuestion(level);
    }
  };

  const handleNewQuestion = () => {
    setQuestion(generateQuestion(difficulty));
    setShowAnswer(false);
    setShowWhiteboardAnswer(false);
  };

  const handleGenerateWorksheet = () => {
    const questions = [];
    const usedKeys = new Set();
    
    const generateUniqueQuestion = (level) => {
      let attempts = 0;
      const maxAttempts = 100;
      
      while (attempts < maxAttempts) {
        const q = generateQuestion(level);
        const uniqueKey = q.display;
        
        if (!usedKeys.has(uniqueKey)) {
          usedKeys.add(uniqueKey);
          return q;
        }
        
        attempts++;
      }
      
      return generateQuestion(level);
    };
    
    if (isDifferentiated) {
      ['level1', 'level2', 'level3'].forEach(lvl => {
        for (let i = 0; i < numQuestions; i++) {
          questions.push({ ...generateUniqueQuestion(lvl), difficulty: lvl });
        }
      });
    } else {
      for (let i = 0; i < numQuestions; i++) {
        questions.push({ ...generateUniqueQuestion(difficulty), difficulty });
      }
    }
    
    setWorksheet(questions);
    setShowWorksheetAnswers(false);
  };

  useEffect(() => {
    if ((mode === 'single' || mode === 'whiteboard') && !question) {
      handleNewQuestion();
    }
  }, [mode]);

  useEffect(() => {
    if ((mode === 'single' || mode === 'whiteboard') && question) {
      handleNewQuestion();
    }
  }, [difficulty, topic, includeThreePart]);

  useEffect(() => {
    if (mode === 'single' && question && (topic === 'sharing' || topic === 'known' || topic === 'difference' || topic === 'mixed')) {
      handleNewQuestion();
    }
  }, [shareQuestionType, useAlgebraicMethod, knownAmountsQuestionType, useNumericalMethod, differenceQuestionType, useDifferenceNumericalMethod]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8 text-purple-900">Ratio Practice</h1>

        {/* Topic Selector */}
        <div className="flex justify-center gap-3 flex-wrap mb-6">
          <button
            onClick={() => setTopic('simplifying')}
            className={'px-8 py-4 rounded-xl font-bold text-xl transition-all ' + 
              (topic === 'simplifying' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-white text-purple-600 border-2 border-purple-300 shadow')}>
            Simplifying Ratios
          </button>
          <button
            onClick={() => setTopic('sharing')}
            className={'px-8 py-4 rounded-xl font-bold text-xl transition-all ' + 
              (topic === 'sharing' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-white text-purple-600 border-2 border-purple-300 shadow')}>
            Sharing in a Ratio
          </button>
          <button
            onClick={() => setTopic('known')}
            className={'px-8 py-4 rounded-xl font-bold text-xl transition-all ' + 
              (topic === 'known' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-white text-purple-600 border-2 border-purple-300 shadow')}>
            Known Amounts
          </button>
          <button
            onClick={() => setTopic('difference')}
            className={'px-8 py-4 rounded-xl font-bold text-xl transition-all ' + 
              (topic === 'difference' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-white text-purple-600 border-2 border-purple-300 shadow')}>
            Given Difference
          </button>
          <button
            onClick={() => setTopic('mixed')}
            className={'px-8 py-4 rounded-xl font-bold text-xl transition-all ' + 
              (topic === 'mixed' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-white text-purple-600 border-2 border-purple-300 shadow')}>
            Mixed Sharing
          </button>
        </div>

        {/* Dividing Line 1 */}
        <div className="flex justify-center mb-8">
          <div style={{width: '90%', height: '1px', backgroundColor: '#d1d5db'}}></div>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => setMode('whiteboard')}
            className={'px-8 py-4 rounded-xl font-bold text-xl transition-all ' + 
              (mode === 'whiteboard' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-white text-purple-600 shadow')}>
            Whiteboard
          </button>
          
          <button 
            onClick={() => setMode('single')}
            className={'px-8 py-4 rounded-xl font-bold text-xl transition-all ' + 
              (mode === 'single' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-white text-purple-600 shadow')}>
            Single Q
          </button>
          
          <button 
            onClick={() => setMode('worksheet')}
            className={'px-8 py-4 rounded-xl font-bold text-xl transition-all ' + 
              (mode === 'worksheet' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-white text-purple-600 shadow')}>
            Worksheet
          </button>
        </div>

        {/* WHITEBOARD & SINGLE Q MODES */}
        {(mode === 'whiteboard' || mode === 'single') && (
          <div className="flex flex-col gap-4">
            {/* Compact Control Bar - IDENTICAL FOR BOTH MODES */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between">
                {/* Difficulty Buttons */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-600">Difficulty:</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setDifficulty('level1')}
                      className={'px-4 py-2 rounded-lg font-bold text-sm w-24 ' + 
                        (difficulty === 'level1' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-white text-green-600 border-2 border-green-600')}>
                      Level 1
                    </button>
                    <button 
                      onClick={() => setDifficulty('level2')}
                      className={'px-4 py-2 rounded-lg font-bold text-sm w-24 ' + 
                        (difficulty === 'level2' 
                          ? 'bg-yellow-600 text-white' 
                          : 'bg-white text-yellow-600 border-2 border-yellow-600')}>
                      Level 2
                    </button>
                    <button 
                      onClick={() => setDifficulty('level3')}
                      className={'px-4 py-2 rounded-lg font-bold text-sm w-24 ' + 
                        (difficulty === 'level3' 
                          ? 'bg-red-600 text-white' 
                          : 'bg-white text-red-600 border-2 border-red-600')}>
                      Level 3
                    </button>
                  </div>
                </div>
                
                {/* Stacked Options */}
                <div className="flex flex-col gap-1">
                  {topic !== 'known' && topic !== 'difference' && topic !== 'mixed' && (
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                      <input type="checkbox" checked={includeThreePart}
                        onChange={(e) => setIncludeThreePart(e.target.checked)}
                        className="w-3 h-3" />
                      3-part
                    </label>
                  )}
                  {topic === 'sharing' && (
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                      <input type="checkbox" checked={useAlgebraicMethod}
                        onChange={(e) => setUseAlgebraicMethod(e.target.checked)}
                        className="w-3 h-3" />
                      Numerical
                    </label>
                  )}
                  {topic === 'known' && difficulty !== 'level3' && (
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                      <input type="checkbox" checked={useNumericalMethod}
                        onChange={(e) => setUseNumericalMethod(e.target.checked)}
                        className="w-3 h-3" />
                      Numerical
                    </label>
                  )}
                  {topic === 'difference' && difficulty !== 'level3' && (
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                      <input type="checkbox" checked={useDifferenceNumericalMethod}
                        onChange={(e) => setUseDifferenceNumericalMethod(e.target.checked)}
                        className="w-3 h-3" />
                      Numerical
                    </label>
                  )}
                  {topic === 'mixed' && difficulty !== 'level3' && (
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                      <input type="checkbox" checked={useNumericalMethod || useDifferenceNumericalMethod}
                        onChange={(e) => {
                          setUseNumericalMethod(e.target.checked);
                          setUseDifferenceNumericalMethod(e.target.checked);
                        }}
                        className="w-3 h-3" />
                      Numerical
                    </label>
                  )}
                </div>
                
                {/* Dropdowns */}
                <div className="flex flex-col gap-1">
                  {topic === 'sharing' && (
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-gray-600">Type:</label>
                      <select value={shareQuestionType}
                        onChange={(e) => setShareQuestionType(e.target.value)}
                        className="px-2 py-1 border-2 border-gray-300 rounded-lg text-xs font-semibold">
                        <option value="mixed">Mixed</option>
                        <option value="personA">Person A</option>
                        <option value="personB">Person B</option>
                        <option value="both">Both</option>
                      </select>
                    </div>
                  )}
                  {topic === 'known' && (
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-gray-600">Type:</label>
                      <select value={knownAmountsQuestionType}
                        onChange={(e) => setKnownAmountsQuestionType(e.target.value)}
                        className="px-2 py-1 border-2 border-gray-300 rounded-lg text-xs font-semibold">
                        <option value="mixed">Mixed</option>
                        <option value="total">Total</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  )}
                  {topic === 'difference' && (
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-gray-600">Type:</label>
                      <select value={differenceQuestionType}
                        onChange={(e) => setDifferenceQuestionType(e.target.value)}
                        className="px-2 py-1 border-2 border-gray-300 rounded-lg text-xs font-semibold">
                        <option value="mixed">Mixed</option>
                        <option value="total">Total</option>
                        <option value="personA">Person A</option>
                        <option value="personB">Person B</option>
                      </select>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={handleNewQuestion}
                    className="px-6 py-2 bg-purple-600 text-white rounded-xl font-bold text-base shadow-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 w-52">
                    <RefreshCw size={18} />
                    New Question
                  </button>
                  <button 
                    onClick={() => mode === 'whiteboard' ? setShowWhiteboardAnswer(!showWhiteboardAnswer) : setShowAnswer(!showAnswer)}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-base shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 w-52">
                    <Eye size={18} />
                    {(mode === 'whiteboard' ? showWhiteboardAnswer : showAnswer) ? 'Hide Answer' : 'Show Answer'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Question Display */}
            {question && (
              <div className="bg-white rounded-xl shadow-2xl p-8">
                {mode === 'whiteboard' ? (
                  <>
                    {!showWhiteboardAnswer ? (
                      <div className="text-6xl font-bold text-center text-purple-900 mb-6">
                        {question.display}
                      </div>
                    ) : (
                      <div className="text-6xl font-bold text-center text-emerald-600 mb-6">
                        {question.answer}
                      </div>
                    )}
                    
                    {/* 500px Annotation Workspace */}
                    <div className="bg-gray-100 rounded-xl" style={{height: '500px'}}></div>
                  </>
                ) : (
                  <>
                    <div className="text-6xl font-bold text-center text-purple-900 mb-8">
                      {question.display}
                    </div>
                    
                    {showAnswer && question.working && (
                      <div className="mt-8 space-y-6">
                        <h3 className="text-3xl font-bold text-emerald-700 mb-6 text-center">Solution:</h3>

                        {question.working.map((step, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-6">
                            {step.type === 'original' && (
                              <div className="text-center">
                                <h4 className="text-xl font-semibold text-gray-700 mb-3">Original Ratio</h4>
                                <div className="text-5xl font-bold text-indigo-700">{step.ratio.join(':')}</div>
                              </div>
                            )}

                            {step.type === 'step' && (
                              <div className="text-center">
                                <div className="text-3xl text-gray-500 mb-2">↓ (÷{step.dividedBy})</div>
                                <div className="text-5xl font-bold text-purple-700">{step.ratio.join(':')}</div>
                              </div>
                            )}

                            {step.type === 'final' && (
                              <div className="text-center">
                                <h4 className="text-xl font-semibold text-gray-700 mb-3">Simplified Ratio</h4>
                                <div className="text-5xl font-bold text-emerald-700 bg-emerald-50 p-6 rounded-lg">{step.answer}</div>
                              </div>
                            )}

                            {step.type === 'showRatio' && (
                              <div className="text-center">
                                <h4 className="text-xl font-semibold text-gray-700 mb-3">Ratio:</h4>
                                <div className="text-3xl font-medium text-indigo-700">
                                  {step.names.map((name, i) => (
                                    <span key={i}>{i > 0 && ' : '}{name} = {step.parts[i]}</span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {step.type === 'explainParts' && (
                              <div className="text-center">
                                <h4 className="text-xl font-semibold text-gray-700 mb-3">Understanding the parts:</h4>
                                <div className="space-y-2">
                                  {step.names.map((name, i) => (
                                    <div key={i} className="text-2xl font-medium text-purple-600">
                                      {name} gets {step.parts[i]} part{step.parts[i] !== 1 ? 's' : ''}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {step.type === 'ratioSum' && (
                              <div className="text-center">
                                <h4 className="text-xl font-semibold text-gray-700 mb-3">Total number of parts:</h4>
                                <div className="text-3xl font-medium text-purple-700">
                                  {step.parts.map((p, i) => (
                                    <span key={i}>{i > 0 && ' + '}{p}</span>
                                  ))} = {step.sum} parts
                                </div>
                              </div>
                            )}

                            {step.type === 'partValue' && (
                              <div className="text-center">
                                <h4 className="text-xl font-semibold text-gray-700 mb-3">Value of 1 part:</h4>
                                <div className="text-3xl font-medium text-blue-700">
                                  {formatCurrency(step.total)} ÷ {step.sum} = {formatCurrency(step.value)}
                                </div>
                              </div>
                            )}

                            {step.type === 'calculateShares' && (
                              <div className="text-center">
                                <h4 className="text-xl font-semibold text-gray-700 mb-4">Calculate each share:</h4>
                                <div className="space-y-3">
                                  {step.names.map((name, i) => (
                                    <div key={i} className="text-2xl font-medium text-blue-600">
                                      {name}: {step.parts[i]} × {formatCurrency(step.partValue)} = {formatCurrency(step.shares[i])}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {step.type === 'verifyTotal' && (
                              <div className="text-center">
                                <h4 className="text-xl font-semibold text-gray-700 mb-3">Check (optional):</h4>
                                <div className="text-2xl font-medium text-green-600">
                                  {step.shares.map((s) => formatCurrency(s)).join(' + ')} = {formatCurrency(step.total)} ✓
                                </div>
                              </div>
                            )}

                            {step.type === 'barModelEmpty' && (
                              <div>
                                <h4 className="text-xl font-semibold text-gray-700 mb-4 text-center">Bar Model:</h4>
                                <div className="flex flex-col gap-3 items-start" style={{ marginLeft: '25%' }}>
                                  {step.bars.map((bar, i) => (
                                    <div key={i} className="flex items-center">
                                      <div className="w-32 text-2xl font-bold text-indigo-900 text-left flex-shrink-0">{bar.person}</div>
                                      <div className="flex gap-1">
                                        {Array(bar.boxes).fill(0).map((_, boxIdx) => (
                                          <div key={boxIdx} className="w-20 h-20 border-4 border-indigo-400 bg-white rounded flex-shrink-0"></div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {step.type === 'totalParts' && (
                              <div className="text-center">
                                <h4 className="text-xl font-semibold text-gray-700 mb-3">Total parts:</h4>
                                <div className="text-3xl font-medium text-purple-700">{step.sum} parts</div>
                              </div>
                            )}

                            {step.type === 'barModelFilled' && (
                              <div>
                                <h4 className="text-xl font-semibold text-gray-700 mb-4 text-center">Calculate shares:</h4>
                                <div className="flex flex-col gap-3 items-start" style={{ marginLeft: '25%' }}>
                                  {step.bars.map((bar, i) => (
                                    <div key={i} className="flex items-center">
                                      <div className="w-32 text-2xl font-bold text-indigo-900 text-left flex-shrink-0">{bar.person}</div>
                                      <div className="flex gap-1">
                                        {Array(bar.boxes).fill(0).map((_, boxIdx) => (
                                          <div key={boxIdx} className="w-20 h-20 border-4 border-emerald-400 bg-emerald-100 rounded flex items-center justify-center text-xs font-bold text-emerald-800 flex-shrink-0">
                                            {formatCurrency(bar.value)}
                                          </div>
                                        ))}
                                      </div>
                                      <span className="text-2xl font-bold text-emerald-700 ml-4">= {formatCurrency(bar.total)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {step.type === 'answer' && (
                              <div className="text-center">
                                <h4 className="text-xl font-semibold text-gray-700 mb-3">Answer:</h4>
                                <div className="text-5xl font-bold text-emerald-700 bg-emerald-50 p-6 rounded-lg">
                                  {step.questionType === 'personA' && `${step.names[0]}: ${formatCurrency(step.shares[0])}`}
                                  {step.questionType === 'personB' && `${step.names[1]}: ${formatCurrency(step.shares[1])}`}
                                  {step.questionType === 'both' && (
                                    <div className="flex flex-col gap-2">
                                      {step.shares.map((share, i) => (
                                        <div key={i}>{step.names[i]}: {formatCurrency(share)}</div>
                                      ))}
                                    </div>
                                  )}
                                  {step.questionType === 'total' && `Total: ${formatCurrency(step.total)}`}
                                  {step.questionType === 'other' && `${step.names[step.knownPerson === 0 ? 1 : 0]}: ${formatCurrency(step.shares[step.knownPerson === 0 ? 1 : 0])}`}
                                </div>
                              </div>
                            )}

                            {step.type === 'showGiven' && (
                              <div className="text-center">
                                <h4 className="text-2xl font-semibold text-gray-700 mb-4">Given information:</h4>
                                <div className="space-y-3 bg-indigo-50 p-6 rounded-lg">
                                  <div className="text-3xl font-medium text-indigo-700">
                                    {step.names.join(' : ')} = {step.ratio}
                                  </div>
                                  <div className="text-3xl font-medium text-purple-600">
                                    {step.knownPerson} receives {formatCurrency(step.knownAmount)}
                                  </div>
                                </div>
                              </div>
                            )}

                            {step.type === 'identifyRatioPart' && (
                              <div className="text-center">
                                <h4 className="text-2xl font-semibold text-gray-700 mb-4">Identify the ratio part:</h4>
                                <div className="text-4xl font-bold text-purple-700 bg-purple-50 p-6 rounded-lg">
                                  {step.knownPerson} has {step.ratioPart} part{step.ratioPart !== 1 ? 's' : ''}
                                </div>
                              </div>
                            )}

                            {step.type === 'calculatePartValue' && (
                              <div className="text-center">
                                <h4 className="text-2xl font-semibold text-gray-700 mb-4">Calculate value of 1 part:</h4>
                                <div className="text-4xl font-bold text-blue-700 bg-blue-50 p-6 rounded-lg">
                                  {formatCurrency(step.knownAmount)} ÷ {step.ratioPart} = {formatCurrency(step.partValue)}
                                </div>
                              </div>
                            )}

                            {step.type === 'calculateTotal' && (
                              <div className="text-center">
                                <h4 className="text-2xl font-semibold text-gray-700 mb-4">Calculate total amount:</h4>
                                <div className="space-y-4 bg-green-50 p-6 rounded-lg">
                                  <div className="text-2xl font-medium text-purple-600">
                                    Total parts: {step.parts.join(' + ')} = {step.parts.reduce((a, b) => a + b, 0)}
                                  </div>
                                  <div className="text-4xl font-bold text-green-700">
                                    Total: {step.parts.reduce((a, b) => a + b, 0)} × {formatCurrency(step.partValue)} = {formatCurrency(step.total)}
                                  </div>
                                </div>
                              </div>
                            )}

                            {step.type === 'calculateOther' && (
                              <div className="text-center">
                                <h4 className="text-2xl font-semibold text-gray-700 mb-4">Calculate {step.otherPerson}'s share:</h4>
                                <div className="text-4xl font-bold text-blue-600 bg-blue-50 p-6 rounded-lg">
                                  {step.ratioPart} × {formatCurrency(step.partValue)} = {formatCurrency(step.share)}
                                </div>
                              </div>
                            )}

                            {step.type === 'barModelKnown' && (
                              <div>
                                <h4 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Bar Model - Given information:</h4>
                                <div className="flex flex-col gap-3 items-start" style={{ marginLeft: '25%' }}>
                                  {step.bars.map((bar, i) => (
                                    <div key={i} className="flex items-center">
                                      <div className="w-32 text-2xl font-bold text-indigo-900 text-left flex-shrink-0">{bar.person}</div>
                                      <div className="flex gap-1">
                                        {Array(bar.boxes).fill(0).map((_, boxIdx) => (
                                          <div key={boxIdx} className={`w-20 h-20 border-4 rounded flex-shrink-0 ${
                                            bar.isKnown 
                                              ? 'border-purple-500 bg-purple-100' 
                                              : 'border-gray-400 bg-white'
                                          }`}></div>
                                        ))}
                                      </div>
                                      {bar.isKnown && (
                                        <span className="text-2xl font-bold text-purple-700 ml-4">= {formatCurrency(bar.knownAmount)}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {step.type === 'calculateTotalFromBar' && (
                              <div className="text-center">
                                <h4 className="text-2xl font-semibold text-gray-700 mb-4">Add all parts to find total:</h4>
                                <div className="text-4xl font-bold text-green-700 bg-green-50 p-6 rounded-lg">
                                  {step.shares.map((s) => formatCurrency(s)).join(' + ')} = {formatCurrency(step.total)}
                                </div>
                              </div>
                            )}

                            {step.type === 'readOtherFromBar' && (
                              <div className="text-center">
                                <h4 className="text-2xl font-semibold text-gray-700 mb-4">Read {step.otherPerson}'s share from bar:</h4>
                                <div className="text-4xl font-bold text-blue-700 bg-blue-50 p-6 rounded-lg">
                                  {formatCurrency(step.share)}
                                </div>
                              </div>
                            )}

                            {step.type === 'barModelDifference' && (
                              <div>
                                <h4 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Bar Model - showing the difference:</h4>
                                <div className="flex flex-col gap-3 items-start" style={{ marginLeft: '25%' }}>
                                  {step.bars.map((bar, i) => {
                                    const isLargerPerson = i === step.largerPerson;
                                    const smallerBoxCount = Math.min(step.bars[0].boxes, step.bars[1].boxes);
                                    
                                    return (
                                      <div key={i} className="flex items-center">
                                        <div className="w-32 text-2xl font-bold text-indigo-900 text-left flex-shrink-0">{bar.person}</div>
                                        <div className="flex gap-1">
                                          {Array(bar.boxes).fill(0).map((_, boxIdx) => {
                                            const isDifferenceBox = isLargerPerson && boxIdx >= smallerBoxCount;
                                            return (
                                              <div 
                                                key={boxIdx} 
                                                className={`w-20 h-20 border-4 rounded flex-shrink-0 ${
                                                  isDifferenceBox 
                                                    ? 'border-purple-500 bg-purple-100' 
                                                    : 'border-indigo-400 bg-white'
                                                }`}>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    );
                                  })}
                                  <div className="ml-32 mt-2">
                                    <div className="text-2xl font-bold text-purple-700 bg-purple-100 px-4 py-2 rounded-lg inline-flex items-center gap-2">
                                      <span className="inline-block w-6 h-6 border-4 border-purple-500 bg-purple-100 rounded"></span>
                                      Difference: {formatCurrency(step.difference)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {step.type === 'identifyDifferenceParts' && (
                              <div className="text-center">
                                <h4 className="text-2xl font-semibold text-gray-700 mb-4">The difference represents:</h4>
                                <div className="text-4xl font-bold text-purple-700 bg-purple-50 p-6 rounded-lg">
                                  {step.partDifference} part{step.partDifference !== 1 ? 's' : ''} = {formatCurrency(step.difference)}
                                </div>
                              </div>
                            )}

                            {step.type === 'calculatePartValueFromDifference' && (
                              <div className="text-center">
                                <h4 className="text-2xl font-semibold text-gray-700 mb-4">Calculate value of 1 part:</h4>
                                <div className="text-4xl font-bold text-blue-700 bg-blue-50 p-6 rounded-lg">
                                  {formatCurrency(step.difference)} ÷ {step.partDifference} = {formatCurrency(step.partValue)}
                                </div>
                              </div>
                            )}

                            {step.type === 'readPersonAFromBar' && (
                              <div className="text-center">
                                <h4 className="text-2xl font-semibold text-gray-700 mb-4">Read {step.person}'s share from bar:</h4>
                                <div className="text-4xl font-bold text-blue-700 bg-blue-50 p-6 rounded-lg">
                                  {formatCurrency(step.share)}
                                </div>
                              </div>
                            )}

                            {step.type === 'readPersonBFromBar' && (
                              <div className="text-center">
                                <h4 className="text-2xl font-semibold text-gray-700 mb-4">Read {step.person}'s share from bar:</h4>
                                <div className="text-4xl font-bold text-blue-700 bg-blue-50 p-6 rounded-lg">
                                  {formatCurrency(step.share)}
                                </div>
                              </div>
                            )}

                            {step.type === 'showGivenDifference' && (
                              <div className="text-center">
                                <h4 className="text-2xl font-semibold text-gray-700 mb-4">Given information:</h4>
                                <div className="space-y-3 bg-indigo-50 p-6 rounded-lg">
                                  <div className="text-3xl font-medium text-indigo-700">
                                    {step.names.join(' : ')} = {step.ratio}
                                  </div>
                                  <div className="text-3xl font-medium text-purple-600">
                                    Difference: {formatCurrency(step.difference)}
                                  </div>
                                </div>
                              </div>
                            )}

                            {step.type === 'calculatePersonA' && (
                              <div className="text-center">
                                <h4 className="text-2xl font-semibold text-gray-700 mb-4">Calculate {step.person}'s share:</h4>
                                <div className="text-4xl font-bold text-blue-600 bg-blue-50 p-6 rounded-lg">
                                  {step.ratioPart} × {formatCurrency(step.partValue)} = {formatCurrency(step.share)}
                                </div>
                              </div>
                            )}

                            {step.type === 'calculatePersonB' && (
                              <div className="text-center">
                                <h4 className="text-2xl font-semibold text-gray-700 mb-4">Calculate {step.person}'s share:</h4>
                                <div className="text-4xl font-bold text-blue-600 bg-blue-50 p-6 rounded-lg">
                                  {step.ratioPart} × {formatCurrency(step.partValue)} = {formatCurrency(step.share)}
                                </div>
                              </div>
                            )}

                            {step.type === 'answerDifference' && (
                              <div className="text-center">
                                <h4 className="text-xl font-semibold text-gray-700 mb-3">Answer:</h4>
                                <div className="text-5xl font-bold text-emerald-700 bg-emerald-50 p-6 rounded-lg">
                                  {step.questionType === 'personA' && `${step.names[0]}: ${formatCurrency(step.shares[0])}`}
                                  {step.questionType === 'personB' && `${step.names[1]}: ${formatCurrency(step.shares[1])}`}
                                  {step.questionType === 'total' && `Total: ${formatCurrency(step.total)}`}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* WORKSHEET MODE */}
        {mode === 'worksheet' && (
          <>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="space-y-4">
                {/* First Line: Questions and Differentiated */}
                <div className="flex justify-center items-center gap-6">
                  <div className="flex items-center gap-3">
                    <label className="text-lg font-semibold">Questions per level:</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="20" 
                      value={numQuestions} 
                      onChange={(e) => setNumQuestions(Math.max(1, Math.min(20, parseInt(e.target.value) || 5)))} 
                      className="w-20 px-4 py-2 border-2 border-purple-300 rounded-lg text-lg" 
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="diff" 
                      checked={isDifferentiated} 
                      onChange={(e) => setIsDifferentiated(e.target.checked)} 
                      className="w-5 h-5" 
                    />
                    <label htmlFor="diff" className="text-lg font-semibold">Differentiated</label>
                  </div>
                </div>

                {/* Second Line: Difficulty, Options, and Buttons */}
                <div className="flex justify-between items-center">
                  {!isDifferentiated && (
                    <div className="flex items-center gap-4">
                      <label className="text-lg font-semibold">Difficulty:</label>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setDifficulty('level1')}
                          className={'px-6 py-2 rounded-lg font-semibold ' + 
                            (difficulty === 'level1' ? 'bg-green-600 text-white' : 'bg-gray-200')}>
                          Level 1
                        </button>
                        <button 
                          onClick={() => setDifficulty('level2')}
                          className={'px-6 py-2 rounded-lg font-semibold ' + 
                            (difficulty === 'level2' ? 'bg-yellow-600 text-white' : 'bg-gray-200')}>
                          Level 2
                        </button>
                        <button 
                          onClick={() => setDifficulty('level3')}
                          className={'px-6 py-2 rounded-lg font-semibold ' + 
                            (difficulty === 'level3' ? 'bg-red-600 text-white' : 'bg-gray-200')}>
                          Level 3
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {isDifferentiated && <div></div>}
                  
                  <div className="flex items-center gap-6">
                    {/* Stacked Checkboxes */}
                    {topic !== 'known' && topic !== 'difference' && topic !== 'mixed' && (
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-base font-semibold">
                          <input type="checkbox" checked={includeThreePart}
                            onChange={(e) => setIncludeThreePart(e.target.checked)} className="w-4 h-4" />
                          3-part ratios
                        </label>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button onClick={handleGenerateWorksheet}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-purple-700">
                        Generate
                      </button>
                      {worksheet.length > 0 && (
                        <button onClick={() => setShowWorksheetAnswers(!showWorksheetAnswers)}
                          className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-emerald-700">
                          <Eye size={20} />
                          {showWorksheetAnswers ? 'Hide' : 'Show'} Answers
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {worksheet.length > 0 && (
              <div className="bg-white rounded-xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-purple-900">
                  {topic === 'simplifying' ? 'Simplifying Ratios' : 
                   topic === 'sharing' ? 'Sharing in a Ratio' : 
                   topic === 'known' ? 'Known Amounts' : 
                   topic === 'difference' ? 'Given Difference' :
                   'Mixed Sharing'} Worksheet
                </h2>
                
                {isDifferentiated ? (
                  <div className="grid grid-cols-3 gap-6">
                    {['level1', 'level2', 'level3'].map((lvl, idx) => (
                      <div key={lvl} className={'rounded-xl p-6 border-4 ' +
                        (lvl === 'level1' ? 'bg-green-50 border-green-500' :
                         lvl === 'level2' ? 'bg-yellow-50 border-yellow-500' :
                         'bg-red-50 border-red-500')}>
                        <h3 className={'text-2xl font-bold text-center mb-6 ' + 
                          (lvl === 'level1' ? 'text-green-700' : 
                           lvl === 'level2' ? 'text-yellow-700' : 
                           'text-red-700')}>
                          Level {idx + 1}
                        </h3>
                        <div className="space-y-3">
                          {worksheet.filter(q => q.difficulty === lvl).map((q, i) => (
                            <div key={i} className="text-xl">
                              <span className="font-semibold text-gray-800">{i + 1}.</span>
                              <span className="ml-3 font-bold text-gray-900">
                                {q.display}
                              </span>
                              {showWorksheetAnswers && (
                                <div className="ml-8 text-emerald-700 font-semibold mt-1">
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
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    {worksheet.map((q, i) => (
                      <div key={i} className="text-xl">
                        <span className="font-semibold text-indigo-900">{i + 1}.</span>
                        <span className="ml-2 font-bold text-indigo-900">
                          {q.display}
                        </span>
                        {showWorksheetAnswers && (
                          <span className="ml-3 text-emerald-700 font-semibold">
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
  );
};

export default RatioTool;
