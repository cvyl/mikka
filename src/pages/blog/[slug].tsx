// pages/[slug].tsx

import { defineComponent, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'

// Load all .md files from the ../blog folder
const markdownFiles = import.meta.glob('../../blog/*.md', { as: 'raw' })

export default defineComponent({
  name: 'DynamicBlogPost',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const postHTML = ref('')
    const loading = ref(true)

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
          postHTML.value = await marked(content)
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

    return () => <div>{loading.value ? <p>Loading...</p> : <div innerHTML={postHTML.value}></div>}</div>
  }
})

// **Static Paths for Vite SSG**
export const getStaticPaths = async () => {
  const markdownFiles = import.meta.glob('../../blog/*.md', { as: 'raw' })

  const paths = Object.keys(markdownFiles).map((path) => {
    const fileName = path.split('/').pop()?.replace('.md', '')
    return `/blog/${fileName}`
  })

  console.log("[vite-ssg] Static Paths:", paths) // Debugging log

  return paths
}
