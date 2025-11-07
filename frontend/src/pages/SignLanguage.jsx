import { useState } from 'react';

const signs = [
  { id: 1, word: 'Hello', video: 'https://example.com/hello.mp4', description: 'Wave hand' },
  { id: 2, word: 'Thank You', video: 'https://example.com/thankyou.mp4', description: 'Touch chin and move hand forward' },
  { id: 3, word: 'Please', video: 'https://example.com/please.mp4', description: 'Rub hand in circles on chest' },
  // Add more signs
];

const SignLanguage = () => {
  const [completed, setCompleted] = useState(new Set());

  const markCompleted = (id) => {
    setCompleted(prev => new Set([...prev, id]));
  };

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8" id="sign-language-heading">Learn Sign Language</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-labelledby="sign-language-heading">
        {signs.map((sign) => (
          <div key={sign.id} className="card p-4">
            <h3 className="text-xl font-semibold mb-2">{sign.word}</h3>
            <p className="text-gray-600 mb-4">{sign.description}</p>
            <video controls className="w-full mb-4" aria-label={`Sign for ${sign.word}`}>
              <source src={sign.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="flex space-x-2">
              <button
                onClick={() => speakWord(sign.word)}
                className="btn flex-1"
                aria-label={`Hear pronunciation of ${sign.word}`}
              >
                Hear Word
              </button>
              {!completed.has(sign.id) && (
                <button
                  onClick={() => markCompleted(sign.id)}
                  className="btn flex-1 bg-accent"
                  aria-label={`Mark ${sign.word} as completed`}
                >
                  Mark Completed
                </button>
              )}
              {completed.has(sign.id) && (
                <span className="flex-1 text-center text-green-600 font-semibold" aria-label={`${sign.word} completed`}>
                  ✓ Completed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignLanguage;