import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import {
  MDXRemote,
  MDXRemoteProps,
  MDXRemoteSerializeResult,
} from 'next-mdx-remote'
import Layout from 'components/layout'
import { BlogScreen } from 'app/features/blog/screen'
import {
  H1,
  Text,
  Image,
  H3,
  XStack,
  Paragraph as OGParagraph,
  Spacer,
  YStack,
  styled,
  ListItem,
  H2,
} from 'tamagui'
import { getAllPosts, getPostBySlug } from '../lib/posts'
import { Suspense } from 'react'
import { GetStaticProps } from 'next'
// type getAllPosts = ReturnType<Awaited<typeof getAllPosts>>
type GetAllPosts = Awaited<ReturnType<typeof getAllPosts>>
type GetPostBySlug = Awaited<ReturnType<typeof getPostBySlug>>

const Paragraph = styled(OGParagraph, {
  fontSize: '$5',
})

type PageProps = {
  source: GetPostBySlug
}
import type { GetStaticPaths, InferGetStaticPropsType } from 'next'

type Repo = {
  name: string
  stargazers_count: number
}

// export const getStaticProps = (async () => {
//   const posts = await getAllPosts()
//   return { props: { source: posts } }
// }) satisfies GetStaticProps<PageProps>

const components = {
  Image: (props: unknown) => (
    <Image
      maxWidth='100%'
      objectFit='cover'
      // @ts-expect-error - tamagui props aren't matching up
      {...props}
    />
  ),
  h1: H1,
  h2: H2,
  Spacer,
  h3: H3,
  p: Paragraph,
  li: ListItem,
  // @ts-expect-error - not sure how to type this
  code: ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
      <SyntaxHighlighter
        children={String(children).replace(/\n$/, '')}
        style={atomDark}
        language={match[1]}
        PreTag='div'
        {...props}
      />
    ) : (
      <span
        className={className}
        {...props}
      >
        {children}
      </span>
    )
  },
}
export default function Page(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <Layout>
      <YStack
        mx='auto'
        // @ts-expect-error
        width='80ch'
      >
        <Suspense fallback={<H1>Loading...</H1>}>
          <MDXRemote
            // @ts-expect-error - tamagui props aren't matching up
            // this is fine for the moment, text styles are rendering as expected
            components={components}
            {...props.source.source}
          />
        </Suspense>
      </YStack>
    </Layout>
  )
}

export const getStaticProps = (async (props) => {
  const id = Array.isArray(props?.params?.id)
    ? props?.params?.id[0]
    : props?.params?.id
  if (!id) {
    return {
      notFound: true,
    }
  }
  const posts = await getPostBySlug(id)
  return { props: { source: posts } }
}) satisfies GetStaticProps<PageProps>

export const getStaticPaths = (async () => {
  const posts = await getAllPosts()
  return {
    fallback: false,
    paths: posts.map((post) => ({
      params: { id: post.source.frontmatter.slug },
    })),
  }
}) as GetStaticPaths
