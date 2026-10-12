import { useState, type ReactNode } from 'react'
import { isBuiltinSectionId, isSectionVisible, sectionLabel } from '../lib/sections'
import { useResumeStore } from '../store/resumeStore'
import type { Resume } from '../types/resume'
import styles from './Editor.module.css'

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      {children}
    </label>
  )
}

function BulletList({
  items,
  onChange,
}: {
  items: string[]
  onChange: (items: string[]) => void
}) {
  return (
    <div className={styles.body} style={{ padding: 0 }}>
      {items.map((item, index) => (
        <div key={index} className={styles.bulletRow}>
          <input
            value={item}
            placeholder="Bullet point"
            onChange={(event) => {
              const next = [...items]
              next[index] = event.target.value
              onChange(next)
            }}
          />
          <button
            type="button"
            className={styles.ghost}
            onClick={() => onChange(items.filter((_, current) => current !== index))}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.ghost}
        onClick={() => onChange([...items, ''])}
      >
        Add bullet
      </button>
    </div>
  )
}

function TagInput({
  tags,
  onChange,
}: {
  tags: string[]
  onChange: (tags: string[]) => void
}) {
  const [draft, setDraft] = useState('')

  function commit() {
    const value = draft.trim()
    if (!value) return
    if (!tags.includes(value)) onChange([...tags, value])
    setDraft('')
  }

  return (
    <div>
      <div className={styles.tags}>
        {tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
            <button
              type="button"
              className={styles.ghost}
              onClick={() => onChange(tags.filter((current) => current !== tag))}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        value={draft}
        placeholder="Type a skill and press Enter"
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            commit()
          }
        }}
        onBlur={commit}
      />
    </div>
  )
}

function Panel({
  title,
  children,
  extra,
}: {
  title: string
  children: ReactNode
  extra?: ReactNode
}) {
  return (
    <details className={styles.panel} open>
      <summary>
        <span>{title}</span>
        {extra}
      </summary>
      <div className={styles.body}>{children}</div>
    </details>
  )
}

function SectionControls({
  resume,
  id,
  index,
  total,
}: {
  resume: Resume
  id: string
  index: number
  total: number
}) {
  const moveSection = useResumeStore((state) => state.moveSection)
  const setSectionVisible = useResumeStore((state) => state.setSectionVisible)
  const removeCustomSection = useResumeStore((state) => state.removeCustomSection)
  const visible = isSectionVisible(resume, id)

  return (
    <span className={styles.controls} onClick={(event) => event.preventDefault()}>
      <label className={styles.visible}>
        <input
          type="checkbox"
          checked={visible}
          onChange={(event) => setSectionVisible(id, event.target.checked)}
        />
        Show
      </label>
      <button
        type="button"
        className={styles.ghost}
        disabled={index === 0}
        onClick={() => moveSection(id, -1)}
      >
        Up
      </button>
      <button
        type="button"
        className={styles.ghost}
        disabled={index === total - 1}
        onClick={() => moveSection(id, 1)}
      >
        Down
      </button>
      {!isBuiltinSectionId(id) ? (
        <button
          type="button"
          className={styles.danger}
          onClick={() => removeCustomSection(id)}
        >
          Delete
        </button>
      ) : null}
    </span>
  )
}

function BasicsEditor() {
  const basics = useResumeStore((state) => state.resume.basics)
  const patchBasics = useResumeStore((state) => state.patchBasics)
  const addLink = useResumeStore((state) => state.addLink)
  const updateLink = useResumeStore((state) => state.updateLink)
  const removeLink = useResumeStore((state) => state.removeLink)

  return (
    <Panel title="Contact & basics">
      <Field label="Full name">
        <input
          value={basics.name}
          onChange={(event) => patchBasics({ name: event.target.value })}
        />
      </Field>
      <Field label="Headline">
        <input
          value={basics.title}
          onChange={(event) => patchBasics({ title: event.target.value })}
        />
      </Field>
      <Field label="Email">
        <input
          value={basics.email}
          onChange={(event) => patchBasics({ email: event.target.value })}
        />
      </Field>
      <div className={styles.row}>
        <Field label="Phone">
          <input
            value={basics.phone}
            onChange={(event) => patchBasics({ phone: event.target.value })}
          />
        </Field>
        <Field label="Location">
          <input
            value={basics.location}
            onChange={(event) => patchBasics({ location: event.target.value })}
          />
        </Field>
      </div>
      {basics.links.map((link) => (
        <div key={link.id} className={styles.item}>
          <div className={styles.row}>
            <Field label="Link label">
              <input
                value={link.label}
                onChange={(event) => updateLink(link.id, { label: event.target.value })}
              />
            </Field>
            <Field label="URL">
              <input
                value={link.url}
                onChange={(event) => updateLink(link.id, { url: event.target.value })}
              />
            </Field>
          </div>
          <button
            type="button"
            className={styles.danger}
            onClick={() => removeLink(link.id)}
          >
            Remove link
          </button>
        </div>
      ))}
      <button type="button" className={styles.ghost} onClick={addLink}>
        Add link
      </button>
    </Panel>
  )
}

