'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

// Personality archetypes
type Archetype = 'A' | 'N' | 'T' | 'L' | 'D' | 'C';

interface ArchetypeScores {
  A: number; // Adventurer
  N: number; // Nurturer
  T: number; // Thinker
  L: number; // Leader
  D: number; // Dreamer
  C: number; // Connector
}

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    archetype: Archetype;
  }[];
}

interface PersonalityTestProps {
  onComplete: (personalityType: string, scores: ArchetypeScores) => void;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What would you enjoy most on a free weekend?",
    options: [
      { text: "Road trip / trying something new", archetype: 'A' },
      { text: "Cooking for loved ones / helping a friend", archetype: 'N' },
      { text: "Reading or solving puzzles", archetype: 'T' },
      { text: "Organizing an event / leading a group", archetype: 'L' },
      { text: "Painting, writing, or daydreaming", archetype: 'D' },
      { text: "Hanging out with friends, social gatherings", archetype: 'C' }
    ]
  },
  {
    id: 2,
    question: "When faced with a challenge, you usually...",
    options: [
      { text: "Jump in and figure it out", archetype: 'A' },
      { text: "Ask others and consider feelings", archetype: 'N' },
      { text: "Analyze step by step", archetype: 'T' },
      { text: "Take charge and decide", archetype: 'L' },
      { text: "Look for unique/creative ideas", archetype: 'D' },
      { text: "Discuss with multiple people", archetype: 'C' }
    ]
  },
  {
    id: 3,
    question: "What sounds most appealing as a date?",
    options: [
      { text: "Skydiving, hiking, adventure", archetype: 'A' },
      { text: "Cozy dinner & conversation", archetype: 'N' },
      { text: "Museum or escape room", archetype: 'T' },
      { text: "Fancy restaurant/nightlife", archetype: 'L' },
      { text: "Stargazing/art event", archetype: 'D' },
      { text: "Fun party/concert", archetype: 'C' }
    ]
  },
  {
    id: 4,
    question: "How do you react when there's tension?",
    options: [
      { text: "Crack a joke / shift mood", archetype: 'A' },
      { text: "Listen and reassure", archetype: 'N' },
      { text: "Stay calm, logical", archetype: 'T' },
      { text: "Settle it directly", archetype: 'L' },
      { text: "Write/reflect/express creatively", archetype: 'D' },
      { text: "Talk openly until resolved", archetype: 'C' }
    ]
  },
  {
    id: 5,
    question: "You feel most energized when...",
    options: [
      { text: "Doing thrilling activities", archetype: 'A' },
      { text: "Helping someone", archetype: 'N' },
      { text: "Solving puzzles", archetype: 'T' },
      { text: "Achieving a big goal", archetype: 'L' },
      { text: "Imagining or creating", archetype: 'D' },
      { text: "Being with people", archetype: 'C' }
    ]
  },
  {
    id: 6,
    question: "When traveling, you prefer...",
    options: [
      { text: "Backpacking/adventure", archetype: 'A' },
      { text: "Family/meaningful visits", archetype: 'N' },
      { text: "Cultural tours/planned trips", archetype: 'T' },
      { text: "Luxury/business-like", archetype: 'L' },
      { text: "Artistic/spiritual places", archetype: 'D' },
      { text: "Group trips with friends", archetype: 'C' }
    ]
  },
  {
    id: 7,
    question: "At a party, you are most likely to...",
    options: [
      { text: "Try the craziest activity", archetype: 'A' },
      { text: "Ensure everyone's comfortable", archetype: 'N' },
      { text: "Talk deeply with a few", archetype: 'T' },
      { text: "Lead games, introduce people", archetype: 'L' },
      { text: "Dreamy corner chats", archetype: 'D' },
      { text: "Chat with everyone", archetype: 'C' }
    ]
  },
  {
    id: 8,
    question: "How do you usually make decisions?",
    options: [
      { text: "Quickly, instincts", archetype: 'A' },
      { text: "Based on how it affects others", archetype: 'N' },
      { text: "Weighing pros/cons", archetype: 'T' },
      { text: "Confidently & directly", archetype: 'L' },
      { text: "Guided by feelings/intuition", archetype: 'D' },
      { text: "After asking others", archetype: 'C' }
    ]
  },
  {
    id: 9,
    question: "Which job sounds closest to you?",
    options: [
      { text: "Explorer / Athlete / Blogger", archetype: 'A' },
      { text: "Teacher / Counselor", archetype: 'N' },
      { text: "Scientist / Engineer", archetype: 'T' },
      { text: "CEO / Politician", archetype: 'L' },
      { text: "Artist / Writer", archetype: 'D' },
      { text: "Event Planner / Influencer", archetype: 'C' }
    ]
  },
  {
    id: 10,
    question: "The way you most often show love is...",
    options: [
      { text: "Shared experiences", archetype: 'A' },
      { text: "Caring & support", archetype: 'N' },
      { text: "Giving advice/solutions", archetype: 'T' },
      { text: "Providing/protecting", archetype: 'L' },
      { text: "Creative gestures", archetype: 'D' },
      { text: "Spending time/fun", archetype: 'C' }
    ]
  },
  {
    id: 11,
    question: "You're best at...",
    options: [
      { text: "Funny/adventurous stories", archetype: 'A' },
      { text: "Listening deeply", archetype: 'N' },
      { text: "Explaining things", archetype: 'T' },
      { text: "Motivating others", archetype: 'L' },
      { text: "Dreaming/imagination", archetype: 'D' },
      { text: "Keeping group engaged", archetype: 'C' }
    ]
  },
  {
    id: 12,
    question: "Which would bother you the most in a partner?",
    options: [
      { text: "Being boring", archetype: 'A' },
      { text: "Being uncaring", archetype: 'N' },
      { text: "Being irrational", archetype: 'T' },
      { text: "Being indecisive", archetype: 'L' },
      { text: "Being too practical/unimaginative", archetype: 'D' },
      { text: "Being antisocial/withdrawn", archetype: 'C' }
    ]
  },
   {
    id: 13,
    question: "For you, the perfect relationship feels like…",
    options: [
      { text: "Exciting, full of new experiences", archetype: 'A' },
      { text: "Supportive, safe, caring", archetype: 'N' },
      { text: "Balanced, practical, problem-solving", archetype: 'T' },
      { text: "Powerful, inspiring, a true partnership", archetype: 'L' },
      { text: "Romantic, dreamy, magical", archetype: 'D' },
      { text: "Fun, social, full of laughter", archetype: 'C' }
    ]
  },
  {
    id: 14,
    question: "The most important quality you look for is…",
    options: [
      { text: "Adventurous and bold", archetype: 'A' },
      { text: "Kind and empathetic", archetype: 'N' },
      { text: "Intelligent and logical", archetype: 'T' },
      { text: "Ambitious and confident", archetype: 'L' },
      { text: "Creative and soulful", archetype: 'D' },
      { text: "Outgoing and fun", archetype: 'C' }
    ]
  },
  {
    id: 15,
    question: "When life gets stressful, you prefer to…",
    options: [
      { text: "Escape and do something thrilling", archetype: 'A' },
      { text: "Lean on loved ones for support", archetype: 'N' },
      { text: "Plan and analyze calmly", archetype: 'T' },
      { text: "Take control and push forward", archetype: 'L' },
      { text: "Reflect or create art/music", archetype: 'D' },
      { text: "Distract yourself with friends/socializing", archetype: 'C' }
    ]
  },
  {
    id: 16,
    question: "With your partner, you’d most enjoy…",
    options: [
      { text: "Spontaneous road trip", archetype: 'A' },
      { text: "Cooking together at home", archetype: 'N' },
      { text: "Building something / solving puzzles", archetype: 'T' },
      { text: "Dressing up and attending an event", archetype: 'L' },
      { text: "Watching movies, stargazing, dreaming", archetype: 'D' },
      { text: "Going to a party or festival", archetype: 'C' }
    ]
  },
  {
    id: 17,
    question: "When you argue with a partner, you usually…",
    options: [
      { text: "Joke or change subject", archetype: 'A' },
      { text: "Comfort them & de-escalate", archetype: 'N' },
      { text: "Stay rational and look for solutions", archetype: 'T' },
      { text: "Take the lead and decide", archetype: 'L' },
      { text: "Withdraw to think/express later", archetype: 'D' },
      { text: "Talk endlessly until resolved", archetype: 'C' }
    ]
  },
  {
    id: 18,
    question: "You show love mostly by…",
    options: [
      { text: "Planning adventures together", archetype: 'A' },
      { text: "Caring gestures, support", archetype: 'N' },
      { text: "Giving advice, fixing problems", archetype: 'T' },
      { text: "Protecting & providing", archetype: 'L' },
      { text: "Romantic notes, art, surprises", archetype: 'D' },
      { text: "Shared social experiences", archetype: 'C' }
    ]
  },
  {
    id: 19,
    question: "Which would be hardest to handle in a partner?",
    options: [
      { text: "Too predictable / routine", archetype: 'A' },
      { text: "Cold / selfish", archetype: 'N' },
      { text: "Illogical / inconsistent", archetype: 'T' },
      { text: "Weak / unmotivated", archetype: 'L' },
      { text: "Unimaginative / boring", archetype: 'D' },
      { text: "Antisocial / doesn’t like people", archetype: 'C' }
    ]
  },
  {
    id: 20,
    question: "Commitment to you means…",
    options: [
      { text: "Experiencing life’s adventures together", archetype: 'A' },
      { text: "Always being there for each other", archetype: 'N' },
      { text: "Solving problems as a team", archetype: 'T' },
      { text: "Building a future empire together", archetype: 'L' },
      { text: "Soulful connection, one true love", archetype: 'D' },
      { text: "Being partners in fun and friendship", archetype: 'C' }
    ]
  },
  {
    id: 21,
    question: "You’re instantly attracted when someone…",
    options: [
      { text: "Does something bold or daring", archetype: 'A' },
      { text: "Shows kindness to others", archetype: 'N' },
      { text: "Talks intelligently", archetype: 'T' },
      { text: "Walks in with confidence", archetype: 'L' },
      { text: "Shares a creative or deep thought", archetype: 'D' },
      { text: "Lights up the room socially", archetype: 'C' }
    ]
  },
  {
    id: 22,
    question: "When you think of your future with a partner…",
    options: [
      { text: "Traveling the world, adventure", archetype: 'A' },
      { text: "Building a family, stable home", archetype: 'N' },
      { text: "Comfortable life, plans & stability", archetype: 'T' },
      { text: "Power couple, achieving success", archetype: 'L' },
      { text: "Soulmate love, passion & art", archetype: 'D' },
      { text: "Full of friends, laughter, events", archetype: 'C' }
    ]
  }
];

