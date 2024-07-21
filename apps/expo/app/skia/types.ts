import { SharedValue } from 'react-native-reanimated'
type ShapeVariant =
  | CircleInterface['type']
  | PaddleInterface['type']
  | Brick['type']

export interface ShapeInterface {
  x: SharedValue<number>
  y: SharedValue<number>
  ax: number
  ay: number
  vx: number
  vy: number
  type: ShapeVariant
  id: number
}

export interface CircleInterface extends ShapeInterface {
  r: number
  type: 'Circle'
}

export interface PaddleInterface extends ShapeInterface {
  type: 'Paddle'
  width: number
  height: number
}

export interface Collision {
  o1: ShapeInterface
  o2: ShapeInterface
  dx: number
  dy: number
  d: number
}
export interface BrickInterface extends ShapeInterface {
  type: 'Brick'
  width: number
  height: number
  canCollide: SharedValue<boolean>
}
