import { IEntitySchema } from "@drax/arch";

const schema: IEntitySchema = {
    module: "redmine",
    name: "RedmineProject",
    identifier: "redmineId",
    apiBasePath: "redmine-projects",
    collectionName: "redmineprojects",
    apiTag: "redmine",
    tabs: ["General", "Goals"],
    schema: {
        redmineId: {
            type: "number",
            required: true,
            unique: true,
            index: true,
            search: true,
            header: true,
            groupTab: "General",
        },
        name: {
            type: "string",
            required: true,
            index: true,
            search: true,
            header: true,
            groupTab: "General",
        },
        goals: {
            type: "array.object",
            required: false,
            header: false,
            groupTab: "Goals",
            schema: {
                name: {
                    type: "string",
                    required: true,
                    search: true,
                },
                description: {
                    type: "longString",
                    required: false,
                    search: true,
                },
            },
        },
    },
};

export default schema;
export { schema };