const archetypeNames = {
  A: 'Adventurer',
  N: 'Nurturer', 
  T: 'Thinker',
  L: 'Leader',
  D: 'Dreamer',
  C: 'Connector'
};

// Welcome Screen Component
const WelcomeScreen = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F5] to-[#E05265] flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 w-full max-w-lg shadow-2xl text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-[#FAF7F5] rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-3xl">
                        <Image
                          src="/assets/logo/heart.png"
                          alt="Flowly Logo"
                          height={40}
                          width={40}
                          priority
                        />
            </span>
          </div>
          <h2 className="font-secondary text-3xl md:text-4xl text-[#E05265] mb-4">
            Personality Test
          </h2>
          <p className="text-[#7C706A] font-app text-base md:text-lg leading-relaxed mb-6">
            This personality test will help us find the most compatible partners for you. 
            We&apos;ll ask you 12 simple questions to understand your unique personality and preferences.
          </p>
          <div className="bg-[#FAF7F5] rounded-2xl p-4 mb-6">
            <p className="text-sm text-[#7C706A]">
              ✨ Takes just 3-5 minutes<br />
              💕 Helps find your perfect match<br />
              🎯 Based on personality compatibility
            </p>
          </div>
        </div>

        <Button
          onClick={onStart}
          className="w-full bg-[#E05265] hover:bg-pink-600 text-white font-medium py-4 px-6 rounded-2xl text-lg transition-colors"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

// Completion Screen Component
const CompletionScreen = ({ personalityType, onContinue }: { 
  personalityType: string;
  onContinue: () => void;
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F5] to-[#E05265] flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 w-full max-w-lg shadow-2xl text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-[#FAF7F5] rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-3xl">
                        <Image
                          src="/assets/logo/heart.png"
                          alt="Flowly Logo"
                          height={40}
                          width={40}
                          priority
                        />
            </span>
          </div>
          <h2 className="font-secondary text-3xl md:text-4xl text-[#E05265] mb-4">
            You&apos;re an {personalityType}!
          </h2>
          <p className="text-[#7C706A] font-app text-base md:text-lg leading-relaxed mb-6">
            Thank you for completing your personality profile! 
            We now have everything we need to find your perfect matches based on your {personalityType} personality.
          </p>
          <div className="bg-[#FAF7F5] rounded-2xl p-4 mb-6">
            <p className="text-sm text-[#7C706A]">
              🚀 Ready to start your journey<br />
              💕 Find compatible partners<br />
              🌟 Meet amazing new people
            </p>
          </div>
        </div>

        <Button
          onClick={onContinue}
          className="w-full bg-[#E05265] hover:bg-pink-600 text-white font-medium py-4 px-6 rounded-2xl text-lg transition-colors"
        >
          Explore Flowly
        </Button>
      </div>
    </div>
  );
};

export default function PersonalityTest({ onComplete }: PersonalityTestProps) {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'questions' | 'complete'>('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<ArchetypeScores>({
    A: 0, N: 0, T: 0, L: 0, D: 0, C: 0
  });
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [completedPersonalityType, setCompletedPersonalityType] = useState<string>('');

  // Calculate gradient based on progress
  const getBackgroundGradient = () => {
    if (currentStep !== 'questions') return 'linear-gradient(to bottom, #FAF7F5, #E05265)';
    
    const progress = currentQuestion / (questions.length - 1);
    
    // Interpolate between start and end colors
    const startR = 250, startG = 247, startB = 245; // #FAF7F5
    const endR = 224, endG = 82, endB = 101; // #E05265
    
    const currentR = Math.round(startR + (endR - startR) * progress);
    const currentG = Math.round(startG + (endG - startG) * progress);
    const currentB = Math.round(startB + (endB - startB) * progress);
    
    const fromColor = `rgb(${currentR}, ${currentG}, ${currentB})`;
    
    // Make the "to" color slightly darker for gradient effect
    const toR = Math.max(currentR - 20, 0);
    const toG = Math.max(currentG - 20, 0);
    const toB = Math.max(currentB - 20, 0);
    const toColor = `rgb(${toR}, ${toG}, ${toB})`;
    
    return `linear-gradient(to bottom, ${fromColor}, ${toColor})`;
  };

  const handleStart = () => {
    setCurrentStep('questions');
  };

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const selectedArchetype = questions[currentQuestion].options[selectedOption].archetype;
    const newScores = { ...scores, [selectedArchetype]: scores[selectedArchetype] + 1 };
    setScores(newScores);

    if (currentQuestion === questions.length - 1) {
      // Test completed - calculate result
      const dominantArchetype = Object.entries(newScores).reduce((a, b) => 
        newScores[a[0] as Archetype] > newScores[b[0] as Archetype] ? a : b
      )[0] as Archetype;
      
      const personalityType = archetypeNames[dominantArchetype];
      setCompletedPersonalityType(personalityType);
      
      // Show completion screen first
      setCurrentStep('complete');
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
    }
  };

  // Handle final completion when user clicks "Explore Flowly"
  const handleFinalComplete = () => {
    onComplete(completedPersonalityType, scores);
  };

  // Show welcome screen
  if (currentStep === 'welcome') {
    return <WelcomeScreen onStart={handleStart} />;
  }

  // Show completion screen
  if (currentStep === 'complete') {
    return (
      <CompletionScreen 
        personalityType={completedPersonalityType}
        onContinue={handleFinalComplete} 
      />
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4"
      style={{ background: getBackgroundGradient() }}
    >
      {/* Progress Bar */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-2">
          <div 
            className="bg-gray-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

{/* Question Card */}
<div 
  className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl flex flex-col"
  style={{ minHeight: "420px" }} // keeps consistent size
>
  {/* Question Text */}
  <h2 className="font-secondary text-xl md:text-2xl text-[#E05265] mb-5 text-center leading-relaxed">
    {questions[currentQuestion].question}
  </h2>

  {/* Options (reduced spacing + padding) */}
  <div className="space-y-2 flex-1">
    {questions[currentQuestion].options.map((option, index) => (
      <button
        key={index}
        onClick={() => handleOptionSelect(index)}
        className={`w-full p-3 md:p-4 text-left rounded-2xl border-2 transition-all duration-200 font-app text-sm md:text-base ${
          selectedOption === index
            ? 'bg-[#E05265] text-white border-[#E05265] shadow-lg'
            : 'bg-[#FAF7F5] text-[#7C706A] border-[#ECCFC6] hover:bg-white hover:border-[#E05265]/50'
        }`}
      >
        {option.text}
      </button>
    ))}
  </div>

  {/* Navigation Buttons */}
  <div className="flex justify-between mt-6 gap-4">
    <Button
      onClick={handleBack}
      disabled={currentQuestion === 0}
      variant="outline"
      className="border-[#E05265] text-[#E05265] bg-transparent hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed w-1/2"
    >
      Back
    </Button>
      
    <Button
      onClick={handleNext}
      disabled={selectedOption === null}
      className="bg-[#E05265] hover:bg-pink-600 text-white disabled:opacity-50 disabled:cursor-not-allowed w-1/2"
    >
      {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
    </Button>
  </div>
</div>

    </div>
  );
}