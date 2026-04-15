import {DraxConfig} from "@drax/common-back";
import RedmineConfig from "../../config/RedmineConfig.js";
import RedmineProvider from "../../providers/RedmineProvider.js";

class RedmineProviderFactory {
    private static provider: RedmineProvider;

    public static get instance(): RedmineProvider {
        if (!RedmineProviderFactory.provider) {
            const url = DraxConfig.getOrLoad(RedmineConfig.Url);
            const apikey = DraxConfig.getOrLoad(RedmineConfig.ApiKey);
            const defaultProject = DraxConfig.getOrLoad(RedmineConfig.DefaultProject);
            const defaultRole = DraxConfig.getOrLoad(RedmineConfig.DefaultRole);
            const timeoutValue = DraxConfig.getOrLoad(RedmineConfig.Timeout);
            const timeout = timeoutValue ? Number.parseInt(timeoutValue, 10) : undefined;

            RedmineProviderFactory.provider = new RedmineProvider(
                url,
                apikey,
                defaultProject,
                defaultRole,
                Number.isNaN(timeout) ? undefined : {timeout},
            );
        }

        return RedmineProviderFactory.provider;
    }
}

export default RedmineProviderFactory;
export {
    RedmineProviderFactory,
};
