import { writeFileSync, mkdirSync, existsSync } from "fs"
import { join } from "path"
import { CHUNKS_DIR } from "../constants"

export async function uploadChunkRoute(req: Request) {
  const formData = await req.formData()

  const chunk = formData.get("chunk") as File
  const fileId = formData.get("fileId") as string
  const chunkIndex = formData.get("chunkIndex") as string

  if (!chunk || !fileId || chunkIndex === null) {
    return new Response(
      JSON.stringify({ error: "Missing required fields" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  // 创建 chunks 目录
  if (!existsSync(CHUNKS_DIR)) {
    mkdirSync(CHUNKS_DIR, { recursive: true })
  }

  // 使用fileId创建一个目录
  const fileChunkDir = join(CHUNKS_DIR, fileId)
  if (!existsSync(fileChunkDir)) {
    mkdirSync(fileChunkDir, { recursive: true })
  }

  // 以chunkIndex保存分块
  const chunkPath = join(fileChunkDir, chunkIndex)
  const buffer = await chunk.arrayBuffer()
  writeFileSync(chunkPath, new Uint8Array(buffer))

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { "Content-Type": "application/json" } }
  )
}
