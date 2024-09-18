import { PipelineStage } from 'mongoose';

export interface SearchStrategy<T> {
  search(params: T): PipelineStage[] | PipelineStage | undefined;
}
