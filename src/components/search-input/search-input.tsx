import { Component, Event, EventEmitter, Prop, State, h } from '@stencil/core';

@Component({
  tag: 'search-input',
  styleUrl: 'search-input.css',
  shadow: true,
})
export class SearchInput {
  @Prop() placeholder: string = 'Search...';
  @Prop() value: string = '';

  @State() private internalValue: string = '';

  @Event() inputChange: EventEmitter<string>;
  @Event() inputClear: EventEmitter<void>;

  componentWillLoad() {
    this.internalValue = this.value;
  }

  private handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    this.internalValue = input.value;
    this.inputChange.emit(this.internalValue);
  };

  private handleClear = () => {
    this.internalValue = '';
    this.inputChange.emit('');
    this.inputClear.emit();
  };

  render() {
    return (
      <div class="search-input-wrapper">
        <span class="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </span>
        <input type="text" class="search-input" placeholder={this.placeholder} value={this.internalValue} onInput={this.handleInput} />
        {this.internalValue && (
          <button class="clear-button" onClick={this.handleClear} aria-label="Clear search">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
}
