import { defineConfig } from "vite"
import { createServer } from "vite"

async function startVite() {
  const server = await createServer(
    defineConfig({
      server: {
        port: 3000,
        host: true,
      },
      envDir: "../",
    }),
  )

  await server.listen()
}

startVite()
