import { mkdirSync, existsSync } from "fs"
import { UPLOAD_DIR, PORT, CHUNKS_DIR } from "./constants"
import { uploadRoute } from "./routes/upload"
import { uploadChunkRoute } from "./routes/upload-chunk"
import { mergeChunksRoute } from "./routes/merge-chunks"
import { fileRoute } from "./routes/file"
import { indexRoute } from "./routes"
import { getLocalIP } from "./utils/ip"


if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR)
}

if (!existsSync(CHUNKS_DIR)) {
  mkdirSync(CHUNKS_DIR)
}

Bun.serve({
  port: PORT,

  async fetch(req: Request) {
    const url = new URL(req.url)

    if (url.pathname === "/") {
      return indexRoute()
    }

    // 单个文件（保留）
    if (url.pathname === "/upload" && req.method === "POST") {
      return uploadRoute(req)
    }

    // 分块上传
    if (url.pathname === "/upload-chunk" && req.method === "POST") {
      return uploadChunkRoute(req)
    }

    // 合并分块
    if (url.pathname === "/merge-chunks" && req.method === "POST") {
      return mergeChunksRoute(req)
    }

    // 上传
    if (url.pathname === "/upload" && req.method === "POST") {
      return uploadRoute(req)
    }

    // 下载
    if (url.pathname.startsWith("/files/")) {
      const filename = decodeURIComponent(
        url.pathname.replace("/files/", "")
      )

      return fileRoute(filename)
    }

    return new Response("Not found", {
      status: 404,
    })
  },
})

console.log(`
🚀 LAN Share running:

http://${getLocalIP()}:${PORT}
`)