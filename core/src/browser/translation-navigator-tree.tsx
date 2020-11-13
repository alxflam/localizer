import { CompositeTreeNode, SelectableTreeNode, TreeNode } from '@theia/core/lib/browser';
import { injectable } from 'inversify';
import { TranslationGroup } from '../common/translation-types';
import { TranslationTree } from './translation-tree';


@injectable()
export class TranslationNavigatorTree extends TranslationTree {

    async createTranslationGroupRoot(group: TranslationGroup, workspaceNode: TranslationTreeNode): Promise<TranslationGroupRootNode> {
        const node = this.toNode(group, workspaceNode) as TranslationGroupRootNode;
        Object.assign(node, {
            // visible: workspaceNode.name !== TranslationTreeNode.name,
            visible: true
        });
        return node;
    }

}

export interface TranslationTreeNode extends CompositeTreeNode, SelectableTreeNode {
    children: TranslationGroupRootNode[];
}
export namespace TranslationTreeNode {

    export const id = 'TranslationTreeNodeId';
    export const name = 'TranslationTreeNode';

    export function is(node: TreeNode | undefined): node is TranslationTreeNode {
        return CompositeTreeNode.is(node) && node.id === TranslationTreeNode.id;
    }

    /**
     * Create a `TranslationNode` that can be used as a `Tree` root.
     */
    export function createRoot(multiRootName?: string): TranslationTreeNode {
        return {
            id: TranslationTreeNode.id,
            name: multiRootName || TranslationTreeNode.name,
            parent: undefined,
            children: [],
            visible: false,
            selected: false
        };
    }
}

/*
* Root node of a translation group
*/
export interface TranslationGroupRootNode extends CompositeTreeNode {
    parent: TranslationTreeNode;
}
export namespace TranslationGroupRootNode {

    export function is(node: Object | undefined): node is TranslationGroupRootNode {
        return CompositeTreeNode.is(node) && TranslationTreeNode.is(node.parent);
    }

    export function find(node: TreeNode | undefined): TranslationGroupRootNode | undefined {
        if (node) {
            if (is(node)) {
                return node;
            }
            return find(node.parent);
        }
    }
}
