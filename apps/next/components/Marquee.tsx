import { useState, useRef, useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import normalizeWheel from 'normalize-wheel'
import { useRafLoop } from 'react-use'
import { useWindowSize } from '@react-hook/window-size'

const isomorphicWindow = typeof window === 'undefined' ? undefined : window

const _ = {
  content: 'Around the world, around the world.',
  speed: 2,
  threshold: 0.014,
  wheelFactor: 1.8,
  dragFactor: 1.2,
}

const MarqueeItem = ({ content, speed }) => {
  const item = useRef(null)
  const rect = useRef({})
  const x = useRef(0)

  const [width, height] = useWindowSize()

  const setX = () => {
    if (!item.current || !rect.current) return
    const xPercentage = (x.current / rect.current.width) * 100
    if (xPercentage < -100) x.current = 0
    if (xPercentage > 0) x.current = -rect.current.width
    item.current.style.transform = `translate3d(${xPercentage}%, 0, 0)`

    // if (x.current < -rect.current.width) x.current = 0;
    // if (x.current > 0) x.current = -rect.current.width;
    // item.current.style.transform = `translate3d(${x.current}px, 0, 0)`;
  }

  useEffect(() => {
    rect.current = item.current.getBoundingClientRect()
  }, [width, height])

  // const buffer = useRef(0);
  const loop = (e) => {
    x.current -= speed.get()
    setX()

    // const delta = (e - buffer.current) / 1000;
    // const c = Math.max(1 / 60 / delta, 1);
    // buffer.current = e;
    // x.current -= speed.get() / c;
    // setX();
  }

  useRafLoop(loop, true)

  return (
    <div
      className='item'
      ref={item}
      style={{
        fontSize: '30vw',
        whiteSpace: 'nowrap',
      }}
    >
      {content}
    </div>
  )
}

export const InteractiveMarquee = () => {
  const marquee = useRef(null)
  const slowDown = useRef(false)
  const isScrolling = useRef(false)
  const constraintsRef = useRef(null)

  const x = useRef(0)
  const w = useRef(isomorphicWindow?.innerWidth).current
  const speed = useSpring(_.speed, {
    damping: 40,
    stiffness: 90,
    mass: 5,
  })
  const opacity = useTransform(speed, [-w * 0.25, 0, w * 0.25], [1, 0, 1])
  const skewX = useTransform(speed, [-w * 0.25, 0, w * 0.25], [-25, 0, 25])

  const onWheel = (e) => {
    const normalized = normalizeWheel(e)
    x.current = normalized.pixelY * _.wheelFactor

    // Reset speed on scroll end
    window.clearTimeout(isScrolling.current)
    isScrolling.current = setTimeout(function () {
      speed.set(_.speed)
    }, 30)
  }

  const onDragStart = () => {
    slowDown.current = true
    marquee.current.classList.add('drag')
    speed.set(0)
  }

  const onDrag = (e, info) => {
    speed.set(_.dragFactor * -info.delta.x)
  }

  const onDragEnd = (e) => {
    slowDown.current = false
    marquee.current.classList.remove('drag')
    x.current = _.speed
  }

  const loop = () => {
    if (slowDown.current || Math.abs(x.current) < _.threshold) return
    x.current *= 0.66
    if (x.current < 0) {
      x.current = Math.min(x.current, 0)
    } else {
      x.current = Math.max(x.current, 0)
    }
    speed.set(_.speed + x.current)
  }

  useRafLoop(loop, true)

  return (
    <>
      <motion.div
        className='bg'
        style={{ opacity }}
        ref={constraintsRef}
      />
      <motion.div
        className='marquee'
        ref={marquee}
        style={{ skewX }}
        onWheel={onWheel}
        drag='x'
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        dragElastic={0.000001} // needs to be > 0 ¯\_(ツ)_/¯
      >
        <MarqueeItem
          content={_.content}
          speed={speed}
        />
        <MarqueeItem
          content={_.content}
          speed={speed}
        />
      </motion.div>
    </>
  )
}
