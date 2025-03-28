import { ref, onMounted, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import { useHead } from '@vueuse/head'
import BackButton from '~/components/BackButton'
import styles from './post.module.sass'
import 'highlight.js/styles/atom-one-light.css'
import katex from 'katex'

marked.use({
  extensions: [
    {
      name: 'math',
      level: 'inline',
      start(src) {
        const index = src.match(/\$+/)?.index
        return index ?? -1
      },
      tokenizer(src) {
        const match = src.match(/^\$([^\$]+?)\$/)
        if (match) {
          return {
            type: 'math',
            raw: match[0],
            text: match[1].trim(),
            math: true
          }
        }
        return undefined
      },
      renderer(token) {
        return katex.renderToString(token.text, { throwOnError: false })
      }
    },
    {
      name: 'mathBlock',
      level: 'block',
      start(src) {
        const index = src.match(/\$\$/)?.index
        return index ?? -1
      },
      tokenizer(src) {
        const match = src.match(/^\$\$([\s\S]+?)\$\$/)
        if (match) {
          return {
            type: 'math',
            raw: match[0],
            text: match[1].trim(),
            math: true,
            block: true
          }
        }
        return undefined
      },
      renderer(token) {
        return `<div class="katex-block">${katex.renderToString(token.text, { displayMode: true, throwOnError: false })}</div>`
      }
    }
  ]
})

const markdownFiles = import.meta.glob('../../blog/*.md', { query: '?raw', import: 'default' })

// Define proper type for frontmatter metadata
interface PostMetadata {
  title?: string;
  date?: string;
  tags?: string[];
  cover?: string;
  description?: string;
}

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
		const cover = ref('')
		const loading = ref(true)
		const toc = ref<Array<{ id: string; text: string; level: number }>>([])

		function slugify(text: string): string {
			return text
				.toLowerCase()
				.trim()
				.replace(/\s+/g, '-')
				.replace(/[^\w\-]+/g, '')
		}

		function updateTOC(): void {
      if (typeof document !== 'undefined') {
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
        postHTML.value = tempDiv.innerHTML
        toc.value = newTOC
      }
		}

		const parseFrontmatter = (content: string): PostMetadata | null => {
					const match = content.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---/)
					if (!match) return null
					const frontmatter = match[1]
					const data: PostMetadata = {}
					frontmatter.split('\n').forEach((line) => {
						const colonIndex = line.indexOf(':')
						if (colonIndex === -1) return
						const key = line.slice(0, colonIndex).trim()
						let value = line.slice(colonIndex + 1).trim()
						if (key === 'tags') {
							(data[key as keyof PostMetadata] as string[]) = value
								.replace(/^\[|\]$/g, '')
								.split(',')
								.map((tag) => tag.trim())
						} else {
							// Type assertion for specific keys
							(data[key as keyof PostMetadata] as string) = value.replace(/^["'](.*)["']$/, '$1')
						}
					})
					return data
				}

		const loadPost = async (): Promise<void> => {
			const slug = route.params.slug
			if (!slug) {
				router.push('/')
				return
			}
			let matchedPath = null
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
						date.value = metadata.date ? new Date(metadata.date).toLocaleDateString() : ''
						tags.value = metadata.tags || []
						cover.value = metadata.cover || ''
						description.value = metadata.description || ''
					}
					postHTML.value = await marked(contentWithoutFrontmatter)
					updateTOC()

					// Apply highlighting to already rendered code blocks
          setTimeout(async () => {
            if (typeof document !== 'undefined') {
                const hljs = await import('highlight.js/lib/core');

                hljs.default.registerLanguage('javascript', await import('highlight.js/lib/languages/javascript').then(m => m.default));
                hljs.default.registerLanguage('php', await import('highlight.js/lib/languages/php').then(m => m.default));
                hljs.default.registerLanguage('yaml', await import('highlight.js/lib/languages/yaml').then(m => m.default));
                hljs.default.registerLanguage('html', await import('highlight.js/lib/languages/xml').then(m => m.default)); // HTML uses XML highlighter
                hljs.default.registerLanguage('css', await import('highlight.js/lib/languages/css').then(m => m.default));
                hljs.default.registerLanguage('python', await import('highlight.js/lib/languages/python').then(m => m.default));
                hljs.default.registerLanguage('bash', await import('highlight.js/lib/languages/bash').then(m => m.default));
                hljs.default.registerLanguage('json', await import('highlight.js/lib/languages/json').then(m => m.default));
                hljs.default.registerLanguage('typescript', await import('highlight.js/lib/languages/typescript').then(m => m.default));

              hljs.default.configure({ ignoreUnescapedHTML: true });

              document.querySelectorAll('pre code').forEach((block) => {
                hljs.default.highlightElement(block as HTMLElement);
              });
            }
          }, 0);
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

		// Use watchEffect to update metadata dynamically
    // Doesn't work unfortunately, will rewrite
		watchEffect(() => {
			useHead({
				title: title.value,
				link: [{ rel: 'canonical', href: `https://cvyl.me/blog/${route.params.slug}` }],
				meta: [
					{ name: 'description', content: description.value },
					{ property: 'og:url', content: `https://cvyl.me/blog/${route.params.slug}` },
					{ property: 'og:type', content: 'article' },
					{ property: 'og:title', content: title.value },
					{ property: 'og:site_name', content: "cvyl's Blog" },
					{ property: 'og:description', content: description.value },
					{ property: 'og:locale', content: 'en_US' },
					{ property: 'og:image', content: cover.value },
					{ property: 'article:author', content: 'cvyl' },
					{ property: 'twitter:title', content: title.value },
					{ property: 'twitter:description', content: description.value },
					{ property: 'twitter:card', content: 'summary_large_image' },
					{ property: 'twitter:image', content: cover.value },
					{ property: 'twitter:site', content: 'https://cvyl.me' },
					...tags.value.map((tag) => ({
						property: 'article:tag',
						content: tag
					}))
				]
			})
		})

		return () => (
			<div class={styles.postPage}>
				<BackButton to='/blog' class={styles.backButton} />
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
