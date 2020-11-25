import { CompositeTreeNode, ExpandableTreeNode, SelectableTreeNode, TreeImpl, TreeNode } from '@theia/core/lib/browser';
import { injectable, inject } from 'inversify';
import { ITranslationTreeNodeData, TranslationGroup } from '../../common/translation-types';
import { TranslationManager } from '../translation-contribution-manager';

// was previously extends TranslationTree
@injectable()
export class TranslationNavigatorTree extends TreeImpl {

    @inject(TranslationManager)
    protected readonly translationManager: TranslationManager

    protected resolveChildren(parent: CompositeTreeNode): Promise<TreeNode[]> {

        // TODO: reuse model here or directly invoke service calls?

        // if children have already been resolved, directly return them
        if (parent.children.length > 0) {
            return Promise.resolve([...parent.children]);
        }

        if (TranslationTreeRootNode.is(parent)) {
            // nothing to resolve - the groups are set on the root node already on model creation
        }

        if (TranslationGroupRootNode.is(parent)) {
            // lazily query the service for translation keys
            const keys = this.translationManager.getTranslationKeys(parent.group);
            return Promise.resolve(keys.map(key => this.createTranslationKeyNode(key, parent)));
        }

        if (TranslationKeyNode.is(parent)) {
            //lazily query the service for details, like translated languages
        }

        return Promise.resolve([]);
    }

    protected toNodeId(group: TranslationGroup, parent: CompositeTreeNode): string {
        return group.name
    }

    public createTranslationKeyNode(group: ITranslationTreeNodeData, parent: TranslationGroupRootNode): TreeNode {
        const node = this.toKeyNode(group, parent);
        return node;
    }

    protected toKeyNode(key: ITranslationTreeNodeData, parent: TranslationGroupRootNode): TreeNode {
        const id = parent.id + '/' + key.key;
        const node = this.getNode(id);
        if (node) {
            return node;
        }
        return {
            id: id,
            parent: parent,
            key: key.key,
            selected: false
        } as TranslationKeyNode
    }

    public createTranslationGroupRoot(group: TranslationGroup, parent: TranslationTreeRootNode): TreeNode {
        const node = this.toGroupRootNode(group, parent);
        return node;
    }

    protected toGroupRootNode(group: TranslationGroup, workspaceNode: TranslationTreeRootNode): TreeNode {
        const id = this.toNodeId(group, workspaceNode);
        const node = this.getNode(id);
        if (TranslationGroupRootNode.is(node)) {
            return node;
        } else {
            const groupRootNode = {
                id: id,
                parent: workspaceNode,
                group: group,
                visible: true,
                expanded: false,
                children: []
            } as TranslationGroupRootNode;

            return groupRootNode;
        }
    }
}

export interface TranslationTreeRootNode extends CompositeTreeNode, SelectableTreeNode {
    children: TreeNode[];
}

export namespace TranslationTreeRootNode {

    export const id = 'TranslationTreeRootNodeId';
    export const name = 'Translations';

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
            selected: false,
            visible: false
        };
    }
}

/*
* Root node of a translation group
*/
export interface TranslationGroupRootNode extends ExpandableTreeNode {
    group: TranslationGroup;
}

export namespace TranslationGroupRootNode {

    export function is(node: Object | undefined): node is TranslationGroupRootNode {
        return ExpandableTreeNode.is(node) && TranslationTreeRootNode.is(node.parent) && 'group' in node;
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
    key: string;
}
export namespace TranslationKeyNode {
    export function is(node: object | undefined): node is TranslationKeyNode {
        return !!node && 'key' in node;
    }
}