import { injectable } from 'inversify';
import { MenuModelRegistry, Command, CommandRegistry } from '@theia/core/lib/common';
import { AbstractViewContribution, OpenViewArguments } from '@theia/core/lib/browser';
import { EDITOR_CONTEXT_MENU } from '@theia/editor/lib/browser';
import { SampleTreeWidget } from './tree/sample-tree-widget';
import { SAMPLE_ID } from './sample';

export const SAMPLE_TOGGLE_COMMAND_ID = 'sample:toggle';
export const SAMPLE_LABEL = 'Sample';

export namespace CallHierarchyCommands {
    export const OPEN: Command = {
        id: 'sample:open',
        label: 'Open Sample Tree'
    };
}

@injectable()
export class SampleContribution extends AbstractViewContribution<SampleTreeWidget> {

    constructor() {
        super({
            widgetId: SAMPLE_ID,
            widgetName: SAMPLE_LABEL,
            defaultWidgetOptions: {
                area: 'bottom'
            },
            toggleCommandId: SAMPLE_TOGGLE_COMMAND_ID,
            toggleKeybinding: 'ctrlcmd+shift+f3'
        });
    }

    

    async openView(args?: Partial<OpenViewArguments>): Promise<SampleTreeWidget> {
        const widget = await super.openView(args);
        return widget;
    }

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(CallHierarchyCommands.OPEN, {
            execute: () => this.openView({
                toggle: false,
                activate: true
            }),
            isEnabled: () => true
        });
        super.registerCommands(commands);
    }

    registerMenus(menus: MenuModelRegistry): void {
        const menuPath = [...EDITOR_CONTEXT_MENU, 'navigation'];
        menus.registerMenuAction(menuPath, {
            commandId: CallHierarchyCommands.OPEN.id,
            label: SAMPLE_LABEL
        });
        super.registerMenus(menus);
    }

}