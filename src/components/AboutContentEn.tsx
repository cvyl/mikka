import Icon from '~/components/Icon'
import web3Icon from '@iconify-icons/logos/ethereum'
import starIcon from '@iconify-icons/mdi/star'
import psychologyIcon from '@iconify-icons/mdi/brain'
import philosophyIcon from '@iconify-icons/mdi/thought-bubble'
import musicIcon from '@iconify-icons/mdi/music'
import languageIcon from '@iconify-icons/mdi/translate'
import healthcareIcon from '@iconify-icons/mdi/hospital-building'
import aiIcon from '@iconify-icons/mdi/robot'

import styles from './AboutContent.module.sass'

export default defineComponent({
	render() {
		return (
			<div class={styles.aboutContainer}>
				<div class={styles.content}>
					<div class={styles.subContainer}>
						<div class={styles['card-container']}>
							<section class={styles['content-section']}>
								<h2 class={styles['section-title']}>Who am I?</h2>
								<p class={styles['section-text']}>
									Hey there! I'm Mikka, I have a lifelong passion for technology, starting my journey into the world of
									computers at the age of nine. Over the years, I've become a programming enthusiast, constantly
									exploring the ever-evolving landscape of web development and software engineering.
								</p>
							</section>

							<section class={styles['content-section']}>
								<h2 class={styles['section-title']}>Interests and Hobbies</h2>
								<p class={styles['section-text']}>
									Aside from programming, I'm interested in astronomy, psychology, and philosophy. I enjoy understanding
									humans and exploring the profound questions these fields raise. I'm drawn to analog technology and
									find myself frequently building various projects from websites to apps and bots.
								</p>
								<p class={styles['section-text']}>
									I have a special appreciation for niche music (especially noise-heavy genres) and
									surreal/psychological media. You'll often find me exploring internet subcultures, altchans, and unique
									art that sparks my curiosity. When not online, I enjoy reading, doodling, and having deep
									conversations about the meaning of life.
								</p>
								<div class={styles['icon-container']}>
									<div class={styles['icon-item']}>
										<Icon icon={starIcon} /> Astronomy
									</div>
									<div class={styles['icon-item']}>
										<Icon icon={psychologyIcon} /> Psychology
									</div>
									<div class={styles['icon-item']}>
										<Icon icon={philosophyIcon} /> Philosophy
									</div>
									<div class={styles['icon-item']}>
										<Icon icon={musicIcon} /> Niche Music
									</div>
									<div class={styles['icon-item']}>
										<Icon icon={web3Icon} /> Technology
									</div>
								</div>
							</section>

							<section class={styles['content-section']}>
								<h2 class={styles['section-title']}>Language Enthusiast</h2>
								<p class={styles['section-text']}>
									Being an ESL (English as a Second Language) learner, I began learning English at the age of nine. By
									the age of 12-13, I had achieved fluency.
								</p>
								<p class={styles['section-text']}>
									I believe that (learning) languages are the key to understanding different cultures and broadening
									one's perspective towards the world.
								</p>
								<div class={styles['icon-container']}>
									{[
										'English (Fluent)',
										'Dutch (Native)',
										'Japanese (Learning)',
										'Chinese (Learning)',
										'German (Basic Level)',
										'French (Basic Level)'
									].map((lang) => (
										<div class={styles['icon-item']} key={lang}>
											<Icon icon={languageIcon} /> {lang}
										</div>
									))}
								</div>
							</section>

							<section class={styles['content-section']}>
								<h2 class={styles['section-title']}>Future Aspirations</h2>
								<p class={styles['section-text']}>
									Looking ahead, I aspire to make a meaningful impact in the intersection of healthcare and technology.
									The prospect of contributing to the medical ICT world, perhaps working in a hospital setting, fuels my
									ambition. I believe that blending technology with healthcare is not only intellectually stimulating
									but also immensely gratifying, providing an opportunity to make a positive difference in the lives of
									others.
								</p>
								<div class={styles['icon-container']}>
									<div class={styles['icon-item']}>
										<Icon icon={healthcareIcon} /> Healthcare Technology
										<Icon icon={aiIcon} /> Machine Learning
									</div>
								</div>
								<p class={styles['section-text']}>
									Life, to me, is akin to a complex puzzle, and I'm piecing it together one interest at a time.
								</p>
								<p class={styles['section-text']}>
									Feel free to reach out and connect. I'd love to share experiences, knowledge, and perhaps collaborate
									on something amazing.
								</p>
							</section>
						</div>
					</div>
				</div>
			</div>
		)
	}
})
