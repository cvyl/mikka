import { defineComponent, ref } from 'vue';
import friendsData from '../../public/friends.json'; // Adjust path as needed to match the file location
import styles from './FriendLinkBox.module.sass';

export default defineComponent({
  name: 'FriendsPage',
  setup() {
    // Load friends data directly from the JSON import
    const friendsSections = ref(friendsData);
    const isDataLoaded = ref(true); // Direct load means data is already available

    return () => (
      <div class={styles.friendsPage}>
        {friendsSections.value.length === 0 ? (
          <div>Loading...</div>
        ) : (
          friendsSections.value.map((section) => (
            <div class={styles.friendCategory} key={section.title}>
              <h2>{section.title}</h2>
              <div class={styles.friendsGrid}>
                {section.items.map((friend) => (
                  <div class={styles.friendItem} key={friend.title}>
                    <a href={friend.link} target="_blank" class={styles.friendLink}>
                      {friend.icon && <img src={friend.icon} alt={`${friend.title} icon`} />}
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
