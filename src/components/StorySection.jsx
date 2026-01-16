export default function StorySection({ section }) {
  return (
    <section
      className="story-section"
      data-section-id={section.id}
    >
      <div className="story-content">
        {section.title && <h2 className="story-title">{section.title}</h2>}
        {section.content && section.content.map((paragraph, index) => (
          <p key={index} className="story-paragraph">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  )
}
