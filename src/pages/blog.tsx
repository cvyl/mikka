import { defineComponent, ref, onMounted } from 'vue'

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
	name: 'BlogPosts',
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

			console.log('Parsed frontmatter:', data)
			return data
		}

		const importAllPosts = async () => {
			const markdownFiles = import.meta.glob('/src/blog/*.md', { as: 'raw', eager: false })
			console.log('Found markdown files:', Object.keys(markdownFiles))

			const postPromises = Object.entries(markdownFiles).map(async ([path, loader]) => {
				try {
					const content = await loader()
					console.log('Processing file:', path) // Debug log
					console.log('Content preview:', content.substring(0, 200)) // Debug log

					const metadata = parseFrontmatter(content)

					if (!metadata) {
						console.error('Failed to parse frontmatter for:', path)
						return null
					}

					const post: BlogPost = {
						path: path.replace('/src/blog/', '').replace('.md', ''),
						title: metadata.title || 'Untitled',
						date: metadata.date || new Date().toISOString(),
						tags: metadata.tags || [],
						category: metadata.category || 'Uncategorized',
						description: metadata.description,
            cover: metadata.cover,
            comment: metadata.comment
					}

					console.log('Successfully processed:', post.path, post) // Debug log
					return post
				} catch (error) {
					console.error('Error processing file:', path, error)
					return null
				}
			})

			const loadedPosts = (await Promise.all(postPromises)).filter((post): post is BlogPost => post !== null)
			posts.value = loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			console.log('Total posts loaded:', posts.value.length)
		}

		onMounted(() => {
			importAllPosts()
		})

		return () => (
			<div className='blog-posts'>
				{posts.value.map((post) => (
					<div key={post.path} className='post-item'>
						<h2>{post.title}</h2>
						{post.description && <p>{post.description}</p>}
						<p>Date: {new Date(post.date).toLocaleDateString()}</p>
						<p>Category: {post.category}</p>
						<p>Tags: {post.tags.join(', ')}</p>
            <p>Comment: {post.comment}</p>
            <p>Cover: {post.cover}</p>
					</div>
				))}
			</div>
		)
	}
})
