import { injectable, inject } from 'inversify';
import { TreeModelImpl } from '@theia/core/lib/browser';
import { Position } from 'vscode-languageserver-types';
import { SampleTree } from './sample-tree';

@injectable()
export class SampleTreeModel extends TreeModelImpl {

    private _languageId: string | undefined;

    @inject(SampleTree) protected readonly tree: SampleTree;

    getTree(): SampleTree {
        return this.tree;
    }

    get languageId(): string | undefined {
        return this._languageId;
    }

    async initializeCallHierarchy(languageId: string | undefined, uri: string | undefined, position: Position | undefined): Promise<void> {
        this.tree.root = undefined;
        this._languageId = languageId;
        if (languageId && uri && position) {
           
                // if (true) {
                //     const rootNode = DefinitionNode.create(undefined, undefined);
                //     this.tree.root = rootNode;
                // }
            }
        
    }
}