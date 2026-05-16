import { join } from "path"

export const PORT = 3000
export const UPLOAD_DIR = join(import.meta.dir, '../uploads')
export const CHUNKS_DIR = join(import.meta.dir, '../chunks')
export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB