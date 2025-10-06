import BackButton from '~/components/BackButton'
import styles from './links.module.sass'
import { Fragment } from 'vue'

export default defineComponent({
	setup() {
		return () => (
			<>
				<div class={styles.container}>
					<BackButton to='/' class={styles.backButton} />
					<h1>Work in progress, please check back later.</h1>
				</div>
			</>
		)
	}
})
