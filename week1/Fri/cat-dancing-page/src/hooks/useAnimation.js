import { useState, useEffect, useCallback } from 'react'

const useAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1)

  const toggleAnimation = useCallback(() => {
    setIsAnimating(prev => !prev)
  }, [])

  const startAnimation = useCallback(() => {
    setIsAnimating(true)
  }, [])

  const stopAnimation = useCallback(() => {
    setIsAnimating(false)
  }, [])

  const changeSpeed = useCallback((speed) => {
    setAnimationSpeed(speed)
  }, [])

  // 키보드 단축키 지원
  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key.toLowerCase()) {
        case ' ':
        case 'enter':
          event.preventDefault()
          toggleAnimation()
          break
        case 's':
          event.preventDefault()
          stopAnimation()
          break
        case 'd':
        case 'p':
          event.preventDefault()
          startAnimation()
          break
        case '1':
          event.preventDefault()
          changeSpeed(0.5)
          break
        case '2':
          event.preventDefault()
          changeSpeed(1)
          break
        case '3':
          event.preventDefault()
          changeSpeed(1.5)
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [toggleAnimation, startAnimation, stopAnimation, changeSpeed])

  return {
    isAnimating,
    animationSpeed,
    toggleAnimation,
    startAnimation,
    stopAnimation,
    changeSpeed
  }
}

export default useAnimation