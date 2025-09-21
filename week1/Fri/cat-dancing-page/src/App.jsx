import DancingCat from './components/DancingCat'
import AnimationControls from './components/AnimationControls'
import useAnimation from './hooks/useAnimation'
import './App.css'
import './styles/global.css'

function App() {
  const {
    isAnimating,
    animationSpeed,
    toggleAnimation,
    startAnimation,
    stopAnimation,
    changeSpeed
  } = useAnimation()

  return (
    <div className="app">
      <header className="app-header">
        <h1>고양이 댄싱 페이지</h1>
        <p>귀여운 고양이가 춤을 춥니다!</p>
        <p className="keyboard-help">
          키보드 단축키: 스페이스바/엔터(토글), D(시작), S(정지), 1/2/3(속도)
        </p>
      </header>

      <main className="app-main">
        <DancingCat
          isAnimating={isAnimating}
          animationSpeed={animationSpeed}
        />
        <AnimationControls
          isAnimating={isAnimating}
          animationSpeed={animationSpeed}
          onToggle={toggleAnimation}
          onStart={startAnimation}
          onStop={stopAnimation}
          onSpeedChange={changeSpeed}
        />
      </main>
    </div>
  )
}

export default App
