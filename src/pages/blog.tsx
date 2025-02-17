// ArchiveOverview.tsx
import { defineComponent, ref, computed, onMounted } from 'vue'
import BackButton from '~/components/BackButton'
import styles from './blog.module.sass'

interface BlogPost {
  path: string
  title: string
  date: string
  tags: string[]
  category: string
  description?: string
  cover?: string
  comment?: string
}

export default defineComponent({
  name: 'ArchiveOverview',
  setup() {
    const posts = ref<BlogPost[]>([])

    const parseFrontmatter = (content: string) => {
      const match = content.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---/)
      if (!match) {
        console.log('No frontmatter found in content:', content.substring(0, 100) + '...')
        return null
      }
      const frontmatter = match[1]
      const data: Record<string, any> = {}

      frontmatter.split('\n').forEach((line) => {
        const colonIndex = line.indexOf(':')
        if (!line.trim() || colonIndex === -1) return

        const key = line.slice(0, colonIndex).trim()
        const value = line.slice(colonIndex + 1).trim()

        data[key] =
          key === 'tags'
            ? value.replace(/^\[|\]$/g, '').trim()
              ? value
                  .replace(/^\[|\]$/g, '')
                  .trim()
                  .split(',')
                  .map((tag) => tag.trim())
              : []
            : value.replace(/^["'](.*)["']$/, '$1')
      })
      return data
    }

    const importAllPosts = async () => {
      const markdownFiles = import.meta.glob('/src/blog/*.md', { as: 'raw', eager: false })
      const postPromises = Object.entries(markdownFiles).map(async ([path, loader]) => {
        try {
          const content = await loader()
          const metadata = parseFrontmatter(content)
          if (!metadata) return null

          return {
            path: path.replace('/src/blog/', '').replace('.md', ''),
            title: metadata.title || 'Untitled',
            date: metadata.date || new Date().toISOString(),
            tags: metadata.tags || [],
            category: metadata.category || 'Uncategorized',
            description: metadata.description,
            cover: metadata.cover,
            comment: metadata.comment
          } as BlogPost
        } catch {
          return null
        }
      })

      const loadedPosts = (await Promise.all(postPromises)).filter((p): p is BlogPost => p !== null)
      posts.value = loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }

    const groupedPosts = computed(() => {
      const grouped: Record<string, BlogPost[]> = {}
      posts.value.forEach((post) => {
        const year = new Date(post.date).getFullYear().toString()
        if (!grouped[year]) grouped[year] = []
        grouped[year].push(post)
      })

      const sortedYears = Object.keys(grouped).sort((a, b) => b.localeCompare(a))
      sortedYears.forEach((year) => {
        grouped[year].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      })
      return sortedYears.map((year) => ({
        year,
        posts: grouped[year]
      }))
    })

    onMounted(() => {
      importAllPosts()
    })

    return () => (
      <div class={styles.archivePage}>
        <BackButton to='/' class={styles.backButton} />
        <div class={styles.archiveContainer}>
          {groupedPosts.value.map((group) => (
            <div key={group.year} class={styles.yearSection}>
              <h2 class={styles.yearTitle}>{group.year}</h2>
              {group.posts.map((post) => (
                <div key={post.path} class={styles.archivePost}>
                  {post.cover && (
                    <div class={styles.thumbnail}>
                      <img src={post.cover} alt={`Cover for ${post.title}`} />
                    </div>
                  )}
                  <div class={styles.postDetails}>
                    <p class={styles.postDate}>{new Date(post.date).toLocaleDateString()}</p>
                    <h3 class={styles.postTitle}>{post.title}</h3>
                    <p class={styles.postCategory}>Category: {post.category}</p>
                    {post.tags?.length > 0 && (
                      <p class={styles.postTags}>Tags: {post.tags.join(', ')}</p>
                    )}
                    {post.description && (
                      <p class={styles.postDescription}>{post.description}</p>
                    )}
                    {post.comment && (
                      <p class={styles.postComment}>Comment: {post.comment}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }
})
