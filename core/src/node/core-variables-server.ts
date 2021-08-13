import * as os from 'os';
import * as path from 'path';
import { injectable } from 'inversify';
import { FileUri } from '@theia/core/lib/node/file-uri';
import { EnvVariablesServerImpl } from '@theia/core/lib/node/env-variables';

@injectable()
export class LocalizerEnvVariableServer extends EnvVariablesServerImpl {

    /**
     * The configuration directory name should not be the default .theia
     */
     protected override async createConfigDirUri(): Promise<string> {
        return FileUri.create(path.join(os.homedir(), '.localizer')).toString();
    }

}
