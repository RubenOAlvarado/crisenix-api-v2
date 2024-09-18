import { SearchStrategy } from '../interfaces/search.strategy.interface';

export class SearchContext<T> {
  private strategy: SearchStrategy<T>;

  constructor(strategy: SearchStrategy<T>) {
    this.strategy = strategy;
  }

  setStrategy(strategy: SearchStrategy<T>) {
    this.strategy = strategy;
  }

  public executeSearch(params: T) {
    return this.strategy.search(params);
  }
}
