import { defineComponent, ref, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import { useRouter, RouterLink } from 'vue-router'
import styles from './index.module.sass'
import SocialNetworks from '~/components/SocialNetworks'
import LastFm from '~/components/lastfm'
import 'tg-blog/dist/style.css'
import './tgblogContainer.sass'

export default defineComponent({
	setup() {
		useHead({
			meta: [
				{ name: 'description', content: 'Personal blog posts and notes' },
				{ name: 'og:url', content: 'https://cvyl.me/' },
				{ name: 'og:type', content: 'website' },
				{ property: 'og:title', content: "Mikka's Blog" },
				{ property: 'og:description', content: 'Personal blog posts and notes' },
				{ property: 'twitter:title', content: "Mikka's Blog" },
				{ property: 'twitter:description', content: 'Personal blog posts and notes' }
			],
			link: [{ rel: 'canonical', href: 'https://cvyl.me/' }]
		})

		const highlightRef = ref()
		const lifeFeedRef = ref()
		const tgBlogRef = ref()
		const TgBlog = ref(null)
		let timeOutId
		const router = useRouter()

    if (typeof document !== 'undefined') {
      onMounted(async () => {
        const { TgBlog: TgBlogComponent } = await import('tg-blog')
        TgBlog.value = TgBlogComponent

        if (lifeFeedRef.value) {
          setTimeout(() => {
            lifeFeedRef.value.style.opacity = '1'
            lifeFeedRef.value.style.transform = 'translateY(0)'
          }, 300)
        }

        const style = document.createElement('style')
        style.id = 'tgblogStyle'
        style.innerHTML = `.tgblogContainer .search { display: none !important; }`
        document.head.appendChild(style)

        const navigateToLife = () => {
          setTimeout(() => {
            router.push('/life')
          }, 50)
        }

        const attachListeners = () => {
          const el = tgBlogRef.value
          if (!el) return
            const tgBlogContainer = el.querySelector('.tgblogContainer') || el

            tgBlogContainer.addEventListener('wheel', navigateToLife)
            tgBlogContainer.addEventListener('click', navigateToLife)
        }
        setTimeout(attachListeners, 1000)
      })
    }

		function hoverHandler(e) {
			if (timeOutId) clearTimeout(timeOutId)
			if (highlightRef.value) {
				highlightRef.value.style.transform = `translateX(${e.currentTarget.offsetLeft}px) translateY(${e.currentTarget.offsetTop}px)`
				highlightRef.value.style.height = `${e.currentTarget.clientHeight}px`
				highlightRef.value.style.width = `${e.currentTarget.clientWidth}px`
				highlightRef.value.style.display = 'block'
			}
			timeOutId = setTimeout(() => {
				if (highlightRef.value) highlightRef.value.style.opacity = '1'
			}, 0)
		}

		function leave() {
			if (timeOutId) clearTimeout(timeOutId)
			if (highlightRef.value) {
				highlightRef.value.style.opacity = '0'
			}
			timeOutId = setTimeout(() => {
				if (highlightRef.value) highlightRef.value.style.display = 'none'
			}, 500)
		}

		const links = [
			['博客', 'Blog', '/blog'],
			['项目', 'Projects', '/projects'],
      //['翻译', 'Translations', '/translations'],
			['好朋友们', 'Friends', '/friends'],
			['生活', 'Life', '/life'],
			['关于我', 'About', '/about']
		]

		return () => (
			<div class={styles.pageContainer}>
				<div class={styles.linkContainer} onMouseleave={leave}>
					<div class={styles.title} onMouseenter={leave}>
						Mikka's Blog
					</div>
					<div class={styles.highlight} aria-hidden='true' ref={highlightRef} />
					{links.map(([ch, en, href]) =>
						href.startsWith('http') ? (
							<a
								href={href}
								target='_blank'
								rel='noopener noreferrer'
								onMouseenter={hoverHandler}
								onFocus={hoverHandler}
							>
								{ch}
								<span aria-hidden='true'>{en}</span>
							</a>
						) : (
							<RouterLink to={href} onMouseenter={hoverHandler} onFocus={hoverHandler}>
								{ch}
								<span aria-hidden='true'>{en}</span>
							</RouterLink>
						)
					)}
					<div class={styles.footer} onMouseenter={leave}>
						<div class={styles.space} onMouseenter={leave} />
						<SocialNetworks hoverHandler={hoverHandler} />
						<div class={styles.space} onMouseenter={leave} />
					</div>
				</div>

				<div class={styles.lifeFeedContainer} ref={lifeFeedRef}>
					<h2>Recent Updates</h2>
					{TgBlog.value && (
						<div ref={tgBlogRef}>
							<TgBlog.value
								postsUrl='https://raw.githubusercontent.com/cvyl/blog-feed/gh-pages/exports/menhera7/posts.json'
								class='tgblogContainer'
							/>
						</div>
					)}
				</div>
				<LastFm />
			</div>
		)
	}
})
