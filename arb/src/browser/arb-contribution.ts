import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import { injectable } from 'inversify';

@injectable()
export class CoreContribution implements FrontendApplicationContribution {

    initialize() {
        console.log("initialize arb");
    }

}