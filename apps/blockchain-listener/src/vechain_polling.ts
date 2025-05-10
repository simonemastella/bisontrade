import { Subject } from 'rxjs';
import { EventLogs, ThorClient } from '@vechain/sdk-network';
import { ethers } from 'ethers';
import { BisonGatewayV1__factory } from '@bisontrade/contracts';
import { sleep } from 'bun';
import { PollingStrategy, SubjectPayload } from './generic_processor';

export class VechainPolling implements PollingStrategy {
  #contractAddress: string;
  #iface = new ethers.Interface(BisonGatewayV1__factory.abi);
  #thorClient: ThorClient;

  constructor(contractAddress: string, network: 'mainnet' | 'testnet') {
    this.#contractAddress = contractAddress;
    this.#thorClient = ThorClient.at(`https://${network}.vechain.org`);
  }
  public async getPastEvents(
    subject: Subject<SubjectPayload>,
    start: number = 0
  ): Promise<{ numberOfEvents: number; lastBlockFetched: number }> {
    let count = 0;
    let lastBlockFetched = start;
    let eventLogs: EventLogs[] = [];
    do {
      eventLogs = await this.#thorClient.logs.filterRawEventLogs({
        range: {
          unit: 'block',
          from: start,
        },
        options: {
          limit: 1000,
          offset: count,
        },
        criteriaSet: [
          {
            address: this.#contractAddress,
          },
        ],
        order: 'asc',
      });
      count += eventLogs.length;
      eventLogs.forEach((event) => {
        const decoded = this.#iface.parseLog(event);
        if (decoded)
          subject.next({
            event: decoded,
            meta: {
              blockNumber: event.meta.blockNumber,
              txId: event.meta.txID,
            },
          });
        lastBlockFetched = event.meta.blockNumber;
      });
    } while (eventLogs.length > 0);
    return { lastBlockFetched, numberOfEvents: count };
  }

  async startPolling(subject: Subject<SubjectPayload>, startingBlock = 0) {
    while (true) {
      try {
        const receipt = await this.getPastEvents(subject, startingBlock);
        startingBlock =
          receipt.lastBlockFetched + Number(receipt.numberOfEvents !== 0); // I'm adding 1 only when at least an event is received
        await sleep(1000);
      } catch (error) {
        console.error('Polling error: ' + JSON.stringify(error));
      }
    }
  }
}
