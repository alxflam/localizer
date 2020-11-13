/**
 * Generated using theia-extension-generator
 */
import { ContainerModule, injectable, interfaces } from 'inversify';
import { CoreContribution } from './core-contribution';
import { bindContributionProvider, CommandContribution, MenuPath } from '@theia/core';
import { bindViewContribution, defaultTreeProps, FrontendApplicationContribution, NavigatableWidgetOptions, OpenHandler, Tree, TreeImpl, TreeModel, TreeModelImpl, TreeProps, TreeWidget, ViewContainer, WebSocketConnectionProvider, WidgetFactory, WidgetManager } from "@theia/core/lib/browser";
import { LocalizerCoreBackendClient, LocalizerCoreBackendWithClientService, LocalizerCoreBackendService, LOCALIZER_CORE_BACKEND_PATH, LOCALIZER_CORE_BACKEND_WITH_CLIENT_PATH } from '../common/protocol';
import { BackendSampleCommandContribution } from './core-services-contribution';
import { TranslationFileOpenHandler } from './translation-file-open-handler';
import { TranslationFileWidget, TranslationFileWidgetOptions } from './translation-file-widget';
import URI from '@theia/core/lib/common/uri';
import { TranslationNavigatorContribution } from './translation-navigator-contribution';
import { TabBarToolbarContribution } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import { TranslationNavigatorWidget, TRANSLATION_NAVIGATOR_ID, TRANSLATION_VIEW_CONTAINER_ID, TRANSLATION_VIEW_CONTAINER_TITLE_OPTIONS } from './translation-navigator-widget';
import { TranslationTreeModel } from './translation-tree-model';
import { TranslationTree } from './translation-tree';
import { TranslationTreeWidget } from './translation-tree-widget';
import { TranslationNavigatorModel } from './translation-navigator-model';
import { TranslationNavigatorTree } from './translation-navigator-tree';
import { createTreeContainer } from '@theia/core/lib/browser/tree';
import { TranslationSupport } from './translation-support';
import { TranslationManager } from './translation-contribution-manager';

export default new ContainerModule(bind => {
    // frontend contribution
    bind(CoreContribution).toSelf().inSingletonScope();
    bind(FrontendApplicationContribution).toService(CoreContribution);

    // backend contribution
    bindBackenddService(bind);

    // bind a manager for easy retrieval of the active contribution manager
    bind(TranslationManager).toSelf().inSingletonScope();
    // bind contribution provider
    bindContributionProvider(bind, TranslationSupport);
    
    //custom widget for editing a single translation resource
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

    // bind custom tabbar for translation navigator tree
    bindViewContribution(bind, TranslationNavigatorContribution);
    bind(FrontendApplicationContribution).toService(TranslationNavigatorContribution);
    bind(TabBarToolbarContribution).toService(TranslationNavigatorContribution);

    // bind(TranslationTreeLabelProvider).toSelf().inSingletonScope();
    // bind(LabelProviderContribution).toService(TranslationTreeLabelProvider);

    bind(TranslationNavigatorWidget).toDynamicValue(ctx =>
        createTranslationNavigatorWidget(ctx.container)
    );
    
    bind(WidgetFactory).toDynamicValue(({ container }) => ({
        id: TRANSLATION_NAVIGATOR_ID,
        createWidget: () => container.get(TranslationNavigatorWidget)
    })).inSingletonScope();
    
    bind(WidgetFactory).toDynamicValue(({ container }) => ({
        id: TRANSLATION_VIEW_CONTAINER_ID,
        createWidget: async () => {
            const viewContainer = container.get<ViewContainer.Factory>(ViewContainer.Factory)({
                id: TRANSLATION_VIEW_CONTAINER_ID,
                progressLocationId: 'explorer'
            });
            viewContainer.setTitleOptions(TRANSLATION_VIEW_CONTAINER_TITLE_OPTIONS);
            const widget = await container.get(WidgetManager).getOrCreateWidget(TRANSLATION_NAVIGATOR_ID);
            viewContainer.addWidget(widget, {
                canHide: false,
                initiallyCollapsed: false
            });
            return viewContainer;
        }
    }));
});

@injectable()
class BackendClientImpl implements LocalizerCoreBackendClient {
    getName(): Promise<string> {
        return new Promise(resolve => resolve('I am a Client'));
    }
}

export const TRANSLATION_CONTEXT_MENU: MenuPath = ['translation-context-menu'];

export const TRANSLATION_NAVIGATOR_PROPS = <TreeProps>{
    ...defaultTreeProps,
    contextMenuPath: TRANSLATION_CONTEXT_MENU,
    multiSelect: true,
    search: true,
    globalSelection: true
};

function bindBackenddService(bind: interfaces.Bind) {
    bind(CommandContribution).to(BackendSampleCommandContribution).inSingletonScope();
    bind(LocalizerCoreBackendClient).to(BackendClientImpl).inSingletonScope();
    bind(LocalizerCoreBackendService).toDynamicValue(ctx => {
        const connection = ctx.container.get(WebSocketConnectionProvider);
        return connection.createProxy<LocalizerCoreBackendService>(LOCALIZER_CORE_BACKEND_PATH);
    }).inSingletonScope();
    bind(LocalizerCoreBackendWithClientService).toDynamicValue(ctx => {
        const connection = ctx.container.get(WebSocketConnectionProvider);
        const backendClient: LocalizerCoreBackendClient = ctx.container.get(LocalizerCoreBackendClient);
        return connection.createProxy<LocalizerCoreBackendWithClientService>(LOCALIZER_CORE_BACKEND_WITH_CLIENT_PATH, backendClient);
    }).inSingletonScope();
}

export function createTranslationNavigatorWidget(parent: interfaces.Container): TranslationNavigatorWidget {
    return createTranslationNavigatorContainer(parent).get(TranslationNavigatorWidget);
}

export function createTranslationTreeContainer(parent: interfaces.Container): interfaces.Container {
    const child = createTreeContainer(parent);
    // const child = parent;
    child.unbind(TreeImpl);
    child.bind(TranslationTree).toSelf();
    child.rebind(Tree).toService(TranslationTree);

    child.unbind(TreeModelImpl);
    child.bind(TranslationTreeModel).toSelf();
    child.rebind(TreeModel).toService(TranslationTreeModel);

    child.unbind(TreeWidget);
    child.bind(TranslationTreeWidget).toSelf();

    return child;
}

export function createTranslationNavigatorContainer(parent: interfaces.Container): interfaces.Container {
    const child = createTranslationTreeContainer(parent);

    // child.unbind(TranslationTree);
    child.bind(TranslationNavigatorTree).toSelf();
    child.rebind(Tree).toService(TranslationNavigatorTree);

    // child.unbind(TranslationTreeModel);
    child.bind(TranslationNavigatorModel).toSelf();
    child.rebind(TreeModel).toService(TranslationNavigatorModel);

    // child.unbind(TranslationTreeWidget);
    child.bind(TranslationNavigatorWidget).toSelf();

    child.rebind(TreeProps).toConstantValue(TRANSLATION_NAVIGATOR_PROPS);

    // child.bind(NavigatorDecoratorService).toSelf().inSingletonScope();
    // child.rebind(TreeDecoratorService).toService(NavigatorDecoratorService);
    // bindContributionProvider(child, NavigatorTreeDecorator);

    return child;
}

