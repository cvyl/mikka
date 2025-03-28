import styles from './gpg.module.sass'
import copyOutlined from '@iconify-icons/ant-design/copy-outlined.js'
import downloadOutlined from '@iconify-icons/ant-design/download-outlined.js'
import Icon from '~/components/Icon'
import BackButton from '~/components/BackButton'

export default defineComponent({
	setup() {
		useHead({
			title: 'GPG 公钥',
			link: [{ rel: 'canonical', href: 'https://cvyl.me/pgp' }],
			meta: [
				{ property: 'og:url', content: 'https://cvyl.me/pgp' },
				{ name: 'description', content: '凌莞 GPG 公钥的复制与下载' },
				{ property: 'og:title', content: 'GPG 公钥' },
				{ property: 'og:description', content: '凌莞 GPG 公钥的复制与下载' },
				{ property: 'twitter:title', content: 'GPG 公钥' },
				{ property: 'twitter:description', content: '凌莞 GPG 公钥的复制与下载' }
			]
		})

		const { copy, copied } = useClipboard({ source: pubKey })

		return () => (
			<div class={styles.pgpContainer}>
				<BackButton to='/' />
				<div class={styles.id} title='BA29 DDAB 2EB5 F349 20A2 DBFD 2537 3639 427C 7EAE'>
					<span>2537</span>
					<span>3639</span>
					<span>427C</span>
					<span>7EAE</span>
				</div>
				<div class={styles.buttons}>
					<div onClick={() => copy()} tabindex={0} role='button'>
						<Icon icon={copyOutlined} />
						<span class={styles.text}>{copied.value ? 'Copied!' : 'Click to copy'}</span>
					</div>
					<div onClick={download} tabindex={0} role='button'>
						<Icon icon={downloadOutlined} />
						<span class={styles.text}>Download</span>
					</div>
				</div>
			</div>
		)
	}
})

function download() {
	const blob = new Blob([pubKey])
	const url = URL.createObjectURL(blob)
	if (typeof document !== 'undefined') {
		const link = document.createElement('a')
		link.href = url
		link.download = 'Mikka (cvyl)_0x427C7EAE_public.asc'
		link.click()
	}
}

const pubKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: ProtonMail

xjMEZtAd2xYJKwYBBAHaRw8BAQdArzTisq28e5L4rLqX6XDaKRY4PhFELiHn
SN15GZdvWf7NH212ZHZlbGRlQHBtLm1lIDxtdmR2ZWxkZUBwbS5tZT7CjAQQ
FgoAPgWCZtAd2wQLCQcICZAlNzY5Qnx+rgMVCAoEFgACAQIZAQKbAwIeARYh
BLop3asutfNJIKLb/SU3NjlCfH6uAABWlwEA2Xx0DeMOEWn0GcmmSw6nANK3
XXlIeYtGG7mnfmtPgCoBALpDQVX5SCBp+zt+lEH7F8xZAE8884NLuCFChnDP
q7sGwqgEEBYIAFoFAmbQHhgJENgGwa9ZeOjHFiEECoZS/l1TOGBXiZ/p2AbB
r1l46McsHG9wZW5wZ3AtY2FAcHJvdG9uLm1lIDxvcGVucGdwLWNhQHByb3Rv
bi5tZT4FgwDtTgAAABWjAQD3LhhjRhoFgsmmREN4d+KeCmisr8CXgJW79wxy
Ey2kRgD9GOgpZgDMVNLAwFY9nSY4J9+VxWbYjzrgmz73+ntVIwfOOARm0B3b
EgorBgEEAZdVAQUBAQdAfMoSEm5hprFMaJGn6SOW4TCWlBv5EV3/CZwuGcTk
3E0DAQgHwngEGBYKACoFgmbQHdsJkCU3NjlCfH6uApsMFiEEuindqy6180kg
otv9JTc2OUJ8fq4AABbmAP9dmwCUJpg2u0kU4gW5vuBA/k04I/HNCOvLuKG5
tUtCzgEAuQ74rUDs7aiTjcQooDoM67DaFSB9lTTcVoTwackQRgw=
=vGXW
-----END PGP PUBLIC KEY BLOCK-----

`
