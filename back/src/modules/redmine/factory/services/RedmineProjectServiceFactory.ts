
import RedmineProjectMongoRepository from '../../repository/mongo/RedmineProjectMongoRepository.js'
import RedmineProjectSqliteRepository from '../../repository/sqlite/RedmineProjectSqliteRepository.js'
import type {IRedmineProjectRepository} from "../../interfaces/IRedmineProjectRepository";
import {RedmineProjectService} from '../../services/RedmineProjectService.js'
import {RedmineProjectBaseSchema, RedmineProjectSchema} from "../../schemas/RedmineProjectSchema.js";
import {COMMON, CommonConfig, DraxConfig} from "@drax/common-back";

class RedmineProjectServiceFactory {
    private static service: RedmineProjectService;

    public static get instance(): RedmineProjectService {
        if (!RedmineProjectServiceFactory.service) {
            
            let repository: IRedmineProjectRepository
            switch (DraxConfig.getOrLoad(CommonConfig.DbEngine)) {
                case COMMON.DB_ENGINES.MONGODB:
                    repository = new RedmineProjectMongoRepository()
                    break;
                case COMMON.DB_ENGINES.SQLITE:
                    const dbFile = DraxConfig.getOrLoad(CommonConfig.SqliteDbFile)
                    repository = new RedmineProjectSqliteRepository(dbFile, false)
                    repository.build()
                    break;
                default:
                    throw new Error("DraxConfig.DB_ENGINE must be one of " + Object.values(COMMON.DB_ENGINES).join(", "));
            }
            
            const baseSchema = RedmineProjectBaseSchema;
            const fullSchema = RedmineProjectSchema;
            RedmineProjectServiceFactory.service = new RedmineProjectService(repository, baseSchema, fullSchema);
        }
        return RedmineProjectServiceFactory.service;
    }
}

export default RedmineProjectServiceFactory
export {
    RedmineProjectServiceFactory
}

