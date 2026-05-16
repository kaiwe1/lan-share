import { writeFileSync } from "fs"
import { join } from "path"
import { UPLOAD_DIR, MAX_FILE_SIZE } from "../constants"

export async function uploadRoute(req: Request) {
  const formData = await req.formData()

  const file = formData.get("file") as File

  if (!file) {
    return new Response(
      JSON.stringify({ error: "No file provided" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  // 检查文件大小
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (MAX_FILE_SIZE / 1024 / 1024).toFixed(0)
    return new Response(
      JSON.stringify({
        error: `File too large. Max size is ${sizeMB}MB, your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      }),
      { status: 413, headers: { "Content-Type": "application/json" } }
    )
  }

  console.log(`[upload] Received file ${file.name} (${(file.size / 1024).toFixed(1)} KB)`)  
  const buffer = await file.arrayBuffer()

  writeFileSync(
    join(UPLOAD_DIR, file.name),
    new Uint8Array(buffer)
  )

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { "Content-Type": "application/json" } }
  )
}