import { useLayoutEffect, useRef, useState } from 'react'
import { useResumeStore } from '../store/resumeStore'
import styles from './Preview.module.css'
import { ResumeDocument } from './templates/ResumeDocument'

const PAGE_WIDTH = (210 * 96) / 25.4
const PAGE_HEIGHT = (297 * 96) / 25.4

export function Preview() {
  const resume = useResumeStore((state) => state.resume)
  const stageRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const update = () => {
      const padding = 48
      const availableWidth = Math.max(stage.clientWidth - padding, 120)
      const availableHeight = Math.max(stage.clientHeight - padding, 120)
      const next = Math.min(
        availableWidth / PAGE_WIDTH,
        availableHeight / PAGE_HEIGHT,
        1,
      )
      setScale(next)
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`rf-stage ${styles.stage}`} ref={stageRef}>
      <div
        className={`rf-scale ${styles.scale}`}
        style={{
          width: PAGE_WIDTH,
          height: PAGE_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        <ResumeDocument resume={resume} />
      </div>
    </div>
  )
}
