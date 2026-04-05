import { computePosition, flip, offset, shift } from '@floating-ui/dom';
import { Component, Element, Event, EventEmitter, Listen, Prop, State, h } from '@stencil/core';
import { SearchResult } from '../../types';
import { highlightText } from '../../utils';

@Component({
  tag: 'search-dropdown',
  styleUrl: 'search-dropdown.css',
  shadow: true,
})
export class SearchDropdown {

  @Element() el: HTMLElement;

  @Prop() results: Array<SearchResult> = [];
  @Prop() query: string = '';
  @Prop() isOpen: boolean = false;
  @Prop() anchorSelector: string = '';

  @State() private activeIndex: number = -1;

  @Event() resultSelect: EventEmitter<SearchResult>;
  @Event() dropdownClose: EventEmitter<void>;

  private dropdownEl: HTMLElement;

  componentDidUpdate() {
    if (this.isOpen) {
      this.updatePosition();
    }
  }

  private async updatePosition() {
    const anchor = document.querySelector(this.anchorSelector) as HTMLElement;
    if (!anchor || !this.dropdownEl) return;

    const { x, y } = await computePosition(anchor, this.dropdownEl, {
      placement: 'bottom-start',
      middleware: [offset(4), flip(), shift({ padding: 8 })],
    });

    this.dropdownEl.style.left = `${x}px`;
    this.dropdownEl.style.top = `${y}px`;
  }

  @Listen('keydown', { target: 'window' })
  handleKeydown(event: KeyboardEvent) {
    if (!this.isOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeIndex = Math.min(this.activeIndex + 1, this.results.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex = Math.max(this.activeIndex - 1, -1);
        break;
      case 'Enter':
        if (this.activeIndex >= 0) {
          this.resultSelect.emit(this.results[this.activeIndex]);
        }
        break;
      case 'Escape':
        this.dropdownClose.emit();
        break;
    }
  }

  @Listen('click', { target: 'window' })
  handleClickOutside(event: MouseEvent) {
    if (!this.isOpen) return;
    if (!this.el.contains(event.target as Node)) {
      this.dropdownClose.emit();
    }
  }

  private handleResultClick = (result: SearchResult) => {
    this.resultSelect.emit(result);
  };

  private renderBadge(badge?: string) {
    if (!badge) return null;
    return <span class="result-badge">{badge}</span>;
  }

  private renderEmptyState() {
    return <div class="empty-state">No results found for "{this.query}"</div>;
  }

  private renderResult(result: SearchResult, index: number) {
    const isActive = index === this.activeIndex;
    const highlightedTitle = highlightText(result.title, this.query);
    const highlightedSubtitle = result.subtitle ? highlightText(result.subtitle, this.query) : null;

    return (
      <div
        key={result.id}
        role="option"
        aria-selected={isActive ? 'true' : 'false'}
        class={{
          'result-item': true,
          'result-item--active': isActive,
        }}
        onClick={() => this.handleResultClick(result)}
      >
        <div class="result-type-badge">{result.type}</div>
        <div class="result-content">
          <div class="result-title" innerHTML={highlightedTitle} />
          {highlightedSubtitle && <div class="result-subtitle" innerHTML={highlightedSubtitle} />}
        </div>
        {this.renderBadge(result.badge)}
      </div>
    );
  }

  render() {
    if (!this.isOpen) return null;

    return (
      <div class="dropdown-wrapper" role="listbox" aria-label="Search results" ref={el => (this.dropdownEl = el as HTMLElement)}>
        {this.results.length === 0 ? this.renderEmptyState() : this.results.map((result, index) => this.renderResult(result, index))}
      </div>
    );
  }
}
