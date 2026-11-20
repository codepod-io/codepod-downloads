const targets = [
  ['aarch64-apple-darwin', 'macos', 'Apple Silicon', 'DMG'],
  ['x86_64-apple-darwin', 'macos', 'Intel', 'DMG'],
  ['universal-apple-darwin', 'macos', 'Universal', 'DMG'],
  ['x86_64-unknown-linux-gnu', 'linux', 'x64', 'tar.gz'],
  ['aarch64-unknown-linux-gnu', 'linux', 'ARM64', 'tar.gz'],
]

const status = document.getElementById('release-status')
fetch('latest.json', { cache: 'no-cache' })
  .then(async (response) => {
    if (!response.ok) throw new Error('Release unavailable')
    const release = await response.json()
    for (const [target, platform, label, format] of targets) {
      const asset = release.assets[target]
      const row = document.createElement('li')
      const link = document.createElement('a')
      const details = document.createElement('small')
      link.className = 'download'
      link.href = asset.url
      link.textContent = label
      link.setAttribute(
        'aria-label',
        `Download CodePod for ${platform === 'macos' ? 'macOS' : 'Linux'} ${label}`,
      )
      details.textContent = `${format} · ${Math.round(asset.size / 1024 / 1024)} MB`
      link.append(details)
      row.append(link)
      document.getElementById(`${platform}-downloads`).append(row)
    }
    const date = new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
    }).format(new Date(release.publishedAt))
    status.textContent = `${release.tag} · ${date}`
    document.getElementById('platforms').hidden = false
    document.getElementById('mac-signing').hidden =
      release.macNotarized === true
  })
  .catch(() => {
    status.textContent = 'The download list is temporarily unavailable.'
    document.getElementById('download-fallback').hidden = false
  })
