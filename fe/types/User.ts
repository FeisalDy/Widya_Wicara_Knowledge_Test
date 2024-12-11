export type DataUserT = {
  id?: number
  name?: string
  email?: string
  gender?: string
}

export type UserT = {
  data?: DataUserT
  error?: string
  message?: string
}