function SummaryEditor() {
  const summary = useResumeStore((state) => state.resume.summary)
  const setSummary = useResumeStore((state) => state.setSummary)
  return (
    <Field label="Summary">
      <textarea
        value={summary}
        onChange={(event) => setSummary(event.target.value)}
      />
    </Field>
  )
}

function ExperienceEditor() {
  const experience = useResumeStore((state) => state.resume.experience)
  const addExperience = useResumeStore((state) => state.addExperience)
  const updateExperience = useResumeStore((state) => state.updateExperience)
  const removeExperience = useResumeStore((state) => state.removeExperience)

  return (
    <>
      {experience.length === 0 ? (
        <p className={styles.hint}>No roles yet. Add your work history.</p>
      ) : null}
      {experience.map((item, index) => (
        <div key={item.id} className={styles.item}>
          <div className={styles.itemTop}>
            <span>Role {index + 1}</span>
            <button
              type="button"
              className={styles.danger}
              onClick={() => removeExperience(item.id)}
            >
              Remove
            </button>
          </div>
          <Field label="Job title">
            <input
              value={item.role}
              onChange={(event) => updateExperience(item.id, { role: event.target.value })}
            />
          </Field>
          <Field label="Company">
            <input
              value={item.company}
              onChange={(event) =>
                updateExperience(item.id, { company: event.target.value })
              }
            />
          </Field>
          <div className={styles.row}>
            <Field label="Start">
              <input
                value={item.startDate}
                onChange={(event) =>
                  updateExperience(item.id, { startDate: event.target.value })
                }
              />
            </Field>
            <Field label="End">
              <input
                value={item.endDate}
                onChange={(event) =>
                  updateExperience(item.id, { endDate: event.target.value })
                }
              />
            </Field>
          </div>
          <Field label="Location">
            <input
              value={item.location}
              onChange={(event) =>
                updateExperience(item.id, { location: event.target.value })
              }
            />
          </Field>
          <Field label="Bullets">
            <BulletList
              items={item.bullets}
              onChange={(bullets) => updateExperience(item.id, { bullets })}
            />
          </Field>
        </div>
      ))}
      <button type="button" className={styles.ghost} onClick={addExperience}>
        Add role
      </button>
    </>
  )
}

function SkillsEditor() {
  const skills = useResumeStore((state) => state.resume.skills)
  const addSkillGroup = useResumeStore((state) => state.addSkillGroup)
  const updateSkillGroup = useResumeStore((state) => state.updateSkillGroup)
  const removeSkillGroup = useResumeStore((state) => state.removeSkillGroup)

  return (
    <>
      {skills.length === 0 ? (
        <p className={styles.hint}>Group skills however you like — languages, tools, or strengths.</p>
      ) : null}
      {skills.map((group) => (
        <div key={group.id} className={styles.item}>
          <div className={styles.itemTop}>
            <span>Group</span>
            <button
              type="button"
              className={styles.danger}
              onClick={() => removeSkillGroup(group.id)}
            >
              Remove
            </button>
          </div>
          <Field label="Group name">
            <input
              value={group.name}
              onChange={(event) => updateSkillGroup(group.id, { name: event.target.value })}
            />
          </Field>
          <Field label="Skills">
            <TagInput
              tags={group.tags}
              onChange={(tags) => updateSkillGroup(group.id, { tags })}
            />
          </Field>
        </div>
      ))}
      <button type="button" className={styles.ghost} onClick={addSkillGroup}>
        Add skill group
      </button>
    </>
  )
}

function AchievementsEditor() {
  const achievements = useResumeStore((state) => state.resume.achievements)
  const addAchievement = useResumeStore((state) => state.addAchievement)
  const updateAchievement = useResumeStore((state) => state.updateAchievement)
  const removeAchievement = useResumeStore((state) => state.removeAchievement)

  return (
    <>
      {achievements.length === 0 ? (
        <p className={styles.hint}>Add awards, publications, or results worth highlighting.</p>
      ) : null}
      {achievements.map((item) => (
        <div key={item.id} className={styles.item}>
          <div className={styles.itemTop}>
            <span>Achievement</span>
            <button
              type="button"
              className={styles.danger}
              onClick={() => removeAchievement(item.id)}
            >
              Remove
            </button>
          </div>
          <Field label="Title">
            <input
              value={item.title}
              onChange={(event) => updateAchievement(item.id, { title: event.target.value })}
            />
          </Field>
          <Field label="Description">
            <textarea
              value={item.description}
              onChange={(event) =>
                updateAchievement(item.id, { description: event.target.value })
              }
            />
          </Field>
          <Field label="Bullets">
            <BulletList
              items={item.bullets}
              onChange={(bullets) => updateAchievement(item.id, { bullets })}
            />
          </Field>
        </div>
      ))}
      <button type="button" className={styles.ghost} onClick={addAchievement}>
        Add achievement
      </button>
    </>
  )
}

