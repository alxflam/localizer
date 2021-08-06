import { FrontendApplication, FrontendApplicationContribution } from '@theia/core/lib/browser';
import { injectable, inject, named } from 'inversify';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { EditorWidget } from '@theia/editor/lib/browser';
import { MonacoEditor } from '@theia/monaco/lib/browser/monaco-editor';
import { FrontendApplicationStateService } from '@theia/core/lib/browser/frontend-application-state';
import { TranslationFileOpenHandler } from './file-view/translation-file-open-handler';
import { ProblemManager } from '@theia/markers/lib/browser/problem/problem-manager';
// import { DiagnosticSeverity } from 'vscode-languageserver-types';
import { FileStat } from '@theia/filesystem/lib/common/files';
import { ContributionProvider, DisposableCollection } from '@theia/core';
import { MonacoWorkspace } from '@theia/monaco/lib/browser/monaco-workspace';
import { TranslationSupport } from './translation-support';
import { TranslationManager } from './translation-contribution-manager';

@injectable()
export class CoreContribution implements FrontendApplicationContribution {

    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService;

    @inject(FileService)
    protected readonly fileService: FileService;

    @inject(TranslationFileOpenHandler)
    protected openHandler: TranslationFileOpenHandler;

    @inject(FrontendApplicationStateService)
    protected stateService: FrontendApplicationStateService;

    @inject(ProblemManager)
    protected problemManager: ProblemManager;

    @inject(MonacoWorkspace)
    protected monacoWorkspace: MonacoWorkspace;

    @inject(ContributionProvider)
    @named(TranslationSupport)
    protected readonly contributions: ContributionProvider<TranslationSupport>;

    @inject(TranslationManager)
    protected readonly supportContributionManager: TranslationManager;

    protected readonly toDispose = new DisposableCollection();

    initialize() {
        console.log('initialize core');

        // TODO: only initialize a TranslationManager here...
        this.fileService.onDidFilesChange(event => {

        });

        // register listener for workspace changes
        this.toDispose.push(this.workspaceService.onWorkspaceChanged((files: FileStat[]) => {
            // set the workspace filestat on some manager and then lazily initialize once the translation view is opened
            // TODO: how about rename, file creation / deletion?
            console.log('Workspace changed');

            for (const handler of this.getContributions()) {
                // TODO: just set the first contribution as the active one ...
                this.supportContributionManager.setTranslationSupport(handler);
                handler.onWorkspaceChanged(files);
            }
        }));

        this.toDispose.push(this.monacoWorkspace.onDidChangeTextDocument(event => {
            for (const handler of this.getContributions()) {
                handler.onDidChangeTextDocument(event.model, event.contentChanges);
            }
        }));

        this.toDispose.push(this.monacoWorkspace.onDidOpenTextDocument(event => {
            for (const handler of this.getContributions()) {
                handler.onDidOpenTextDocument(event);
            }
        }));

        this.toDispose.push(this.monacoWorkspace.onDidSaveTextDocument(event => {
            for (const handler of this.getContributions()) {
                handler.onDidSaveTextDocument(event);
            }
        }));
    }

    openInitialView() {
        // open first supported translation file on startup
        this.workspaceService.onWorkspaceChanged((files: FileStat[]) => {
            console.log('Workspace changed');

            // return if theworkspace got closed?
            if (files.length === 0) {
                return;
            }

            // return if the workspace root has no children
            if (!files[0].children) {
                return;
            }

            for (const handler of this.getContributions()) {
                for (const item of files[0].children) {
                    const supported = handler.supports(item.resource);
                    if (supported) {
                        this.stateService.onStateChanged(state => {
                            if (state === 'ready') {
                                this.openHandler.open(item.resource);
                            }
                        });
                        // exit function, only open first translation resource
                        return;
                    }
                }
            }

            // const arbFiles = files[0].children?.filter(a => a.name.endsWith('.arb'));
            // if (arbFiles && arbFiles.length > 0) {
            //     console.log("Workspace with " + arbFiles.length) + " arb files opened, open view";
            //     const uri = arbFiles[0].resource;
            //     if (uri && uri.scheme === 'file' && (uri.path.ext === '.arb')) {
            //         this.stateService.onStateChanged((state) => {
            //             if (state === 'ready') {
            //                 this.openHandler.open(uri);
            //             }
            //         })
            //     }
            // }
        });
    }

    onWillStop(app: FrontendApplication) {
        this.toDispose.dispose();
    }

    async onStart(app: FrontendApplication): Promise<void> {

        console.log('started core');

        // open arb translation if arb file is opened in editor
        app.shell.onDidAddWidget(widget => {
            if (widget instanceof EditorWidget) {
                const { editor } = widget;
                if (editor instanceof MonacoEditor) {
                    const uri = editor.getResourceUri();
                    if (this.openHandler.canHandle(uri)) {
                        // const markers = this.problemManager.findMarkers({ uri: uri }).map(a => a.data);
                        // const range = { start: { line: 0, character: 10 }, end: { line: 0, character: 10 } };
                        // markers.push({ message: 'My new custom error message!', range, severity: DiagnosticSeverity.Error })
                        // this.problemManager.setMarkers(uri, 'localizer', markers)
                        this.openHandler.open(uri, { widgetOptions: { ref: widget, mode: 'open-to-right' } });
                    }
                }
            }
        });
    }

    protected getContributions(): TranslationSupport[] {
        return this.contributions.getContributions();
    }

}
