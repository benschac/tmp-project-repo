import React, { useEffect } from 'react'
import { StyleSheet, Dimensions, useWindowDimensions } from 'react-native'
import Spline from './skia/spline'
import {
  BALL_COLOR,
  startColors,
  endColors,
  width,
  height,
  RADIUS,
  MAX_SPEED,
  PADDLE_MIDDLE,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  TOTAL_BRICKS,
  BRICK_MIDDLE,
  BRICK_WIDTH,
  BRICK_ROW_LENGTH,
  BRICK_HEIGHT,
} from '../constants'
import {
  Canvas,
  Circle,
  Fill,
  Group,
  LinearGradient,
  RoundedRect,
  vec,
} from '@shopify/react-native-skia'
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useDerivedValue,
  interpolateColor,
  interpolate,
  Easing,
  useFrameCallback,
} from 'react-native-reanimated'
import { Stack } from 'expo-router'
import {
  BrickInterface,
  CircleInterface,
  Collision,
  PaddleInterface,
  ShapeInterface,
} from './skia/types'
import { StatusBar } from 'expo-status-bar'
import {
  GestureDetector,
  GestureHandlerRootView,
  Gesture,
} from 'react-native-gesture-handler'
import { YStack } from '@my/ui'
interface Prop {
  idx: number
  brick: BrickInterface
}

const Brick = ({ idx, brick }: Prop) => {
  const color = useDerivedValue(() => {
    return brick.canCollide.value ? 'orange' : 'transparent'
  }, [brick.canCollide])
  return (
    <RoundedRect
      key={idx}
      x={brick.x}
      y={brick.y}
      width={brick.width}
      height={brick.height}
      r={8}
    >
      <LinearGradient
        start={vec(5, 300)}
        end={vec(4, 50)}
        colors={['red', 'orange']}
      />
    </RoundedRect>
  )
}

export default function Screen() {
  const circleObject: CircleInterface = {
    id: 0,
    x: useSharedValue(0),
    y: useSharedValue(0),
    r: RADIUS,
    ax: 0,
    ay: 0,
    vx: 0,
    vy: 0,
    type: 'Circle',
  }
  const rectangleObject: PaddleInterface = {
    id: 1,
    x: useSharedValue(PADDLE_MIDDLE),
    y: useSharedValue(height - 100),
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    ax: 0,
    ay: 0,
    vx: 0,
    vy: 0,
    type: 'Paddle',
  }
  const bricks: BrickInterface[] = Array(TOTAL_BRICKS)
    .fill(0)
    .map((_, idx) => {
      const farBrickX = BRICK_MIDDLE + BRICK_WIDTH + 50
      const middleBrickX = BRICK_MIDDLE
      const closeBrick = BRICK_MIDDLE - BRICK_WIDTH - 50
      let startingXPosition = -1
      if (idx % BRICK_ROW_LENGTH === 0) {
        startingXPosition = farBrickX
      } else if (idx % BRICK_ROW_LENGTH === 1) {
        startingXPosition = middleBrickX
      } else {
        startingXPosition = closeBrick
      }

      const startingY = 50
      const startingYPosition =
        startingY + Math.floor(idx / BRICK_ROW_LENGTH) * 50

      return {
        type: 'Brick',
        id: 0,
        x: useSharedValue(startingXPosition),
        y: useSharedValue(startingYPosition),
        ax: 0,
        ay: 0,
        vx: 0,
        vy: 0,
        height: BRICK_HEIGHT,
        width: BRICK_WIDTH,
        canCollide: useSharedValue(true),
      }
    })

  createBouncingExample(circleObject)
  useFrameCallback((frameInfo) => {
    if (!frameInfo.timeSincePreviousFrame) {
      return
    }
    animate(
      [circleObject, rectangleObject, ...bricks],
      frameInfo.timeSincePreviousFrame,
      0
    )
  })
  const gesture = Gesture.Pan().onChange((event) => {
    rectangleObject.x.value = event.x - PADDLE_WIDTH / 2
  })

  return (
    <>
      <StatusBar style='inverted' />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Spline />
      {/* <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={gesture}>
          <Canvas
            style={{
              backgroundColor: 'black',
              width,
              height,
            }}
          >
            <Circle
              cx={circleObject.x}
              cy={circleObject.y}
              r={RADIUS}
              color={BALL_COLOR}
            />
            <RoundedRect
              x={rectangleObject.x}
              y={rectangleObject.y}
              width={rectangleObject.width}
              height={rectangleObject.height}
              color='white'
              r={8}
            />
            {bricks.map((brick, idx) => {
              return (
                <Brick
                  key={idx}
                  idx={idx}
                  brick={brick}
                />
              )
            })}
          </Canvas>
        </GestureDetector>
      </GestureHandlerRootView> */}
    </>
  )
}

export const createBouncingExample = (circleObject: CircleInterface) => {
  'worklet'
  circleObject.x.value = 100
  circleObject.y.value = 100
  circleObject.ax = 0.5
  circleObject.ay = 0.5
  circleObject.vx = 0
  circleObject.vy = 0
}

const move = (obj: ShapeInterface, dt: number) => {
  'worklet'
  obj.vx += obj.ax * dt
  obj.vy += obj.ay * dt

  obj.x.value += obj.vx * dt
  obj.y.value += obj.vy * dt

  // vx
  if (obj.vx > MAX_SPEED) {
    obj.vx = MAX_SPEED
  }
  if (obj.vx < -MAX_SPEED) {
    obj.vx = -MAX_SPEED
  }

  // vy
  if (obj.vy > MAX_SPEED) {
    obj.vy = MAX_SPEED
  }

  if (obj.vy < -MAX_SPEED) {
    obj.vy = -MAX_SPEED
  }
}
function isCircle(shape: ShapeInterface): shape is CircleInterface {
  'worklet'
  return shape.type === 'Circle'
}

