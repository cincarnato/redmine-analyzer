
import type {IRedmineProject, IRedmineProjectBase} from './IRedmineProject'
import {IDraxCrudRepository} from "@drax/crud-share";

interface IRedmineProjectRepository extends IDraxCrudRepository<IRedmineProject, IRedmineProjectBase, IRedmineProjectBase>{

}

export {IRedmineProjectRepository}


