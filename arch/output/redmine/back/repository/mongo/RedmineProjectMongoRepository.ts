
import {AbstractMongoRepository} from "@drax/crud-back";
import {RedmineProjectModel} from "../../models/RedmineProjectModel.js";
import type {IRedmineProjectRepository} from '../../interfaces/IRedmineProjectRepository'
import type {IRedmineProject, IRedmineProjectBase} from "../../interfaces/IRedmineProject";


class RedmineProjectMongoRepository extends AbstractMongoRepository<IRedmineProject, IRedmineProjectBase, IRedmineProjectBase> implements IRedmineProjectRepository {

    constructor() {
        super();
        this._model = RedmineProjectModel;
        this._searchFields = ['redmineId', 'name'];
        this._populateFields = [];
        this._lean = true
    }

}

export default RedmineProjectMongoRepository
export {RedmineProjectMongoRepository}

