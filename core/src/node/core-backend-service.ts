import { injectable } from "inversify";
import { LocalizerCoreBackendService } from "../common/protocol";

@injectable()
export class LocalizerCoreBackendServiceImpl implements LocalizerCoreBackendService {
    
    sayHelloTo(name: string): Promise<string> {
        return new Promise<string>(resolve => resolve('Hello from the Server to ' + name));
    }
}
