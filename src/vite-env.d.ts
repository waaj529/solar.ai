/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_TOKEN_STORAGE: 'localStorage' | 'sessionStorage' | 'memory'
  readonly VITE_TOKEN_REFRESH_ENDPOINT: string
  readonly VITE_TOKEN_REFRESH_BUFFER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}