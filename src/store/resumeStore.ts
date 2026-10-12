import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { cloneSeed } from '../data/seed'
import { uid } from '../lib/ids'
import { isBuiltinSectionId } from '../lib/sections'
import type {
  AchievementItem,
  Basics,
  CustomItem,
  CustomSection,
  ExperienceItem,
  Link,
  ProjectItem,
  Resume,
  SkillGroup,
  TemplateId,
} from '../types/resume'

const STORAGE_KEY = 'resume-forge:v1'

function mapById<T extends { id: string }>(
  items: T[],
  id: string,
  patch: Partial<T>,
): T[] {
  return items.map((item) => (item.id === id ? { ...item, ...patch } : item))
}

function debounceStorage(ms: number) {
  let timer: ReturnType<typeof setTimeout> | undefined
  return createJSONStorage(() => ({
    getItem: (name) => localStorage.getItem(name),
    setItem: (name, value) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        localStorage.setItem(name, value)
      }, ms)
    },
    removeItem: (name) => localStorage.removeItem(name),
  }))
}

type ResumeState = {
  resume: Resume
  setTemplate: (templateId: TemplateId) => void
  patchBasics: (patch: Partial<Omit<Basics, 'links'>>) => void
  addLink: () => void
  updateLink: (id: string, patch: Partial<Link>) => void
  removeLink: (id: string) => void
  setSummary: (summary: string) => void
  addExperience: () => void
  updateExperience: (id: string, patch: Partial<ExperienceItem>) => void
  removeExperience: (id: string) => void
  addSkillGroup: () => void
  updateSkillGroup: (id: string, patch: Partial<SkillGroup>) => void
  removeSkillGroup: (id: string) => void
  addAchievement: () => void
  updateAchievement: (id: string, patch: Partial<AchievementItem>) => void
  removeAchievement: (id: string) => void
  addProject: () => void
  updateProject: (id: string, patch: Partial<ProjectItem>) => void
  removeProject: (id: string) => void
  addCustomSection: () => void
  updateCustomSection: (
    id: string,
    patch: Partial<Pick<CustomSection, 'title' | 'visible'>>,
  ) => void
  removeCustomSection: (id: string) => void
  addCustomItem: (sectionId: string) => void
  updateCustomItem: (
    sectionId: string,
    itemId: string,
    patch: Partial<CustomItem>,
  ) => void
  removeCustomItem: (sectionId: string, itemId: string) => void
  moveSection: (id: string, direction: -1 | 1) => void
  setSectionVisible: (id: string, visible: boolean) => void
  reset: () => void
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      resume: cloneSeed(),
      setTemplate: (templateId) =>
        set((state) => ({
          resume: {
            ...state.resume,
            meta: { ...state.resume.meta, templateId },
          },
        })),
      patchBasics: (patch) =>
        set((state) => ({
          resume: {
            ...state.resume,
            basics: { ...state.resume.basics, ...patch },
          },
        })),
      addLink: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            basics: {
              ...state.resume.basics,
              links: [
                ...state.resume.basics.links,
                { id: uid(), label: '', url: '' },
              ],
            },
          },
        })),
      updateLink: (id, patch) =>
        set((state) => ({
          resume: {
            ...state.resume,
            basics: {
              ...state.resume.basics,
              links: mapById(state.resume.basics.links, id, patch),
            },
          },
        })),
      removeLink: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            basics: {
              ...state.resume.basics,
              links: state.resume.basics.links.filter((link) => link.id !== id),
            },
          },
        })),
      setSummary: (summary) =>
        set((state) => ({ resume: { ...state.resume, summary } })),
      addExperience: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: [
              ...state.resume.experience,
              {
                id: uid(),
                company: '',
                role: '',
                startDate: '',
                endDate: '',
                location: '',
                bullets: [''],
              },
            ],
          },
        })),
      updateExperience: (id, patch) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: mapById(state.resume.experience, id, patch),
          },
        })),
      removeExperience: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: state.resume.experience.filter((item) => item.id !== id),
          },
        })),
      addSkillGroup: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: [
              ...state.resume.skills,
              { id: uid(), name: '', tags: [] },
            ],
          },
        })),
      updateSkillGroup: (id, patch) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: mapById(state.resume.skills, id, patch),
          },
        })),
      removeSkillGroup: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: state.resume.skills.filter((group) => group.id !== id),
          },
        })),
      addAchievement: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            achievements: [
              ...state.resume.achievements,
              { id: uid(), title: '', description: '', bullets: [] },
            ],
          },
        })),
      updateAchievement: (id, patch) =>
        set((state) => ({
          resume: {
            ...state.resume,
            achievements: mapById(state.resume.achievements, id, patch),
          },
        })),
      removeAchievement: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            achievements: state.resume.achievements.filter((item) => item.id !== id),
          },
        })),
      addProject: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: [
              ...state.resume.projects,
              {
                id: uid(),
                name: '',
                link: '',
                startDate: '',
                endDate: '',
                bullets: [''],
              },
            ],
          },
        })),
      updateProject: (id, patch) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: mapById(state.resume.projects, id, patch),
          },
        })),
      removeProject: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: state.resume.projects.filter((item) => item.id !== id),
          },
        })),
      addCustomSection: () =>
        set((state) => {
          const id = uid()
          const section: CustomSection = {
            id,
            title: 'Custom section',
            visible: true,
            items: [{ id: uid(), heading: '', body: '', bullets: [''] }],
          }
          return {
            resume: {
              ...state.resume,
              customSections: [...state.resume.customSections, section],
              meta: {
                ...state.resume.meta,
                sectionOrder: [...state.resume.meta.sectionOrder, id],
              },
            },
          }
        }),
      updateCustomSection: (id, patch) =>
        set((state) => ({
          resume: {
            ...state.resume,
            customSections: mapById<CustomSection>(
              state.resume.customSections,
              id,
              patch,
            ),
          },
        })),
      removeCustomSection: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            customSections: state.resume.customSections.filter(
              (section) => section.id !== id,
            ),
            meta: {
              ...state.resume.meta,
              sectionOrder: state.resume.meta.sectionOrder.filter(
                (sectionId) => sectionId !== id,
              ),
            },
          },
        })),
      addCustomItem: (sectionId) =>
        set((state) => ({
          resume: {
            ...state.resume,
            customSections: state.resume.customSections.map((section) =>
              section.id === sectionId
                ? {
                    ...section,
                    items: [
                      ...section.items,
                      { id: uid(), heading: '', body: '', bullets: [''] },
                    ],
                  }
                : section,
            ),
          },
        })),
      updateCustomItem: (sectionId, itemId, patch) =>
        set((state) => ({
          resume: {
            ...state.resume,
            customSections: state.resume.customSections.map((section) =>
              section.id === sectionId
                ? { ...section, items: mapById(section.items, itemId, patch) }
                : section,
            ),
          },
        })),
      removeCustomItem: (sectionId, itemId) =>
        set((state) => ({
          resume: {
            ...state.resume,
            customSections: state.resume.customSections.map((section) =>
              section.id === sectionId
                ? {
                    ...section,
                    items: section.items.filter((item) => item.id !== itemId),
                  }
                : section,
            ),
          },
        })),
      moveSection: (id, direction) =>
        set((state) => {
          const order = [...state.resume.meta.sectionOrder]
          const index = order.indexOf(id)
          const next = index + direction
          if (index < 0 || next < 0 || next >= order.length) return state
          ;[order[index], order[next]] = [order[next], order[index]]
          return {
            resume: {
              ...state.resume,
              meta: { ...state.resume.meta, sectionOrder: order },
            },
          }
        }),
      setSectionVisible: (id, visible) =>
        set((state) => {
          if (isBuiltinSectionId(id)) {
            return {
              resume: {
                ...state.resume,
                meta: {
                  ...state.resume.meta,
                  visibility: { ...state.resume.meta.visibility, [id]: visible },
                },
              },
            }
          }
          return {
            resume: {
              ...state.resume,
              customSections: state.resume.customSections.map((section) =>
                section.id === id ? { ...section, visible } : section,
              ),
            },
          }
        }),
      reset: () => set({ resume: cloneSeed() }),
    }),
    {
      name: STORAGE_KEY,
      storage: debounceStorage(300),
      partialize: (state) => ({ resume: state.resume }),
    },
  ),
)
