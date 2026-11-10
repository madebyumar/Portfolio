/** Escape HTML, then apply a small safe markdown subset for blog bodies. */
export function renderMarkdown(md?: string): string {
  if (!md) return ''
  let html = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  html = html.replace(/```([\s\S]*?)```/g, (_m, p: string) => `<pre><code>${p.trim()}</code></pre>`)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
    '<a href="$2" rel="noopener noreferrer" target="_blank">$1</a>'
  )
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>')
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')

  return html
    .split(/\n\s*\n/)
    .map((p) => {
      p = p.trim()
      if (!p) return ''
      if (/^<(h[1-3]|pre|ul|ol|li)/i.test(p)) return p
      return `<p>${p.replace(/\n/g, '<br />')}</p>`
    })
    .join('\n')
}
