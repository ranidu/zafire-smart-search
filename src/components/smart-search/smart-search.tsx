import { Component, Element, Event, EventEmitter, h, Prop, State } from '@stencil/core';
import { FilterOption, SearchChangeEvent, SearchFilterEvent, SearchResult, SearchSelectEvent } from '../../types';

@Component({
  tag: 'smart-search',
  styleUrl: 'smart-search.css',
  shadow: true, // using shadow DOM to encapsulate styles and avoid conflicts
})
export class SmartSearch {

  @Element() el: HTMLElement;

  @Prop() placeholder: string = 'Search...';
  @Prop() filters: FilterOption[] = [];
  @Prop() results: Array<SearchResult> = [];
  @Prop() theme: 'light' | 'dark' = 'light';
  @Prop() debounceMs: number = 300;
  @Prop() maxResults: number = 10;

  @State() private query: string = '';
  @State() private activeFilter: FilterOption | null = null;
  @State() private isOpen: boolean = false;

  @Event() searchChange: EventEmitter<SearchChangeEvent>;
  @Event() searchSelect: EventEmitter<SearchSelectEvent>;
  @Event() searchFilter: EventEmitter<SearchFilterEvent>;
  @Event() searchClear: EventEmitter<void>;

  private debounceTimer: ReturnType<typeof setTimeout>;

  private get slicedResults(): Array<SearchResult> {
    return this.results.slice(0, this.maxResults);
  }

  private get anchorId(): string {
    return `smart-search-anchor-${this.el.id || 'default'}`;
  }

  private handleInputChange = (event: CustomEvent<string>) => {
    const query = event.detail;
    this.query = query;
    this.isOpen = true;

    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.searchChange.emit({
        query: this.query,
        filter: this.activeFilter?.value ?? null,
      });
    }, this.debounceMs);
  };

  private handleInputClear = () => {
    this.query = '';
    this.isOpen = false;
    this.searchClear.emit();
  };

  private handleFilterChange = (event: CustomEvent<FilterOption | null>) => {
    this.activeFilter = event.detail;
    this.searchFilter.emit({ filter: event.detail as FilterOption });

    if (this.query) {
      this.searchChange.emit({
        query: this.query,
        filter: this.activeFilter?.value ?? null,
      });
    }
  };

  private handleResultSelect = (event: CustomEvent<SearchResult>) => {
    this.isOpen = false;
    this.query = event.detail.title;
    this.searchSelect.emit({ result: event.detail });
  };

  private handleDropdownClose = () => {
    this.isOpen = false;
  };

  render() {
    return (
      <div
        class={{
          'smart-search': true,
          'smart-search--dark': this.theme === 'dark',
        }}
      >
        <div class="anchor" id={this.anchorId}>
          <search-input placeholder={this.placeholder} value={this.query} onInputChange={this.handleInputChange} onInputClear={this.handleInputClear} />
          <search-filter filters={this.filters} onFilterChange={this.handleFilterChange} />
        </div>
        <search-dropdown
          results={this.slicedResults as any}
          query={this.query}
          isOpen={this.isOpen}
          anchorSelector={`#${this.anchorId}`}
          onResultSelect={this.handleResultSelect}
          onDropdownClose={this.handleDropdownClose}
        />
      </div>
    );
  }
}
