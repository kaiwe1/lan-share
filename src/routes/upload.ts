import { writeFileSync } from "fs"
import { join } from "path"
import { UPLOAD_DIR } from "../constants"

export async function uploadRoute(req: Request) {
  const formData = await req.formData()

  const file = formData.get("file") as File

  if (!file) {
    return new Response("No file", {
      status: 400,
    })
  }

  const buffer = await file.arrayBuffer()

  writeFileSync(
    join(UPLOAD_DIR, file.name),
    new Uint8Array(buffer)
  )

  return new Response("OK")
}