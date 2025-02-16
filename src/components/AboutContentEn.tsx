import Icon from '~/components/Icon'
import { defineComponent } from 'vue'

// Import Iconify icons
import nextIcon from '@iconify-icons/logos/nextjs-icon'
import reactIcon from '@iconify-icons/logos/react'
import npmIcon from '@iconify-icons/logos/npm-icon'
import html5Icon from '@iconify-icons/logos/html-5'
import typescriptIcon from '@iconify-icons/logos/typescript-icon'
import prettierIcon from '@iconify-icons/logos/prettier'
import tailwindIcon from '@iconify-icons/logos/tailwindcss-icon'
import eslintIcon from '@iconify-icons/logos/eslint'
import viteIcon from '@iconify-icons/logos/vitejs'
import vueIcon from '@iconify-icons/logos/vue'
import laravelIcon from '@iconify-icons/logos/laravel'
import nodeIcon from '@iconify-icons/logos/nodejs-icon'
import gitIcon from '@iconify-icons/logos/git-icon'
import githubActionsIcon from '@iconify-icons/logos/github-actions'
import ubuntuIcon from '@iconify-icons/logos/ubuntu'
import debianIcon from '@iconify-icons/logos/debian'
import wsl2Icon from '@iconify-icons/logos/linux-tux'
import cloudflareIcon from '@iconify-icons/logos/cloudflare'
import windowsIcon from '@iconify-icons/logos/microsoft'
import vscodeIcon from '@iconify-icons/logos/visual-studio-code'

export default defineComponent({
	render() {
		return (
			<div style={{ textAlign: 'center', padding: '20px', maxWidth: '800px', margin: 'auto' }}>
				<h1>关于我</h1>

				<section>
					<h2>Stack</h2>
					<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
						<Icon icon={nextIcon} /> Next.js
						<Icon icon={reactIcon} /> React
						<Icon icon={npmIcon} /> NPM
						<Icon icon={html5Icon} /> HTML5
						<Icon icon={typescriptIcon} /> TypeScript
						<Icon icon={prettierIcon} /> Prettier
						<Icon icon={tailwindIcon} /> TailwindCSS
						<Icon icon={eslintIcon} /> ESLint
						<Icon icon={viteIcon} /> Vite
						<Icon icon={vueIcon} /> Vue 3
					</div>
				</section>

				<section>
					<h2>Backend</h2>
					<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
						<Icon icon={laravelIcon} /> Laravel 10.x
						<Icon icon={nodeIcon} /> Node.js
					</div>
				</section>

				<section>
					<h2>DevOps</h2>
					<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
						<Icon icon={gitIcon} /> Git
						<Icon icon={githubActionsIcon} /> GitHub Actions
						<Icon icon={ubuntuIcon} /> Ubuntu
						<Icon icon={debianIcon} /> Debian
						<Icon icon={wsl2Icon} /> WSL2
						<Icon icon={cloudflareIcon} /> Cloudflare
					</div>
				</section>

				<section>
					<h2>Environment</h2>
					<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
						<Icon icon={windowsIcon} /> Windows
						<Icon icon={vscodeIcon} /> Visual Studio Code
					</div>
				</section>

				<section>
					<h2>Miscellaneous</h2>
					<p>人生就像一盘西洋棋，我不会下西洋棋。</p>
				</section>
			</div>
		)
	}
})
