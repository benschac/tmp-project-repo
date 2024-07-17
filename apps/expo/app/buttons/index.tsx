import { H1, Text, ScrollView } from '@my/ui'
import { Canvas, Circle, Group, Path, Skia } from '@shopify/react-native-skia'
import {
  runOnJS,
  runOnUI,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'
import { spline } from '@georgedoescode/spline'
import { Dimensions } from 'react-native'

import { Stack } from 'expo-router'

type Point = {
  x: number
  y: number
  originX: number
  originY: number
  noiseOffsetX: number
  noiseOffsetY: number
}
export default function Screen() {
  const createPoints = (n: number): Point[] => {
    const points: Point[] = []
    const numberOfPoints = n ?? 6
    const angle = (Math.PI * 2) / numberOfPoints
    const radius = 100
    for (let i = 0; i < numberOfPoints; i++) {
      const theta = i * angle
      const x = radius * Math.cos(theta)
      const y = radius * Math.sin(theta)
      points.push({
        x,
        y,
        originX: x,
        originY: y,
        noiseOffsetX: Math.random() * 100,
        noiseOffsetY: Math.random() * 100,
      })
    }
    return points
  }

  const points = useSharedValue<Point[]>(createPoints(10))

  const path = useDerivedValue(() => {
    const path = Skia.Path.Make()
    if (points.value.length > 0) {
      const firstPoint = points.value[0]
      path.moveTo(firstPoint.x, firstPoint.y)

      for (let i = 0; i < points.value.length; i++) {
        const currentPoint = points.value[i]
        const nextPoint = points.value[(i + 1) % points.value.length]
        const midPoint = {
          x: (currentPoint.x + nextPoint.x) / 2,
          y: (currentPoint.y + nextPoint.y) / 2,
        }

        if (i % 2 === 0) {
          // Use quadratic curve for even indices
          path.quadTo(currentPoint.x, currentPoint.y, midPoint.x, midPoint.y)
        } else {
          // Use cubic curve for odd indices
          const prevMidPoint = {
            x:
              (points.value[(i - 1 + points.value.length) % points.value.length]
                .x +
                currentPoint.x) /
              2,
            y:
              (points.value[(i - 1 + points.value.length) % points.value.length]
                .y +
                currentPoint.y) /
              2,
          }
          path.cubicTo(
            prevMidPoint.x,
            prevMidPoint.y,
            currentPoint.x,
            currentPoint.y,
            midPoint.x,
            midPoint.y
          )
        }
      }

      path.close()
    }
    return path
  })
  const { width, height } = Dimensions.get('window')
  return (
    <>
      <Stack.Screen
        options={{
          title: 'buttons',
        }}
      />
      <ScrollView px='$2'>
        <Canvas style={{ width, height }}>
          <Path
            transform={[{ translateX: width / 2 }, { translateY: height / 2 }]}
            path={path}
            color='blue'
            strokeWidth={1}
          />
        </Canvas>
      </ScrollView>
    </>
  )
}
