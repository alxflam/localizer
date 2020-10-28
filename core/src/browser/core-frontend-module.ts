/**
 * Generated using theia-extension-generator
 */
import { ContainerModule, injectable } from 'inversify';
import { CoreContribution } from './core-contribution';
import { CommandContribution} from '@theia/core';
import { FrontendApplicationContribution, OpenHandler, WebSocketConnectionProvider, WidgetFactory } from "@theia/core/lib/browser";
import { LocalizerCoreBackendClient, LocalizerCoreBackendWithClientService, LocalizerCoreBackendService, LOCALIZER_CORE_BACKEND_PATH, LOCALIZER_CORE_BACKEND_WITH_CLIENT_PATH } from '../common/protocol';
import { BackendSampleCommandContribution} from './core-services-contribution';
import { ArbFileOpenHandler } from './arb-open-handler';
import { ArbFileWidget, ArbFileWidgetOptions } from './arb-file-widget';
import URI from '@theia/core/lib/common/uri';

export default new ContainerModule(bind => {

    // Replace this line wittheh  desired binding, e.g. "bind(CommandContribution).to(CoreContribution)
    bind(CoreContribution).toSelf().inSingletonScope();
    bind(FrontendApplicationContribution).toService(CoreContribution);

    bind(CommandContribution).to(BackendSampleCommandContribution).inSingletonScope();
    bind(LocalizerCoreBackendClient).to(BackendClientImpl).inSingletonScope();

    bind(LocalizerCoreBackendService).toDynamicValue(ctx => {
        const connection = ctx.container.get(WebSocketConnectionProvider);
        return connection.createProxy<LocalizerCoreBackendService>(LOCALIZER_CORE_BACKEND_PATH);
    }).inSingletonScope();

    bind(LocalizerCoreBackendWithClientService).toDynamicValue(ctx => {
        const connection = ctx.container.get(WebSocketConnectionProvider);
        const backendClient: LocalizerCoreBackendClient = ctx.container.get(LocalizerCoreBackendClient);
        return connection.createProxy<LocalizerCoreBackendWithClientService>(LOCALIZER_CORE_BACKEND_WITH_CLIENT_PATH, backendClient);
    }).inSingletonScope();

    //custom widget for editing a single arb file
    bind(OpenHandler).to(ArbFileOpenHandler).inSingletonScope();
    bind(WidgetFactory).toDynamicValue(({ container }) => ({
        id: ArbFileWidget.id,
        createWidget: (uri: string) => {
            const child = container.createChild();
            child.bind(ArbFileWidgetOptions).toConstantValue({
                uri: new URI(uri)
            });
            child.bind(ArbFileWidget).toSelf();
            return child.get(ArbFileWidget);
        }
    }));
});

@injectable()
class BackendClientImpl implements LocalizerCoreBackendClient {
    getName(): Promise<string> {
        return new Promise(resolve => resolve('I am a Client'));
    }
}
