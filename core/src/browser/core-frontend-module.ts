/**
 * Generated using theia-extension-generator
 */
import { ContainerModule } from 'inversify';
import { CoreContribution } from './core-contribution';


export default new ContainerModule(bind => {

    // Replace this line with the desired binding, e.g. "bind(CommandContribution).to(CoreContribution)
    bind(CoreContribution).toSelf();
});
