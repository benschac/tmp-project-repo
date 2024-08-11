import { YStack, styled } from 'tamagui'

export const MyComponent = styled(YStack, {
  name: 'MyComponent',
  variants: {
    blue: {
      true: {
        backgroundColor: 'blue',
      },
    },
  } as const,
})
