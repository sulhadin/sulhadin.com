import Color from 'colorjs.io'
import Link from './Link'
import { sans } from './fonts'
import { type Post, getPosts, metadata } from './posts'

export { metadata }

export default async function Home() {
  const posts = await getPosts()
  return (
    <div className="relative -top-[10px] flex flex-col gap-8">
      {posts.map((post) => (
        <Link
          key={post.slug}
          className="block py-4 hover:scale-[1.005] will-change-transform"
          href={`/${post.slug}/`}
        >
          <article>
            <PostTitle post={post} />
            <PostMeta post={post} />
            <PostSubtitle post={post} />
          </article>
        </Link>
      ))}
    </div>
  )
}

function PostTitle({ post }: { post: Post }) {
  const lightRange = Color.range('lab(63 59.32 -1.47)', 'lab(33 42.09 -43.19)')
  const darkRange = Color.range('lab(78.9 0.88 -24)', 'lab(78 19.97 -36.75)')
  const today = new Date()
  const timeSinceFirstPost = today.getTime() - new Date(2018, 10, 30).getTime()
  const timeSinceThisPost = today.getTime() - new Date(post.date).getTime()
  const staleness = timeSinceThisPost / timeSinceFirstPost

  return (
    <h2
      className={[
        sans.className,
        'text-[28px] font-black leading-none mb-2',
        'text-[--lightLink] dark:text-[--darkLink]',
      ].join(' ')}
      style={
        {
          '--lightLink': lightRange(staleness).toString(),
          '--darkLink': darkRange(staleness).toString(),
        } as any
      }
    >
      {post.title}
    </h2>
  )
}

function PostMeta({ post }: { post: Post }) {
  return (
    <p className="text-[13px] text-gray-700 dark:text-gray-300">
      {new Date(post.date).toLocaleDateString('en', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}
    </p>
  )
}

function PostSubtitle({ post }: { post: Post }) {
  return <p className="mt-1">{post.spoiler}</p>
}
