import StorySection from './StorySection'

export default function ContentPanel({ sections }) {
  return (
    <div className="content-panel">
      {sections.map((section) => (
        <StorySection key={section.id} section={section} />
      ))}
    </div>
  )
}
