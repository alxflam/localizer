import { GettingStartedContribution } from './getting-started/getting-started-contribution';
import { ContainerModule, interfaces } from 'inversify';
import { LocalizerGettingStartedWidget } from './getting-started/getting-started-widget';
import { WidgetFactory, FrontendApplicationContribution, bindViewContribution } from '@theia/core/lib/browser';
import { CustomAboutDialog } from './about-dialog/about-dialog';
import { CustomAboutDialogContribution } from './about-dialog/about-dialog-contribution';
import { CommandContribution } from '@theia/core/lib/common/command';
import { GettingStartedWidget } from '@theia/getting-started/lib/browser/getting-started-widget';

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
    bind(LocalizerGettingStartedWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(context => ({
        id: GettingStartedWidget.ID,
        createWidget: () => context.container.get<LocalizerGettingStartedWidget>(LocalizerGettingStartedWidget),
    })).inSingletonScope();
});
