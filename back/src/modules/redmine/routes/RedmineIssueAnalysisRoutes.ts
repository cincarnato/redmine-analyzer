
import RedmineIssueAnalysisController from "../controllers/RedmineIssueAnalysisController.js";
import {CrudSchemaBuilder} from "@drax/crud-back";
import {RedmineIssueAnalysisSchema, RedmineIssueAnalysisBaseSchema} from '../schemas/RedmineIssueAnalysisSchema.js'

async function RedmineIssueAnalysisFastifyRoutes(fastify, options) {

    const controller: RedmineIssueAnalysisController = new RedmineIssueAnalysisController()
    const schemas = new CrudSchemaBuilder(RedmineIssueAnalysisSchema, RedmineIssueAnalysisBaseSchema,RedmineIssueAnalysisBaseSchema, 'RedmineIssueAnalysis', 'openapi-3.0', ['redmine']);

    fastify.post('/api/redmine-issue-analyses/analyze', {
        schema: {
            tags: ['redmine'],
            summary: 'Analyze Redmine issues and persist RedmineIssueAnalysis records',
            body: {
                type: 'object',
                required: ['projectId', 'dateFrom', 'dateTo'],
                properties: {
                    projectId: {type: ['number', 'string']},
                    dateFrom: {type: 'string'},
                    dateTo: {type: 'string'},
                    statusIds: {
                        type: 'array',
                        items: {type: ['number', 'string']},
                    },
                },
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        projectId: {type: ['number', 'string']},
                        dateFrom: {type: 'string'},
                        dateTo: {type: 'string'},
                        statusIds: {
                            type: 'array',
                            items: {type: ['number', 'string']},
                        },
                        total: {type: 'number'},
                        created: {type: 'number'},
                        updated: {type: 'number'},
                        failed: {type: 'number'},
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    redmineIssueId: {type: 'string'},
                                    subject: {type: 'string'},
                                    message: {type: 'string'},
                                },
                            },
                        },
                    },
                },
            },
        },
    }, (req, rep) => controller.analyzeIssues(req as any, rep))

    fastify.post('/api/redmine-issue-analyses/analyze-one', {
        schema: {
            tags: ['redmine'],
            summary: 'Analyze one Redmine issue in real time without persisting it',
            body: {
                type: 'object',
                required: ['redmineId'],
                properties: {
                    redmineId: {type: ['number', 'string']},
                    descriptionOverride: {type: 'string'},
                },
            },
        },
    }, (req, rep) => controller.analyzeIssue(req as any, rep))

    fastify.post('/api/redmine-issue-analyses/assist', {
        schema: {
            tags: ['redmine'],
            summary: 'Assist rewriting a Redmine issue description',
            body: {
                type: 'object',
                required: ['redmineId'],
                properties: {
                    redmineId: {type: ['number', 'string']},
                    currentDescription: {type: 'string'},
                    userInput: {type: 'string'},
                    analysis: {type: 'object', additionalProperties: true},
                },
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        descripcionPropuesta: {type: 'string'},
                        preguntasComentarios: {
                            type: 'array',
                            items: {type: 'string'},
                        },
                        tokens: {type: 'number'},
                        inputTokens: {type: 'number'},
                        outputTokens: {type: 'number'},
                        time: {type: 'number'},
                    },
                },
            },
        },
    }, (req, rep) => controller.assistIssue(req as any, rep))

    fastify.get('/api/redmine-issue-analyses', {schema: schemas.paginateSchema}, (req,rep) => controller.paginate(req,rep))
    
    fastify.get('/api/redmine-issue-analyses/find', {schema: schemas.findSchema}, (req,rep) => controller.find(req,rep))
    
    fastify.get('/api/redmine-issue-analyses/search', {schema: schemas.searchSchema}, (req,rep) => controller.search(req,rep))
    
    fastify.get('/api/redmine-issue-analyses/:id', {schema: schemas.findByIdSchema}, (req,rep) => controller.findById(req,rep))
    
    fastify.get('/api/redmine-issue-analyses/find-one', {schema: schemas.findOneSchema}, (req,rep) => controller.findOne(req,rep))
    
    fastify.get('/api/redmine-issue-analyses/group-by', {schema: schemas.groupBySchema}, (req,rep) => controller.groupBy(req,rep))

    fastify.post('/api/redmine-issue-analyses', {schema: schemas.createSchema}, (req,rep) =>controller.create(req,rep))

    fastify.put('/api/redmine-issue-analyses/:id', {schema: schemas.updateSchema}, (req,rep) =>controller.update(req,rep))
    
    fastify.patch('/api/redmine-issue-analyses/:id', {schema: schemas.updateSchema}, (req,rep) =>controller.updatePartial(req,rep))

    fastify.delete('/api/redmine-issue-analyses/:id', {schema: schemas.deleteSchema}, (req,rep) =>controller.delete(req,rep))
    
    fastify.get('/api/redmine-issue-analyses/export', (req,rep) =>controller.export(req,rep))
    
    fastify.post('/api/redmine-issue-analyses/import', (req,rep) => controller.import(req,rep))
    
}

export default RedmineIssueAnalysisFastifyRoutes;
export {RedmineIssueAnalysisFastifyRoutes}
