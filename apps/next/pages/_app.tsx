import '@tamagui/core/reset.css'
import '@tamagui/font-inter/css/400.css'
// import '@tamagui/font-inter/css/700.css'
import 'raf/polyfill'

import React, { ReactNode } from 'react'
import Head from 'next/head'
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import type { SolitoAppProps } from 'solito'
import { Provider } from 'app/provider'
import { NextPage } from 'next/types'
import { Playfair_Display } from 'next/font/google'

if (process.env.NODE_ENV === 'production') {
  require('../public/tamagui.css')
}

const font = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--my-font',
})

function MyApp({ Component, pageProps }: SolitoAppProps) {
  return (
    <>
      <Head>
        <title>bensch.ac</title>
        <meta
          name='developer living in new york city'
          content='a personal blog and portfolio'
        />
        <link
          rel='icon'
          href='/favicon.ico'
        />
        <script
          dangerouslySetInnerHTML={{
            // avoid flash of animated things on enter:
            __html: `document.documentElement.classList.add('t_unmounted')`,
          }}
        />
      </Head>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => ReactNode
}
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useRootTheme()

  return (
    <NextThemeProvider
      // change default theme (system) here:
      // defaultTheme="light"
      onChangeTheme={(next) => {
        setTheme(next as any)
      }}
    >
      <Provider
        disableRootThemeClass
        disableInjectCSS
        defaultTheme={theme}
      >
        <div className={font.variable}>{children}</div>
      </Provider>
    </NextThemeProvider>
  )
}

export default MyApp
