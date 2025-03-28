import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import BackButton from '~/components/BackButton'
import styles from './index.module.sass'

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
	name: 'BlogIndexOverview',
	setup() {
		useHead({
			title: '博客列表',
			link: [{ rel: 'canonical', href: 'https://cvyl.me/blog' }],
			meta: [
				{ property: 'og:url', content: 'https://cvyl.me/blog' },
				{ name: 'description', content: 'Mikka的博客文章列表' },
				{ property: 'og:title', content: '博客列表' },
				{ property: 'og:description', content: 'Mikka的博客文章列表' },
				{ property: 'twitter:title', content: '博客列表' },
				{ property: 'twitter:description', content: 'Mikka的博客文章列表' }
			]
		})
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
				let value = line.slice(colonIndex + 1).trim()

				// Format markdown-like syntax in values
				const formatMarkdown = (text: string) =>
					text
						.replace(/~~(.*?)~~/g, '<del>$1</del>') // Strikethrough
						.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
						.replace(/\*(.*?)\*/g, '<em>$1</em>') // Italics

				data[key] =
					key === 'tags'
						? value.replace(/^\[|\]$/g, '').trim()
							? value
									.replace(/^\[|\]$/g, '')
									.trim()
									.split(',')
									.map((tag) => tag.trim())
							: []
						: formatMarkdown(value.replace(/^["'](.*)["']$/, '$1'))
			})
			return data
		}

		const importAllPosts = async () => {
			const markdownFiles = import.meta.glob('/src/blog/*.md', { query: '?raw', import: 'default' })

			const postPromises = Object.entries(markdownFiles).map(async ([path, loader]) => {
				try {
					const content = await loader()
					if (typeof content !== 'string') throw new Error('Invalid content type')
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

		// Group posts by year (descending)
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
			<div class={styles.blogIndexPage}>
				<BackButton to='/' class={styles.backButton} />

				<div class={styles.blogIndexContainer}>
					{groupedPosts.value.map((group) => (
						<div key={group.year} class={styles.blogIndexYearSection}>
							<h2 class={styles.blogIndexYearTitle}>{group.year}</h2>
							{group.posts.map((post, index) => (
								<div key={post.path} class={styles.postItem} style={{ transitionDelay: `${index * 0.1}s` }}>
									<div class={styles.flexContainer}>
										<div>
											<div class={styles.category}>{post.category}</div>
											<div class={styles.title}>
												<RouterLink to={`/blog/${post.path}`}>
													<span>{post.title}</span>
												</RouterLink>
											</div>
											<div class={styles.date}>{new Date(post.date).toLocaleDateString()}</div>
											{post.description && <div class={styles.desc} v-html={post.description}></div>}
											{post.tags?.length > 0 && (
												<div class={styles.tags}>
													{post.tags.map((tag) => (
														<span class={styles.tag} key={tag}>
															#{tag}{' '}
														</span>
													))}
												</div>
											)}
											{/*{post.comment && <div class={styles.comment}>Comment: {post.comment}</div>}
                      future ideas*/}
										</div>
										{post.cover && <img src={post.cover} alt={post.title} class={styles.banner} />}
									</div>
									<div class={styles.hf} />
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		)
	}
})
