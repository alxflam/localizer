import { Command, CommandRegistry } from "@theia/core";
import { AbstractViewContribution, FrontendApplication, FrontendApplicationContribution } from "@theia/core/lib/browser";
import { injectable } from "inversify";
import { TranslationViewWidget, TRANSLATION_VIEW_ID } from "./translation-view-widget";

export namespace TranslationViewCommands {
    export const OPEN_VIEW: Command = {
        id: 'translation.view.open',
        label: 'Show Translation View'
    };
}

@injectable()
export class TranslationViewContribution extends AbstractViewContribution<TranslationViewWidget> implements FrontendApplicationContribution {

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
            execute: () => this.openView({ activate: true })
        });
    }

    async initializeLayout(app: FrontendApplication): Promise<void> {
        await this.openView();
    }
}