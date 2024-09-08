interface IntersectionObserver {
  observe(target: Element): void
  unobserve(target: Element): void
  disconnect(): void
}

declare var IntersectionObserver: {
  prototype: IntersectionObserver
  new (
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ): IntersectionObserver
}
