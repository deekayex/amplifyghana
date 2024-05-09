import React from 'react'

const EmbeddedDoc = () => {
  return (
    <div><p><iframe
    style={{ borderRadius: '12px' }}
    src="https://open.spotify.com/embed/track/01jgSDpB4gJR6f1WqcYCom?utm_source=generator"
    width="100%"
    height="352"
    frameBorder="0" // Use camelCase for frameBorder
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    allowFullScreen // Use camelCase for allowFullscreen
    loading="lazy"
  ></iframe></p></div>
  
  )
}

export default EmbeddedDoc