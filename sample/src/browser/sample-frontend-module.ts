import { WidgetFactory, bindViewContribution } from '@theia/core/lib/browser';
import { SAMPLE_ID } from './sample';

import { ContainerModule } from 'inversify';
import { SampleContribution } from './sample-contribution';
import { createSampleTreeWidget } from './tree/sample-tree-container';

export default new ContainerModule(bind => {

    bindViewContribution(bind, SampleContribution);

    bind(WidgetFactory).toDynamicValue(context => ({
        id: SAMPLE_ID,
        createWidget: () => createSampleTreeWidget(context.container)
    }));
});