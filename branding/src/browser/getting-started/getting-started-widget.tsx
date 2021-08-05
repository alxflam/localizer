import { injectable, postConstruct } from 'inversify';
import { GettingStartedWidget } from '@theia/getting-started/lib/browser/getting-started-widget';
import React = require('react');

@injectable()
export class LocalizerGettingStartedWidget extends GettingStartedWidget {

    /**
     * Collection of useful links to display for end users.
     */
    protected readonly repositoryUrl = 'https://www.github.com/alxflam/localizer';

    @postConstruct()
    protected async init(): Promise<void> {
        super.init();
        this.update();
    }

    /**
     * Render the help section.
     */
    protected renderHelp(): React.ReactNode {
        return <div className='gs-section'>
            <h3 className='gs-section-header'>
                <i className='fa fa-question-circle'></i>
                Help
            </h3>
            <div className='gs-action-container'>
                <a
                    role={'button'}
                    tabIndex={0}
                    onClick={() => this.doOpenExternalLink(this.repositoryUrl)}
                    onKeyDown={(e: React.KeyboardEvent) => this.doOpenExternalLinkEnter(e, this.repositoryUrl)}>
                    Source Code Repository
                </a>
            </div>
        </div>;
    }



}