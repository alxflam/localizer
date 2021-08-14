import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { injectable, inject, postConstruct } from 'inversify';
import { BaseWidget, LabelProvider, Message, NavigatableWidget, PreferenceService, Saveable, SaveableSource } from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { MonacoTextModelService } from '@theia/monaco/lib/browser/monaco-text-model-service';
import { MonacoEditorModel } from '@theia/monaco/lib/browser/monaco-editor-model';
import { Disposable, Reference } from '@theia/core';
import { TranslationFileView } from './translation-file-view';
import { TranslationManager } from '../translation-contribution-manager';
import { TranslationServiceManager } from '../translator/translation-service-manager';

@injectable()
export class TranslationFileWidgetOptions {
    uri: URI;
}

@injectable()
export class TranslationFileWidget extends BaseWidget implements SaveableSource, NavigatableWidget {

    static id = 'translation-file-widget';

    @inject(TranslationManager)
    protected readonly translationSupport: TranslationManager;

    @inject(TranslationServiceManager)
    protected readonly translationServiceManager: TranslationServiceManager;

    @inject(TranslationFileWidgetOptions)
    protected readonly options: TranslationFileWidgetOptions;

    @inject(PreferenceService)
    protected readonly preferenceService: PreferenceService;

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
        ReactDOM.render(model ? <TranslationFileView
            model={model}
            modelService={this.modelService}
            parser={this.translationSupport.getTranslationSupportForURI(this.options.uri).getParser()}
            translationServiceManager={this.translationServiceManager}
            preferenceService={this.preferenceService}
        /> : undefined!, this.viewNode);
    }

    getResourceUri(): URI | undefined {
        return this.options.uri;
    }

    createMoveToUri(resourceUri: URI): URI | undefined {
        return this.options.uri && this.options.uri.withPath(resourceUri.path);
    }

    /**
     * The widget operates on a MonacoEditorModel, hence we can make it saveable.
     * Therefore we can save directly in the widget without having to switch to the monaco editor.
     * Furthermore the dirty decorator is present if modifications are made.
     */
    get saveable(): Saveable {
        const model = this.reference && this.reference.object;
        if (model) {
            return model;
        }
        throw new Error('MonacoEditorModel could not be found');
    }

}
