
import RedmineProjectController from "../controllers/RedmineProjectController.js";
import {CrudSchemaBuilder} from "@drax/crud-back";
import {RedmineProjectSchema, RedmineProjectBaseSchema} from '../schemas/RedmineProjectSchema.js'

async function RedmineProjectFastifyRoutes(fastify, options) {

    const controller: RedmineProjectController = new RedmineProjectController()
    const schemas = new CrudSchemaBuilder(RedmineProjectSchema, RedmineProjectBaseSchema,RedmineProjectBaseSchema, 'RedmineProject', 'openapi-3.0', ['redmine']);

    fastify.get('/api/redmine-projects', {schema: schemas.paginateSchema}, (req,rep) => controller.paginate(req,rep))
    
    fastify.get('/api/redmine-projects/find', {schema: schemas.findSchema}, (req,rep) => controller.find(req,rep))
    
    fastify.get('/api/redmine-projects/search', {schema: schemas.searchSchema}, (req,rep) => controller.search(req,rep))
    
    fastify.get('/api/redmine-projects/:id', {schema: schemas.findByIdSchema}, (req,rep) => controller.findById(req,rep))
    
    fastify.get('/api/redmine-projects/find-one', {schema: schemas.findOneSchema}, (req,rep) => controller.findOne(req,rep))
    
    fastify.get('/api/redmine-projects/group-by', {schema: schemas.groupBySchema}, (req,rep) => controller.groupBy(req,rep))

    fastify.post('/api/redmine-projects', {schema: schemas.createSchema}, (req,rep) =>controller.create(req,rep))

    fastify.put('/api/redmine-projects/:id', {schema: schemas.updateSchema}, (req,rep) =>controller.update(req,rep))
    
    fastify.patch('/api/redmine-projects/:id', {schema: schemas.updateSchema}, (req,rep) =>controller.updatePartial(req,rep))

    fastify.delete('/api/redmine-projects/:id', {schema: schemas.deleteSchema}, (req,rep) =>controller.delete(req,rep))
    
    fastify.get('/api/redmine-projects/export', (req,rep) =>controller.export(req,rep))
    
    fastify.post('/api/redmine-projects/import', (req,rep) => controller.import(req,rep))
    
}

export default RedmineProjectFastifyRoutes;
export {RedmineProjectFastifyRoutes}
