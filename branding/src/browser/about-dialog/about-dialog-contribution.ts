import { injectable, inject } from 'inversify';
import { CustomAboutDialog } from './about-dialog';
import { CommonCommands } from '@theia/core/lib/browser';
import { CommandContribution, CommandRegistry } from '@theia/core/lib/common/command';

@injectable()
export class CustomAboutDialogContribution implements CommandContribution {

    constructor(
        @inject(CustomAboutDialog) protected readonly aboutDialog: CustomAboutDialog
    ) { }

    protected async openAbout(): Promise<void> {
        this.aboutDialog.open();
    }

    registerCommands(commandRegistry: CommandRegistry): void {
        // need to unregister and re-register the command, as the command has been registered with the default dialog implementation
        commandRegistry.unregisterCommand(CommonCommands.ABOUT_COMMAND);
        commandRegistry.registerCommand(CommonCommands.ABOUT_COMMAND, {
            execute: () => this.openAbout()
        });
    }

}
