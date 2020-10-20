import { GettingStartedContribution } from './getting-started-contribution';
import { ContainerModule, interfaces } from 'inversify';
import { GettingStartedWidget } from './getting-started-widget';
import { WidgetFactory, FrontendApplicationContribution, bindViewContribution } from '@theia/core/lib/browser';
import { CustomAboutDialog } from './about-dialog';
import { CustomAboutDialogContribution } from './about-dialog-contribution';
import { CommandContribution } from '@theia/core/lib/common/command';

export default new ContainerModule((bind: interfaces.Bind) => {
    // bind custom about dialog
    bind(CustomAboutDialogContribution).toSelf().inSingletonScope();
    [CommandContribution].forEach(serviceIdentifier =>
        bind(serviceIdentifier).toService(CustomAboutDialogContribution)
    );
    bind(CustomAboutDialog).toSelf();

    // bind getting started view
    bindViewContribution(bind, GettingStartedContribution);
    bind(FrontendApplicationContribution).toService(GettingStartedContribution);
    bind(GettingStartedWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(context => ({
        id: GettingStartedWidget.ID,
        createWidget: () => context.container.get<GettingStartedWidget>(GettingStartedWidget),
    })).inSingletonScope();
});