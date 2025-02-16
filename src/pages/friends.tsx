// @ts-ignore
import random from '~/utils/random'
import styles from './friends.module.sass'
import FriendLinkBox from '~/components/FriendLinkBox'
import BackButton from '~/components/BackButton'
import ScrollContainer from '~/components/ScrollContainer'
import { defineComponent, ref } from 'vue'

export default defineComponent({
	setup() {
		useHead({
			title: '友情链接',
			link: [{ rel: 'canonical', href: 'https://cvyl.me/friends' }],
			meta: [
				{ property: 'og:url', content: 'https://cvyl.me/friends' },
				{ name: 'description', content: '这里是凌莞的好朋友们' },
				{ property: 'og:title', content: '友情链接' },
				{ property: 'og:description', content: '这里是凌莞的好朋友们' },
				{ property: 'twitter:title', content: '友情链接' },
				{ property: 'twitter:description', content: '这里是凌莞的好朋友们' }
			]
		})

		return () => (
			<div class={styles.friendContainer}>
				<ScrollContainer>
					<div class={styles.scrollBox}>
						<div class={styles.groupBox}>
							<div class={styles.title}>好朋友们～</div>
							{/* Grid container for friend links */}
							<div class={styles.friendsGrid}>
								<FriendLinkBox />
							</div>
						</div>
					</div>
				</ScrollContainer>
				<BackButton to='/' />
			</div>
		)
	}
})
