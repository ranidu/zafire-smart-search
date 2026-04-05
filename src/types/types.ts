export interface SearchResult {
  id: string
  type: string
  title: string
  subtitle?: string
  badge?: string
  metadata?: Record<string, string>
}

export interface FilterOption {
  id: string
  label: string
  value: string
}

export interface SearchChangeEvent {
  query: string
  filter: string | null
}

export interface SearchSelectEvent {
  result: SearchResult
}

export interface SearchFilterEvent {
  filter: FilterOption
}