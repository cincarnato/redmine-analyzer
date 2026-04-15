
import RedmineIssueAnalysisMongoRepository from '../../repository/mongo/RedmineIssueAnalysisMongoRepository.js'
import RedmineIssueAnalysisSqliteRepository from '../../repository/sqlite/RedmineIssueAnalysisSqliteRepository.js'
import type {IRedmineIssueAnalysisRepository} from "../../interfaces/IRedmineIssueAnalysisRepository";
import {RedmineIssueAnalysisService} from '../../services/RedmineIssueAnalysisService.js'
import {RedmineIssueAnalysisBaseSchema, RedmineIssueAnalysisSchema} from "../../schemas/RedmineIssueAnalysisSchema.js";
import {COMMON, CommonConfig, DraxConfig} from "@drax/common-back";

class RedmineIssueAnalysisServiceFactory {
    private static service: RedmineIssueAnalysisService;

    public static get instance(): RedmineIssueAnalysisService {
        if (!RedmineIssueAnalysisServiceFactory.service) {
            
            let repository: IRedmineIssueAnalysisRepository
            switch (DraxConfig.getOrLoad(CommonConfig.DbEngine)) {
                case COMMON.DB_ENGINES.MONGODB:
                    repository = new RedmineIssueAnalysisMongoRepository()
                    break;
                case COMMON.DB_ENGINES.SQLITE:
                    const dbFile = DraxConfig.getOrLoad(CommonConfig.SqliteDbFile)
                    repository = new RedmineIssueAnalysisSqliteRepository(dbFile, false)
                    repository.build()
                    break;
                default:
                    throw new Error("DraxConfig.DB_ENGINE must be one of " + Object.values(COMMON.DB_ENGINES).join(", "));
            }
            
            const baseSchema = RedmineIssueAnalysisBaseSchema;
            const fullSchema = RedmineIssueAnalysisSchema;
            RedmineIssueAnalysisServiceFactory.service = new RedmineIssueAnalysisService(repository, baseSchema, fullSchema);
        }
        return RedmineIssueAnalysisServiceFactory.service;
    }
}

export default RedmineIssueAnalysisServiceFactory
export {
    RedmineIssueAnalysisServiceFactory
}

