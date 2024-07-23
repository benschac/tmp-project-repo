/**
 * TODO: Finish animation with noise
 *
 *
 * 1. Create a path with 5 points, that updates path with noise.
 * 2. animate / interpolate path points with noise
 */
import {
  GestureDetector,
  GestureHandlerRootView,
  Gesture,
} from 'react-native-gesture-handler'
import {
  Canvas,
  Path,
  Skia,
  usePathValue,
  processTransform3d,
} from '@shopify/react-native-skia'
import { centripetal_catmull_rom_spline } from '../../lib/spline'
import { Stack } from 'expo-router'
import { Dimensions } from 'react-native'
// import { createNoise2D } from 'simplex-noise'
import { createNoise2D } from '../../lib/noise'
// A simple copy-and-paste implementation of Johannes Baagøe's Alea PRNG

// Mostly packaged so I can easily include it in my projeccts. Nothing more

// JavaScript's Math.random() is fast, but has problems. First, it isn't seedable, second, its randomness leaves a bit to be desired. Johannes Baagøe has done some great work in trying to find a more modern PRNG algorithm that performs well on JavaScript, and Alea seems to be the one that has come out ahead (benchmarks).
import alea from 'alea'
const seed = alea('seed')
const noise2D = createNoise2D(seed)

import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated'

const noiseStep = 0.005

// map a number from 1 range to another
function map(n, start1, end1, start2, end2) {
  'worklet'
  return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2
}

interface Point {
  x: number
  y: number
  originX: number
  originY: number
  noiseOffsetX: number
  noiseOffsetY: number
}

function createNoise(x: number, y: number) {
  'worklet'
  const noise = noise2D(x, y)
  return noise
}

function animate({ points }: { points: SharedValue<Point[]> }) {
  'worklet'
  for (let i = 0; i < points.value.length; i++) {
    const point = points.value[i]

    // return a pseudo random value between -1 / 1 based on this point's current x, y positions in "time"
    const nX = createNoise(point.noiseOffsetX, point.noiseOffsetX)
    const nY = createNoise(point.noiseOffsetY, point.noiseOffsetY)
    // map this noise value to a new value, somewhere between it's original location -20 and it's original location + 20
    const x = map(nX, -1, 1, point.originX - 20, point.originX + 20)
    const y = map(nY, -1, 1, point.originY - 20, point.originY + 20)

    // update the point's current coordinates
    point.x = x
    point.y = y

    // progress the point's x, y values through "time"
    point.noiseOffsetX += noiseStep
    point.noiseOffsetY += noiseStep
  }
  console.log('points', points.value)
  return points.value
}

function createPoints(numPoints: number, radius: number): Point[] {
  const points: Point[] = []
  for (let i = 0; i < numPoints; i++) {
    // const point = numPoints[i]
    // const nX = createNoise(point.noiseOffsetX, point.noiseOffsetX)
    // const nY = createNoise(point.x, point.y)

    const angle = (i / numPoints) * 2 * Math.PI
    const x = 100 + radius * Math.cos(angle)
    const y = 100 + radius * Math.sin(angle)
    // TODO: Add noise

    // const nX = createNoise({})

    points.push({
      x,
      y,
      originX: x,
      originY: y,
      noiseOffsetX: Math.random() * 1000,
      noiseOffsetY: Math.random() * 1000,
    })
  }
  return points
}

const rrct = Skia.Path.Make()
rrct.addRRect(Skia.RRectXY(Skia.XYWHRect(0, 0, 100, 100), 10, 10))

// TODO:
// 1. use noise initial to confirm functionality on path points
// 2. add a click handler to update path points with new generated noise

export default function Screen() {
  const { width, height } = Dimensions.get('window')
  const radius = useSharedValue(width * 0.333)
  const tapped = useSharedValue(false)
  const rotateY = useSharedValue(0)

  const points = useSharedValue(createPoints(5, radius.value))

  const path = useDerivedValue(() => {
    const splinePoints = centripetal_catmull_rom_spline(points.value, 0.5, true)
    const path = Skia.Path.Make()

    if (splinePoints.length > 0) {
      path.moveTo(splinePoints[0].x, splinePoints[0].y)
      for (let i = 1; i < splinePoints.length; i++) {
        path.lineTo(splinePoints[i].x, splinePoints[i].y)
      }
      path.close()
    }

    return path
  }, [points])

  const gesture = Gesture.Pan().onChange((event) => {
    // console.log('event hiiiiiii', event)
    // points.value = animate({ points })
    rotateY.value -= event.changeX / 300
  })

  const clip = usePathValue((path) => {
    'worklet'
    path.transform(
      processTransform3d([
        { translate: [50, 50] },
        { perspective: 300 },
        { rotateY: rotateY.value },
        { translate: [-50, -50] },
      ])
    )
  }, rrct)

  return (
    <>
      {/* <Stack.Screen
        options={{
          title: '',
          headerShown: false,
        }}
      /> */}
      <GestureDetector gesture={gesture}>
        <Canvas style={{ width, height }}>
          <Path
            path={path}
            color='rgba(27, 127, 237, 0.8)'
            style='stroke'
            strokeWidth={4}
            transform={[{ translate: [50, 50] }]}
          />
        </Canvas>
      </GestureDetector>
    </>
  )
}
