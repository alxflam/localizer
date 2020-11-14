
import { injectable } from 'inversify';
import { TreeNode, CompositeTreeNode, SelectableTreeNode, ExpandableTreeNode, TreeImpl } from '@theia/core/lib/browser';

import { Definition, Caller } from '../sample';

import { Md5 } from 'ts-md5/dist/md5';

@injectable()
export class SampleTree extends TreeImpl {

    async resolveChildren(parent: CompositeTreeNode): Promise<TreeNode[]> {
        if (parent.children.length > 0) {
            return Promise.resolve([...parent.children]);
        }
        let definition: Definition | undefined;
        if (DefinitionNode.is(parent)) {
            definition = parent.definition;
        } else if (CallerNode.is(parent)) {
            definition = parent.caller.callerDefinition;
        }
        if (definition) {
            return Promise.resolve([]);
            // return this.toNodes(callers, parent);
        }
        return Promise.resolve([]);
    }

    protected toNodes(callers: Caller[], parent: CompositeTreeNode): TreeNode[] {
        return callers.map(caller => this.toNode(caller, parent));
    }

    protected toNode(caller: Caller, parent: CompositeTreeNode | undefined): TreeNode {
        return CallerNode.create(caller, parent as TreeNode);
    }
}

export interface DefinitionNode extends SelectableTreeNode, ExpandableTreeNode {
    definition: Definition;
}

export namespace DefinitionNode {
    export function is(node: TreeNode | undefined): node is DefinitionNode {
        return !!node && 'definition' in node;
    }

    export function create(definition: Definition, parent: TreeNode | undefined): DefinitionNode {
        const name = definition.symbolName;
        const id = createId(definition, parent);
        return <DefinitionNode>{
            id, definition, name, parent,
            visible: true,
            children: [],
            expanded: false,
            selected: false,
        };
    }
}

export interface CallerNode extends SelectableTreeNode, ExpandableTreeNode {
    caller: Caller;
}

export namespace CallerNode {
    export function is(node: TreeNode | undefined): node is CallerNode {
        return !!node && 'caller' in node;
    }

    export function create(caller: Caller, parent: TreeNode | undefined): CallerNode {
        const callerDefinition = caller.callerDefinition;
        const name = callerDefinition.symbolName;
        const id = createId(callerDefinition, parent);
        return <CallerNode>{
            id, caller, name, parent,
            visible: true,
            children: [],
            expanded: false,
            selected: false,
        };
    }
}

function createId(definition: Definition, parent: TreeNode | undefined): string {
    const idPrefix = (parent) ? parent.id + '/' : '';
    const id = idPrefix + Md5.hashStr(JSON.stringify(definition));
    return id;
}