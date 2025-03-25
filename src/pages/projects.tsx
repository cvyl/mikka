import { defineComponent, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import BackButton from '~/components/BackButton'
import styles from './projects.module.sass'

interface Project {
  id: string
  title: string
  date: string
  tags: string[]
  category: string
  description?: string
  cover?: string
  link?: string
}

export default defineComponent({
  name: 'ProjectsPage',
  setup() {
    useHead({
      title: '项目列表',
      link: [{ rel: 'canonical', href: 'https://cvyl.me/projects' }],
      meta: [
        { property: 'og:url', content: 'https://cvyl.me/projects' },
        { name: 'description', content: 'Mikka的项目列表' },
        { property: 'og:title', content: '项目列表' },
        { property: 'og:description', content: 'Mikka的项目列表' },
        { property: 'twitter:title', content: '项目列表' },
        { property: 'twitter:description', content: 'Mikka的项目列表' }
      ]
    });

    const projects = ref<Project[]>([
      {
        id: 'short-moe',
        title: 'Short.moe',
        date: '2024-09-07',
        tags: ['URL Shortener', 'Web Development'],
        category: 'Web Service',
        description: 'A free URL shortener service that allows you to easily shorten long URLs into shorter, more manageable links.',
        cover: '/gallery/projects/shortmoe.png',
        link: 'https://short.moe'
      },
      {
        id: 'lgbt-sh',
        title: 'LGBT.sh',
        date: '2024-11-11',
        tags: ['Subdomain Registration', 'Web Service'],
        category: 'Community',
        description: 'A free sub-domain registration service for the LGBTQ+ community.',
        cover: '/gallery/projects/lgbtsh.png',
        link: 'https://lgbt.sh'
      },
      {
        id: 'awesome-transgender',
        title: 'Awesome Transgender',
        date: '2024-11-17',
        tags: ['Resource Compilation', 'LGBTQ+'],
        category: 'Educational',
        description: 'A curated list of LGBTQ+ resources focused on transgender individuals.',
        cover: '/gallery/projects/awesome-transgender.svg',
        link: 'https://github.com/cvyl/awesome-transgender'
      },
      {
        id: 'cf-email-to-json-worker',
        title: 'CF Email to JSON Worker',
        date: '2024-12-01',
        tags: ['Cloudflare', 'Serverless', 'Email Parsing'],
        category: 'Infrastructure',
        description: 'A serverless Cloudflare Worker that parses incoming emails, saves the email body and attachments to an R2 bucket, and provides a JSON feed accessible through a GET request.',
        cover: '/gallery/lilya.jpg',
        link: 'https://github.com/cvyl/cf-email-to-json-worker'
      },
      {
        id: 'cloudflare-websocket-livecount',
        title: 'Cloudflare WebSocket LiveCount',
        date: '2025-01-15',
        tags: ['Real-time', 'WebSockets', 'Vue 3'],
        category: 'Web Development',
        description: 'A real-time visitor counter built using Vue 3, Vite, Cloudflare Durable Objects, and WebSockets, organized within a Turbo Monorepo.',
        cover: '/gallery/lilya.jpg',
        link: 'https://github.com/cvyl/cloudflare-websocket-livecount'
      }
    ]);


    return () => (
      <div class={styles.projectsPage}>
        <BackButton to="/" class={styles.backButton} />
        <h1 class={styles.pageTitle}>My Projects</h1>

        <div class={styles.gridContainer}>
          {projects.value.map((project) => (
            <div key={project.id} class={styles.projectCard}>
              {project.cover && <img src={project.cover} alt={project.title} class={styles.projectImage} />}
              <div class={styles.projectContent}>
                <h2 class={styles.projectTitle}>
                  {project.link ? (
                    <a href={project.link} target="_blank" rel="noopener noreferrer">{project.title}</a>
                  ) : (
                    project.title
                  )}
                </h2>
                <p class={styles.projectCategory}>{project.category}</p>
                <p class={styles.projectDescription}>{project.description}</p>
                <div class={styles.projectTags}>
                  {project.tags.map((tag) => (
                    <span key={tag} class={styles.tag}>#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
})
