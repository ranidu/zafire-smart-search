import { Component, Event, EventEmitter, Prop, State, h } from '@stencil/core'
import { FilterOption } from '../../types'

@Component({
  tag: 'search-filter',
  styleUrl: 'search-filter.css',
  shadow: true,
})
export class SearchFilter {

  @Prop() filters: FilterOption[] = []

  @State() private activeFilterId: string = 'all'

  @Event() filterChange: EventEmitter<FilterOption | null>

  private get allFilters(): FilterOption[] {
    return [
      { id: 'all', label: 'All', value: '' },
      ...this.filters,
    ]
  }

  private handleFilterClick = (filter: FilterOption) => {
    this.activeFilterId = filter.id
    this.filterChange.emit(filter.id === 'all' ? null : filter)
  }

  render() {
    if (this.filters.length === 0) return null

    return (
      <div class="filter-wrapper" role="tablist" aria-label="Search filters">
        {this.allFilters.map(filter => (
          <button
            key={filter.id}
            role="tab"
            aria-selected={this.activeFilterId === filter.id ? 'true' : 'false'}
            class={{
              'filter-tab': true,
              'filter-tab--active': this.activeFilterId === filter.id,
            }}
            onClick={() => this.handleFilterClick(filter)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    )
  }
}