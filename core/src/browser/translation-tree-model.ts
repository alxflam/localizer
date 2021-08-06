import { TreeModelImpl } from '@theia/core/lib/browser/tree/tree-model';
import { injectable, inject, postConstruct } from 'inversify';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { FileNode } from '@theia/filesystem/lib/browser/file-tree';
import { FileChangesEvent, FileChange, FileChangeType } from '@theia/filesystem/lib/common/files';

import URI from '@theia/core/lib/common/uri';
import { CompositeTreeNode, TreeNode } from '@theia/core/lib/browser';

// TODO: let the navigator tree model just extend the file tree model?
@injectable()
export class TranslationTreeModel extends TreeModelImpl {

    @inject(FileService)
    protected readonly fileService: FileService;

    @postConstruct()
    protected init(): void {
        super.init();
        this.toDispose.push(this.fileService.onDidFilesChange(changes => this.onFilesChanged(changes)));
    }

    protected onFilesChanged(changes: FileChangesEvent): void {
        if (!this.refreshAffectedNodes(this.getAffectedUris(changes)) && this.isRootAffected(changes)) {
            this.refresh();
        }
    }

    protected refreshAffectedNodes(uris: URI[]): boolean {
        const nodes = this.getAffectedNodes(uris);
        for (const node of nodes.values()) {
            this.refresh(node);
        }
        return nodes.size !== 0;
    }

    protected getAffectedUris(changes: FileChangesEvent): URI[] {
        return changes.changes.filter(change => !this.isFileContentChanged(change)).map(change => change.resource);
    }

    protected isFileContentChanged(change: FileChange): boolean {
        return change.type === FileChangeType.UPDATED && FileNode.is(this.getNodesByUri(change.resource).next().value);
    }

    *getNodesByUri(uri: URI): IterableIterator<TreeNode> {
        const node = this.getNode(uri.toString());
        if (node) {
            yield node;
        }
    }

    protected getAffectedNodes(uris: URI[]): Map<string, CompositeTreeNode> {
        const nodes = new Map<string, CompositeTreeNode>();
        // for (const uri of uris) {
            // for (const node of this.getNodesByUri(uri.parent)) {
                    // nodes.set(node.id, node);
            // }
        // }
        return nodes;
    }

    protected isRootAffected(changes: FileChangesEvent): boolean {
        // const root = this.root;
        // if (FileStatNode.is(root)) {
        //     return changes.contains(root.uri, FileChangeType.ADDED) || changes.contains(root.uri, FileChangeType.UPDATED);
        // }
        return false;
    }

}
