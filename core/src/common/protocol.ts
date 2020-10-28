import { JsonRpcServer } from '@theia/core/lib/common/messaging';

export const LocalizerCoreBackendService = Symbol('LocalizerCoreBackendService');
export const LOCALIZER_CORE_BACKEND_PATH = '/services/localizer/core';

export interface LocalizerCoreBackendService {
    /// a plain dummy from the sample to test the service
    sayHelloTo(name: string): Promise<string>
    // TODO: add methods to retrieve parsed translation data
}
export const LocalizerCoreBackendWithClientService = Symbol('LocalizerCoreBackendWithClient');
export const LOCALIZER_CORE_BACKEND_WITH_CLIENT_PATH = '/services/localizer/core/withClient';

export interface LocalizerCoreBackendWithClientService extends JsonRpcServer<LocalizerCoreBackendClient> {
    greet(): Promise<string>
}

export const LocalizerCoreBackendClient = Symbol('LocalizerCoreBackendClient');
export interface LocalizerCoreBackendClient {
    getName(): Promise<string>;
}
