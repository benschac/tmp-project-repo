import {
  Anchor,
  Button,
  H1,
  H3,
  ListItem,
  Paragraph,
  Separator,
  Sheet,
  useToastController,
  XStack,
  YGroup,
  YStack,
} from '@my/ui'
import { ChevronDown, ChevronUp, X } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { useLink } from 'solito/navigation'

export function HomeScreen({ pagesMode = false }: { pagesMode?: boolean }) {
  const skiaLink = useLink({
    href: '/skia',
  })
  return (
    <YStack
      f={1}
      ai='center'
      gap='$8'
      p='$4'
      w='100%'
      theme='alt2'
    >
      <XStack>
        <H3
          ff='$body'
          size='$10'
          ta='left'
          f={1}
        >
          Skia
        </H3>
      </XStack>
      <YGroup elevation='$0.25'>
        <YGroup.Item>
          <ListItem
            {...skiaLink}
            title='skia'
          />
        </YGroup.Item>
        <Separator />
        <YGroup.Item>
          <ListItem
            title='Second'
            subTitle='Second subtitle'
          />
        </YGroup.Item>
        <Separator />
        <YGroup.Item>
          <ListItem>Third</ListItem>
        </YGroup.Item>
      </YGroup>
    </YStack>
  )
}
