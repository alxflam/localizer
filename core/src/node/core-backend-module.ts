import { ConnectionHandler, JsonRpcConnectionHandler } from "@theia/core";
import { ContainerModule } from "inversify";
import { LocalizerCoreBackendClient, LocalizerCoreBackendWithClientService, LocalizerCoreBackendService, LOCALIZER_CORE_BACKEND_PATH, LOCALIZER_CORE_BACKEND_WITH_CLIENT_PATH } from "../common/protocol";
import { LocalizerCoreBackendWithClientServiceImpl } from "./core-backend-with-client-service";
import { LocalizerCoreBackendServiceImpl } from "./core-backend-service";
import { CoreBackendContribution } from "./core-backend-contribution";
import { BackendApplicationContribution } from "@theia/core/lib/node";

export default new ContainerModule(bind => {
    bind(CoreBackendContribution).toSelf().inSingletonScope();
    bind(BackendApplicationContribution).toService(CoreBackendContribution);

    bind(LocalizerCoreBackendService).to(LocalizerCoreBackendServiceImpl).inSingletonScope()
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new JsonRpcConnectionHandler(LOCALIZER_CORE_BACKEND_PATH, () => {
            return ctx.container.get<LocalizerCoreBackendService>(LocalizerCoreBackendService);
        })
    ).inSingletonScope();

    bind(LocalizerCoreBackendWithClientService).to(LocalizerCoreBackendWithClientServiceImpl).inSingletonScope()
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new JsonRpcConnectionHandler<LocalizerCoreBackendClient>(LOCALIZER_CORE_BACKEND_WITH_CLIENT_PATH, client => {
            const server = ctx.container.get<LocalizerCoreBackendWithClientServiceImpl>(LocalizerCoreBackendWithClientService);
            server.setClient(client);
            client.onDidCloseConnection(() => server.dispose());
            return server;
        })
    ).inSingletonScope();
});
