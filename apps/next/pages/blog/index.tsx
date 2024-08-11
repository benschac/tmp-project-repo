import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import Layout from 'components/layout'
import { BlogScreen } from 'app/features/blog/screen'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import {
  H1,
  H2,
  Text,
  Image,
  H3,
  XStack,
  Paragraph,
  YStack,
  H5,
  Separator,
  Spacer,
  Theme,
} from 'tamagui'
import { getAllPosts } from '../lib/posts'
import { Suspense } from 'react'
import { useLink } from 'solito/navigation'
import { GetStaticProps } from 'next'
// type getAllPosts = ReturnType<Awaited<typeof getAllPosts>>
type GetAllPosts = Awaited<ReturnType<typeof getAllPosts>>

type PageProps = {
  source: GetAllPosts
}
import type { InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'

type Repo = {
  name: string
  stargazers_count: number
}

// export const getStaticProps = (async (context) => {
//   const res = await fetch('https://api.github.com/repos/vercel/next.js')
//   const repo = await res.json()
//   return { props: { repo } }
// }) satisfies GetStaticProps<{
//   repo: Repo
// }>

export const getStaticProps = (async () => {
  const posts = (await getAllPosts()).sort((a, b) => {
    return (
      new Date(b.source.frontmatter.date as string).getTime() -
      new Date(a.source.frontmatter.date as string).getTime()
    )
  })
  return { props: { source: posts } }
}) satisfies GetStaticProps<PageProps>

const components = {
  Image,
  h1: H1,
  h2: H2,
  h3: H3,
  p: Paragraph,
  Test: Text,
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
      <Suspense fallback={<H1>Loading...</H1>}>
        <YStack
          pt='$4'
          mx='auto'
          rowGap='$4'
        >
          {props.source.map((post, idx) => {
            const blogLink = useLink({
              href: `/blog/${props.source[idx].source.frontmatter.slug}`,
            })
            const { title, date, description, tags } = post.source.frontmatter
            return (
              <>
                <YStack
                  cursor='pointer'
                  key={idx}
                  {...blogLink}
                >
                  <YStack rowGap='$2'>
                    <H5 size='$6'>
                      {new Date(date as string).toLocaleDateString()}
                    </H5>
                    <H2 size='$10'>{title}</H2>
                    <XStack columnGap='$2'>
                      <XStack columnGap='$2'>
                        {/* @ts-expect-error */}
                        {tags?.map((tag: string, idx: number) => {
                          return (
                            <Theme inverse>
                              <Paragraph
                                bg='$color'
                                br='$2'
                                color='$background'
                                key={idx}
                                px='$2'
                                size='$1'
                              >
                                {tag}
                              </Paragraph>
                            </Theme>
                          )
                        })}
                      </XStack>
                    </XStack>
                  </YStack>
                  <Spacer size='$4' />
                  <Paragraph>{description}</Paragraph>
                </YStack>
                <Separator />
              </>
            )
          })}
        </YStack>
      </Suspense>
    </Layout>
  )
}
