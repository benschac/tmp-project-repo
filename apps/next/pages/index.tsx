import { HomeScreen } from 'app/features/home/screen'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, shaderMaterial, Box } from '@react-three/drei'
// import vertexShader from '../shaders/vertex.glsl'
// import fragmentShader from '../shaders/fragment.glsl'
// const Scene = () => {
//   const ref = React.useRef()
//   return (
//     <Canvas>
//       <OrbitControls />
//       <ambientLight intensity={1.5} />
//       <spotLight
//         position={[100, 100, 100]}
//         angle={0.15}
//         penumbra={1}
//       />
//       <Box scale={2}>
//         <meshStandardMaterial color='orange' />
//       </Box>
//     </Canvas>
//   )
// }

import Layout from 'components/layout'
import {
  Button,
  // Circle as OGCircle,
  H1,
  ThemeTokens,
  SizeTokens,
  Circle as TamaguiCircle,
  XStack,
  YStack,
} from 'tamagui'
import { Svg, Circle as OGCircle } from 'react-native-svg'
import { View } from 'react-native'
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import React, { useRef } from 'react'
import { Shaders, Node, GLSL } from 'gl-react'
import { Surface } from 'gl-react-dom'

// in gl-react you need to statically define "shaders":
const shaders = Shaders.create({
  helloGL: {
    // This is our first fragment shader in GLSL language (OpenGL Shading Language)
    // (GLSL code gets compiled and run on the GPU)
    frag: GLSL`
precision highp float;
varying vec2 uv;
void main() {
  gl_FragColor = vec4(uv.x, uv.y, 0.5, 1.0);
}
`,
    // the main() function is called FOR EACH PIXELS
    // the varying uv is a vec2 where x and y respectively varying from 0.0 to 1.0.
    // we set in output the pixel color using the vec4(r,g,b,a) format.
    // see GLSL_ES_Specification_1.0.17
  },
})

const Circle = React.forwardRef((ref, props) => {
  return function InnerCircle({ size }: { size: number }) {
    return (
      <View
        ref={ref}
        {...props}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: 'purple',
        }}
      />
    )
  }
})

const AnimatedSVGCircle = Animated.createAnimatedComponent(OGCircle)
const AnimatedTamaguiCircle = Animated.createAnimatedComponent(TamaguiCircle)
const RawReactNativeCircle = Animated.createAnimatedComponent(Circle)

export default function Page() {
  const width = useSharedValue(150)
  const r = useSharedValue(10)
  const offset = useSharedValue(50)
  const handlePress = () => {
    width.value = withSpring(width.value + 50)
  }

  const handleCirclePress = () => {
    console.log('here')
    r.value += 10
    console.log(r.value)
  }

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: width.value * 2 }],
    }
  }, [width])

  const animatedProps = useAnimatedProps(() => {
    console.log('here')
    return { r: r.value }
  }, [r])
  const animatedTamaguiProps = useAnimatedProps(() => {
    console.log('here')
    return { size: r.value }
  }, [r])

  const offSetStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offset.value }],
    }
  }, [offset])

  const handleOffsetPress = () => {
    offset.value = withTiming(100)
  }

  return (
    <Layout>
      <YStack f={1}>
        <Surface
          width={300}
          height={300}
        >
          <Node shader={shaders.helloGL} />
        </Surface>
        <Animated.View
          style={[
            offSetStyles,
            {
              height: 100,
              width: 100,
              backgroundColor: 'violet',
            },
          ]}
        />
        {/* <Animated.View
        style={[
          animatedStyles,
          {
            height: 100,
            backgroundColor: 'violet',
          },
        ]}
      />
      <AnimatedTamaguiCircle
        size={10}
        animatedProps={animatedTamaguiProps}
        bg='blue'
      />
      <TamaguiCircle
        size={10}
        bg='blue'
        animation='lazy'
      /> */}
        {/* <RawReactNativeCircle size={10} /> */}
        {/* <Svg>
        <AnimatedSVGCircle
          fill='red'
          animatedProps={animatedProps}
        />
      </Svg> */}
        <XStack>
          <Button onPress={handleOffsetPress}>offset</Button>
          <Button onPress={handlePress}>hello</Button>
          <Button onPress={handleCirclePress}>circle</Button>
        </XStack>
        {/* <H1>TODO</H1> */}
      </YStack>
    </Layout>
  )
}
