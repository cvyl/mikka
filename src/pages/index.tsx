import { defineComponent, ref, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import styles from './index.module.sass'
import { RouterLink } from 'vue-router'
import SocialNetworks from '~/components/SocialNetworks'
import LastFm from '~/components/lastfm' // Adjust the path as needed
import 'tg-blog/dist/style.css'
import './tgblogIndex.sass'

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
		const TgBlog = ref(null)
		let timeOutId

		onMounted(async () => {
			// Dynamically import TgBlog
			const { TgBlog: TgBlogComponent } = await import('tg-blog')
			TgBlog.value = TgBlogComponent

			// Fade in the feed container
			if (lifeFeedRef.value) {
				setTimeout(() => {
					lifeFeedRef.value.style.opacity = '1'
					lifeFeedRef.value.style.transform = 'translateY(0)'
				}, 300)
			}
		})

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
			['好朋友们', 'Friends', '/friends'],
			['生活', 'Life', '/life'],
			['关于我', 'About', '/about']
		]

		return () => (
			<div class={styles.pageContainer}>
				{/* Left-side container */}
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

				{/* Main feed container */}
				<div class={styles.lifeFeedContainer} ref={lifeFeedRef}>
					<h2>Recent Updates</h2>
					{TgBlog.value && (
						<TgBlog.value
							postsUrl='https://raw.githubusercontent.com/cvyl/blog-feed/gh-pages/exports/menhera7/posts.json'
							class='tgblogContainer'
						/>
					)}
				</div>
				<LastFm />
			</div>
		)
	}
})
