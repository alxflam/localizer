import { AboutDialog } from "@theia/core/lib/browser/about-dialog";

import * as React from 'react';
import { injectable } from 'inversify';

@injectable()
export class CustomAboutDialog extends AboutDialog {

    /**
     * Customize `renderHeader` to print out some more information about the app.
     */
    protected renderHeader(): React.ReactNode {
        const appInfo = this.applicationInfo;
        const title = appInfo && <h2>{appInfo.name} {appInfo.version}</h2>;
        return <>
            {title}

            <p>Localizer is a development tool for the translation of texts.</p>

            <p>Localizer is distributed as Open Source Software under Terms of the MIT License.</p>

            <p>Build with Theia, React, Electron and many more open source libraries.</p>
        </>;

    }
}