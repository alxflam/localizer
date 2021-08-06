import { FrontendApplicationStateService } from '@theia/core/lib/browser/frontend-application-state';
import { injectable, inject, postConstruct } from 'inversify';
import { TranslationGroupRootNode, TranslationKeyNode, TranslationNavigatorTree, TranslationTreeRootNode } from './translation-navigator-tree';
import { TranslationTreeModel } from '../translation-tree-model';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { CompositeTreeNode, ExpandableTreeNode, SelectableTreeNode, TreeNode } from '@theia/core/lib/browser';
import { ProgressService } from '@theia/core';
import { TranslationManager } from '../translation-contribution-manager';
import { CommandService } from '@theia/core/lib/common/command';
import { TranslationViewCommands } from '../translation-view/translation-view-contribution';

@injectable()
export class TranslationNavigatorModel extends TranslationTreeModel {

    @inject(TranslationNavigatorTree)
    protected readonly tree: TranslationNavigatorTree;

    @inject(FrontendApplicationStateService)
    protected readonly applicationState: FrontendApplicationStateService;

    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService;

    @inject(ProgressService)
    protected readonly progressService: ProgressService;

    @inject(TranslationManager)
    protected readonly translationManager: TranslationManager;

    @inject(CommandService)
    protected readonly commandService: CommandService;

    @postConstruct()
    protected init(): void {
        super.init();
        this.initializeRoot();
    }

    protected async initializeRoot(): Promise<void> {
        await Promise.all([
            this.applicationState.reachedState('initialized_layout'),
            this.workspaceService.roots
        ]);

        await this.updateRoot();
        if (this.toDispose.disposed) {
            return;
        }

        this.toDispose.push(this.workspaceService.onWorkspaceChanged(() => this.updateRoot()));
        this.toDispose.push(this.workspaceService.onWorkspaceLocationChanged(() => this.updateRoot()));
        if (this.selectedNodes.length) {
            return;
        }

        const root = this.root;
        if (CompositeTreeNode.is(root) && root.children.length === 1) {
            const child = root.children[0];
            if (SelectableTreeNode.is(child) && !child.selected && ExpandableTreeNode.is(child)) {
                this.selectNode(child);
                this.expandNode(child);
            }
        }
    }

    protected async updateRoot(): Promise<void> {
        this.root = await this.createRoot();
    }

    protected async createRoot(): Promise<TreeNode | undefined> {
        // if there is a workspace
        if (this.workspaceService.opened) {
            // then check if there are translation nodes
            const node = TranslationTreeRootNode.createRoot();
            // translation groups need to be added initially, otherwise they won't be visible
            // a workaround would be to make the root node a visible ExpandableTreeNode, but that introduces an unnecessary tree hierarchy
            const groups = this.translationManager.getTranslationGroups();
            for (const group of groups) {
                node.children.push(this.tree.createTranslationGroupRoot(group, node));
            }
            return node;
        }
    }

    protected doOpenNode(node: TreeNode): void {
        if (node.visible === false) {
            return;
        }
        // open translation view on double click
        if (TranslationGroupRootNode.is(node)) {
            this.commandService.executeCommand(TranslationViewCommands.OPEN_VIEW.id, {'group': node.group });
        }
        if (TranslationKeyNode.is(node)) {

        }
    }
}
