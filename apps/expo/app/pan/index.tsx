import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import { H1 } from '@my/ui'
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import Animated from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'

export default function Screen() {
  const isPressed = useSharedValue(false)
  const start = useSharedValue({
    x: 0,
    y: 0,
  })
  const offset = useSharedValue({
    x: 0,
    y: 0,
  })
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: offset.value.x,
        },
        {
          translateY: offset.value.y,
        },
        {
          scale: withSpring(isPressed.value ? 1 : 1.4),
        },
      ],
    }
  })

  const gesture = Gesture.Pan()
    .onBegin((props) => {
      isPressed.value = true
    })
    .onUpdate((props) => {
      offset.value = {
        x: props.translationX + start.value.x,
        y: props.translationY + start.value.y,
      }
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      }
    })
    .onFinalize(() => {
      isPressed.value = false
    })

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Pan',
          headerShown: true,
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[animatedStyles]}>
            <H1>Hi booooo</H1>
          </Animated.View>
        </GestureDetector>
      </SafeAreaView>
    </>
  )
}
