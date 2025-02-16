import styles from './life.module.sass'
import BackButton from '~/components/BackButton'
import 'tg-blog/dist/style.css'
import './tgblogContainer.sass'
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
	setup() {
		// Dynamically import TgBlog on the client side only
		const TgBlog = ref(null)

		onMounted(async () => {
			const { TgBlog: TgBlogComponent } = await import('tg-blog')
			TgBlog.value = TgBlogComponent
		})

		useHead({
			title: '凌莞的喵喵喵碎碎念',
			link: [{ rel: 'canonical', href: 'https://cvyl.me/life' }],
			meta: [
				{ property: 'og:url', content: 'https://cvyl.me/life' },
				{ name: 'description', content: '凌莞的喵喵喵碎碎念和奇奇怪怪的分享' },
				{ property: 'og:title', content: '凌莞的喵喵喵碎碎念' },
				{ property: 'og:description', content: '凌莞的喵喵喵碎碎念和奇奇怪怪的分享' },
				{ property: 'twitter:title', content: '凌莞的喵喵喵碎碎念' },
				{ property: 'twitter:description', content: '凌莞的喵喵喵碎碎念和奇奇怪怪的分享' },
				{ name: 'robots', content: 'noindex' }
			]
		})

		return () => (
			<div class={styles.sharesContainer}>
				<BackButton to='/' class={styles.back} />
				<div class={styles.main}>
					{/* Render TgBlog component only if it's loaded */}
					{TgBlog.value && (
						<TgBlog.value
							postsUrl='https://raw.githubusercontent.com/cvyl/blog-feed/gh-pages/exports/menhera7/posts.json'
							class='maintgblogContainer'
						/>
					)}
				</div>
			</div>
		)
	}
})
