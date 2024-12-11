export type ProductT = {
  data?: DataProductT[]
  pagination?: DataProductPaginationT
  message?: string
  error?: string
}

export type DataProductT = {
  id: string
  name: string
  price: number
  category: string
  description: string
}

export type DataProductPaginationT = {
  currentPage: number
  limit: number
  total: number
}
