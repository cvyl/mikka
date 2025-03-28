import { ref, onMounted } from 'vue'
import styles from './life.module.sass'
import BackButton from '~/components/BackButton'
import 'tg-blog/dist/style.css'
import './tgblogContainer.sass'

export default defineComponent({
	setup() {
		// Dynamically import TgBlog on the client side only
		const TgBlog = ref(null)

		onMounted(async () => {
			const { TgBlog: TgBlogComponent } = await import('tg-blog')
			TgBlog.value = TgBlogComponent
		})

		useHead({
			title: "Mikka's Life Feed",
			link: [{ rel: 'canonical', href: 'https://cvyl.me/life' }],
			meta: [
				{ property: 'og:url', content: 'https://cvyl.me/life' },
				{ name: 'description', content: "Mikka's personal rambling about whats currently happening in life" },
				{ property: 'og:title', content: "Mikka's Life Feed" },
				{ property: 'og:description', content: "Mikka's personal rambling about whats currently happening in life" },
				{ property: 'twitter:title', content: "Mikka's Life Feed" },
				{
					property: 'twitter:description',
					content: "Mikka's personal rambling about whats currently happening in life"
				},
				{ name: 'robots', content: 'noindex' }
			]
		})

		if (typeof document !== 'undefined') {
			document.getElementById('tgblogStyle')?.remove()
		}

		return () => (
			<div class={styles.sharesContainer}>
				<BackButton to='/' class={styles.back} />
				<div class={styles.main}>
					{TgBlog.value && (
						<TgBlog.value
							postsUrl='https://raw.githubusercontent.com/cvyl/blog-feed/gh-pages/exports/menhera7/posts.json'
							class='tgblogContainer'
						/>
					)}
				</div>
			</div>
		)
	}
})
