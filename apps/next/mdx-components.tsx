import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'
import { H1, H3, Text } from 'tamagui'

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => <H1>{children}</H1>,
    h3: ({ children }) => <H3>{children}</H3>,
    p: ({ children }) => <Text>{children}</Text>,
    img: (props) => (
      <Image
        sizes='100vw'
        style={{ width: '100%', height: 'auto' }}
        {...(props as ImageProps)}
      />
    ),
    ...components,
  }
}
