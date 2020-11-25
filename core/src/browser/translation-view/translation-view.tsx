import * as React from "react";
import { JSONSchema6 } from "json-schema";
import { DisposableCollection } from "@theia/core";
import { ReferencedModelStorage } from "../referenced-model-storage";
import { TranslationGroup } from "../../common/translation-types";

export class TranslationView extends React.Component<TranslationView.Props, TranslationView.State> {

    protected readonly schemaStorage: ReferencedModelStorage<JSONSchema6>;

    constructor(props: TranslationView.Props) {
        super(props);
        
    }

    render(): JSX.Element | null {
        return <>
                    <div>
                        <h3>Test</h3>
                    </div>
        </>;
    }

    protected readonly toDispose = new DisposableCollection();

    componentDidMount(): void {
        // not needed yet
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
    }
    export interface State {
        formData: any
    }
}