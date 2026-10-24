/** Araçların kalıcı (tekrar denemenin anlamsız olduğu) hataları için: görev doğrudan failed olur */
export class PermanentToolError extends Error {
  constructor(
    readonly code: string,
    message: string
  ) {
    super(message)
    this.name = 'PermanentToolError'
  }
}
