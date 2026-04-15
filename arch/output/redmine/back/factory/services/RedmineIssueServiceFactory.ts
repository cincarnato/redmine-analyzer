
import RedmineIssueMongoRepository from '../../repository/mongo/RedmineIssueMongoRepository.js'
import RedmineIssueSqliteRepository from '../../repository/sqlite/RedmineIssueSqliteRepository.js'
import type {IRedmineIssueRepository} from "../../interfaces/IRedmineIssueRepository";
import {RedmineIssueService} from '../../services/RedmineIssueService.js'
import {RedmineIssueBaseSchema, RedmineIssueSchema} from "../../schemas/RedmineIssueSchema.js";
import {COMMON, CommonConfig, DraxConfig} from "@drax/common-back";

class RedmineIssueServiceFactory {
    private static service: RedmineIssueService;

    public static get instance(): RedmineIssueService {
        if (!RedmineIssueServiceFactory.service) {
            
            let repository: IRedmineIssueRepository
            switch (DraxConfig.getOrLoad(CommonConfig.DbEngine)) {
                case COMMON.DB_ENGINES.MONGODB:
                    repository = new RedmineIssueMongoRepository()
                    break;
                case COMMON.DB_ENGINES.SQLITE:
                    const dbFile = DraxConfig.getOrLoad(CommonConfig.SqliteDbFile)
                    repository = new RedmineIssueSqliteRepository(dbFile, false)
                    repository.build()
                    break;
                default:
                    throw new Error("DraxConfig.DB_ENGINE must be one of " + Object.values(COMMON.DB_ENGINES).join(", "));
            }
            
            const baseSchema = RedmineIssueBaseSchema;
            const fullSchema = RedmineIssueSchema;
            RedmineIssueServiceFactory.service = new RedmineIssueService(repository, baseSchema, fullSchema);
        }
        return RedmineIssueServiceFactory.service;
    }
}

export default RedmineIssueServiceFactory
export {
    RedmineIssueServiceFactory
}

