import { Command, CommandRegistry } from '@theia/core';
import {
    AbstractViewContribution,
    FrontendApplication,
    OpenerService,
    Widget
} from '@theia/core/lib/browser';
import {
    WorkspaceCommandContribution,
    WorkspacePreferences,
    WorkspaceService
} from '@theia/workspace/lib/browser';
import { TabBarToolbarContribution, TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import { injectable, inject, postConstruct } from 'inversify';
import { TRANSLATION_NAVIGATOR_ID, TranslationNavigatorWidget } from './translation-navigator-widget';
import { TranslationNavigatorModel } from './translation-navigator-model';
export namespace TranslationNavigatorCommands {
    export const REFRESH_NAVIGATOR: Command = {
        id: 'translate.refresh',
        category: 'Translate',
        label: 'Refresh',
        iconClass: 'refresh'
    };
    export const COLLAPSE_ALL: Command = {
        id: 'translate.collapse.all',
        category: 'Translate',
        label: 'Collapse Nodes',
        iconClass: 'theia-collapse-all-icon'
    };
}

@injectable()
export class TranslationNavigatorContribution extends AbstractViewContribution<TranslationNavigatorWidget> implements TabBarToolbarContribution {

    @inject(WorkspaceCommandContribution)
    protected readonly workspaceCommandContribution: WorkspaceCommandContribution;

    constructor(
        @inject(OpenerService) protected readonly openerService: OpenerService,
        @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService,
        @inject(WorkspacePreferences) protected readonly workspacePreferences: WorkspacePreferences
    ) {
        super({
            widgetId: TRANSLATION_NAVIGATOR_ID,
            widgetName: 'Translation Navigator',
            defaultWidgetOptions: {
                area: 'left',
                rank: 300
            },
            toggleCommandId: 'translationNavigator:toggle',
            toggleKeybinding: 'ctrlcmd+shift+t'
        });
    }

    @postConstruct()
    protected async init(): Promise<void> {
        this.workspaceCommandContribution.onDidCreateNewFile(async event => this.onDidCreateNewResource());
    }

    private async onDidCreateNewResource(): Promise<void> {
        const selfWidget = this.tryGetWidget();
        if (!selfWidget || !selfWidget.isVisible) {
            return;
        }
        const model: TranslationNavigatorModel = selfWidget.model;
        model.refresh();
    }

    async initializeLayout(app: FrontendApplication): Promise<void> {
        await this.openView();
    }

    registerCommands(registry: CommandRegistry): void {
        super.registerCommands(registry);
        registry.registerCommand(TranslationNavigatorCommands.REFRESH_NAVIGATOR, {
            execute: widget => this.withWidget(widget, () => this.refreshTranslationNavigator()),
            isEnabled: widget => this.withWidget(widget, () => this.workspaceService.opened),
            isVisible: widget => this.withWidget(widget, () => this.workspaceService.opened)
        });
    }

    protected withWidget<T>(widget: Widget | undefined = this.tryGetWidget(), cb: (navigator: TranslationNavigatorWidget) => T): T | false {
        if (widget instanceof TranslationNavigatorWidget && widget.id === TRANSLATION_NAVIGATOR_ID) {
            return cb(widget);
        }
        return false;
    }

    async refreshTranslationNavigator(): Promise<void> {
        const { model } = await this.widget;
        await model.refresh();
    }

    registerToolbarItems(registry: TabBarToolbarRegistry): void {
        registry.registerItem({
            id: TranslationNavigatorCommands.REFRESH_NAVIGATOR.id,
            command: TranslationNavigatorCommands.REFRESH_NAVIGATOR.id,
            tooltip: 'Refresh',
            priority: 0,
        });
    }

}
