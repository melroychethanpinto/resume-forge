import type { Resume } from '../types/resume'

export const seedResume: Resume = {
  meta: {
    templateId: 'classic',
    sectionOrder: [
      'summary',
      'experience',
      'skills',
      'projects',
      'achievements',
      'custom-education',
    ],
    visibility: {
      summary: true,
      experience: true,
      skills: true,
      achievements: true,
      projects: true,
    },
  },
  basics: {
    name: 'Alex Rivera',
    title: 'Software Engineer',
    email: 'alex.rivera@email.com',
    phone: '+1 (555) 010-2048',
    location: 'Austin, TX',
    links: [
      { id: 'link-github', label: 'GitHub', url: 'github.com/alexrivera' },
      { id: 'link-linkedin', label: 'LinkedIn', url: 'linkedin.com/in/alexrivera' },
    ],
  },
  summary:
    'Software engineer who ships reliable product features and cares about clear communication. Comfortable owning a feature from design through production, with a bias toward simple systems that are easy to change.',
  experience: [
    {
      id: 'exp-1',
      company: 'Northstar Labs',
      role: 'Software Engineer',
      startDate: '2022',
      endDate: 'Present',
      location: 'Austin, TX',
      bullets: [
        'Built and maintained customer-facing web apps in React and TypeScript used by 40k monthly users.',
        'Cut p95 API latency by 35% by adding caching and trimming over-fetching in the dashboard service.',
        'Partnered with design to ship an accessible settings flow and reduced related support tickets by 22%.',
      ],
    },
    {
      id: 'exp-2',
      company: 'Harbor Analytics',
      role: 'Junior Software Engineer',
      startDate: '2020',
      endDate: '2022',
      location: 'Remote',
      bullets: [
        'Delivered reporting views and CSV exports that replaced a weekly spreadsheet workflow.',
        'Wrote integration tests around billing edge cases and helped drop production incidents after releases.',
      ],
    },
  ],
  skills: [
    {
      id: 'skill-1',
      name: 'Languages',
      tags: ['TypeScript', 'JavaScript', 'Python', 'SQL'],
    },
    {
      id: 'skill-2',
      name: 'Frontend',
      tags: ['React', 'HTML', 'CSS', 'Vite'],
    },
    {
      id: 'skill-3',
      name: 'Backend & tools',
      tags: ['Node.js', 'PostgreSQL', 'Git', 'REST APIs'],
    },
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'On-call quality award',
      description: 'Recognized for reducing noisy alerts and documenting a clearer incident playbook.',
      bullets: [],
    },
    {
      id: 'ach-2',
      title: 'Hackathon finalist',
      description: 'Built a job-application tracker that synced notes and deadlines in a weekend prototype.',
      bullets: [],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Lumen Notes',
      link: 'github.com/alexrivera/lumen-notes',
      startDate: '2024',
      endDate: '',
      bullets: [
        'Personal knowledge app with local-first storage, tags, and full-text search.',
        'Focused on keyboard-first editing and a print-friendly reading view.',
      ],
    },
    {
      id: 'proj-2',
      name: 'RouteWatch',
      link: '',
      startDate: '2023',
      endDate: '2024',
      bullets: [
        'Small traffic-delay dashboard that pulled public transit APIs into a single status page.',
      ],
    },
  ],
  customSections: [
    {
      id: 'custom-education',
      title: 'Education',
      visible: true,
      items: [
        {
          id: 'edu-1',
          heading: 'B.S. Computer Science — State University',
          body: '2016 – 2020',
          bullets: ['Coursework in algorithms, databases, and human-computer interaction.'],
        },
      ],
    },
  ],
}

export function cloneSeed(): Resume {
  return structuredClone(seedResume)
}
