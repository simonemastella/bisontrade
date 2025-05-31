import {
  DepositEvent,
  WhitelistTokenEvent,
  WithdrawFailedEvent,
  WithdrawSucceededEvent,
} from '@bisontrade/contracts/dist/contracts/BisonGatewayV1';
import { SubjectPayload } from './generic_processor';

export class EventHandler {
  public process(item: SubjectPayload) {
    switch (item.event.name) {
      case 'Deposit':
        return this.handleDepositEvent(
          item.event as unknown as DepositEvent.OutputObject
        );
      case 'WithdrawSucceeded':
        return this.handleWithdrawSucceededEvent(
          item.event as unknown as WithdrawSucceededEvent.OutputObject
        );
      case 'WithdrawFailed':
        return this.handleWithdrawFailedEvent(
          item.event.args as unknown as WithdrawFailedEvent.OutputObject
        );
      case 'WhitelistToken':
        return this.handleWhitelistTokenEvent(
          item.event.args as unknown as WhitelistTokenEvent.OutputObject
        );
    }
  }

  private handleDepositEvent(fragment: DepositEvent.OutputObject) {
    console.log(fragment);
  }

  private handleWithdrawSucceededEvent(
    fragment: WithdrawSucceededEvent.OutputObject
  ) {
    console.log(fragment);
  }

  private handleWithdrawFailedEvent(
    fragment: WithdrawFailedEvent.OutputObject
  ) {
    console.log(fragment);
  }

  private handleWhitelistTokenEvent(
    fragment: WhitelistTokenEvent.OutputObject
  ) {}
}
