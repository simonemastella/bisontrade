import env from './env';
import { GenericEventProcessor, PollingStrategy } from './generic_processor';
import { VechainPolling } from './vechain_polling';
let strategy: PollingStrategy;
switch (env.blockchain) {
  case 'vechain':
    strategy = new VechainPolling(env.bgv1Address, env.environment);
    break;

  default:
    throw Error('Unsupported blockchain');
}
const eventProcessor = new GenericEventProcessor(strategy);
eventProcessor.start();
