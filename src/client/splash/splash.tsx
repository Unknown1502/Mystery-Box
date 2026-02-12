import '../index.css';

import { context, requestExpandedMode } from '@devvit/web/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

export const Splash = () => {
  return (
    <div className="flex relative flex-col justify-center items-center min-h-screen gap-4 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="text-8xl mb-4 animate-bounce">🎁</div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-bold text-center text-white drop-shadow-lg">
          Reddit Mystery Box
        </h1>
        <p className="text-xl text-center text-purple-200 font-medium">
          Hey {context.username ?? 'Detective'} 🔍
        </p>
        <p className="text-base text-center text-purple-300 max-w-md px-4 leading-relaxed">
          Solve the daily mystery with your community! Each guess reveals more clues. Can you crack
          the code before your guesses run out?
        </p>
      </div>
      <div className="flex items-center justify-center mt-5">
        <button
          className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg font-semibold w-auto h-14 rounded-full cursor-pointer transition-all px-10 shadow-2xl transform hover:scale-105"
          onClick={(e) => requestExpandedMode(e.nativeEvent, 'game')}
        >
          🔓 Unlock Today's Mystery
        </button>
      </div>
      <div className="mt-6 text-center text-sm text-purple-300 max-w-md px-4 space-y-1">
        <p>✨ New mystery daily at midnight UTC</p>
        <p>🎯 3 guesses per day</p>
        <p>🏆 First solver gets the crown</p>
      </div>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
