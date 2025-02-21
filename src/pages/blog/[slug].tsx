import { defineComponent, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import BackButton from '~/components/BackButton'
import styles from './post.module.sass'

const markdownFiles = import.meta.glob('../../blog/*.md', { query: '?raw', import: 'default' })

export default defineComponent({
	name: 'DynamicBlogPost',
	setup() {
		const route = useRoute()
		const router = useRouter()
		const postHTML = ref('')
		const title = ref('')
		const description = ref('')
		const date = ref('')
		const tags = ref<string[]>([])
		const cover = ref('') // New cover image ref
		const loading = ref(true)
		// Table of Contents (TOC)
		const toc = ref<Array<{ id: string; text: string; level: number }>>([])

		// Simple slugify helper to generate IDs from text
		function slugify(text: string) {
			return text
				.toLowerCase()
				.trim()
				.replace(/\s+/g, '-')
				.replace(/[^\w\-]+/g, '')
		}

		// Parse rendered HTML for headings and build TOC
		function updateTOC() {
			const tempDiv = document.createElement('div')
			tempDiv.innerHTML = postHTML.value
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
			postHTML.value = tempDiv.innerHTML
			toc.value = newTOC
		}

		// Parse frontmatter metadata from markdown
		const parseFrontmatter = (content: string) => {
			const match = content.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---/)
			if (!match) return null
			const frontmatter = match[1]
			const data: Record<string, any> = {}
			frontmatter.split('\n').forEach((line) => {
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

		// Load post markdown, parse metadata, render HTML, and update TOC
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
					const metadata = parseFrontmatter(content)
					const contentWithoutFrontmatter = content.replace(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---/, '').trim()
					if (metadata) {
						title.value = metadata.title || 'Untitled'
						date.value = new Date(metadata.date).toLocaleDateString()
						tags.value = metadata.tags || []
						cover.value = metadata.cover || '' // Capture cover image URL
						description.value = metadata.description || ''
					}
					postHTML.value = await marked(contentWithoutFrontmatter)
					updateTOC()
          useHead({
            title: await title.value || 'Untitled',
            link: [{ rel: 'canonical', href: `https://cvyl.me/blog/${route.params.slug}` }],
            meta: [
              { name: 'description', content: description.value || '' },
              { property: 'og:url', content: `https://cvyl.me/blog/${route.params.slug}` },
              { property: 'og:type', content: 'article' },
              { property: 'og:title', content: title.value },
              { property: 'og:site_name', content: "cvyl's Blog" },
              { property: 'og:description', content: description.value || '' },
              { property: 'og:locale', content: 'en_US' },
              { property: 'og:image', content: cover.value || '' },
              { property: 'article:author', content: 'cvyl' },
              { property: 'twitter:title', content: title.value },
              { property: 'twitter:description', content: description.value || '' },
              { property: 'twitter:card', content: 'summary_large_image' },
              { property: 'twitter:image', content: cover.value || '' },
              { property: 'twitter:site', content: 'https://cvyl.me' },
              ...tags.value.map((tag) => ({
                property: 'article:tag',
                content: tag
              }))
            ]
          })
				} catch (error) {
					router.push('/')
				}
			} else {
				router.push('/')
			}
			loading.value = false
		}
		onMounted(loadPost)
		watch(() => route.params.slug, loadPost)



		return () => (
			<div class={styles.postPage}>
				<BackButton to='/' class={styles.backButton} />
				{loading.value ? (
					<p class={styles.loading}>Loading...</p>
				) : (
					<div class={styles.contentWrapper}>
						<nav class={styles.toc}>
							<ul>
								{toc.value.map((item) => (
									<li key={item.id} class={styles[`tocItemLevel${item.level}`]}>
										<a href={`#${item.id}`}>{item.text}</a>
									</li>
								))}
							</ul>
						</nav>
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
