import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';

interface Props {
  isPlaying: boolean;
  speed: number;
  progress: number;
  currentTime: Date | null;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onProgressChange: (progress: number) => void;
}

const SPEED_OPTIONS = [1, 5, 10, 50, 100];

export function PlaybackControls({
  isPlaying,
  speed,
  progress,
  currentTime,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  onProgressChange
}: Props) {
  const formatTime = (date: Date | null) => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newProgress = x / rect.width;
    onProgressChange(newProgress);
  };

  return (
    <div className="playback-controls">
      <div className="playback-header">
        <div className="playback-time">
          <span className="time-label">Simulation Time:</span>
          <span className="time-value">{formatTime(currentTime)}</span>
        </div>
        <div className="speed-controls">
          <FastForward size={16} />
          {SPEED_OPTIONS.map(s => (
            <button
              key={s}
              className={`speed-button ${speed === s ? 'active' : ''}`}
              onClick={() => onSpeedChange(s)}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      <div className="progress-container" onClick={handleProgressClick}>
        <div className="progress-track">
          <div 
            className="progress-indicator" 
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="progress-percentage">{(progress * 100).toFixed(1)}%</span>
      </div>

      <div className="control-buttons">
        {isPlaying ? (
          <button className="control-button" onClick={onPause}>
            <Pause size={24} />
            <span>Pause</span>
          </button>
        ) : (
          <button className="control-button primary" onClick={onPlay}>
            <Play size={24} />
            <span>Play</span>
          </button>
        )}
        <button className="control-button" onClick={onReset}>
          <RotateCcw size={24} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
