import styles from './about.module.sass'
import { RouterLink } from 'vue-router'
import languageIcon from '@iconify-icons/cil/language.js'
import Icon from '~/components/Icon'
import BackButton from '~/components/BackButton'
import AboutContentZh from '~/components/AboutContentZh'
import AboutContentEn from '~/components/AboutContentEn'

export default defineComponent({
	setup() {
		useHead({
			title: '关于我',
			link: [{ rel: 'canonical', href: 'https://cvyl.me/blog' }],
			meta: [
				{ property: 'og:url', content: 'https://cvyl.me/blog' },
				{ name: 'description', content: '这里可能有一些你想了解的信息' },
				{ property: 'og:title', content: '关于我' },
				{ property: 'og:description', content: '这里可能有一些你想了解的信息' },
				{ property: 'twitter:title', content: '关于我' },
				{ property: 'twitter:description', content: '这里可能有一些你想了解的信息' }
			]
		})

		const route = useRoute()
		const preferredLanguage = ref('en')
		const browserLanguages = usePreferredLanguages()
		const language = computed(() => (route.query.lang as string) || preferredLanguage.value)

		return () => {
			return (
				<div class={styles.aboutContainer}>
					<div class={styles.content}>
						<span>This webpage is under construction.</span>
					</div>
					<BackButton to='/' />
				</div>
			)
		}
	}
})
