import { Button, Text, H1, Paragraph, Separator, XStack, YStack } from '@my/ui'
import type { GestureReponderEvent } from '@tamagui/core'
import { useRouter } from 'solito/router'

export const Link = ({
  href,
  tag = 'a',
  ...props
}: {
  href: string
  children: React.ReactNode
  tag?: string
}) => {
  const router = useRouter()
  const handlePress = (event: GestureReponderEvent) => {
    event.preventDefault()
    router.push(href)
  }

  return (
    <Text
      tag={tag}
      onPress={handlePress}
      cursor='pointer'
      // @ts-expect-error - inhert type is fucked
      lineHeight='inherit'
      {...props}
    />
  )
}
export function BlogScreen(props) {
  // console.log(props, 'prps')
  return (
    <YStack
      f={1}
      jc='center'
      ai='center'
      gap='$8'
      p='$4'
      bg='$background'
    >
      <XStack
        pos='absolute'
        w='100%'
        t='$6'
        gap='$6'
        jc='center'
        fw='wrap'
        $sm={{ pos: 'relative', t: 0 }}
      ></XStack>

      <YStack gap='$4'>
        <Link href='/blog/test'>test</Link>
        <H1
          ta='center'
          col='$color12'
        >
          Blog
        </H1>
        <Paragraph
          col='$color10'
          ta='center'
        >
          Here's a basic starter to show navigating from one screen to another.
        </Paragraph>
        <Separator />
        <Paragraph ta='center'>
          This screen uses the same code on Next.js and React Native.
        </Paragraph>
        <Separator />
      </YStack>
    </YStack>
  )
}
