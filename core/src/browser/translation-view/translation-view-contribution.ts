import { Command, CommandRegistry } from "@theia/core";
import { AbstractViewContribution, OpenViewArguments, FrontendApplication, FrontendApplicationContribution, OpenerService } from "@theia/core/lib/browser";
import { inject, injectable } from "inversify";
import { TranslationGroup } from "../../common/translation-types";
import { TranslationViewWidget, TRANSLATION_VIEW_ID } from "./translation-view-widget";

export namespace TranslationViewCommands {
    export const OPEN_VIEW: Command = {
        id: 'translation.view.open',
        label: 'Show Translation View'
    };
}

export interface TranslationViewWidgetOptions extends OpenViewArguments {
    group: TranslationGroup
}

@injectable()
export class TranslationViewContribution extends AbstractViewContribution<TranslationViewWidget> implements FrontendApplicationContribution {

    @inject(OpenerService)
    protected readonly openerService: OpenerService;

    constructor(
    ) {
        super({
            widgetId: TRANSLATION_VIEW_ID,
            widgetName: 'Translation Group',
            defaultWidgetOptions: {
                area: 'main',
                rank: 300
            },
            toggleCommandId: 'translationView:toggle',
            toggleKeybinding: 'ctrlcmd+shift+s'
        });
    }

    registerCommands(registry: CommandRegistry): void {
        super.registerCommands(registry);
        registry.registerCommand(TranslationViewCommands.OPEN_VIEW, {
            execute: async (args: TranslationViewWidgetOptions) => {
                args.activate = true
                await this.openView(args)
            }
        });
    }

    async initializeLayout(app: FrontendApplication): Promise<void> {
        await this.openView();
    }

    async openView(args?: Partial<TranslationViewWidgetOptions>): Promise<TranslationViewWidget> {
        const widget = await super.openView(args);
        this.refreshWidget(args!.group);
        return widget;
    }

    protected async refreshWidget(group: TranslationGroup | undefined): Promise<void> {
        const widget = this.tryGetWidget();
        if (!widget) {
            return;
        }
        widget.setGroup(group);
    }
}