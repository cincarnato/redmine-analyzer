import RedmineSyncController from "../controllers/RedmineSyncController.js";

async function RedmineSyncFastifyRoutes(fastify, options) {
    const controller = new RedmineSyncController();

    fastify.get(
        "/api/redmine-sync/projects",
        {
            schema: {
                tags: ["redmine"],
                summary: "List Redmine projects for sync",
                response: {
                    200: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: {type: ["number", "string"]},
                                name: {type: "string"},
                                identifier: {type: "string"},
                            },
                        },
                    },
                },
            },
        },
        (req, rep) => controller.getProjects(req as any, rep),
    );

    fastify.get(
        "/api/redmine-sync/statuses",
        {
            schema: {
                tags: ["redmine"],
                summary: "List Redmine issue statuses for sync",
                response: {
                    200: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: {type: ["number", "string"]},
                                name: {type: "string"},
                                isClosed: {type: "boolean"},
                            },
                        },
                    },
                },
            },
        },
        (req, rep) => controller.getIssueStatuses(req as any, rep),
    );

    fastify.post(
        "/api/redmine-sync/issues",
        {
            schema: {
                tags: ["redmine"],
                summary: "Sync Redmine issues by project and creation date range",
                body: {
                    type: "object",
                    required: ["projectId", "dateFrom", "dateTo"],
                    properties: {
                        projectId: {type: ["number", "string"]},
                        dateFrom: {type: "string"},
                        dateTo: {type: "string"},
                        includeJournals: {type: "boolean"},
                        statusIds: {
                            type: "array",
                            items: {type: ["number", "string"]},
                        },
                    },
                },
                response: {
                    200: {
                        type: "object",
                        properties: {
                            projectId: {type: ["number", "string"]},
                            dateFrom: {type: "string"},
                            dateTo: {type: "string"},
                            includeJournals: {type: "boolean"},
                            statusIds: {
                                type: "array",
                                items: {type: ["number", "string"]},
                            },
                            total: {type: "number"},
                            created: {type: "number"},
                            updated: {type: "number"},
                        },
                    },
                },
            },
        },
        (req, rep) => controller.syncProjectIssues(req as any, rep),
    );
}

export default RedmineSyncFastifyRoutes;
export {
    RedmineSyncFastifyRoutes,
};
