import { readFile, readdir } from 'node:fs/promises'
import { Feed } from 'feed'
import matter from 'gray-matter'

export interface Post {
  slug: string
  title: string
  date: string
  spoiler: string
  youtube?: string
  bluesky?: string
}

export const metadata = {
  title: 'refactored — A blog by Sulhadin Öney',
  description: 'A blog by Sulhadin Öney',
  openGraph: {
    title: 'refactored',
  },
  alternates: {
    types: {
      'application/atom+xml': 'https://sulhadin.com/atom.xml',
      'application/rss+xml': 'https://sulhadin.com/rss.xml',
    },
  },
}

export async function getPosts(): Promise<Post[]> {
  const entries = await readdir('./public/', { withFileTypes: true })
  const dirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
  const fileContents = await Promise.all(
    dirs.map((dir) => readFile(`./public/${dir}/index.md`, 'utf8')),
  )
  const posts = dirs.map((slug, i) => {
    const fileContent = fileContents[i]
    const { data } = matter(fileContent)
    return { slug, ...data }
  })
  posts.sort((a: any, b: any) => {
    return Date.parse(a.date) < Date.parse(b.date) ? 1 : -1
  })
  return posts as Post[]
}

export async function generateFeed() {
  const posts = await getPosts()
  const site_url = 'https://sulhadin.com/'

  const feedOptions = {
    author: {
      name: 'Sulhadin Öney',
      email: 'sulhadin@gmail.com',
      link: site_url,
    },
    description: metadata.description,
    favicon: `${site_url}/icon.png`,
    feedLinks: { atom: `${site_url}atom.xml`, rss: `${site_url}rss.xml` },
    generator: 'Feed for Node.js',
    id: site_url,
    image: 'https://github.com/sulhadin.png',
    link: site_url,
    title: metadata.title,
  }

  const feed = new Feed(feedOptions as any)

  for (const post of posts) {
    feed.addItem({
      date: new Date(post.date),
      description: post.spoiler,
      id: `${site_url}${post.slug}/`,
      link: `${site_url}${post.slug}/`,
      title: post.title,
    })
  }

  return feed
}
