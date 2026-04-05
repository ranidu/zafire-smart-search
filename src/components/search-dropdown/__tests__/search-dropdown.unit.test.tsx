import { render, h, describe, it, expect, vi } from '@stencil/vitest'
import { SearchResult } from '../../../types'

const RESULTS: SearchResult[] = [
  { id: '1', type: 'Account', title: 'Acme Corp', subtitle: 'Enterprise' },
  { id: '2', type: 'Contact', title: 'John Doe', badge: 'VIP' },
]

describe('search-dropdown', () => {

  it('renders nothing when isOpen is false', async () => {
    const { root } = await render(<search-dropdown results={RESULTS as any} is-open={false} />)
    const wrapper = root.shadowRoot!.querySelector('.dropdown-wrapper')
    expect(wrapper).toBeNull()
  })

  it('renders the listbox when isOpen is true', async () => {
    const { root } = await render(<search-dropdown results={RESULTS as any} is-open={true} />)
    const wrapper = root.shadowRoot!.querySelector('[role="listbox"]')
    expect(wrapper).not.toBeNull()
  })

  it('renders one result item per result', async () => {
    const { root } = await render(<search-dropdown results={RESULTS as any} is-open={true} />)
    const items = root.shadowRoot!.querySelectorAll('[role="option"]')
    expect(items.length).toBe(2)
  })

  it('shows empty state when results array is empty', async () => {
    const { root } = await render(<search-dropdown results={[] as any} query="foo" is-open={true} />)
    const emptyState = root.shadowRoot!.querySelector('.empty-state')
    expect(emptyState).not.toBeNull()
    expect(emptyState!.textContent).toContain('foo')
  })

  it('renders the result type badge', async () => {
    const { root } = await render(<search-dropdown results={RESULTS as any} is-open={true} />)
    const badges = root.shadowRoot!.querySelectorAll('.result-type-badge')
    expect(badges[0].textContent).toBe('Account')
    expect(badges[1].textContent).toBe('Contact')
  })

  it('renders the optional badge when present', async () => {
    const { root } = await render(<search-dropdown results={RESULTS as any} is-open={true} />)
    const badge = root.shadowRoot!.querySelector('.result-badge')
    expect(badge).not.toBeNull()
    expect(badge!.textContent).toBe('VIP')
  })

  it('emits resultSelect when a result item is clicked', async () => {
    const { root, waitForChanges } = await render(<search-dropdown results={RESULTS as any} is-open={true} />)
    const spy = vi.fn()
    root.addEventListener('resultSelect', spy)

    const firstItem = root.shadowRoot!.querySelector<HTMLElement>('[role="option"]')!
    firstItem.click()
    await waitForChanges()

    expect(spy).toHaveBeenCalledTimes(1)
    const event = spy.mock.calls[0][0] as CustomEvent<SearchResult>
    expect(event.detail).toEqual(RESULTS[0])
  })

  it('highlights matching text in the result title', async () => {
    const { root } = await render(<search-dropdown results={RESULTS as any} query="Acme" is-open={true} />)
    const title = root.shadowRoot!.querySelector('.result-title')!
    expect(title.innerHTML).toContain('<mark>')
  })

})
