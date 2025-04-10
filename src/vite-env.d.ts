/// <reference types="vite/client" />

interface ImportMeta {
    readonly glob: (path: string, options?: { eager?: boolean }) => Record<string, any>
  }