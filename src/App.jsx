import { useState, useEffect, useRef } from 'react'
import './index.css'
import valentineImg from './assets/valentine.jpg'
import penguinImg from './assets/penguin.jpg'

function App() {
  const [yesPressed, setYesPressed] = useState(false)
  const [noPos, setNoPos] = useState({ top: 'auto', left: 'auto', position: 'relative' })
  const confettiCanvasRef = useRef(null)

  const noBtnRef = useRef(null)
  const containerRef = useRef(null)

  // Floating Hearts logic
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    const symbols = ['❤', '💖', '💕', '💗']
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      left: Math.random() * 100 + 'vw',
      duration: Math.random() * 3 + 4 + 's',
      delay: Math.random() * 5 + 's'
    }))
    setHearts(newHearts)
  }, [])

  // Runaway No Button Logic
  // Runaway No Button Logic
  const moveButton = () => {
    if (!noBtnRef.current) return

    // Dynamic dimensions
    const btnRect = noBtnRef.current.getBoundingClientRect()
    const btnWidth = btnRect.width
    const btnHeight = btnRect.height

    // Use viewport dimensions
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    const padding = 20 // Keep it away from the absolute edges

    // Ensure strictly positive range
    // We calculate available space for the top-left corner
    const maxX = Math.max(0, viewportWidth - btnWidth - padding)
    const maxY = Math.max(0, viewportHeight - btnHeight - padding)

    // Generate random position within bounds [padding, maxX]
    const randomX = Math.random() * (maxX - padding) + padding
    const randomY = Math.random() * (maxY - padding) + padding

    setNoPos({
      position: 'fixed',
      left: `${randomX}px`,
      top: `${randomY}px`,
      zIndex: 1000 // Always on top
    })
  }

  // Confetti Logic
  useEffect(() => {
    if (yesPressed && confettiCanvasRef.current) {
      const canvas = confettiCanvasRef.current
      const ctx = canvas.getContext('2d')
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      let particles = []
      const colors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffd6ff', '#e0aaff']

      function ConfettiParticle() {
        this.x = Math.random() * canvas.width
        this.y = -20
        this.size = Math.random() * 8 + 4
        this.speedY = Math.random() * 3 + 2
        this.speedX = Math.random() * 2 - 1
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.rotation = Math.random() * 360
      }

      ConfettiParticle.prototype.update = function () {
        this.y += this.speedY
        this.x += this.speedX
        this.rotation += 2
      }

      ConfettiParticle.prototype.draw = function () {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation * Math.PI / 180)
        ctx.fillStyle = this.color
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
        ctx.restore()
      }

      // Spawn particles
      for (let i = 0; i < 150; i++) {
        setTimeout(() => {
          particles.push(new ConfettiParticle())
        }, i * 5)
      }

      const animateConfetti = () => {
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        particles.forEach((p, index) => {
          p.update()
          p.draw()
          if (p.y > canvas.height) {
            particles.splice(index, 1)
          }
        })

        if (particles.length > 0) {
          requestAnimationFrame(animateConfetti)
        }
      }

      animateConfetti()

      const handleResize = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [yesPressed])

  return (
    <>
      {/* Background Hearts */}
      <div className="bg-hearts">
        {hearts.map(heart => (
          <div
            key={heart.id}
            className="heart"
            style={{
              left: heart.left,
              animationDuration: heart.duration,
              animationDelay: heart.delay
            }}
          >
            {heart.symbol}
          </div>
        ))}
      </div>

      {!yesPressed ? (
        <div className="container" ref={containerRef}>
          <img src={valentineImg} alt="Us" className="valentine-img" />
          <h1>Will you be my Valentine? 💗</h1>
          <div className="buttons">
            <button
              className="btn-yes"
              onClick={() => setYesPressed(true)}
            >
              Yes 💕
            </button>
            <button
              ref={noBtnRef}
              className="btn-no"
              style={noPos}
              onMouseOver={moveButton}
              onTouchStart={moveButton}
              onClick={moveButton}
            >
              No 🙅‍♀️
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="container success-message" style={{ display: 'block' }}>
            <img src={penguinImg} alt="Penguin" className="penguin-img" />
            <h1 className="success-text">I knew you’d say yes!</h1>
            <p className="sub-text">And yet they say I got no rizz 🥰💐</p>
          </div>
          <canvas ref={confettiCanvasRef} id="confetti"></canvas>
        </>
      )}
    </>
  )
}

export default App
