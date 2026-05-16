export function renderHomePage(files: string[]) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>LAN Share</title>
  <style>
    body {
      font-family: sans-serif;
      max-width: 700px;
      margin: 40px auto;
      padding: 20px;
    }

    .drop {
      border: 2px dashed #999;
      padding: 40px;
      text-align: center;
      border-radius: 12px;
      margin-bottom: 30px;
    }

    a {
      display: block;
      margin: 8px 0;
    }
  </style>
</head>

<body>
  <h1>LAN Share</h1>
  
  <div class='drop'>
    <input type="file" id="fileInput" />
  </div>

  <h2>Files</h2>

  ${files
    .map(
      (file) =>
        `<div><a href="/files/${encodeURIComponent(file)}">${file}</a></div>`
    )
    .join("")}

<script>
  const input = document.getElementById("fileInput")

  input.addEventListener("change", async () => {
    const file = input.files[0]

    const CHUNK_SIZE = 2 * 1024 * 1024 // 2MB
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
    const fileId = file.size + file.name

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, file.size)
      const chunk = file.slice(start, end)

      const formData = new FormData()
      formData.append('chunk', chunk)
      formData.append('fileId', fileId)
      formData.append('chunkIndex', i.toString())

      await fetch('/upload-chunk', { method: 'POST', body: formData })
      console.log('upload progress: ', Math.round((i + 1) / totalChunks))
    }

    // upload finished, notify backend to merge
    await fetch('/merge-chunks', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ fileId, fileName: file.name })
    })

    // refresh page to get latest file list
    location.reload()
  })
</script>

</body>
</html>
`
}