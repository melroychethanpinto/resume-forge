import { sectionLabel, visibleSectionIds } from '../../lib/sections'
import type {
  AchievementItem,
  CustomSection,
  ExperienceItem,
  ProjectItem,
  Resume,
  SkillGroup,
} from '../../types/resume'
import classic from './classic.module.css'
import compact from './compact.module.css'
import modern from './modern.module.css'

const themes = {
  classic,
  modern,
  compact,
}

function dates(start: string, end: string): string {
  return [start, end].filter((part) => part.trim()).join(' – ')
}

function filled(values: string[]): string[] {
  return values.filter((value) => value.trim())
}

function Contact({ resume, styles }: { resume: Resume; styles: CSSModule }) {
  const items = [
    resume.basics.email,
    resume.basics.phone,
    resume.basics.location,
    ...resume.basics.links
      .filter((link) => link.url.trim())
      .map((link) => (link.label.trim() ? `${link.label}: ${link.url}` : link.url)),
  ].filter((item) => item.trim())

  if (items.length === 0) return null

  return (
    <ul className={styles.contact}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function Bullets({ items, styles }: { items: string[]; styles: CSSModule }) {
  const list = filled(items)
  if (list.length === 0) return null
  return (
    <ul className={styles.bullets}>
      {list.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function ExperienceBlock({
  items,
  styles,
}: {
  items: ExperienceItem[]
  styles: CSSModule
}) {
  return (
    <>
      {items.map((item) => (
        <div key={item.id} className={styles.item}>
          <div className={styles.itemHead}>
            <span>{item.role || item.company}</span>
            <span>{dates(item.startDate, item.endDate)}</span>
          </div>
          <div className={styles.itemMeta}>
            <span>{item.role && item.company ? item.company : ''}</span>
            <span>{item.location}</span>
          </div>
          <Bullets items={item.bullets} styles={styles} />
        </div>
      ))}
    </>
  )
}

function SkillsBlock({ items, styles }: { items: SkillGroup[]; styles: CSSModule }) {
  return (
    <div className={styles.skills}>
      {items
        .filter((group) => group.name.trim() || group.tags.some((tag) => tag.trim()))
        .map((group) => (
          <div key={group.id} className={styles.skillGroup}>
            {group.name.trim() ? (
              <span className={styles.skillName}>{group.name}</span>
            ) : null}
            <ul className={styles.tags}>
              {filled(group.tags).map((tag) => (
                <li key={tag} className={styles.tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  )
}

function AchievementsBlock({
  items,
  styles,
}: {
  items: AchievementItem[]
  styles: CSSModule
}) {
  return (
    <>
      {items.map((item) => (
        <div key={item.id} className={styles.item}>
          {item.title.trim() ? (
            <div className={styles.itemHead}>{item.title}</div>
          ) : null}
          {item.description.trim() ? (
            <p className={styles.customBody}>{item.description}</p>
          ) : null}
          <Bullets items={item.bullets} styles={styles} />
        </div>
      ))}
    </>
  )
}

function ProjectsBlock({
  items,
  styles,
}: {
  items: ProjectItem[]
  styles: CSSModule
}) {
  return (
    <>
      {items.map((item) => (
        <div key={item.id} className={styles.item}>
          <div className={styles.itemHead}>
            <span>{item.name}</span>
            <span>{dates(item.startDate, item.endDate)}</span>
          </div>
          {item.link.trim() ? (
            <div className={styles.itemMeta}>
              <span>{item.link}</span>
            </div>
          ) : null}
          <Bullets items={item.bullets} styles={styles} />
        </div>
      ))}
    </>
  )
}

function CustomBlock({
  section,
  styles,
}: {
  section: CustomSection
  styles: CSSModule
}) {
  return (
    <>
      {section.items.map((item) => (
        <div key={item.id} className={styles.item}>
          {item.heading.trim() ? (
            <div className={styles.itemHead}>{item.heading}</div>
          ) : null}
          {item.body.trim() ? <p className={styles.customBody}>{item.body}</p> : null}
          <Bullets items={item.bullets} styles={styles} />
        </div>
      ))}
    </>
  )
}

type CSSModule = (typeof themes)[keyof typeof themes]

export function ResumeDocument({ resume }: { resume: Resume }) {
  const styles = themes[resume.meta.templateId]
  const sections = visibleSectionIds(resume)

  return (
    <article id="resume-page" className={`rf-page ${styles.page}`}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.name}>{resume.basics.name || 'Your name'}</h1>
          {resume.basics.title.trim() ? (
            <p className={styles.role}>{resume.basics.title}</p>
          ) : null}
        </div>
        <Contact resume={resume} styles={styles} />
      </header>
      {sections.map((id) => (
        <section key={id} className={styles.section}>
          <h2 className={styles.sectionTitle}>{sectionLabel(resume, id)}</h2>
          {id === 'summary' ? (
            <p className={styles.summary}>{resume.summary}</p>
          ) : null}
          {id === 'experience' ? (
            <ExperienceBlock items={resume.experience} styles={styles} />
          ) : null}
          {id === 'skills' ? (
            <SkillsBlock items={resume.skills} styles={styles} />
          ) : null}
          {id === 'achievements' ? (
            <AchievementsBlock items={resume.achievements} styles={styles} />
          ) : null}
          {id === 'projects' ? (
            <ProjectsBlock items={resume.projects} styles={styles} />
          ) : null}
          {resume.customSections.find((section) => section.id === id) ? (
            <CustomBlock
              section={resume.customSections.find((section) => section.id === id)!}
              styles={styles}
            />
          ) : null}
        </section>
      ))}
    </article>
  )
}
