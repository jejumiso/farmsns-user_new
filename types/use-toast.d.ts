// types/use-toast.d.ts

declare global {
  const useToast: () => {
    add: (options: {
      title: string
      description?: string
      timeout?: number
      color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
      icon?: string
      actions?: { label: string; click: () => void }[]
    }) => void
  }
}

export {}
