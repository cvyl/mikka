import { defineComponent, ref, onMounted, Fragment } from 'vue'
import BackButton from '~/components/BackButton'
import styles from './friends.module.sass'

export default defineComponent({
  setup() {
    const friendsSections = ref<any[]>([])
    const loading = ref(true)
    const selectedTab = ref(0)

    onMounted(async () => {
      try {
        const response = await fetch('./friends.json')
        const data = await response.json()
        friendsSections.value = data as any[]
      } catch (error) {
        console.error('Error fetching friends data:', error)
      } finally {
        loading.value = false
      }
    })

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
      <div class={styles.friendsContainer}>
        <BackButton to="/" class={styles.back} />
        <div class={styles.main}>
          {loading.value ? (
            <div class={styles.loading}>Loading...</div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div class={styles.tabs}>
                {friendsSections.value.map((section, index) => (
                  <button
                    key={section.title}
                    class={[styles.tabButton, index === selectedTab.value && styles.activeTab]}
                    onClick={() => (selectedTab.value = index)}
                  >
                    {section.title}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div class={styles.tabContent}>
                <div class={styles.friendsGrid}>
                  {friendsSections.value[selectedTab.value]?.items.map((friend: any) => (
                    <a
                      href={friend.link}
                      target="_blank"
                      key={friend.title}
                      class={styles.friendItem}
                    >
                      <img
                        src={friend.icon || 'gallery/noimage.png'}
                        alt={`${friend.title} icon`}
                      />
                      <div class={styles.friendItemTitle}>{friend.title}</div>
                      <div class={styles.friendItemDesc}>{friend.desc}</div>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }
})
