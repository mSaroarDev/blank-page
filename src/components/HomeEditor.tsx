import React, { useState, useEffect, useRef } from 'react';
import Clear from '../assets/icons/clean.png';
import ClearWhite from '../assets/icons/clean-white.png';
import Navbar from './Navbar';
import { useTheme } from '../providers/ThemeProviders';

const HomeEditor: React.FC = () => {
  const [text, setText] = useState<string>('');
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const STORAGE_KEY = 'text-editor-content';

  const { theme } = useTheme();

  useEffect(() => {
    const savedContent = localStorage.getItem(STORAGE_KEY);
    if (savedContent) {
      setText(savedContent);
    }
  }, []);

  const saveContent = () => {
    localStorage.setItem(STORAGE_KEY, text);
  };

  const clearContent = () => {
    setText('');
    localStorage.removeItem(STORAGE_KEY);
    
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  useEffect(() => {
    // Fix: Specify the correct event type
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveContent();
      }
    };

    // This is line 77 that's causing the error
    window.addEventListener('keydown', handleKeyDown as EventListener);
    return () => window.removeEventListener('keydown', handleKeyDown as EventListener);
  }, [text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      const textarea = editorRef.current;
      if (!textarea) return;

      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = text.substring(0, cursorPos);
      const textAfterCursor = text.substring(cursorPos);
      
      const currentLineMatch = textBeforeCursor.split('\n').pop()?.match(/^(\d+)\.\s/);
      
      if (currentLineMatch) {
        e.preventDefault(); 
        
        const currentNumber = parseInt(currentLineMatch[1], 10);
        const nextNumber = currentNumber + 1;
        
        const newText = textBeforeCursor + '\n' + nextNumber + '. ' + textAfterCursor;
        setText(newText);
        
        setTimeout(() => {
          if (textarea) {
            const newPosition = cursorPos + 1 + nextNumber.toString().length + 2; // +1 for newline, +2 for '. '
            textarea.selectionStart = textarea.selectionEnd = newPosition;
            textarea.focus();
          }
        }, 0);
      }
    }
  };

  useEffect(() => {
    saveContent();
  }, [text]);

  return (
    <div className="min-h-screen p-4">
      <div className="">
        <Navbar />

        <div className="p-4 max-w-4xl mx-auto overflow-hidden">
          <div className='flex items-center justify-end'>
            <div className="space-x-2">
              {/* <button
                onClick={copyContent}
                className="p-1 transition cursor-pointer"
              >
                {isCopied ? <Checked /> : <CopyIcon />}
              </button>
              <button
                onClick={saveContent}
                className="p-1 transition cursor-pointer"
              >
                {isSaved ? <Checked /> : <SaveIcon />}
              </button> */}
              <button
                onClick={clearContent}
                className={`py-1 px-2 border border-gray-200 dark:border-gray-800 transition cursor-pointer ${theme === 'light' ? 'hover:bg-gray-300' : 'hover:bg-gray-700'} rounded-md flex items-center space-x-2`}
                title="Clear all text"
              >
                {theme === 'light' ? (
                  <img src={Clear} alt="Clear" className='w-5 h-5' />
                ) : (
                  <img src={ClearWhite} alt="Clear" className='w-5 h-5' />
                )}

                <span className=''>Clear</span>
              </button>
            </div>
          </div>


          <textarea
            ref={editorRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            className="w-full h-[70vh] p-2 font-mono text-md focus:outline-none outline-none resize-none text-gray-950 dark:text-white"
            placeholder="Start typing here..."
          />

          {/* Footer */}
          <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-300 text-center">
            Total characters: {text.length}, Total Words: {text.split(/\s+/).filter(word => word.length > 0).length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeEditor;