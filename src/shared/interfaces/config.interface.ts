import { NodeEnvs } from 'src/configs/configuration';

export interface Config {
  port: number;
  defaultPort: number;
  API_VERSION: string;
  VERSION: string;
  NODE_ENV: NodeEnvs;
}