function ProjectsEditor() {
  const projects = useResumeStore((state) => state.resume.projects)
  const addProject = useResumeStore((state) => state.addProject)
  const updateProject = useResumeStore((state) => state.updateProject)
  const removeProject = useResumeStore((state) => state.removeProject)

  return (
    <>
      {projects.length === 0 ? (
        <p className={styles.hint}>Add projects you want on the page.</p>
      ) : null}
      {projects.map((item) => (
        <div key={item.id} className={styles.item}>
          <div className={styles.itemTop}>
            <span>Project</span>
            <button
              type="button"
              className={styles.danger}
              onClick={() => removeProject(item.id)}
            >
              Remove
            </button>
          </div>
          <Field label="Name">
            <input
              value={item.name}
              onChange={(event) => updateProject(item.id, { name: event.target.value })}
            />
          </Field>
          <Field label="Link">
            <input
              value={item.link}
              onChange={(event) => updateProject(item.id, { link: event.target.value })}
            />
          </Field>
          <div className={styles.row}>
            <Field label="Start">
              <input
                value={item.startDate}
                onChange={(event) =>
                  updateProject(item.id, { startDate: event.target.value })
                }
              />
            </Field>
            <Field label="End">
              <input
                value={item.endDate}
                onChange={(event) => updateProject(item.id, { endDate: event.target.value })}
              />
            </Field>
          </div>
          <Field label="Bullets">
            <BulletList
              items={item.bullets}
              onChange={(bullets) => updateProject(item.id, { bullets })}
            />
          </Field>
        </div>
      ))}
      <button type="button" className={styles.ghost} onClick={addProject}>
        Add project
      </button>
    </>
  )
}

function CustomSectionEditor({ id }: { id: string }) {
  const section = useResumeStore((state) =>
    state.resume.customSections.find((item) => item.id === id),
  )
  const updateCustomSection = useResumeStore((state) => state.updateCustomSection)
  const addCustomItem = useResumeStore((state) => state.addCustomItem)
  const updateCustomItem = useResumeStore((state) => state.updateCustomItem)
  const removeCustomItem = useResumeStore((state) => state.removeCustomItem)

  if (!section) return null

  return (
    <>
      <Field label="Section title">
        <input
          value={section.title}
          onChange={(event) =>
            updateCustomSection(section.id, { title: event.target.value })
          }
        />
      </Field>
      {section.items.map((item) => (
        <div key={item.id} className={styles.item}>
          <div className={styles.itemTop}>
            <span>Entry</span>
            <button
              type="button"
              className={styles.danger}
              onClick={() => removeCustomItem(section.id, item.id)}
            >
              Remove
            </button>
          </div>
          <Field label="Heading">
            <input
              value={item.heading}
              onChange={(event) =>
                updateCustomItem(section.id, item.id, { heading: event.target.value })
              }
            />
          </Field>
          <Field label="Details">
            <textarea
              value={item.body}
              onChange={(event) =>
                updateCustomItem(section.id, item.id, { body: event.target.value })
              }
            />
          </Field>
          <Field label="Bullets">
            <BulletList
              items={item.bullets}
              onChange={(bullets) =>
                updateCustomItem(section.id, item.id, { bullets })
              }
            />
          </Field>
        </div>
      ))}
      <button
        type="button"
        className={styles.ghost}
        onClick={() => addCustomItem(section.id)}
      >
        Add entry
      </button>
    </>
  )
}

function SectionEditor({ id }: { id: string }) {
  if (id === 'summary') return <SummaryEditor />
  if (id === 'experience') return <ExperienceEditor />
  if (id === 'skills') return <SkillsEditor />
  if (id === 'achievements') return <AchievementsEditor />
  if (id === 'projects') return <ProjectsEditor />
  return <CustomSectionEditor id={id} />
}

export function Editor() {
  const resume = useResumeStore((state) => state.resume)
  const addCustomSection = useResumeStore((state) => state.addCustomSection)
  const order = resume.meta.sectionOrder

  return (
    <aside className={`rf-nprint ${styles.editor}`}>
      <div className={styles.inner}>
        <BasicsEditor />
        {order.map((id, index) => (
          <Panel
            key={id}
            title={sectionLabel(resume, id)}
            extra={
              <SectionControls
                resume={resume}
                id={id}
                index={index}
                total={order.length}
              />
            }
          >
            <SectionEditor id={id} />
          </Panel>
        ))}
        <button type="button" className={styles.primary} onClick={addCustomSection}>
          Add custom section
        </button>
      </div>
    </aside>
  )
}
