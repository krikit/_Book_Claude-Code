import { useState, useEffect } from 'react'
import catSvg from '../assets/images/cat.svg'
import '../styles/animations.css'

const DancingCat = ({ isAnimating, animationSpeed = 1 }) => {
  const [animationClass, setAnimationClass] = useState('')

  useEffect(() => {
    if (isAnimating) {
      setAnimationClass('dancing')
    } else {
      setAnimationClass('')
    }
  }, [isAnimating])

  const containerStyle = {
    '--animation-speed': animationSpeed
  }

  return (
    <div className="cat-container" style={containerStyle}>
      <div className={`cat ${animationClass}`}>
        <img
          src={catSvg}
          alt="귀여운 고양이"
          className="cat-image"
        />
      </div>
      <div className="stage">
        <div className="stage-light"></div>
      </div>
    </div>
  )
}

export default DancingCat