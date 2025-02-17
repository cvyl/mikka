// pages/[slug].tsx

import { defineComponent, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'

export default defineComponent({
	name: 'DynamicBlogPost',
	setup() {
		const route = useRoute()
		const router = useRouter()
		const postHTML = ref('')
		const loading = ref(true)

		const loadPost = async () => {
			// Grab the dynamic part from the URL, e.g. /cloudflare-ai-worker => 'cloudflare-ai-worker'
			const slug = route.params.slug as string | undefined
      console.log(slug)
			if (!slug) {
				router.push('/')
				return
			}

			// Load all .md files from the ../blog folder
			const markdownFiles = import.meta.glob('../../blog/*.md', { as: 'raw' })

			// Look for a file whose name matches the slug
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
					postHTML.value = await marked(content)
				} catch (error) {
					router.push('/')
				}
			} else {
				// If no file is found, redirect to home
				router.push('/')
			}
			loading.value = false
		}

		onMounted(loadPost)

		// If the route changes (e.g., user navigates from one slug to another), reload
		watch(() => route.params.slug, loadPost)

		return () => <div>{loading.value ? <p>Loading...</p> : <div innerHTML={postHTML.value}></div>}</div>
	}
})
