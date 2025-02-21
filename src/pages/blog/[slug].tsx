import { defineComponent, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import { useHead } from '@vueuse/head'
import BackButton from '~/components/BackButton'
import styles from './post.module.sass'

const markdownFiles = import.meta.glob('../../blog/*.md', { query: '?raw', import: 'default' })

export default defineComponent({
	name: 'DynamicBlogPost',
	setup() {
		const route = useRoute()
		const router = useRouter()

		// Reactive data
		const metadata = ref<Record<string, any>>({})
		const postContent = ref<string>('')
		const toc = ref<Array<{ id: string; text: string; level: number }>>([])

		// Helper: Slugify headings for TOC
		const slugify = (text: string) =>
			text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')

		// Extract metadata and remove frontmatter from content
		const extractMetadata = (content: string) => {
			const meta: Record<string, any> = {}
			const match = content.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---/)
			if (match) {
				match[1].split('\n').forEach((line) => {
					const [key, ...rest] = line.split(':')
					if (key && rest.length) {
						let value = rest.join(':').trim()
						if (key === 'tags') {
							value = value.replace(/^\[|\]$/g, '').split(',').map((tag) => tag.trim())
						} else {
							value = value.replace(/^["'](.*)["']$/, '$1')
						}
						meta[key.trim()] = value
					}
				})
				content = content.replace(match[0], '').trim()
			}
			return { metadata: meta, content }
		}

		// Generate Table of Contents
		const generateTOC = (html: string) => {
			const tempDiv = document.createElement('div')
			tempDiv.innerHTML = html
			const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6')
			const newTOC: Array<{ id: string; text: string; level: number }> = []
			headings.forEach((heading) => {
				const text = heading.textContent || ''
				const level = parseInt(heading.tagName.substring(1), 10)
				if (!heading.id) {
					const id = slugify(text)
					heading.id = id
				}
				newTOC.push({ id: heading.id, text, level })
			})
			return { toc: newTOC, updatedHTML: tempDiv.innerHTML }
		}

		// Load post markdown
		const loadPost = async () => {
			const slug = route.params.slug as string | undefined
			if (!slug) {
				router.push('/')
				return
			}

			let matchedPath: string | null = null
			for (const path in markdownFiles) {
				if (path.split('/').pop()?.replace('.md', '') === slug) {
					matchedPath = path
					break
				}
			}

			if (!matchedPath) {
				router.push('/')
				return
			}

			try {
				const rawContent = await markdownFiles[matchedPath]()
				if (typeof rawContent !== 'string') throw new Error('Invalid content type')

				// Extract metadata
				const { metadata: meta, content } = extractMetadata(rawContent)
				metadata.value = meta

				// Render Markdown
				const renderedHTML = await marked(content)

				// Generate TOC
				const { toc: generatedTOC, updatedHTML } = generateTOC(renderedHTML)
				toc.value = generatedTOC
				postContent.value = updatedHTML

				// Set metadata dynamically as soon as it's available
				useHead({
					title: meta.title || 'Untitled',
					meta: [
						{ name: 'description', content: meta.description || '' },
						{ property: 'og:url', content: `https://cvyl.me/blog/${slug}` },
						{ property: 'og:type', content: 'article' },
						{ property: 'og:title', content: meta.title || 'Untitled' },
						{ property: 'og:site_name', content: "cvyl's Blog" },
						{ property: 'og:description', content: meta.description || '' },
						{ property: 'og:image', content: meta.cover || '' },
						{ property: 'article:author', content: 'cvyl' },
						{ property: 'twitter:title', content: meta.title || 'Untitled' },
						{ property: 'twitter:description', content: meta.description || '' },
						{ property: 'twitter:card', content: 'summary_large_image' },
						{ property: 'twitter:image', content: meta.cover || '' },
						{ property: 'twitter:site', content: 'https://cvyl.me' },
						...(meta.tags || []).map((tag) => ({ property: 'article:tag', content: tag }))
					]
				})
			} catch (error) {
				router.push('/')
			}
		}

		// Watch for route changes and reload post
		watch(() => route.params.slug, loadPost, { immediate: true })

		return () => (
			<div class={styles.postPage}>
				<BackButton to='/blog' class={styles.backButton} />
				{!postContent.value ? (
					<p class={styles.loading}>Loading...</p>
				) : (
					<div class={styles.contentWrapper}>
						{/* TOC Section */}
						<nav class={styles.toc}>
							<ul>
								{toc.value.map((item) => (
									<li key={item.id} class={styles[`tocItemLevel${item.level}`]}>
										<a href={`#${item.id}`}>{item.text}</a>
									</li>
								))}
							</ul>
						</nav>

						{/* Blog Post Content */}
						<div class={styles.postContainer}>
							{metadata.value.cover && (
								<div class={styles.bannerContainer}>
									<img src={metadata.value.cover} alt={metadata.value.title} class={styles.banner} />
								</div>
							)}
							<h1 class={styles.postTitle}>{metadata.value.title}</h1>
							<div class={styles.postMeta}>
								<span class={styles.postDate}>{new Date(metadata.value.date).toLocaleDateString()}</span>
								{metadata.value.tags?.length > 0 && (
									<span class={styles.postTags}>
										{metadata.value.tags.map((tag) => (
											<span key={tag} class={styles.tag}>
												#{tag}{' '}
											</span>
										))}
									</span>
								)}
							</div>
							<div class={styles.postContent} v-html={postContent.value}></div>
						</div>
					</div>
				)}
			</div>
		)
	}
})
