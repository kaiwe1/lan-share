import { join } from "path"
import { UPLOAD_DIR } from "../constants"

export function fileRoute(filename: string) {
  const file = Bun.file(
    join(UPLOAD_DIR, filename)
  )

  return new Response(file)
}