import {
  Anchor,
  Button,
  H1,
  H3,
  ListItem,
  Paragraph,
  ScrollView,
  Separator,
  Sheet,
  Spacer,
  useToastController,
  XStack,
  YGroup,
  YStack,
} from '@my/ui'
import { ChevronDown, ChevronUp, X } from '@tamagui/lucide-icons'
import { useEffect, useState } from 'react'
import { useLink, useRouter } from 'solito/navigation'
import { RecurseCenter, OAuth2Config, TokenResponse } from 'recurse-center'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const config: OAuth2Config = {
  clientId: 'lYxmn-I2EQStfAquOLGr53pkzqru30EYQvBGACG3PMU',
  clientSecret: '0A7VUfrgkpFMUx0u_jaCESTDT7XiKbGD2nzD03',
  redirectUri: 'http://localhost:3000',
  authorizationEndpoint: 'https://www.recurse.com/oauth/authorize',
  tokenEndpoint: 'https://www.recurse.com/oauth/token',
  scope: 'public',
  apiBaseUrl: 'https://www.recurse.com',
}

const client = new RecurseCenter(config)
// TODO: don't commit
const authCode = 'V6bvSc6n5qTzRdFwORtpRJIp299L3kYkWlRLpsO0su8'
const authCode2 = 'uSCZ8zwV8Bbv7zckatMwQ5Htb9sOiz7w_dr915gn4jo'
async function exchangeCodeForTokens(code: string): Promise<TokenResponse> {
  const response = await fetch('/api/exchange-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  })

  if (!response.ok) {
    console.log('response hit an error', response)
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to exchange token')
  }

  return await response.json()
}

// async function exchangeCodeForTokens(code: string): Promise<void> {
//   try {
//     const response = await fetch('/api/exchange-token', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ code }),
//     })

//     if (!response.ok) {
//       const errorData = await response.json()
//       throw new Error(errorData.error || 'Failed to exchange token')
//     }

//     const data: TokenResponse = await response.json()
//     // this.setTokens(data)
//   } catch (error) {
//     if (error instanceof Error) {
//       throw new Error(`Failed to exchange code for tokens: ${error.message}`)
//     }
//     throw new Error('An unknown error occurred')
//   }
// }
export function HomeScreen({ pagesMode = false }: { pagesMode?: boolean }) {
  const [oauthState, setOauthState] = useState<string | null>(null)

  const skiaLink = useLink({
    href: '/skia',
  })
  const buttonsLink = useLink({
    href: '/buttons',
  })

  const router = useRouter()

  // useEffect(() => {
  //   async function handleAuth() {
  //     const { code, state } = router.query
  //     if (
  //       code &&
  //       state &&
  //       typeof code === 'string' &&
  //       typeof state === 'string'
  //     ) {
  //       try {
  //         const tokenResponse = await exchangeCodeForTokens(code)
  //         console.log('Successfully exchanged code for tokens', tokenResponse)
  //         client.setTokens(tokenResponse)
  //         // client.

  //         // Here you might want to save the tokens and update your app's state
  //       } catch (error) {
  //         console.error('Error exchanging code for tokens:', error)
  //       }
  //     }
  //   }

  //   handleAuth()
  // }, [router.query, oauthState])

  const getProfilesTest = () => {
    const authUrl = client.getAuthorizationUrl()
    const state = new URL(authUrl).searchParams.get('state')
    setOauthState(state)
    window.location.href = authUrl
  }
  const handleGetOAuthToken = async () => {
    // await client.exchangeCodeForTokens(authCode2)
    // const profiles = await client.getProfiles()
    // console.log(profiles)
    fetch('/api/protected-route', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify({ code: authCode2 }),
    })
  }
  const insets = useSafeAreaInsets()
  return (
    <ScrollView {...insets} >
    {/* <Spacer size='$12' /> */}
    <YStack
      f={1}
      ai='center'
      p='$4'
      rowGap="$2"
      w='100%'
      theme='alt2'
    >
      <XStack>
        <H3
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
            {...buttonsLink}
            title='buttons'
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
      <YGroup elevation='$0.25'>
        <H3
          size='$10'
          ta='left'
          f={1}
        >
          Skia
        </H3>
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
    </ScrollView>
  )
}
