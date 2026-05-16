import { mkdirSync, existsSync } from "fs"
import os from "os"
import { UPLOAD_DIR, PORT } from "./constants"
import { uploadRoute } from "./routes/upload"
import { fileRoute } from "./routes/file"
import { indexRoute } from "./routes"


if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR)
}

function getLocalIP() {
  const nets = os.networkInterfaces()

  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address
      }
    }
  }

  return "localhost"
}

Bun.serve({
  port: PORT,

  async fetch(req: Request) {
    const url = new URL(req.url)

    // 首页
    if (url.pathname === "/") {
      return indexRoute()
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