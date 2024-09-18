import { SearchStrategy } from '../interfaces/search.strategy.interface';

export class NoSearchStrategy implements SearchStrategy<null> {
  search() {
    return [];
  }
}
