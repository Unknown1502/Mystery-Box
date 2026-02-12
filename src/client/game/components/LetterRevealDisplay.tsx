import { useState, useEffect } from 'react';

interface LetterRevealDisplayProps {
  answer: string;
  revealPercentage: number; // 0-100
  hasUserSolved: boolean;
}

/**
 * Displays the mystery answer with progressive letter reveals
 * Shows blanks with some letters filled in based on reveal percentage
 */
export function LetterRevealDisplay({ 
  answer, 
  revealPercentage, 
  hasUserSolved 
}: LetterRevealDisplayProps) {
  const [revealedLetters, setRevealedLetters] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Get all letter positions (excluding spaces)
    const letterPositions: number[] = [];
    for (let i = 0; i < answer.length; i++) {
      if (answer[i] !== ' ') {
        letterPositions.push(i);
      }
    }

    // Calculate how many letters to reveal based on percentage
    const totalLetters = letterPositions.length;
    const lettersToReveal = Math.floor((revealPercentage / 100) * totalLetters);

    // Strategy: Reveal first letter of each word + random letters
    const revealed = new Set<number>();
    
    // Always reveal first letter of each word
    const words = answer.split(' ');
    let currentIndex = 0;
    words.forEach((word) => {
      if (word.length > 0) {
        revealed.add(currentIndex);
      }
      currentIndex += word.length + 1; // +1 for space
    });

    // Add strategic letters (vowels first for readability)
    const vowels = 'AEIOU';
    const consonants: number[] = [];
    const vowelPositions: number[] = [];
    
    letterPositions.forEach((pos) => {
      if (!revealed.has(pos)) {
        const char = answer[pos];
        if (char && vowels.includes(char)) {
          vowelPositions.push(pos);
        } else {
          consonants.push(pos);
        }
      }
    });

    // Shuffle and select additional letters to reveal
    const shuffleArray = <T,>(array: T[]): T[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
      }
      return shuffled;
    };

    // Reveal vowels first, then consonants
    const additionalToReveal = lettersToReveal - revealed.size;
    const shuffledVowels = shuffleArray(vowelPositions);
    const shuffledConsonants = shuffleArray(consonants);
    const remainingPositions = [...shuffledVowels, ...shuffledConsonants];

    for (let i = 0; i < Math.min(additionalToReveal, remainingPositions.length); i++) {
      revealed.add(remainingPositions[i]!);
    }

    setRevealedLetters(revealed);
  }, [answer, revealPercentage]);

  const renderWord = (word: string, startIndex: number) => {
    return word.split('').map((letter, i) => {
      const globalIndex = startIndex + i;
      const isRevealed = hasUserSolved || revealedLetters.has(globalIndex);
      
      return (
        <span
          key={globalIndex}
          className={`inline-block mx-0.5 transition-all duration-500 transform ${
            isRevealed 
              ? 'text-blue-700 scale-110 animate-pulse-custom opacity-100' 
              : 'text-slate-400 opacity-70'
          }`}
          style={{
            transitionDelay: `${i * 30}ms` // Stagger animation
          }}
        >
          {isRevealed ? (
            <span className="inline-block animate-fade-in font-black">{letter}</span>
          ) : (
            '_'
          )}
        </span>
      );
    });
  };

  const words = answer.split(' ');
  let currentIndex = 0;

  return (
    <div className="text-center">
      <div className="inline-flex flex-wrap justify-center gap-4 text-4xl md:text-5xl font-mono font-bold tracking-wider">
        {words.map((word, wordIndex) => {
          const wordElement = (
            <div 
              key={wordIndex} 
              className={`inline-flex ${hasUserSolved ? 'animate-bounce-subtle' : ''}`}
            >
              {renderWord(word, currentIndex)}
            </div>
          );
          currentIndex += word.length + 1; // +1 for space
          return wordElement;
        })}
      </div>
      
      {/* Letter Count Helper */}
      <div className="mt-6 text-sm text-slate-500 font-mono">
        {words.map((word, i) => (
          <span key={i} className="mx-2">
            ({word.length} {word.length === 1 ? 'letter' : 'letters'})
          </span>
        ))}
      </div>
    </div>
  );
}
