import chevronLeft from '@iconify-icons/akar-icons/chevron-left.js';
import Icon from '~/components/Icon';
import { RouteLocationRaw, RouterLink } from 'vue-router';
import { PropType } from 'vue';
import styles from './BackButton.module.sass';

export default defineComponent({
  props: {
    to: { type: String as PropType<RouteLocationRaw>, required: true },
  },
  setup(props) {
    return () => (
      <div class={styles.back}>
        <RouterLink to={props.to} aria-label="返回">
          <Icon icon={chevronLeft}/>
        </RouterLink>
      </div>
    );
  },
});
