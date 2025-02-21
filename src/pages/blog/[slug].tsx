import { defineComponent, ref, computed, onMounted, watchEffect } from 'vue'
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

		// Reactive properties
		const metadata = ref<Record<string, any>>({})
		const postContent = ref<string>('')
		const toc = ref<Array<{ id: string; text: string; level: number }>>([])

		// Helper: Slugify headings for TOC
		const slugify = (text: string) =>
			text
				.toLowerCase()
				.trim()
				.replace(/\s+/g, '-')
				.replace(/[^\w\-]+/g, '')

		// Generate Table of Contents
		const updateTOC = () => {
			const tempDiv = document.createElement('div')
			tempDiv.innerHTML = postContent.value
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
			// Update the post HTML with new heading IDs
			postContent.value = tempDiv.innerHTML
			toc.value = newTOC
		}

		// Load post markdown, parse metadata, render HTML
		const loadPost = async () => {
			const slug = route.params.slug as string | undefined
			if (!slug) {
				router.push('/')
				return
			}

			let matchedPath: string | null = null
			for (const path in markdownFiles) {
				const fileName = path.split('/').pop()?.replace('.md', '')
				if (fileName === slug) {
					matchedPath = path
					break
				}
			}

			if (matchedPath) {
				try {
					const content = await markdownFiles[matchedPath]()
					if (typeof content !== 'string') throw new Error('Invalid content type')

					// Extract frontmatter metadata
					const match = content.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---/)
					if (match) {
						metadata.value = parseFrontmatter(match[1])
					}

					// Render markdown content
					postContent.value = await marked(content.replace(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---/, '').trim())

					// Generate TOC
					updateTOC()
				} catch (error) {
					router.push('/')
				}
			} else {
				router.push('/')
			}
		}

		// Helper function to parse frontmatter metadata
		const parseFrontmatter = (content: string) => {
			const data: Record<string, any> = {}
			content.split('\n').forEach((line) => {
				const colonIndex = line.indexOf(':')
				if (colonIndex === -1) return
				const key = line.slice(0, colonIndex).trim()
				let value = line.slice(colonIndex + 1).trim()
				if (key === 'tags') {
					data[key] = value
						.replace(/^\[|\]$/g, '')
						.split(',')
						.map((tag) => tag.trim())
				} else {
					data[key] = value.replace(/^["'](.*)["']$/, '$1')
				}
			})
			return data
		}

		// Computed properties
		const title = computed(() => metadata.value.title || 'Untitled')
		const description = computed(() => metadata.value.description || '')
		const date = computed(() => (metadata.value.date ? new Date(metadata.value.date).toLocaleDateString() : ''))
		const tags = computed(() => metadata.value.tags || [])
		const cover = computed(() => metadata.value.cover || '')
		const postHTML = computed(() => postContent.value)

		// Use VueUse head for dynamic metadata updates
		useHead({
			title,
			link: [{ rel: 'canonical', href: computed(() => `https://cvyl.me/blog/${route.params.slug}`) }],
			meta: [
				{ name: 'description', content: description },
				{ property: 'og:url', content: computed(() => `https://cvyl.me/blog/${route.params.slug}`) },
				{ property: 'og:type', content: 'article' },
				{ property: 'og:title', content: title },
				{ property: 'og:site_name', content: "cvyl's Blog" },
				{ property: 'og:description', content: description },
				{ property: 'og:locale', content: 'en_US' },
				{ property: 'og:image', content: cover },
				{ property: 'article:author', content: 'cvyl' },
				{ property: 'twitter:title', content: title },
				{ property: 'twitter:description', content: description },
				{ property: 'twitter:card', content: 'summary_large_image' },
				{ property: 'twitter:image', content: cover },
				{ property: 'twitter:site', content: 'https://cvyl.me' },
				...computed(() =>
					tags.value.map((tag) => ({
						property: 'article:tag',
						content: tag
					}))
				).value
			]
		})

		// Watch for route changes to reload posts
		watchEffect(loadPost)

		return () => (
			<div class={styles.postPage}>
				<BackButton to='/blog' class={styles.backButton} />
				{!postHTML.value ? (
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
							{cover.value && (
								<div class={styles.bannerContainer}>
									<img src={cover.value} alt={title.value} class={styles.banner} />
								</div>
							)}
							<h1 class={styles.postTitle}>{title.value}</h1>
							<div class={styles.postMeta}>
								<span class={styles.postDate}>{date.value}</span>
								{tags.value.length > 0 && (
									<span class={styles.postTags}>
										{tags.value.map((tag) => (
											<span key={tag} class={styles.tag}>
												#{tag}{' '}
											</span>
										))}
									</span>
								)}
							</div>
							<div class={styles.postContent} v-html={postHTML.value}></div>
						</div>
					</div>
				)}
			</div>
		)
	}
})
