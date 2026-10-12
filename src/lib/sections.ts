import {
  BUILTIN_SECTION_IDS,
  type BuiltinSectionId,
  type Resume,
} from '../types/resume'

export const BUILTIN_LABELS: Record<BuiltinSectionId, string> = {
  summary: 'Summary',
  experience: 'Work Experience',
  skills: 'Skills',
  achievements: 'Achievements',
  projects: 'Projects',
}

export function isBuiltinSectionId(id: string): id is BuiltinSectionId {
  return (BUILTIN_SECTION_IDS as readonly string[]).includes(id)
}

export function sectionLabel(resume: Resume, id: string): string {
  if (isBuiltinSectionId(id)) return BUILTIN_LABELS[id]
  return resume.customSections.find((section) => section.id === id)?.title || 'Custom'
}

export function isSectionVisible(resume: Resume, id: string): boolean {
  if (isBuiltinSectionId(id)) return resume.meta.visibility[id]
  return resume.customSections.find((section) => section.id === id)?.visible ?? false
}

function hasText(value: string | undefined): boolean {
  return Boolean(value?.trim())
}

function hasBullets(bullets: string[]): boolean {
  return bullets.some((bullet) => hasText(bullet))
}

export function isSectionEmpty(resume: Resume, id: string): boolean {
  if (id === 'summary') return !hasText(resume.summary)
  if (id === 'experience') {
    return !resume.experience.some(
      (item) =>
        hasText(item.company) ||
        hasText(item.role) ||
        hasText(item.location) ||
        hasBullets(item.bullets),
    )
  }
  if (id === 'skills') {
    return !resume.skills.some((group) => hasText(group.name) || group.tags.some(hasText))
  }
  if (id === 'achievements') {
    return !resume.achievements.some(
      (item) => hasText(item.title) || hasText(item.description) || hasBullets(item.bullets),
    )
  }
  if (id === 'projects') {
    return !resume.projects.some(
      (item) =>
        hasText(item.name) ||
        hasText(item.link) ||
        hasBullets(item.bullets),
    )
  }
  const custom = resume.customSections.find((section) => section.id === id)
  if (!custom) return true
  return !custom.items.some(
    (item) => hasText(item.heading) || hasText(item.body) || hasBullets(item.bullets),
  )
}

export function visibleSectionIds(resume: Resume): string[] {
  return resume.meta.sectionOrder.filter(
    (id) => isSectionVisible(resume, id) && !isSectionEmpty(resume, id),
  )
}
