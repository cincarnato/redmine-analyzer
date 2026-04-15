
import { z } from 'zod';


const RedmineIssueBaseSchema = z.object({
      redmineId: z.number().min(0,'validation.required'),
    subject: z.string().min(1,'validation.required'),
    description: z.string().optional(),
    doneRatio: z.number().nullable().optional(),
    isPrivate: z.boolean().optional(),
    spentHours: z.number().nullable().optional(),
    totalSpentHours: z.number().nullable().optional(),
    estimatedHours: z.number().nullable().optional(),
    totalEstimatedHours: z.number().nullable().optional(),
    startDate: z.coerce.date().nullable().optional(),
    dueDate: z.coerce.date().nullable().optional(),
    createdOn: z.coerce.date({error: "validation.date"}),
    updatedOn: z.coerce.date({error: "validation.date"}),
    closedOn: z.coerce.date().nullable().optional(),
    project: z.object({    id: z.number().min(0,'validation.required'),
    name: z.string().min(1,'validation.required')}),
    tracker: z.object({    id: z.number().min(0,'validation.required'),
    name: z.string().min(1,'validation.required')}),
    status: z.object({    id: z.number().min(0,'validation.required'),
    name: z.string().min(1,'validation.required'),
    isClosed: z.boolean().optional()}),
    priority: z.object({    id: z.number().min(0,'validation.required'),
    name: z.string().min(1,'validation.required')}),
    author: z.object({    id: z.number().min(0,'validation.required'),
    name: z.string().min(1,'validation.required')}),
    customFields: z.array(
z.object({    id: z.number().min(0,'validation.required'),
    name: z.string().min(1,'validation.required'),
    value: z.string().optional()})
    ).optional(),
    syncSource: z.string().optional().default('redmine'),
    rawPayload: z.record(z.string(),z.unknown()).optional().nullable()
});

const RedmineIssueSchema = RedmineIssueBaseSchema
    .extend({
      _id: z.coerce.string(),
       
    })

export default RedmineIssueSchema;
export {RedmineIssueSchema, RedmineIssueBaseSchema}
