
import {AbstractMongoRepository} from "@drax/crud-back";
import {RedmineIssueAnalysisModel} from "../../models/RedmineIssueAnalysisModel.js";
import type {IRedmineIssueAnalysisRepository} from '../../interfaces/IRedmineIssueAnalysisRepository'
import type {IRedmineIssueAnalysis, IRedmineIssueAnalysisBase} from "../../interfaces/IRedmineIssueAnalysis";


class RedmineIssueAnalysisMongoRepository extends AbstractMongoRepository<IRedmineIssueAnalysis, IRedmineIssueAnalysisBase, IRedmineIssueAnalysisBase> implements IRedmineIssueAnalysisRepository {

    constructor() {
        super();
        this._model = RedmineIssueAnalysisModel;
        this._searchFields = ['resumen', 'rolObjetivo', 'areaFuncional'];
        this._populateFields = ['redmineIssue'];
        this._lean = true
    }

}

export default RedmineIssueAnalysisMongoRepository
export {RedmineIssueAnalysisMongoRepository}
