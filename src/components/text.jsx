import React, { useState, useRef, useEffect } from 'react'
import defaultTypeSound from '/sfx/type.wav'
import clickSound from '/sfx/click.wav'

const AnimatedText = ({
  text,
  className = '',
  customText = '',
  time = 1,
  preStyle = '',
  audioSrc = defaultTypeSound
}) => {
  const [animatedTitle, setAnimatedTitle] = useState(text || '')
  const intervalRef = useRef(null)
  const audioRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  const finalClass = isHovered ? preStyle || className : className
  const letters = customText === '' ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : customText

  const handleMouseOver = () => {
    let iteration = 0
    setIsHovered(true)
    audioRef.current = new Audio(audioSrc)
    audioRef.current.loop = true
    audioRef.current.play()

    function animateText() {
      intervalRef.current = setInterval(() => {
        const randomText = text
          .split('')
          .map((char, index) => {
            return index < iteration
              ? char
              : letters[Math.floor(Math.random() * letters.length)]
          })
          .join('')

        setAnimatedTitle(randomText)
        iteration += 0.5 / time

        if (iteration >= text.length) {
          clearInterval(intervalRef.current)
          setAnimatedTitle(text)
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }
      }, 30)
    }

    animateText()
  }

  const handleMouseOut = () => {
    setIsHovered(false)
    clearInterval(intervalRef.current)
    setAnimatedTitle(text)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const handleClick = () => {
    const clickAudio = new Audio(clickSound)
    clickAudio.play()
  }

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [])

  return (
    <span className="z-50">
      <span
        className={`${finalClass} z-50 inline`}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={handleClick}
      >
        {animatedTitle}
      </span>
    </span>
  )
}

export default AnimatedText
