import { injectable } from "inversify";
import { LocalizerCoreBackendClient, LocalizerCoreBackendWithClientService } from "../common/protocol";

@injectable()
export class LocalizerCoreBackendWithClientServiceImpl implements LocalizerCoreBackendWithClientService {

    private client?: LocalizerCoreBackendClient;

    greet(): Promise<string> {
        return new Promise<string>((resolve, reject) =>
            this.client ? this.client.getName().then(greet => resolve('Hello ' + greet))
                : reject('No Client'));
    }

    dispose(): void {
        // do nothing
    }
    
    setClient(client: LocalizerCoreBackendClient): void {
        this.client = client;
    }

}
