import { defineComponent, ref, onMounted } from 'vue';
import styles from './FriendLinkBox.module.sass';

export default defineComponent({
  name: 'FriendsPage',
  setup() {
    const friendsSections = ref([]);
    const loading = ref(true);

    const checkImage = async (url: string) => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) throw new Error('Image not found');
        return url;
      } catch {
        return 'gallery/noimage.png';
      }
    };

    const processFriendsData = async (data: any[]) => {
      friendsSections.value = data.map(section => ({
        ...section,
        items: section.items.map(friend => ({
          ...friend,
          imageLoaded: false,
          icon: friend.icon || 'gallery/noimage.png'
        }))
      }));
      loading.value = false;

      for (let section of friendsSections.value) {
        for (let friend of section.items) {
          const validIcon = await checkImage(friend.icon);
          friend.icon = validIcon;
          friend.imageLoaded = true;
        }
      }
    };

    onMounted(() => {
      fetch('./friends.json')
        .then(response => response.json())
        .then(data => processFriendsData(data as any[]))
        .catch(error => console.error('Error fetching friends data:', error));
    });

    return () => (
      <div class={styles.friendsPage}>
        {loading.value ? (
          <div>Loading...</div>
        ) : (
          friendsSections.value.map((section) => (
            <div class={styles.friendCategory} key={section.title}>
              <h2>{section.title}</h2>
              <div class={styles.friendsGrid}>
                {section.items.map((friend) => (
                  <div class={styles.friendItem} key={friend.title}>
                    <a href={friend.link} target="_blank" class={styles.friendLink}>
                      {!friend.imageLoaded ? (
                        <div class={styles.skeleton}></div>
                      ) : (
                        <img src={friend.icon} alt={`${friend.title} icon`} />
                      )}
                      <div class={styles.friendItemTitle}>{friend.title}</div>
                      <div class={styles.friendItemDesc}>{friend.desc}</div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    );
  },
});
