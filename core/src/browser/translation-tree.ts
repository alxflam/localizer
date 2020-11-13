import { injectable, inject } from 'inversify';
import { MessageService, Mutable, UriSelection } from '@theia/core';
import { CompositeTreeNode, SelectableTreeNode, TreeImpl, TreeNode } from '@theia/core/lib/browser';
import { TranslationGroup } from '../common/translation-types';
import { TranslationGroupRootNode, TranslationTreeNode } from './translation-navigator-tree';

@injectable()
export class TranslationTree extends TreeImpl {

    @inject(MessageService)
    protected readonly messagingService: MessageService;

    async resolveChildren(parent: CompositeTreeNode): Promise<TreeNode[]> {
        return super.resolveChildren(parent);
    }

    // protected async resolveFileStat(node: FileStatNode): Promise<FileStat | undefined> {
    //     try {
    //         const fileStat = await this.fileService.resolve(node.uri);
    //         node.fileStat = fileStat;
    //         return fileStat;
    //     } catch (e) {
    //         if (!(e instanceof FileOperationError && e.fileOperationResult === FileOperationResult.FILE_NOT_FOUND)) {
    //             this.messagingService.error(e.message);
    //         }
    //         return undefined;
    //     }
    // }

    // protected async toNodes(fileStat: FileStat, parent: CompositeTreeNode): Promise<TreeNode[]> {
    //     if (!fileStat.children) {
    //         return [];
    //     }
    //     const result = await Promise.all(fileStat.children.map(async child =>
    //         this.toNode(child, parent)
    //     ));
    //     return result.sort(DirNode.compare);
    // }

    protected toNode(group: TranslationGroup, parent: TranslationTreeNode): TranslationGroupRootNode {
        const id = this.toNodeId(group, parent);
        const node = this.getNode(id);
        if (TranslationGroupRootNode.is(node)) {
            return node
        } else {
            return <TranslationGroupRootNode>{
                id: id,
                name: group.name,
                parent: parent,
                visible: true,    
                children: [ <TreeNode>{
                    id: 'a',
                    name: 'test',
                    visible: true
                }]
            }
        }
    }

    protected toNodeId(group: TranslationGroup, parent: CompositeTreeNode): string {
        return group.name
    }
}

export interface TranslationKeyNode extends SelectableTreeNode, Mutable<UriSelection> {
}

export namespace TranslationKeyNode {
    export function is(node: object | undefined): node is TranslationKeyNode {
        return !!node && 'fileStat' in node;
    }

    export function getUri(node: TreeNode | undefined): string | undefined {
        if (is(node)) {
            return node.uri.toString();
        }
        return undefined;
    }
}

export type TranslationKeyNodeData = Omit<TranslationKeyNode, 'uri' | 'fileStat'> & {
    uri: string
    // stat?: Stat | { type: FileType } & Partial<Stat>
    // fileStat?: DeprecatedFileStat
};
export namespace TranslationKeyNodeData {
    export function is(node: object | undefined): node is TranslationKeyNodeData {
        return !!node && 'uri' in node && ('fileStat' in node || 'stat' in node);
    }
}