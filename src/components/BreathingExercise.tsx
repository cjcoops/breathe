import React, { useState, useEffect, useRef } from "react";

type BreathSpeed = "slow" | "medium" | "fast";

interface SpeedSettings {
  slow: number;
  medium: number;
  fast: number;
}

const SPEED_OPTIONS: SpeedSettings = {
  slow: 4000,
  medium: 2500,
  fast: 1500,
};

const BREATH_IN_DURATION = 2.194281 * 1000;
const BREATH_OUT_DURATION = 3.317531 * 1000;

const BreathingExercise: React.FC = () => {
  const [breathCount, setBreathCount] = useState<number>(5);
  const [rounds, setRounds] = useState<number>(3);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [speed, setSpeed] = useState<BreathSpeed>("medium");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  // Current breath increments by 1 for each breath in or breath out. Resets each round
  const [currentBreath, setCurrentBreath] = useState<number>(0);

  const breathInAudio = useRef<HTMLAudioElement>(
    new Audio("/sounds/breath-in.mp3")
  );

  const breathOutAudio = useRef<HTMLAudioElement>(
    new Audio("/sounds/breath-out.mp3")
  );

  const startBreathing = (): void => {
    setIsPlaying(true);
    setCurrentBreath(0);
    setCurrentRound(1);
  };

  useEffect(() => {
    let timer: number;

    if (isPlaying && currentRound <= rounds) {
      if (currentBreath < breathCount * 2) {
        const isBreathIn = currentBreath % 2 === 0;
        const audioElement = isBreathIn
          ? breathInAudio.current
          : breathOutAudio.current;
        const originalDuration = isBreathIn
          ? BREATH_IN_DURATION
          : BREATH_OUT_DURATION;
        const targetDuration = SPEED_OPTIONS[speed];

        audioElement.playbackRate = originalDuration / targetDuration;
        audioElement.play();

        timer = setTimeout(() => {
          setCurrentBreath((prev) => prev + 1);
        }, SPEED_OPTIONS[speed]);
      } else {
        // One round complete, start next round
        setCurrentBreath(0);
        setCurrentRound((prev) => prev + 1);
      }
    } else {
      // All rounds complete
      setIsPlaying(false);
      setCurrentBreath(0);
      setCurrentRound(1);
    }

    return () => clearTimeout(timer);
  }, [isPlaying, currentBreath, breathCount, speed, currentRound, rounds]);

  const handleBreathCountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setBreathCount(Number(e.target.value));
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSpeed(e.target.value as BreathSpeed);
  };

  const handleRoundsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setRounds(Number(e.target.value));
  };

  return (
    <div className="breathing-exercise">
      <div className="controls">
        <div>
          <label>Number of Breaths:</label>
          <input
            type="number"
            min="1"
            max="20"
            value={breathCount}
            onChange={handleBreathCountChange}
          />
        </div>

        <div>
          <label>Number of Rounds:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={rounds}
            onChange={handleRoundsChange}
          />
        </div>

        <div>
          <label>Speed:</label>
          <select value={speed} onChange={handleSpeedChange}>
            <option value="slow">Slow</option>
            <option value="medium">Medium</option>
            <option value="fast">Fast</option>
          </select>
        </div>

        <button onClick={startBreathing} disabled={isPlaying}>
          Start Breathing Exercise
        </button>
      </div>

      {isPlaying && (
        <div className="status">
          <p>
            Round {currentRound} of {rounds}
          </p>
          <p>
            Breath {Math.floor(currentBreath / 2) + 1} of {breathCount}
          </p>
          <p>{currentBreath % 2 === 0 ? "Breathe In" : "Breathe Out"}</p>
        </div>
      )}
    </div>
  );
};

export default BreathingExercise;
