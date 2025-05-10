import { Subject, concatMap } from 'rxjs';
import { ethers } from 'ethers';

export type SubjectPayload = {
  event: ethers.LogDescription;
  meta: { blockNumber: number; txId: string };
};

/* Polling strategy interface 
The class must implements a loop that pushes on subject the events
of type SubjectPayload 
*/
export interface PollingStrategy {
  startPolling(queue: Subject<SubjectPayload>, fromBlock: number): void;
}

export class GenericEventProcessor {
  private queue = new Subject<SubjectPayload>();
  private lastBlock = 0; // TODO: Fetch from DB or state storage

  constructor(private pollingStrategy: PollingStrategy) {}

  public start() {
    this.pollingStrategy.startPolling(this.queue, this.lastBlock);
    this.processQueue();
  }

  private processQueue() {
    this.queue
      .pipe(
        concatMap(async (item) => {
          // TODO: Replace this with actual event handling logic
          console.log(item);
        })
      )
      .subscribe({
        complete: () => console.log('Queue processing complete'),
      });
  }
}