function isPaddle(shape: ShapeInterface): shape is PaddleInterface {
  'worklet'
  return shape.type === 'Paddle'
}
function isBrick(shape: ShapeInterface): shape is BrickInterface {
  'worklet'
  return shape.type === 'Brick'
}

const resloveWallCollision = (obj: ShapeInterface) => {
  'worklet'
  let circleObject: CircleInterface
  if (!isCircle(obj)) {
    return
  }
  circleObject = obj
  // Wall collision detection
  if (circleObject.x.value - circleObject.r < 0) {
    circleObject.x.value = circleObject.r
    circleObject.vx = Math.abs(circleObject.vx)
    circleObject.ax = Math.abs(circleObject.ax)
  }

  if (circleObject.x.value + circleObject.r > width) {
    circleObject.x.value = width - circleObject.r
    circleObject.vx = -Math.abs(circleObject.vx)
    circleObject.ax = -Math.abs(circleObject.ax)
  }

  if (circleObject.y.value - circleObject.r < 0) {
    circleObject.y.value = circleObject.r
    circleObject.vy = Math.abs(circleObject.vy)
    circleObject.ay = Math.abs(circleObject.ay)
  }

  if (circleObject.y.value + circleObject.r > height) {
    circleObject.y.value = height - circleObject.r
    circleObject.vy = -Math.abs(circleObject.vy)
    circleObject.ay = -Math.abs(circleObject.ay)
  }
}

function circleRect(
  circle: CircleInterface,
  rect: PaddleInterface | BrickInterface,
  paddle: { width; height }
) {
  'worklet'

  const distX = Math.abs(circle.x.value - rect.x.value - rect.width / 2)
  const distY = Math.abs(circle.y.value - rect.y.value - rect.height / 2)
  const rectWidth = rect.width
  const rectHeight = rect.height

  if (distX > rectWidth / 2 + circle.r) {
    return false
  }

  if (distY > rectHeight / 2 + circle.r) {
    return false
  }

  if (distX <= rectWidth / 2) {
    return true
  }

  if (distY <= rectHeight / 2) {
    return true
  }

  const dx = distX - rectWidth / 2
  const dy = distY - rectHeight / 2

  return dx * dx + dy * dy <= circle.r * circle.r
}

function checkCollision(o1: ShapeInterface, o2: ShapeInterface) {
  'worklet'
  if (isCircle(o1) && (isBrick(o2) || isPaddle(o2))) {
    const rect = o2
    const circle = o1

    if (isBrick(rect) && !rect.canCollide.value) {
      return {
        collisionInfo: null,
        collided: false,
      }
    }

    const isCollision = circleRect(circle, rect, {
      width: rect.width,
      height: rect.height,
    })

    if (isCollision) {
      const dx = rect.x.value + rect.width / 2 - circle.x.value
      const dy = rect.y.value + rect.height / 2 - circle.y.value
      const d = Math.sqrt(dx * dx + dy * dy)

      if (isBrick(rect)) {
        rect.canCollide.value = false
      }

      return {
        collisionInfo: {
          x: rect.x.value,
          y: rect.y.value,
          dx,
          dy,
          d,
        },
        collided: true,
      }
    }
  }

  return {
    collisionInfo: null,
    collided: false,
  }
}

const resovleCollisionWithboucne = (info: Collision) => {
  'worklet'
  if (isCircle(info.o1) && (isPaddle(info.o2) || isBrick(info.o2))) {
    const ball = info.o1
    const rect = info.o2

    // Determine which side of the rectangle the ball hit
    const overlapX = ball.x.value - rect.x.value - rect.width / 2
    const overlapY = ball.y.value - rect.y.value - rect.height / 2

    if (Math.abs(overlapX) > Math.abs(overlapY)) {
      // Horizontal collision
      ball.vx = -ball.vx
      ball.x.value =
        overlapX > 0
          ? rect.x.value + rect.width + ball.r
          : rect.x.value - ball.r
    } else {
      // Vertical collision
      ball.vy = -ball.vy
      ball.y.value =
        overlapY > 0
          ? rect.y.value + rect.height + ball.r
          : rect.y.value - ball.r
    }

    if (isPaddle(rect)) {
      // Adjust horizontal velocity based on where the ball hit the paddle
      const hitPos = (ball.x.value - rect.x.value) / rect.width
      ball.vx = MAX_SPEED * (hitPos - 0.5) * 2
    }
  }
}

const animate = (
  objects: ShapeInterface[],
  timeSinceprevFrame: number,
  brickCount
) => {
  'worklet'
  for (const obj of objects) {
    if (obj.type === 'Circle') {
      move(obj, (0.15 / 16) * timeSinceprevFrame)
    }
  }

  for (const obj of objects) {
    if (obj.type === 'Circle') {
      resloveWallCollision(obj)
    }
  }

  for (const [i, o1] of objects.entries()) {
    for (const [j, o2] of objects.entries()) {
      if (i < j) {
        const { collided, collisionInfo } = checkCollision(o1, o2)
        if (collided && collisionInfo) {
          if (isCircle(o1) && (isPaddle(o2) || isBrick(o2))) {
            resovleCollisionWithboucne({
              dx: collisionInfo.dx,
              dy: collisionInfo.dy,
              d: collisionInfo.d,
              o1,
              o2,
            })
          }
        }
      }
    }
  }
}
