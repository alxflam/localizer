import { Command, CommandContribution, CommandRegistry} from '@theia/core/lib/common';
import { inject, injectable } from 'inversify';
import { LocalizerCoreBackendWithClientService, LocalizerCoreBackendService } from '../common/protocol';

const SayHelloViaBackendCommandWithCallBack: Command = {
    id: 'sayHelloOnBackendWithCallBack.command',
    label: 'Say hello on the backend with a callback to the client',
};

const SayHelloViaBackendCommand: Command = {
    id: 'sayHelloOnBackend.command',
    label: 'Say hello on the backend',
};

@injectable()
export class BackendSampleCommandContribution implements CommandContribution {

    constructor(
        @inject(LocalizerCoreBackendWithClientService) private readonly helloBackendWithClientService: LocalizerCoreBackendWithClientService,
        @inject(LocalizerCoreBackendService) private readonly helloBackendService: LocalizerCoreBackendService,
    ) { }

    registerCommands(registry: CommandRegistry): void {
        
        registry.registerCommand(SayHelloViaBackendCommandWithCallBack, {
            execute: () => this.helloBackendWithClientService.greet().then(r => console.log(r))
        });

        registry.registerCommand(SayHelloViaBackendCommand, {
            execute: () => this.helloBackendService.sayHelloTo('World').then(r => console.log(r))
        });
    }
}
