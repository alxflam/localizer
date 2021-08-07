import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { injectable, inject, postConstruct } from 'inversify';
import { BaseWidget, LabelProvider, Message, NavigatableWidget } from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { MonacoTextModelService } from '@theia/monaco/lib/browser/monaco-text-model-service';
import { MonacoEditorModel } from '@theia/monaco/lib/browser/monaco-editor-model';
import { Disposable, Reference } from '@theia/core';
import { TranslationFileView } from './translation-file-view';
import { TranslationManager } from '../translation-contribution-manager';

@injectable()
export class TranslationFileWidgetOptions {
    uri: URI;
}

@injectable()
export class TranslationFileWidget extends BaseWidget implements NavigatableWidget {

    static id = 'translation-file-widget';

    @inject(TranslationManager)
    protected readonly translationSupport: TranslationManager;

    @inject(TranslationFileWidgetOptions)
    protected readonly options: TranslationFileWidgetOptions;

    @inject(LabelProvider)
    protected readonly labelProvider: LabelProvider;

    @inject(MonacoTextModelService)
    protected readonly modelService: MonacoTextModelService;

    protected viewNode: HTMLDivElement;
    protected reference: Reference<MonacoEditorModel> | undefined;

    @postConstruct()
    protected async init(): Promise<void> {
        const { uri } = this.options;
        this.id = TranslationFileWidget.id + ':' + uri.toString();
        const name = this.labelProvider.getName(uri);
        this.title.label = 'Translate: ' + name;
        this.title.closable = true;

        this.scrollOptions = {};
        this.viewNode = document.createElement('div');
        this.viewNode.style.paddingLeft = '15px';
        this.viewNode.style.paddingRight = '15px';
        this.node.appendChild(this.viewNode);
        this.toDispose.push(Disposable.create(() => ReactDOM.unmountComponentAtNode(this.viewNode)));

        const reference = await this.modelService.createModelReference(uri);
        if (this.toDispose.disposed) {
            reference.dispose();
            return;
        }

        this.toDispose.push(this.reference = reference);
        this.update();
    }

    protected onUpdateRequest(message: Message): void {
        super.onUpdateRequest(message);
        const model = this.reference && this.reference.object;
        ReactDOM.render(model ? <TranslationFileView model={model} modelService={this.modelService}
                parser={this.translationSupport.getTranslationSupportForURI(this.options.uri).getParser()}
            /> : undefined!, this.viewNode);
    }

    getResourceUri(): URI | undefined {
        return this.options.uri;
    }

    createMoveToUri(resourceUri: URI): URI | undefined {
        return this.options.uri && this.options.uri.withPath(resourceUri.path);
    }

}
