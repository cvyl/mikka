import styles from './index.module.sass';
import { RouterLink } from 'vue-router';
import SocialNetworks from '~/components/SocialNetworks';

export default defineComponent({
  setup() {
    useHead({
      meta: [
        { name: 'description', content: 'Personal blog posts and notes' },
        { name: 'og:url', content: 'https://cvyl.me/' },
        { name: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Mikka’s Blog' },
        { property: 'og:description', content: 'Personal blog posts and notes' },
        { property: 'twitter:title', content: 'Mikka’s Blog' },
        { property: 'twitter:description', content: 'Personal blog posts and notes' },
      ],
      link: [
        { rel: 'canonical', href: 'https://cvyl.me/' },
      ],
    });
    const highlightRef = ref<HTMLDivElement>();

    let timeOutId: any;

    function hoverHandler(e: any) {
      timeOutId && clearTimeout(timeOutId);
      if (highlightRef.value) {
        highlightRef.value.style.transform =
          `translateX(${e.currentTarget.offsetLeft}px) translateY(${e.currentTarget.offsetTop}px)`;
        highlightRef.value.style.height = `${e.currentTarget.clientHeight}px`;
        highlightRef.value.style.width = `${e.currentTarget.clientWidth}px`;
        highlightRef.value.style.display = 'block';
      }
      timeOutId = setTimeout(() => highlightRef.value!.style.opacity = '1', 0);
    }

    function leave() {
      timeOutId && clearTimeout(timeOutId);
      if (highlightRef.value) {
        highlightRef.value.style.opacity = '0';
      }
      timeOutId = setTimeout(() => highlightRef.value! && (highlightRef.value!.style.display = 'none'), 500);
    }

    const links = [
      ['博客', 'Blog', '/blog'],
      ['好朋友们', 'Friends', '/friends'],
      //Life feed
      ['生活', 'Life', '/life'],
      //['翻译', 'Translations', '/translations'],
     // ['投喂', 'Donate', '/donate'],
      ['关于我', 'About', '/about'],
    ];

    return () => (
      <div class={styles.linkContainer} onMouseleave={leave}>
        <div class={styles.title} onMouseenter={leave}>
          Mikka's Blog
        </div>
        <div class={styles.highlight} aria-hidden={true} ref={highlightRef}/>
        {links.map(([ch, en, href]) =>
          href.startsWith('http') ? (
            <a href={href} target="_blank" rel="noopener noreferrer" onMouseenter={hoverHandler} onFocus={hoverHandler}>
              {ch}
              <span aria-hidden={true}>{en}</span>
            </a>
          ) : (
            // @ts-ignore
            <RouterLink to={href} onMouseenter={hoverHandler} onFocus={hoverHandler}>
              {ch}
              <span aria-hidden={true}>{en}</span>
            </RouterLink>
          )
        )}
        <div class={styles.footer} onMouseenter={leave}>
          <div class={styles.space} onMouseenter={leave}/>
          <SocialNetworks hoverHandler={hoverHandler}/>
          <div class={styles.space} onMouseenter={leave}/>
        </div>
      </div>
    );
  },
});
