
import RedmineIssueController from "../controllers/RedmineIssueController.js";
import {CrudSchemaBuilder} from "@drax/crud-back";
import {RedmineIssueSchema, RedmineIssueBaseSchema} from '../schemas/RedmineIssueSchema.js'

async function RedmineIssueFastifyRoutes(fastify, options) {

    const controller: RedmineIssueController = new RedmineIssueController()
    const schemas = new CrudSchemaBuilder(RedmineIssueSchema, RedmineIssueBaseSchema,RedmineIssueBaseSchema, 'RedmineIssue', 'openapi-3.0', ['redmine']);

    fastify.get('/api/redmine-issues', {schema: schemas.paginateSchema}, (req,rep) => controller.paginate(req,rep))
    
    fastify.get('/api/redmine-issues/find', {schema: schemas.findSchema}, (req,rep) => controller.find(req,rep))
    
    fastify.get('/api/redmine-issues/search', {schema: schemas.searchSchema}, (req,rep) => controller.search(req,rep))
    
    fastify.get('/api/redmine-issues/:id', {schema: schemas.findByIdSchema}, (req,rep) => controller.findById(req,rep))
    
    fastify.get('/api/redmine-issues/find-one', {schema: schemas.findOneSchema}, (req,rep) => controller.findOne(req,rep))
    
    fastify.get('/api/redmine-issues/group-by', {schema: schemas.groupBySchema}, (req,rep) => controller.groupBy(req,rep))

    fastify.post('/api/redmine-issues', {schema: schemas.createSchema}, (req,rep) =>controller.create(req,rep))

    fastify.put('/api/redmine-issues/:id', {schema: schemas.updateSchema}, (req,rep) =>controller.update(req,rep))
    
    fastify.patch('/api/redmine-issues/:id', {schema: schemas.updateSchema}, (req,rep) =>controller.updatePartial(req,rep))

    fastify.delete('/api/redmine-issues/:id', {schema: schemas.deleteSchema}, (req,rep) =>controller.delete(req,rep))
    
    fastify.get('/api/redmine-issues/export', (req,rep) =>controller.export(req,rep))
    
    fastify.post('/api/redmine-issues/import', (req,rep) => controller.import(req,rep))
    
}

export default RedmineIssueFastifyRoutes;
export {RedmineIssueFastifyRoutes}
