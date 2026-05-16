import { readdirSync, readFileSync, writeFileSync, rmSync } from "fs"
import { join } from "path"
import { UPLOAD_DIR, CHUNKS_DIR } from "../constants"

export async function mergeChunksRoute(req: Request) {
  const body = await req.json()
  const { fileId, fileName } = body as { fileId: string; fileName: string }

  if (!fileId || !fileName) {
    return new Response(
      JSON.stringify({ error: "Missing fileId or fileName" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  const fileChunkDir = join(CHUNKS_DIR, fileId)
  const chunks = readdirSync(fileChunkDir)
    .map(Number)
    .sort((a, b) => a - b)

  // 合并所有分块
  const allData: Uint8Array[] = []
  for (const chunkIndex of chunks) {
    const chunkPath = join(fileChunkDir, chunkIndex.toString())
    const data = readFileSync(chunkPath)
    allData.push(new Uint8Array(data))
  }

  // 合并成一个文件
  const totalLength = allData.reduce((sum, data) => sum + data.length, 0)
  const mergedData = new Uint8Array(totalLength)
  let offset = 0
  for (const data of allData) {
    mergedData.set(data, offset)
    offset += data.length
  }

  // 保存到 uploads 目录
  const outputPath = join(UPLOAD_DIR, fileName)
  writeFileSync(outputPath, mergedData)

  console.log(`[merge-chunks] Merged file saved to ${outputPath} (${mergedData.byteLength} bytes)`)  

  // 删除分块目录
  rmSync(fileChunkDir, { recursive: true })

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { "Content-Type": "application/json" } }
  )
}
