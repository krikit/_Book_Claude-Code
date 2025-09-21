const AnimationControls = ({
  isAnimating,
  animationSpeed,
  onToggle,
  onStart,
  onStop,
  onSpeedChange
}) => {
  const speedLabels = {
    0.5: '느림',
    1: '보통',
    1.5: '빠름'
  }

  return (
    <div className="controls">
      <div className="control-buttons">
        <button
          className={`control-button ${isAnimating ? 'stop' : 'start'}`}
          onClick={onToggle}
          aria-label={isAnimating ? '춤 멈추기' : '춤 시작하기'}
        >
          {isAnimating ? '🛑 춤 멈추기' : '💃 춤 시작하기'}
        </button>

        <button
          className="control-button start"
          onClick={onStart}
          disabled={isAnimating}
          aria-label="춤 시작하기"
        >
          ▶️ 시작
        </button>

        <button
          className="control-button stop"
          onClick={onStop}
          disabled={!isAnimating}
          aria-label="춤 멈추기"
        >
          ⏹️ 정지
        </button>
      </div>

      <div className="speed-controls">
        <label htmlFor="speed-slider" className="speed-label">
          춤 속도: {speedLabels[animationSpeed] || '사용자 정의'}
        </label>
        <div className="speed-buttons">
          {[0.5, 1, 1.5].map(speed => (
            <button
              key={speed}
              className={`speed-button ${animationSpeed === speed ? 'active' : ''}`}
              onClick={() => onSpeedChange(speed)}
              aria-label={`속도 ${speedLabels[speed]}으로 변경`}
            >
              {speedLabels[speed]}
            </button>
          ))}
        </div>
      </div>

      <div className="status">
        <span className={`status-indicator ${isAnimating ? 'active' : 'inactive'}`}>
          {isAnimating ? '🎵 춤추는 중...' : '😴 쉬는 중...'}
        </span>
      </div>
    </div>
  )
}

export default AnimationControls