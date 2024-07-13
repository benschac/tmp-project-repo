class APIError extends Error {
  status: number
  statusText: string
  message: string

  constructor(status: number, statusText: string, message: string) {
    super(`${status} ${statusText}: ${message}`)
    this.name = 'APIError'
    this.status = status
    this.statusText = statusText
    this.message = message
  }
}

export { APIError }
