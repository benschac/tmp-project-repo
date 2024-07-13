import { H1 } from '@my/ui'
import { Canvas, Circle, Group } from '@shopify/react-native-skia'

import { Stack } from 'expo-router'

export default function Screen() {
  const width = 256
  const height = 256
  const r = width * 0.33
  return (
    <>
      <Stack.Screen
        options={{
          title: 'skia',
        }}
      />
      return (
      <Canvas style={{ width, height }}>
        <Group blendMode='multiply'>
          <Circle
            cx={r}
            cy={r}
            r={r}
            color='cyan'
          />
          <Circle
            cx={width - r}
            cy={r}
            r={r}
            color='magenta'
          />
          <Circle
            cx={width / 2}
            cy={width - r}
            r={r}
            color='yellow'
          />
        </Group>
      </Canvas>
      );
    </>
  )
}
