import { FrontendApplication, FrontendApplicationContribution } from '@theia/core/lib/browser';
import { injectable, inject } from 'inversify';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { FileStat } from '@theia/filesystem/lib/common/files';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { EditorWidget } from '@theia/editor/lib/browser';
import { MonacoEditor } from '@theia/monaco/lib/browser/monaco-editor';
import { MiniBrowserOpenHandler } from '@theia/mini-browser/lib/browser/mini-browser-open-handler';
import { FrontendApplicationStateService } from '@theia/core/lib/browser/frontend-application-state';

// Add contribution interface to be implemented, e.g. "CoreContribution implements CommandContribution"
@injectable()
export class CoreContribution implements FrontendApplicationContribution {

    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService;

    @inject(FileService)
    protected readonly fileService: FileService;

    @inject(MiniBrowserOpenHandler)
    protected openHandler: MiniBrowserOpenHandler;

    @inject(FrontendApplicationStateService)
    protected stateService: FrontendApplicationStateService


    initialize() {
        console.log("initialize core");

        // now attach some workspace listener - TODO: open folder is not opening a workspace...
        this.workspaceService.onWorkspaceChanged((files: FileStat[]) => {
            console.log("Workspace changed");
            if (files.length === 0) {
                return;
            }
            const arbFiles = files[0].children?.filter(a => a.name.endsWith('.arb'));
            if (arbFiles && arbFiles.length > 0) {
                console.log("Workspace with " + arbFiles.length) + " arb files opened, open view";
                const uri = arbFiles[0].resource;
                if (uri && uri.scheme === 'file' && (uri.path.ext === '.arb')) {
                    this.stateService.onStateChanged((state) => {
                        if (state === 'ready') {
                            this.openHandler.open(uri);
                        }
                    })
                }
            }
        });
    }

    async onStart(app: FrontendApplication): Promise<void> {

        console.log("started core");

        app.shell.onDidAddWidget(widget => {
            if (widget instanceof EditorWidget) {
                const { editor } = widget;
                if (editor instanceof MonacoEditor) {
                    const uri = editor.getResourceUri();
                    if (uri && uri.scheme === 'file' && (uri.path.ext === '.arb')) {
                        this.openHandler.open(uri, { widgetOptions: { ref: widget, mode: 'open-to-right' } });
                    }
                }
            }
        });
    }

}