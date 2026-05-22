export type Session = {
  username: string
  createdAt: number
}

export const sessions = new Map<string, Session>()
