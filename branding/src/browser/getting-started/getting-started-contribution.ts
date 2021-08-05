import { injectable, inject } from 'inversify';
import { AbstractViewContribution, FrontendApplicationContribution, FrontendApplication } from '@theia/core/lib/browser';
import { FrontendApplicationStateService } from '@theia/core/lib/browser/frontend-application-state';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { GettingStartedWidget } from '@theia/getting-started/lib/browser/getting-started-widget';

@injectable()
export class GettingStartedContribution extends AbstractViewContribution<GettingStartedWidget> implements FrontendApplicationContribution {

    @inject(FrontendApplicationStateService)
    protected readonly stateService: FrontendApplicationStateService;

    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService;

    constructor() {
        super({
            widgetId: GettingStartedWidget.ID,
            widgetName: GettingStartedWidget.LABEL,
            defaultWidgetOptions: {
                area: 'main',
            }
        });
    }

    async onStart(app: FrontendApplication): Promise<void> {
        // open the getting started view whenever the app is started without an open workspace
        if (!this.workspaceService.opened) {
            this.stateService.reachedState('ready').then(
                () => this.openView({ reveal: true })
            );
        }
    }

    // registerCommands(registry: CommandRegistry): void {
    //     // register a command which opens the getting started view
    //     registry.registerCommand(GettingStartedCommand, {
    //         execute: () => this.openView({ reveal: true }),
    //     });
    // }

    // registerMenus(menus: MenuModelRegistry): void {
    //     // add possibility to manually open the getting started view via a help menu entry
    //     menus.registerMenuAction(CommonMenus.HELP, {
    //         commandId: GettingStartedCommand.id,
    //         label: GettingStartedCommand.label,
    //         order: 'a10'
    //     });
    // }
}