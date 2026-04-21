
import { z } from 'zod';


const RedmineProjectBaseSchema = z.object({
      redmineId: z.number().min(0,'validation.required'),
    name: z.string().min(1,'validation.required'),
    goals: z.array(
z.object({    name: z.string().min(1,'validation.required'),
    description: z.string().optional()})
    ).optional()
});

const RedmineProjectSchema = RedmineProjectBaseSchema
    .extend({
      _id: z.coerce.string(),
       
    })

export default RedmineProjectSchema;
export {RedmineProjectSchema, RedmineProjectBaseSchema}
