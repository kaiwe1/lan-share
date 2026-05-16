export function renderHomePage(files: string[]) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>LAN Share</title>
</head>

<body>
  <h1>LAN Share</h1>

  <input type="file" id="fileInput" />

  <h2>Files</h2>

  ${files
    .map(
      (file) =>
        `<a href="/files/${encodeURIComponent(file)}">${file}</a>`
    )
    .join("")}

<script>
  const input = document.getElementById("fileInput")

  input.addEventListener("change", async () => {
    const file = input.files[0]

    const formData = new FormData()
    formData.append("file", file)

    await fetch("/upload", {
      method: "POST",
      body: formData,
    })

    location.reload()
  })
</script>

</body>
</html>
`
}