import { describe, expect, h, it, render, vi } from '@stencil/vitest'
import { FilterOption } from '../../../types'

const FILTERS: FilterOption[] = [
  { id: 'accounts', label: 'Accounts', value: 'accounts' },
  { id: 'contacts', label: 'Contacts', value: 'contacts' },
]

describe('search-filter', () => {

  it('renders nothing when no filters are provided', async () => {
    const { root } = await render(<search-filter />)
    const wrapper = root.shadowRoot!.querySelector('.filter-wrapper')
    expect(wrapper).toBeNull()
  })

  it('renders "All" tab plus one tab per filter', async () => {
    const { root } = await render(<search-filter filters={FILTERS} />)
    const tabs = root.shadowRoot!.querySelectorAll('[role="tab"]')
    expect(tabs.length).toBe(3) 
  })

  it('"All" tab is active by default', async () => {
    const { root } = await render(<search-filter filters={FILTERS} />)
    const allTab = root.shadowRoot!.querySelector('[role="tab"]')!
    expect(allTab.getAttribute('aria-selected')).toBe('true')
    expect(allTab.classList.contains('filter-tab--active')).toBe(true)
  })

  it('emits filterChange with null when "All" tab is clicked', async () => {
    const { root, waitForChanges } = await render(<search-filter filters={FILTERS} />)
    const spy = vi.fn()
    root.addEventListener('filterChange', spy)

    const allTab = root.shadowRoot!.querySelector<HTMLButtonElement>('[role="tab"]')!
    allTab.click()
    await waitForChanges()

    expect(spy).toHaveBeenCalledTimes(1)
    const event = spy.mock.calls[0][0] as CustomEvent
    expect(event.detail).toBeNull()
  })

  it('emits filterChange with the selected filter when a non-All tab is clicked', async () => {
    const { root, waitForChanges } = await render(<search-filter filters={FILTERS} />)
    const spy = vi.fn()
    root.addEventListener('filterChange', spy)

    const tabs = root.shadowRoot!.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    tabs[1].click()
    await waitForChanges()

    const event = spy.mock.calls[0][0] as CustomEvent<FilterOption>
    expect(event.detail).toEqual(FILTERS[0])
  })

  it('updates active tab when a filter is clicked', async () => {
    const { root, waitForChanges } = await render(<search-filter filters={FILTERS} />)

    const tabs = root.shadowRoot!.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    tabs[2].click()
    await waitForChanges()

    const updatedTabs = root.shadowRoot!.querySelectorAll('[role="tab"]')
    expect(updatedTabs[2].getAttribute('aria-selected')).toBe('true')
    expect(updatedTabs[0].getAttribute('aria-selected')).toBe('false')
  })

})
