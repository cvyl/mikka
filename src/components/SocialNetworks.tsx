import { PropType, Fragment } from 'vue';
import mailOutlined from '@iconify-icons/ant-design/mail-outlined.js';
import cvIcon from '~/icons/cv';
import githubFill from '@iconify-icons/akar-icons/github-fill.js';
import telegramFill from '@iconify-icons/akar-icons/telegram-fill.js';
import mediumFill from '@iconify-icons/akar-icons/medium-fill.js';
import mastodonFill from '@iconify-icons/akar-icons/mastodon-fill.js';
import ethereumIcon from '@iconify-icons/simple-icons/ethereum';
import rssIcon from '@iconify-icons/bi/rss-fill';
import crowdinIcon from '@iconify-icons/simple-icons/crowdin.js';
import obsidianIcon from '@iconify-icons/simple-icons/obsidian.js';
import gpg from '~/icons/gpg';
import Icon from '~/components/Icon';
import { RouterLink } from 'vue-router';

export default defineComponent({
  props: {
    hoverHandler: { type: Function as PropType<(payload: Event) => void>, required: true },
  },
  setup(props) {

    return () => (
      <>
        <a href="mailto:i@cvyl.me" aria-label="Email" onMouseenter={props.hoverHandler} onFocus={props.hoverHandler} target="_blank">
          <Icon icon={mailOutlined}/>
        </a>
        <a href="https://github.com/cvyl" rel="me" aria-label="GitHub" onMouseenter={props.hoverHandler} onFocus={props.hoverHandler} target="_blank">
          <Icon icon={githubFill}/>
        </a>
        {/*<a href="https://tech.lgbt/@777" rel="me" aria-label="Mastodon" onMouseenter={props.hoverHandler} onFocus={props.hoverHandler} target="_blank">
          <Icon icon={mastodonFill} />
        </a>*/}
        <a href="https://t.me/malehera" rel="me" aria-label="Telegram" onMouseenter={props.hoverHandler} onFocus={props.hoverHandler} target="_blank">
          <Icon icon={telegramFill}/>
        </a>
        <a href="https://cvyl.me/blog-feed/exports/menhera7/atom.xml" rel="me" aria-label="RSS Feed" onMouseenter={props.hoverHandler} onFocus={props.hoverHandler} target="_blank">
          <Icon icon={rssIcon}/>
        </a>
        <a href="https://medium.com/@mikka123" rel="me" aria-label="Medium" onMouseenter={props.hoverHandler} onFocus={props.hoverHandler} target="_blank">
          <Icon icon={mediumFill}/>
        </a>
        <a href="https://help.obsidian.md/Obsidian/Credits#Translators" rel="me" aria-label="Obsidian.md Credits" onMouseenter={props.hoverHandler} onFocus={props.hoverHandler} target="_blank">
          <Icon icon={obsidianIcon}/>
        </a>
        <a href="https://crowdin.com/profile/kohada" rel="me" aria-label="Crowdin" onMouseenter={props.hoverHandler} onFocus={props.hoverHandler} target="_blank">
          <Icon icon={crowdinIcon}/>
        </a>
        <a href="https://raw.githubusercontent.com/cvyl/cvyl/refs/heads/main/cv-28-10-2024.pdf" rel="me" aria-label="Resume/CV" onMouseenter={props.hoverHandler} onFocus={props.hoverHandler} target="_blank">
          <Icon icon={cvIcon}/>
        </a>
        <RouterLink to="/gpg" aria-label="GPG Public Key" onMouseenter={props.hoverHandler} onFocus={props.hoverHandler}>
          <Icon icon={gpg}/>
        </RouterLink>
      </>
    );
  },
});
