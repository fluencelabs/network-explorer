import { Component, ReactNode } from 'react'

export class ErrorBoundary extends Component<{
  fallback?: ReactNode
  children?: ReactNode
}> {
  state: { hasError?: boolean } = {}

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error(error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}
