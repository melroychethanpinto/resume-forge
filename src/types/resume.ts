export type TemplateId = 'classic' | 'modern' | 'compact'

export const BUILTIN_SECTION_IDS = [
  'summary',
  'experience',
  'skills',
  'achievements',
  'projects',
] as const

export type BuiltinSectionId = (typeof BUILTIN_SECTION_IDS)[number]

export type Link = {
  id: string
  label: string
  url: string
}

export type Basics = {
  name: string
  title: string
  email: string
  phone: string
  location: string
  links: Link[]
}

export type ExperienceItem = {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  location: string
  bullets: string[]
}

export type SkillGroup = {
  id: string
  name: string
  tags: string[]
}

export type AchievementItem = {
  id: string
  title: string
  description: string
  bullets: string[]
}

export type ProjectItem = {
  id: string
  name: string
  link: string
  startDate: string
  endDate: string
  bullets: string[]
}

export type CustomItem = {
  id: string
  heading: string
  body: string
  bullets: string[]
}

export type CustomSection = {
  id: string
  title: string
  visible: boolean
  items: CustomItem[]
}

export type Resume = {
  meta: {
    templateId: TemplateId
    sectionOrder: string[]
    visibility: Record<BuiltinSectionId, boolean>
  }
  basics: Basics
  summary: string
  experience: ExperienceItem[]
  skills: SkillGroup[]
  achievements: AchievementItem[]
  projects: ProjectItem[]
  customSections: CustomSection[]
}
