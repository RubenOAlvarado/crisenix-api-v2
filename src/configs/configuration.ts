export enum NodeEnvs {
  development = 'development',
  qa = 'qa',
  production = 'production',
}
const DEFAULT_PORT = 3000;
const DEFAULT_NODE_ENV = NodeEnvs.development;

const PORT = Number(process.env['PORT']) || DEFAULT_PORT;

const {
  NODE_ENV: PROCESS_NODE_ENV = DEFAULT_NODE_ENV,
  API_VERSION,
  VERSION,
  MONGO_URI,
  GOOGLE_CREDENTIALS,
} = process.env;

export default () => ({
  port: PORT,
  API_VERSION,
  VERSION,
  NODE_ENV: PROCESS_NODE_ENV,
  GOOGLE_CREDENTIALS,
  mongo: {
    uri: MONGO_URI,
  },
});
