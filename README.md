# LAN Share

A simple LAN file sharing app built with Bun and TypeScript.

## Features

- Upload files from browser
- Download uploaded files
- Supports chunked upload for large files

## Requirements

- Bun

## Run locally

```bash
bun run dev
```

Then open the URL shown in the console, e.g. `http://localhost:3000`.

## Upload

- Select a file in the browser
- The app uploads the file in chunks
- The page reloads after upload is complete

## Project structure

- `src/server.ts` - HTTP server entry point
- `src/routes/upload.ts` - single-file upload handler
- `src/routes/upload-chunk.ts` - chunk upload handler
- `src/routes/merge-chunks.ts` - chunk merge handler
- `src/pages/home.ts` - HTML homepage renderer
- `uploads/` - saved uploaded files

## Notes

- Uploaded files are stored under `uploads/`
- Chunked upload data is temporarily written under `chunks/`
