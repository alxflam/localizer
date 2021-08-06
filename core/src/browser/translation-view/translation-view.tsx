import * as React from 'react';
import { DisposableCollection } from '@theia/core';
import { ITranslationTreeNodeData, TranslationGroup } from '../../common/translation-types';
import { TranslationManager } from '../translation-contribution-manager';

export class TranslationView extends React.Component<TranslationView.Props, TranslationView.State> {

    constructor(props: TranslationView.Props) {
        super(props);
        this.state = {
            keys: []
        };

    }

    render(): JSX.Element | null {

        const { keys } = this.state;

        // TODO: use translation entry instead of the tree node data type
        // var entries: ITranslationEntry[] = []
        if (keys && keys.length > 0) {
            // for every language and the key name

            // create a column

            // and the corresponding value

            return <>

                <table>
                    <thead>
                        <th>Key</th>
                        <th>English</th>
                        <th>German</th>
                    </thead>
                    <tbody>
                        {keys.map((value, index) => (
                                <tr>
                                    <td>{value.key}</td>
                                    <td>{value.key}</td>
                                    <td>{value.key}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </>;
        } else {
            return <>
                <div>
                    <h3>No Translation Keys for {this.props.group.name}</h3>
                </div>
            </>;
        }

    }

    protected readonly toDispose = new DisposableCollection();

    componentDidMount(): void {
        this.reconcileGroupData();
    }

    protected async reconcileGroupData(): Promise<void> {
        const keys = this.props.manager.getTranslationKeys(this.props.group);
        this.setState({ keys });
    }

    componentWillUnmount(): void {
        this.toDispose.dispose();
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error(error);
    }

}

export namespace TranslationView {
    export interface Props {
        group: TranslationGroup
        manager: TranslationManager
    }
    export interface State {
        keys: ITranslationTreeNodeData[]
    }
}
