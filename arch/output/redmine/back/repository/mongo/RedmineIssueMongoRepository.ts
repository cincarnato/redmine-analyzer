
import {AbstractMongoRepository} from "@drax/crud-back";
import {RedmineIssueModel} from "../../models/RedmineIssueModel.js";
import type {IRedmineIssueRepository} from '../../interfaces/IRedmineIssueRepository'
import type {IRedmineIssue, IRedmineIssueBase} from "../../interfaces/IRedmineIssue";


class RedmineIssueMongoRepository extends AbstractMongoRepository<IRedmineIssue, IRedmineIssueBase, IRedmineIssueBase> implements IRedmineIssueRepository {

    constructor() {
        super();
        this._model = RedmineIssueModel;
        this._searchFields = ['redmineId', 'subject', 'description'];
        this._populateFields = [];
        this._lean = true
    }

}

export default RedmineIssueMongoRepository
export {RedmineIssueMongoRepository}

