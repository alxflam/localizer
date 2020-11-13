import { FrontendApplicationStateService } from '@theia/core/lib/browser/frontend-application-state';
import { injectable, inject, postConstruct } from 'inversify';
import { TranslationNavigatorTree, TranslationTreeNode } from './translation-navigator-tree';
import { TranslationTreeModel } from './translation-tree-model';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { CompositeTreeNode, ExpandableTreeNode, SelectableTreeNode, TreeNode } from '@theia/core/lib/browser';
import { ProgressService } from '@theia/core';
import { TranslationManager } from './translation-contribution-manager';

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
    protected readonly translationManager: TranslationManager

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
            const groups = this.translationManager.getTranslationGroups();

            const node = TranslationTreeNode.createRoot();
            for (const group of groups) {
                node.children.push(await this.tree.createTranslationGroupRoot(group, node))
            }

            return node
        }
    }
}