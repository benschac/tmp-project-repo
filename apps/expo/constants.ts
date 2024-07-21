import { Dimensions } from 'react-native'

const { height: windowHeight, width: windowWidth } = Dimensions.get('window')

export const BALL_COLOR = '#77FF23'
export const startColors = [
  'rgba(34, 193, 195, 1)',
  'rgba(34,193,195,1)',
  'rgba(63,94,251,1)',
  'rgba(253,29,29,1)',
]
export const endColors = [
  'rgba(0,212,255,1)',
  'rgba(253,187,45,1)',
  'rgba(252,70,107,1)',
  'rgba(252,176,69,1)',
]

export const TOTAL_BRICKS = 18
export const BRICK_ROW_LENGTH = 3
export const PADDLE_HEIGHT = 50
export const PADDLE_WIDTH = 125
export const BRICK_HEIGHT = 25
export const BRICK_WIDTH = 80
export const BRICK_MIDDLE = windowWidth / 2 - BRICK_WIDTH / 2
export const PADDLE_MIDDLE = windowWidth / 2 - PADDLE_WIDTH / 2
export const RADIUS = 16
export const MAX_SPEED = 50

export const height = windowHeight
export const width = windowWidth
// const size = 256;
//   const r = useSharedValue(0);
//   const c = useDerivedValue(() => size - r.value);
//   useEffect(() => {
//     r.value = withRepeat(withTiming(size * 0.33, { duration: 1000 }), -1);
//   }, [r, size]);
//   return (
//     <Canvas style={{ flex: 1 }}>
//       <Group blendMode="multiply">
//         <Circle cx={r} cy={r} r={r} color="cyan" />
//         <Circle cx={c} cy={r} r={r} color="magenta" />
//         <Circle
//           cx={size/2}
//           cy={c}
//           r={r}
//           color="yellow"
//         />
//       </Group>
//     </Canvas>
//   );
