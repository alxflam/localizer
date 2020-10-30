import { NavigatableWidgetOpenHandler } from "@theia/core/lib/browser";
import URI from "@theia/core/lib/common/uri";
import { injectable, inject } from "inversify";
import { EditorManager } from "@theia/editor/lib/browser";
import { ArbFileWidget } from "./arb-file-widget";

@injectable()
export class ArbFileOpenHandler extends NavigatableWidgetOpenHandler<ArbFileWidget> {

    readonly id = ArbFileWidget.id;
    readonly label = "Translation";  
  
    @inject(EditorManager)
    protected readonly editorManager: EditorManager;

    canHandle(uri: URI): number {
        if (uri.path.ext !== '.arb') {
            return 0;
        }
        if (uri.path.name.endsWith('-data')) {
            return this.editorManager.canHandle(uri) * 2;    
        }
        return this.editorManager.canHandle(uri) / 2;
    }
    
}