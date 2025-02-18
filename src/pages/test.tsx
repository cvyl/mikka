import { Signature } from '../components/icons/signature'
import styles from './test.module.sass'
import { Fragment } from 'vue'

export default defineComponent({
	setup() {
		return () => (
			<>
				<div class={styles.container}>
					<Signature class={`${styles.signatureAnimated} ${styles.size}`} />
				</div>
			</>
		)
	}
})
