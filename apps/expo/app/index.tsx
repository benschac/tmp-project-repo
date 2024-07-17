import React from 'react'
import { Canvas, Path, Skia } from '@shopify/react-native-skia'
import { centripetal_catmull_rom_spline } from '../lib/spline'
import { Stack } from 'expo-router'
import { Dimensions } from 'react-native'
import { createNoise2D } from 'simplex-noise'
// A simple copy-and-paste implementation of Johannes Baagøe's Alea PRNG

// Mostly packaged so I can easily include it in my projeccts. Nothing more

// JavaScript's Math.random() is fast, but has problems. First, it isn't seedable, second, its randomness leaves a bit to be desired. Johannes Baagøe has done some great work in trying to find a more modern PRNG algorithm that performs well on JavaScript, and Alea seems to be the one that has come out ahead (benchmarks).
import { alea } from 'alea'
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated'
// map a number from 1 range to another
function map(n, start1, end1, start2, end2) {
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

// how fast we progress through "time"
let noiseStep = 0.005
function createNoise({ x, y }: { x: number; y: number }) {
  const noise2D = createNoise2D()
  const noise = noise2D(x, y)
  return noise
}

function createPoints(numPoints: number, radius: number): Point[] {
  const points: Point[] = []
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI
    const x = 100 + radius * Math.cos(angle)
    const y = 100 + radius * Math.sin(angle)
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

export default function Screen() {
  const { width, height } = Dimensions.get('window')
  const radius = useSharedValue(width * 0.333)

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
  })
  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerShown: false,
        }}
      />
      <Canvas style={{ width, height }}>
        <Path
          path={path}
          color='rgba(27, 127, 237, 0.8)'
          style='fill'
          transform={[{ translateX: width / 2 }, { translateY: height / 2 }]}
        />
      </Canvas>
    </>
  )
}
