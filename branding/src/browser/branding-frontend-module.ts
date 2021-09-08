import { GettingStartedContribution } from './getting-started/getting-started-contribution';
import { ContainerModule, interfaces } from 'inversify';
import { LocalizerGettingStartedWidget } from './getting-started/getting-started-widget';
import { WidgetFactory, FrontendApplicationContribution, bindViewContribution } from '@theia/core/lib/browser';
import { CustomAboutDialog } from './about-dialog/about-dialog';
import { CustomAboutDialogContribution } from './about-dialog/about-dialog-contribution';
import { CommandContribution } from '@theia/core/lib/common/command';
import { GettingStartedWidget } from '@theia/getting-started/lib/browser/getting-started-widget';
import { bindContributionProvider } from '@theia/core';
import { BrandingPreferenceConfiguration, BrandingPreferenceConfigurations } from './preference-configuration';
import { PreferenceConfigurations } from '@theia/core/lib/browser/preferences/preference-configurations';

export default new ContainerModule((bind: interfaces.Bind, unbind, isBound, rebind: interfaces.Rebind) => {
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

    // bind custom settings folder
    bindContributionProvider(bind, BrandingPreferenceConfiguration);
    bind(BrandingPreferenceConfigurations).toSelf().inSingletonScope();
    rebind(PreferenceConfigurations).to(BrandingPreferenceConfigurations).inSingletonScope();
});
