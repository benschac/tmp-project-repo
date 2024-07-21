import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { YStack, H1 } from '@my/ui'
export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Transitions',
        }}
      />
      <SafeAreaView>
        <YStack>
          <H1>Transitions</H1>
        </YStack>
      </SafeAreaView>
    </>
  )
}
