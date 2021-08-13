
import { ContainerModule } from 'inversify';
import { EnvVariablesServer } from '@theia/core/lib/common/env-variables';
import { LocalizerEnvVariableServer } from './core-variables-server';

export default new ContainerModule((bind, unbind, isBound, rebind) => {
    rebind(EnvVariablesServer).to(LocalizerEnvVariableServer).inSingletonScope();
});
