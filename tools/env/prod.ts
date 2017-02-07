import { EnvConfig } from './env-config.interface';

const ProdConfig: EnvConfig = {
  REST_API: 'https://api.bencinmonitor.si',
  WS_API: 'wss://api.bencinmonitor.si',
  ENV: 'PROD'
};

export = ProdConfig;

