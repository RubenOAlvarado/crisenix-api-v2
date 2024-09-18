import { PipelineStage } from 'mongoose';

export class QueryBuilder {
  private stages: PipelineStage[] = [];

  addStage(stage: PipelineStage | PipelineStage[] | undefined): void {
    if (Array.isArray(stage)) {
      this.stages.push(...stage);
    } else if (stage) {
      this.stages.push(stage);
    }
  }

  build(): PipelineStage[] {
    return this.stages;
  }
}
