import { ContainerModule, interfaces } from 'inversify';
import { CoreContribution } from './core-contribution';
import { bindContributionProvider, MenuPath } from '@theia/core';
import { bindViewContribution,
    defaultTreeProps,
    FrontendApplicationContribution,
    LabelProviderContribution,
    NavigatableWidgetOptions,
    OpenHandler,
    Tree,
    TreeModel,
    TreeProps,
    WidgetFactory } from '@theia/core/lib/browser';
import { TranslationFileOpenHandler } from './file-view/translation-file-open-handler';
import { TranslationFileWidget, TranslationFileWidgetOptions } from './file-view/translation-file-widget';
import { TranslationNavigatorContribution } from './tree/translation-navigator-contribution';
import { TabBarToolbarContribution } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import { TranslationNavigatorWidget, TRANSLATION_NAVIGATOR_ID } from './tree/translation-navigator-widget';
import { TranslationNavigatorModel } from './tree/translation-navigator-model';
import { TranslationNavigatorTree } from './tree/translation-navigator-tree';
import { createTreeContainer, TreeImpl, TreeModelImpl, TreeWidget } from '@theia/core/lib/browser/tree';
import { TranslationSupport } from './translation-support';
import { TranslationManager } from './translation-contribution-manager';
import { TranslationTreeLabelProvider } from './tree/translation-tree-label-provider';
import { TranslationViewWidget, TRANSLATION_VIEW_ID } from './translation-view/translation-view-widget';
import URI from '@theia/core/lib/common/uri';
import { TranslationViewContribution } from './translation-view/translation-view-contribution';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    // frontend contribution
    bind(CoreContribution).toSelf().inSingletonScope();
    bind(FrontendApplicationContribution).toService(CoreContribution);

    // bind a manager for easy retrieval of the active contribution manager
    bind(TranslationManager).toSelf().inSingletonScope();
    // bind contribution provider
    bindContributionProvider(bind, TranslationSupport);

    // custom widget for editing a single translation resource
    bind(TranslationFileOpenHandler).toSelf().inSingletonScope();
    bind(OpenHandler).toService(TranslationFileOpenHandler);
    bind(TranslationFileWidget).toSelf();

    // widget for single translation resource
    bind(WidgetFactory).toDynamicValue(context => ({
        id: TranslationFileWidget.id,
        async createWidget(options: NavigatableWidgetOptions): Promise<TranslationFileWidget> {
            const { container } = context;
            const child = container.createChild();
            const uri = new URI(options.uri);
            child.bind(TranslationFileWidgetOptions).toConstantValue({ uri });
            return child.get(TranslationFileWidget);
        }
    })).inSingletonScope();

    // bind custom view contribution for translation navigator tree
    bindViewContribution(bind, TranslationNavigatorContribution);
    bind(TabBarToolbarContribution).toService(TranslationNavigatorContribution);

    bind(TranslationTreeLabelProvider).toSelf().inSingletonScope();
    bind(LabelProviderContribution).toService(TranslationTreeLabelProvider);

    bind(WidgetFactory).toDynamicValue(({ container }) => ({
        id: TRANSLATION_NAVIGATOR_ID,
        createWidget: () => createTranslationNavigatorWidget(container)
    })).inSingletonScope();

    // bind custom translation view
    bind(TranslationViewWidget).toSelf();
    bindViewContribution(bind, TranslationViewContribution);
    bind(FrontendApplicationContribution).toService(TranslationViewContribution);

    // widget for group translation resource
    bind(WidgetFactory).toDynamicValue(context => ({
        id: TRANSLATION_VIEW_ID,
        async createWidget(): Promise<TranslationViewWidget> {
            const { container } = context;
            const child = container.createChild();
            // const group = options.group;
            // child.bind(TranslationViewWidgetOptions).toConstantValue({ group });
            return child.get(TranslationViewWidget);
        }
    })).inSingletonScope();

});

export const TRANSLATION_CONTEXT_MENU: MenuPath = ['translation-context-menu'];

export const TRANSLATION_NAVIGATOR_PROPS = <TreeProps>{
    ...defaultTreeProps,
    contextMenuPath: TRANSLATION_CONTEXT_MENU,
    multiSelect: true,
    search: true,
    globalSelection: true
};

export function createTranslationNavigatorWidget(parent: interfaces.Container): TranslationNavigatorWidget {
    return createTranslationNavigatorContainer(parent).get<TranslationNavigatorWidget>(TranslationNavigatorWidget);
}

export function createTranslationNavigatorContainer(parent: interfaces.Container): interfaces.Container {
    const child = createTreeContainer(parent);

    child.unbind(TreeImpl);
    child.bind(TranslationNavigatorTree).toSelf();
    child.rebind(Tree).toService(TranslationNavigatorTree);

    child.unbind(TreeModelImpl);
    child.bind(TranslationNavigatorModel).toSelf();
    child.rebind(TreeModel).toService(TranslationNavigatorModel);

    child.bind(TranslationNavigatorWidget).toSelf();
    child.rebind(TreeWidget).toService(TranslationNavigatorWidget);

    // child.rebind(TreeProps).toConstantValue(TRANSLATION_NAVIGATOR_PROPS);

    return child;
}

