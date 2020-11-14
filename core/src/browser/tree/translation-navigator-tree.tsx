import { CompositeTreeNode, SelectableTreeNode, TreeImpl, TreeNode } from '@theia/core/lib/browser';
import { injectable } from 'inversify';
import { TranslationGroup } from '../../common/translation-types';

// was previously extends TranslationTree
@injectable()
export class TranslationNavigatorTree extends TreeImpl {

    protected resolveChildren(parent: CompositeTreeNode): Promise<TreeNode[]> {
        if (TranslationTreeRootNode.is(parent)) {
            return Promise.resolve(
                parent.children
            );
        }

        if (TranslationGroupRootNode.is(parent) && parent.children) {
            return Promise.resolve(
                parent.children
            );
        }

        return Promise.resolve(Array.from(parent.children));
    }

    protected toNodeId(group: TranslationGroup, parent: CompositeTreeNode): string {
        return group.name
    }

    async createTranslationGroupRoot(group: TranslationGroup, workspaceNode: TranslationTreeRootNode): Promise<TranslationGroupRootNode> {
        const node = this.toNode(group, workspaceNode) as TranslationGroupRootNode;
        Object.assign(node, {
            // visible: workspaceNode.name !== TranslationTreeNode.name,
            visible: true
        });
        return node;
    }

    protected toNode(group: TranslationGroup, workspaceNode: TranslationTreeRootNode): TranslationGroupRootNode {
        const id = this.toNodeId(group, workspaceNode);
        const node = this.getNode(id);
        if (TranslationGroupRootNode.is(node)) {
            return node;
        } else {

            const newNode = {
                id: id,
                name: group.name,
                parent: workspaceNode,
                visible: true,
                children: []
            } as TranslationGroupRootNode

            const item = {
                id: 'a',
                name: 'test',
                visible: true,
                key: 'a',
                selected: false,
                parent: newNode
            } as TranslationKeyNode;

            newNode.children.push(item)
            return newNode;

        }
    }
}

export interface TranslationTreeRootNode extends CompositeTreeNode, SelectableTreeNode {
    children: TranslationGroupRootNode[];
}
export namespace TranslationTreeRootNode {

    export const id = 'TranslationTreeRootNodeId';
    export const name = 'TranslationTreeRootNode';

    export function is(node: TreeNode | undefined): node is TranslationTreeRootNode {
        return CompositeTreeNode.is(node) && node.id === TranslationTreeRootNode.id;
    }

    /**
     * Create a `TranslationTreeRootNode` that can be used as a `Tree` root.
     */
    export function createRoot(multiRootName?: string): TranslationTreeRootNode {
        return {
            id: TranslationTreeRootNode.id,
            name: multiRootName || TranslationTreeRootNode.name,
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
    parent: TranslationTreeRootNode;
    children: TranslationKeyNode[];
}
export namespace TranslationGroupRootNode {

    export function is(node: Object | undefined): node is TranslationGroupRootNode {
        return CompositeTreeNode.is(node) && TranslationTreeRootNode.is(node.parent);
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


export interface TranslationKeyNode extends SelectableTreeNode {
    key: String;
}
export namespace TranslationKeyNode {
    export function is(node: object | undefined): node is TranslationKeyNode {
        return !!node && 'key' in node;
    }
}