/**
 * TODO:
 *
 * 1. marquee text effect on scroll
 */
import Layout from 'components/layout'
import { H1, YStack, styled } from 'tamagui'
import { useRafLoop, useWindowSize } from 'react-use'
import React, {
  useRef,
  useEffect,
  WheelEvent,
  PointerEvent,
  useState,
} from 'react'
import { PanInfo, motion, useSpring, useTransform } from 'framer-motion'
import normalizeWheel from 'normalize-wheel'
import generateRssFeed from 'utils/rss'
import { getAllPosts } from './lib/posts'
const MarqueeContainer = styled(motion.div, {
  // p: '$4',
  borderColor: '$color',
  borderWidth: '$1',
  borderStyle: 'solid',
  borderRadius: '$4',
  overflow: 'hidden',
})

const isomorphicWindow = typeof window === 'undefined' ? undefined : window

const _ = {
  content: '༼ ◕_◕ ༽',
  speed: 2,
  threshold: 0.014,
  wheelFactor: 1.5,
  dragFactor: 1.1,
}

type TimeOut = ReturnType<typeof setTimeout>
const MarqueeItem: React.FC<MarqueeItemProps> = ({
  content,
  speed,
  reverse = false,
}) => {
  const [duplicates, setDuplicates] = useState(2)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentWidth, setContentWidth] = useState(0)
  const x = useRef(0)

  useEffect(() => {
    if (contentRef.current && containerRef.current) {
      const newContentWidth = contentRef.current.offsetWidth
      setContentWidth(newContentWidth)
      const containerWidth = containerRef.current.offsetWidth
      const newDuplicates = Math.ceil(containerWidth / newContentWidth) + 1
      setDuplicates(newDuplicates)

      // Set initial position
      x.current = reverse ? 0 : -newContentWidth
    }
  }, [content, reverse])

  const loop = () => {
    if (containerRef.current && contentWidth > 0) {
      const direction = reverse ? 1 : -1
      x.current += direction * speed.get()

      if (reverse) {
        if (x.current >= contentWidth) {
          x.current = 0
        }
      } else {
        if (x.current <= -contentWidth) {
          x.current = 0
        }
      }

      containerRef.current.style.transform = `translateX(${x.current}px)`
    }
  }

  useRafLoop(loop, true)

  return (
    <div style={{ overflow: 'hidden' }}>
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          flexDirection: reverse ? 'row-reverse' : 'row',
        }}
      >
        {[...Array(duplicates)].map((_, index) => (
          <div
            key={index}
            ref={index === 0 ? contentRef : null}
            style={{
              whiteSpace: 'nowrap',
              lineHeight: 1.4,
              fontSize: '10vw',
              letterSpacing: '-0.05em',
              flex: 'none',
            }}
          >
            {content}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Page(props) {
  console.log(props)
  const { width, height } = useWindowSize()
  const speed = useSpring(_.speed, {
    stiffness: 100,
    damping: 10,
    mass: 5,
  })

  const marqueeRef = useRef<HTMLDivElement | null>(null)
  const x = useRef(0)
  // probably going to break on server render
  const w = useRef(isomorphicWindow?.innerWidth)?.current ?? 0
  const isScrolling = useRef<TimeOut>()
  const slowDown = useRef(false)
  const constraintsRef = useRef<HTMLDivElement | null>(null)
  // read this a bit more
  // const opacity = useTransform(speed, [-w * 0.2, 0, w * 2], [1, 0, 1])
  const skewX = useTransform(speed, [-w * 0.25, 0, w * 0.25], [-25, 0, 25])

  const loop = () => {
    if (slowDown.current || Math.abs(x.current) < _.threshold) return
    x.current *= 0.7
    if (x.current < 0) {
      x.current = Math.min(x.current, 0)
    } else {
      x.current = Math.max(x.current, 0)
    }
    speed.set(_.speed + x.current)
  }

  useRafLoop(loop, true)

  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    const normalized = normalizeWheel(e)
    x.current = normalized.pixelY * _.wheelFactor

    window.clearTimeout(isScrolling.current)

    isScrolling.current = setTimeout(() => {
      speed.set(_.speed)
    }, 30)
  }
  const onDragStart = (e: MouseEvent) => {
    slowDown.current = true
    marqueeRef.current?.classList.add('drag')
    speed.set(0)
    // speed2.set(0)
    console.log(e)
  }
  const onDrag = (e: MouseEvent, info: PanInfo) => {
    speed.set(_.dragFactor * -info.delta.x)
    console.log(e)
  }
  const onDragEnd = (e: MouseEvent) => {
    slowDown.current = false
    marqueeRef.current?.classList.remove('drag')
    x.current = _.speed
    console.log('onDragEnd', x.current)
  }

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    slowDown.current = true
    marqueeRef?.current?.classList.add('drag')
    speed.set(0)
    console.log('onPointerDown', x.current)
  }
  const onPointerUp = (e: PointerEvent<HTMLElement>) => {
    slowDown.current = false
    marqueeRef?.current?.classList.remove('drag')
    x.current = _.speed

    console.log('onPointerUp', x.current)
  }
  // console.log(props.allPosts)

  return (
    <Layout>
      <motion.div
        style={{
          position: 'relative',
          overflow: 'hidden',
        }}
        // backdropFilter='blur(3.8px)'
        // bg='rgba(255, 255, 255, 0.07)'
        ref={constraintsRef}
      >
        <MarqueeContainer
          // onWheel={onWheel}
          onDragStart={onDragStart}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          onPointerUp={onPointerUp}
          onPointerDown={onPointerDown}
          ref={marqueeRef}
          style={{
            skewX: skewX,
          }}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.0001}
          drag='x'
        >
          <MarqueeItem
            content={_.content}
            speed={speed}
          />
          <MarqueeItem
            content={_.content}
            reverse
            speed={speed}
          />
          <MarqueeItem
            content={_.content}
            speed={speed}
          />
          <MarqueeItem
            content={_.content}
            reverse
            speed={speed}
          />
          <MarqueeItem
            content={_.content}
            speed={speed}
          />
          <MarqueeItem
            content={_.content}
            reverse
            speed={speed}
          />
          <YStack
            borderRadius='$4'
            borderColor={'$color'}
            padding='$4'
            style={{
              backdropFilter: 'blur(10.8px)',
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              borderWidth: '$1',
              position: 'absolute',
              transform: 'translate(0%, 0%)',
              // translateY: '-50%',
              // translateX: '-50%',
              width: '50%',
              left: '5%',
              height: '90%',
              top: '5%',
              bottom: '10%',
              // bottom: 0,
            }}
          >
            <H1>hello</H1>
            <H1>hello</H1>
            <H1>hello</H1>
            <H1>hello</H1>
            <H1>hello</H1>
          </YStack>
        </MarqueeContainer>
        {/* <InteractiveMarquee /> */}
      </motion.div>
      <YStack
        zi={1}
        backdropFilter='blur(3.8px)'
        t='$4'
        bg='rgba(255, 255, 255, 0.07)'
        borderRadius='$4'
        borderWidth='$1'
        borderColor='$color'
        tag='header'
        jc='center'
      >
        <H1>benschac </H1>
      </YStack>
    </Layout>
  )
}
export const getStaticProps = async () => {
  const allPosts = await getAllPosts()

  generateRssFeed(allPosts)
  return {
    props: { allPosts },
  }
}
