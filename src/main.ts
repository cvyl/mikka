import { ViteSSG } from 'vite-ssg';
import routes from 'virtual:generated-pages';
import App from './App';

import './styles/global.sass';

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
);
