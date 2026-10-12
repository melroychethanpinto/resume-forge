import { useResumeStore } from '../store/resumeStore'
import type { TemplateId } from '../types/resume'
import styles from './AppShell.module.css'
import { Editor } from './Editor'
import { Preview } from './Preview'

const TEMPLATES: { id: TemplateId; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'compact', label: 'Compact' },
]

export function AppShell() {
  const templateId = useResumeStore((state) => state.resume.meta.templateId)
  const setTemplate = useResumeStore((state) => state.setTemplate)
  const reset = useResumeStore((state) => state.reset)

  function handleReset() {
    if (window.confirm('Reset the resume to the sample content? This cannot be undone.')) {
      reset()
    }
  }

  return (
    <div className={styles.shell}>
      <header className={`rf-nprint ${styles.topbar}`}>
        <div className={styles.brand}>
          <strong>Resume Forge</strong>
          <span>Add content once, then pick a template.</span>
        </div>
        <div className={styles.actions}>
          <label>
            Template
            <select
              value={templateId}
              onChange={(event) => setTemplate(event.target.value as TemplateId)}
            >
              {TEMPLATES.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className={styles.primary}
            onClick={() => window.print()}
          >
            Print / PDF
          </button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </header>
      <div className={styles.main}>
        <Editor />
        <Preview />
      </div>
    </div>
  )
}
