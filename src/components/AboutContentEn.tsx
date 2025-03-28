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
                  Hey there! I'm a transgender girl with a lifelong passion for technology,
                  starting my journey into the world of computers at the age of nine.
                  Over the years, I've become a programming enthusiast, constantly exploring
                  the ever-evolving landscape of web development, and recently,
                  I've delved into the fascinating realm of web3 technologies.
                </p>
              </section>

              <section class={styles['content-section']}>
                <h2 class={styles['section-title']}>Interests and Hobbies</h2>
                <p class={styles['section-text']}>
                  Beyond the realms of coding, I find joy in gazing at the stars and
                  unraveling the mysteries of the universe through astronomy.
                  Exploring the intricacies of human behavior in the realm of psychology
                  has always intrigued me. I'm equally passionate about contemplating life,
                  beliefs, and the profound questions that philosophy and religion often raise.
                </p>
                <p class={styles['section-text']}>
                  But it's not all serious business! As a devoted fan of まふまふ (MafuMafu),
                  I find solace and inspiration in the world of music.
                  On a lighter note, I am allergic to liars :P.
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
                    <Icon icon={musicIcon} /> Music (まふまふ fan)
                  </div>
                  <div class={styles['icon-item']}>
                    <Icon icon={web3Icon} /> Web3
                  </div>
                </div>
              </section>

              <section class={styles['content-section']}>
                <h2 class={styles['section-title']}>Language Enthusiast</h2>
                <p class={styles['section-text']}>
                  Being an ESL (English as a Second Language) learner, I began learning English
                  at the age of nine. By the age of 12-13, I had achieved fluency.
                </p>
                <p class={styles['section-text']}>
                  I believe that (learning) languages are the key to understanding different cultures
                  and broadening one's perspective towards the world.
                </p>
                <div class={styles['icon-container']}>
                  {['English (Fluent)', 'Dutch (Native)', 'Japanese (Learning)',
                  'Chinese (Learning)', 'German (Basic Level)', 'French (Basic Level)'].map(lang => (
                  <div class={styles['icon-item']} key={lang}>
                    <Icon icon={languageIcon} /> {lang}
                  </div>
                  ))}
                </div>
                </section>

              <section class={styles['content-section']}>
                <h2 class={styles['section-title']}>Future Aspirations</h2>
                <p class={styles['section-text']}>
                  Looking ahead, I aspire to make a meaningful impact in the intersection
                  of healthcare and technology. The prospect of contributing to the
                  medical ICT world, perhaps working in a hospital setting, fuels my ambition.
                  I believe that blending technology with healthcare is not only intellectually
                  stimulating but also immensely gratifying, providing an opportunity to make
                  a positive difference in the lives of others.
                </p>
                <div class={styles['icon-container']}>
                  <div class={styles['icon-item']}>
                    <Icon icon={healthcareIcon} /> Healthcare Technology
                    <Icon icon={aiIcon} /> Machine Learning
                  </div>
                </div>
                <p class={styles['section-text']}>
                  Life, to me, is akin to a complex puzzle, and I'm piecing it together
                  one interest at a time.
                </p>
                <p class={styles['section-text']}>
                  Feel free to reach out and connect – I'd love to share experiences,
                  knowledge, and perhaps collaborate on something amazing.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
