import { Controller, ControllerEvent } from '@shared/ControllerDecorators';
import { injectable } from 'inversify';
import alt from 'alt-client';

@injectable()
@Controller('start')
export class GlobalController {
    constructor() {}

    @ControllerEvent('helloFromServer')
    async helloFromServer(message: string): Promise<string> {
        alt.log('123');
        return '123 ' + message;
    }
}
