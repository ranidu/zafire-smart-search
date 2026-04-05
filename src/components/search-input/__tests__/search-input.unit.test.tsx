import { render, h, describe, it, expect, vi } from '@stencil/vitest'

describe('search-input', () => {

  it('renders with default placeholder', async () => {
    const { root } = await render(<search-input />)
    const input = root.shadowRoot!.querySelector('input')!
    expect(input.placeholder).toBe('Search...')
  })

  it('renders with custom placeholder', async () => {
    const { root } = await render(<search-input placeholder="Search accounts..." />)
    const input = root.shadowRoot!.querySelector('input')!
    expect(input.placeholder).toBe('Search accounts...')
  })

  it('does not show clear button when empty', async () => {
    const { root } = await render(<search-input />)
    const clearBtn = root.shadowRoot!.querySelector('.clear-button')
    expect(clearBtn).toBeNull()
  })

  it('emits inputChange when user types', async () => {
    const { root, waitForChanges } = await render(<search-input />)
    const inputChangeSpy = vi.fn()
    root.addEventListener('inputChange', inputChangeSpy)

    const input = root.shadowRoot!.querySelector('input')!
    input.value = 'John'
    input.dispatchEvent(new CustomEvent('input'))
    await waitForChanges()

    expect(inputChangeSpy).toHaveBeenCalled()
  })

})
