import { describe, expect, h, it, render, vi } from '@stencil/vitest'
import { FilterOption, SearchResult } from '../../../types'

const FILTERS: FilterOption[] = [
  { id: 'accounts', label: 'Accounts', value: 'accounts' },
]

const RESULTS: SearchResult[] = [
  { id: '1', type: 'Account', title: 'Acme Corp' },
  { id: '2', type: 'Contact', title: 'John Doe' },
]

describe('smart-search', () => {

  it('renders with default placeholder', async () => {
    const { root } = await render(<smart-search />)
    const input = root.shadowRoot!.querySelector('search-input') as any
    expect(input.placeholder).toBe('Search...')
  })

  it('renders with custom placeholder', async () => {
    const { root } = await render(<smart-search placeholder="Find something..." />)
    const input = root.shadowRoot!.querySelector('search-input') as any
    expect(input.placeholder).toBe('Find something...')
  })

  it('applies dark theme class when theme is dark', async () => {
    const { root } = await render(<smart-search theme="dark" />)
    const wrapper = root.shadowRoot!.querySelector('.smart-search')!
    expect(wrapper.classList.contains('smart-search--dark')).toBe(true)
  })

  it('does not apply dark theme class for light theme', async () => {
    const { root } = await render(<smart-search theme="light" />)
    const wrapper = root.shadowRoot!.querySelector('.smart-search')!
    expect(wrapper.classList.contains('smart-search--dark')).toBe(false)
  })

  it('renders search-filter when filters are provided', async () => {
    const { root } = await render(<smart-search filters={FILTERS} />)
    const filter = root.shadowRoot!.querySelector('search-filter')!
    expect(filter).not.toBeNull()
  })

  it('dropdown is closed initially', async () => {
    const { root } = await render(<smart-search results={RESULTS as any} />)
    const dropdown = root.shadowRoot!.querySelector('search-dropdown')!
    expect(dropdown.getAttribute('is-open')).not.toBe('true')
  })

  it('emits searchClear when input is cleared', async () => {
    const { root, waitForChanges } = await render(<smart-search />)
    const spy = vi.fn()
    root.addEventListener('searchClear', spy)

    const searchInput = root.shadowRoot!.querySelector('search-input')!
    searchInput.dispatchEvent(new CustomEvent('inputClear', { bubbles: true, composed: true }))
    await waitForChanges()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('emits searchFilter when a filter is selected', async () => {
    const { root, waitForChanges } = await render(<smart-search filters={FILTERS} />)
    const spy = vi.fn()
    root.addEventListener('searchFilter', spy)

    const searchFilter = root.shadowRoot!.querySelector('search-filter')!
    searchFilter.dispatchEvent(new CustomEvent('filterChange', {
      detail: FILTERS[0],
      bubbles: true,
      composed: true,
    }))
    await waitForChanges()

    expect(spy).toHaveBeenCalledTimes(1)
    const event = spy.mock.calls[0][0] as CustomEvent
    expect(event.detail.filter).toEqual(FILTERS[0])
  })

  it('emits searchSelect and closes dropdown when a result is selected', async () => {
    const { root, waitForChanges } = await render(<smart-search results={RESULTS as any} />)
    const spy = vi.fn()
    root.addEventListener('searchSelect', spy)

    const dropdown = root.shadowRoot!.querySelector('search-dropdown')!
    dropdown.dispatchEvent(new CustomEvent('resultSelect', {
      detail: RESULTS[0],
      bubbles: true,
      composed: true,
    }))
    await waitForChanges()

    expect(spy).toHaveBeenCalledTimes(1)
    const event = spy.mock.calls[0][0] as CustomEvent
    expect(event.detail.result).toEqual(RESULTS[0])
    expect(dropdown.getAttribute('is-open')).not.toBe('true')
  })

  it('respects maxResults by slicing results', async () => {
    const manyResults: SearchResult[] = Array.from({ length: 15 }, (_, i) => ({
      id: String(i),
      type: 'Account',
      title: `Result ${i}`,
    }))
    const { root } = await render(<smart-search results={manyResults as any} max-results={5} />)
    const dropdown = root.shadowRoot!.querySelector('search-dropdown')!
    const passed = (dropdown as any).results ?? []
    expect(passed.length).toBeLessThanOrEqual(5)
  })

})
