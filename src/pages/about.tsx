import styles from './about.module.sass'
import BackButton from '~/components/BackButton'
import AboutContentEn from '~/components/AboutContentEn'

export default defineComponent({
	setup() {
		useHead({
			title: '关于我',
			link: [{ rel: 'canonical', href: 'https://mikka.im/about' }],
			meta: [
				{ property: 'og:url', content: 'https://mikka.im/about' },
				{ name: 'description', content: '这里可能有一些你想了解的信息' },
				{ property: 'og:title', content: '关于我' },
				{ property: 'og:description', content: '这里可能有一些你想了解的信息' },
				{ property: 'twitter:title', content: '关于我' },
				{ property: 'twitter:description', content: '这里可能有一些你想了解的信息' }
			]
		})

    return () => {
      return (
        <div class={styles.aboutContainer}>
          <div class={styles.content}>
            <div class={styles.title}>About</div>
            <div class={styles.subContainer}>
              <div><AboutContentEn /></div>
            </div>
          </div>
					<BackButton to='/' />
					{/*<div class={styles.languageSwitchMobile}>
						<RouterLink
							to={{ query: { lang: language.value === 'en' ? 'zh' : 'en' } }}
							aria-label='切换语言 Switch language'
						>
							<Icon icon={languageIcon} />
						</RouterLink>
					</div>
					<div class={styles.languageSwitch}>
						<RouterLink to={{ query: { lang: 'zh' } }}>中文</RouterLink>
						<RouterLink to={{ query: { lang: 'en' } }}>English</RouterLink>
					</div> */}
				</div>
			)
		}
	}
})
