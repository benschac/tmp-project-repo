import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import Layout from 'components/layout'
import { BlogScreen } from 'app/features/blog/screen'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { H1, Text, Image, H3, XStack } from 'tamagui'
import { getAllPosts } from '../lib/posts'
import { Suspense } from 'react'
import { GetStaticProps } from 'next'
// type getAllPosts = ReturnType<Awaited<typeof getAllPosts>>
type GetAllPosts = Awaited<ReturnType<typeof getAllPosts>>

type PageProps = {
  source: GetAllPosts
}
import type { InferGetStaticPropsType } from 'next'

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
  const posts = await getAllPosts()
  return { props: { source: posts } }
}) satisfies GetStaticProps<PageProps>

const components = {
  Image,
  h1: H1,
  h3: H3,
  p: Text,
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
        {/* {props.source && (
          <MDXRemote
            components={components}
            {...props.source.source}
          />
        )} */}
        {/* <MDXRemote
          components={components}
          {...props.source}
        /> */}
        {/* <BlogScreen /> */}
      </Suspense>
    </Layout>
  )
}
