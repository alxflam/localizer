import { PreferenceConfigurations } from '@theia/core/lib/browser/preferences/preference-configurations';
import { injectable } from '@theia/core/shared/inversify';

export const BrandingPreferenceConfiguration = Symbol('BrandingPreferenceConfiguration');

@injectable()
export class BrandingPreferenceConfigurations extends PreferenceConfigurations {

    /**
     * Local workspace preferences should be stored in a .localizer folder (or the one Theia uses by default)
     */
    override getPaths(): string[] {
        return ['.localizer', ...super.getPaths()];
    }

}
