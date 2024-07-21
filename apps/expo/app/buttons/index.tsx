import { ScrollView } from '@my/ui'

import { Stack } from 'expo-router'

function Page() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'buttons',
        }}
      />
      <ScrollView px='$2'></ScrollView>
    </>
  )
}
