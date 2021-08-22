import * as React from 'react';
import { DisposableCollection } from '@theia/core';
import { ITranslationGroupData, TranslationGroup } from '../../common/translation-types';
import { TranslationManager } from '../translation-contribution-manager';
import { ChangeEventHandler } from '@theia/core/shared/react';

export class TranslationView extends React.Component<TranslationView.Props, TranslationView.State> {

    constructor(props: TranslationView.Props) {
        super(props);
        this.state = {
            data: {
                languages: new Map(),
                data: []
            }
        };

        this.onChange = this.onChange.bind(this);
    }

    render(): JSX.Element | null {

        const { data } = this.state;
        const languagesWithResource = Array.from(data.languages);
        const languageCodes = languagesWithResource.map((a, b) => a[0]);
        const keys = Array.from(data.data);

        // TODO: use translation entry instead of the tree node data type
        // var entries: ITranslationEntry[] = []
        if (data && languageCodes.length > 0) {
            // for every language and the key name

            // create a column

            // and the corresponding value

            return <>
                <table>
                    <thead>
                        <tr>
                            <th key='Key'>Key</th>
                            {languageCodes.map((key, _) => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {keys.map((value, _) => (
                            <tr key={value.key}>
                                <td key={value.key}>{value.key}</td>
                                {languageCodes.map((lang: string) => {
                                    const val = value.data[lang];
                                    if (val) {
                                        return <td key={lang + '.' + value.key}>
                                            <input
                                                key={lang + '.' + value.key}
                                                type="text"
                                                className="theia-input localizer-expanded-width localizer-translation-input"
                                                defaultValue={val}
                                                // try like that: onChange={evt => this.updateInputValue(evt)}
                                                onChange={this.onChange} />
                                        </td>;
                                    }
                                    return <td></td>;
                                })}
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
        const data = this.props.manager.getTranslationEntries(this.props.group);
        this.setState({ data });
    }

    componentWillUnmount(): void {
        this.toDispose.dispose();
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error(error);
    }

    onChange(event: React.FormEvent<HTMLInputElement>): ChangeEventHandler<HTMLInputElement> | undefined {
        console.log(event.currentTarget.id);
        console.log(event.currentTarget.value);
        // const { data } = this.state;
        // const keys = Array.from(data.data);

        // const translation = keys.find(e => e.key === key);
        // if (translation) {
        //     if (language) {
        //         translation.data[language] = value.replace(/\\n/g, '\n');
                // this._validate(translation);
                // } else {
                //     const newKey = IJEConfiguration.FORCE_KEY_UPPERCASE ? value.toUpperCase() : value;
                //     const oldKey = translation.key;

                //     translation.key = newKey;

                //     if (oldKey !== newKey) {
                //         this._validateImpacted(translation, oldKey);
                //     }
                //     this._validate(translation, true);
        //     }
        // }
        // TODO: delegate for persistency update
        // this._manager.updateTranslation(translation);
        return undefined;
    }

}

export namespace TranslationView {
    export interface Props {
        group: TranslationGroup
        manager: TranslationManager
    }
    export interface State {
        data: ITranslationGroupData
    }

}
