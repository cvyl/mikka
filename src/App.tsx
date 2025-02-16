import { RouterView } from 'vue-router';
import styles from './App.module.sass';
import { Transition } from 'vue';

export default defineComponent({
  setup() {
    useHead({
      title: 'Mikka’s Blog',
      link: [
        { rel: 'icon', href: "/favicon.ico", type: 'image/ico' },
      ],
      meta: [
        { name: 'author', content: 'Mikka' },
        { property: 'og:site_name', content: 'Mikka’s Blog' },
        { property: 'og:type', content: 'website' },
        { name: 'keywords', content: 'cvyl,Mikka' },
      ],
    });

    const route = useRoute();

    return () => (
      <div class={`${styles.background}`}>
        <img style={{ position: 'fixed', bottom: '0', right: '0' }} width="150" src="/menhera.png" alt="Profile" draggable="false" />
        <RouterView>
          {{
        default: ({ Component }: any) => (
          <Transition name="animation" duration={600} mode="out-in">
            <div key={route.path}
             class={`${styles.container} ${route.path.startsWith('/posts') ? '' : 'base'}`}>
          <Component/>
            </div>
          </Transition>
        ),
          }}
        </RouterView>
        <div class={styles.footer}>
        <span>© Mikka 本站遵循 <a target="_blank" rel="noopener noreferrer" href="https://creativecommons.org/licenses/by-nc-nd/4.0/">CC BY-NC-ND 4.0 协议</a></span>
        </div>
      </div>
    );
  },
});
