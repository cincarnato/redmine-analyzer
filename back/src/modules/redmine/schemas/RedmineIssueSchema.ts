import {z} from 'zod';

const jsonSafeDateSchema = z.preprocess(
    (value) => value instanceof Date ? value.toISOString() : value,
    z.string(),
).nullish();

const LooseNamedEntitySchema = z.object({
    id: z.number().min(0, 'validation.required').nullish(),
    name: z.string().nullish(),
});

const CustomFieldSchema = z.object({
    id: z.number().min(0, 'validation.required').nullish(),
    name: z.string().nullish(),
    value: z.string().nullish(),
});

const JournalDetailSchema = z.object({
    property: z.string().nullish(),
    name: z.string().nullish(),
    oldValue: z.string().nullish(),
    newValue: z.string().nullish(),
});

const JournalSchema = z.object({
    id: z.number().min(0, 'validation.required').nullish(),
    user: LooseNamedEntitySchema.nullish(),
    notes: z.string().nullish(),
    createdOn: jsonSafeDateSchema,
    details: z.array(JournalDetailSchema).nullish(),
});

const RedmineIssueBaseSchema = z.object({
    redmineId: z.number().min(0, 'validation.required').nullish(),
    subject: z.string().nullish(),
    description: z.string().nullish(),
    doneRatio: z.number().nullish(),
    isPrivate: z.boolean().nullish(),
    spentHours: z.number().nullish(),
    totalSpentHours: z.number().nullish(),
    estimatedHours: z.number().nullish(),
    totalEstimatedHours: z.number().nullish(),
    startDate: jsonSafeDateSchema,
    dueDate: jsonSafeDateSchema,
    createdOn: jsonSafeDateSchema,
    updatedOn: jsonSafeDateSchema,
    closedOn: jsonSafeDateSchema,
    project: LooseNamedEntitySchema.nullish(),
    tracker: LooseNamedEntitySchema.nullish(),
    status: LooseNamedEntitySchema.extend({
        isClosed: z.boolean().nullish(),
    }).nullish(),
    priority: LooseNamedEntitySchema.nullish(),
    author: LooseNamedEntitySchema.nullish(),
    fixedVersion: LooseNamedEntitySchema.nullish(),
    journals: z.array(JournalSchema).nullish(),
    customFields: z.array(CustomFieldSchema).nullish(),
    syncSource: z.string().default('redmine').nullish(),
    rawPayload: z.record(z.string(), z.unknown()).nullish(),
});

const RedmineIssueSchema = RedmineIssueBaseSchema.extend({
    _id: z.coerce.string().nullish(),
});

export default RedmineIssueSchema;
export {RedmineIssueSchema, RedmineIssueBaseSchema};
