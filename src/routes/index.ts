import { readdirSync } from "fs"
import { UPLOAD_DIR } from "../constants"
import { renderHomePage } from "../pages/home"

export function indexRoute() {
  const files = readdirSync(UPLOAD_DIR)

  return new Response(
    renderHomePage(files),
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  )
}