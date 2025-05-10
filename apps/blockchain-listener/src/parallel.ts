import { ethers } from 'ethers';
import { Subject, concatMap } from 'rxjs';
import { VechainPolling } from './vechain_polling';

export type SubjectPayload = {
  event: ethers.LogDescription;
  meta: { blockNumber: number; txId: string };
};
const queue = new Subject<SubjectPayload>();

// TODO this should be fetched by the last parsed event
let lastBlock = 0;
const vechainPolling = new VechainPolling(
  '0xbc330b7960c77b0443006a341edfd0507adf2e87',
  'testnet'
);
vechainPolling.startPolling(queue, lastBlock);

// Worker 2: Process items sequentially
queue
  .pipe(
    concatMap(async (item) => {
      //TODO insert here the handler for all the events
      console.log(item);
    })
  )
  .subscribe({
    complete: () => console.log('Queue processing complete'),
  });
