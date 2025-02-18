import { defineComponent, ref, onMounted, onUnmounted, Fragment } from 'vue'
import styles from './lastfm.module.sass'

export default defineComponent({
	name: 'LastFm',
	setup() {
		const isLoading = ref(true)
		const currentTrack = ref<any>(null)
		const intervalId = ref<number | null>(null) // Store interval ID

		const lastFmApiKey = '0cd5233e03c3bfc97b90a307302a1542'
		const lastFmUsername = 'Transfeminine'

		onMounted(() => {
			fetchCurrentTrack()
			intervalId.value = window.setInterval(fetchCurrentTrack, 10000)
		})

		// Clean up interval when component unmounts
		onUnmounted(() => {
			if (intervalId.value) {
				clearInterval(intervalId.value)
			}
		})

		async function fetchCurrentTrack() {
			if (!lastFmApiKey || !lastFmUsername) {
				isLoading.value = false
				return
			}
			try {
				const endpoint = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastFmUsername}&api_key=${lastFmApiKey}&format=json&limit=1`
				const response = await fetch(endpoint)
				const data = (await response.json()) as { recenttracks: { track: any[] } }
				currentTrack.value = data?.recenttracks?.track?.[0] ?? null
			} catch {
				currentTrack.value = null
			} finally {
				isLoading.value = false
			}
		}

		return () => (
			<div class={styles.lastFmContainer}>
				{isLoading.value && <div>Loading...</div>}
				{!isLoading.value && currentTrack.value && (
					<>
						<img
							class={styles.albumArt}
							src={
								currentTrack.value.image?.[2]?.['#text'] ?? 'noart.png'
							}
							alt='Album Art'
						/>
						<div class={styles.info}>
							<a class={styles.title} href={currentTrack.value.url} target='_blank' rel='noopener noreferrer'>
								{currentTrack.value.name}
							</a>
							<div class={styles.artist}>{currentTrack.value.artist['#text']}</div>

							{/* Check if the track is currently playing */}
							{currentTrack.value['@attr']?.nowplaying ? (
								<div class={styles.status}>Now Playing</div>
							) : (
								<div class={styles.status}>Last Played</div>
							)}
						</div>
					</>
				)}
				{!isLoading.value && !currentTrack.value && <div>Not currently playing anything</div>}
			</div>
		)
	}
})
