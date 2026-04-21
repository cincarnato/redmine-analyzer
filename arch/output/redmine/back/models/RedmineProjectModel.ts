
import {mongoose} from '@drax/common-back';
import {PaginateModel} from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';
import mongoosePaginate from 'mongoose-paginate-v2'
import type {IRedmineProject} from '../interfaces/IRedmineProject'

const RedmineProjectSchema = new mongoose.Schema<IRedmineProject>({
            redmineId: {type: Number,   required: true, index: true, unique: true },
            name: {type: String,   required: true, index: true, unique: false },
            goals: [{ 
                        name: {type: String,   required: true, index: false, unique: false },
            description: {type: String,   required: false, index: false, unique: false } 
            }]
}, {timestamps: true});

RedmineProjectSchema.plugin(uniqueValidator, {message: 'validation.unique'});
RedmineProjectSchema.plugin(mongoosePaginate);

RedmineProjectSchema.virtual("id").get(function () {
    return this._id.toString();
});


RedmineProjectSchema.set('toJSON', {getters: true, virtuals: true});

RedmineProjectSchema.set('toObject', {getters: true, virtuals: true});

const MODEL_NAME = 'RedmineProject';
const COLLECTION_NAME = 'redmineprojects';
const RedmineProjectModel = mongoose.model<IRedmineProject, PaginateModel<IRedmineProject>>(MODEL_NAME, RedmineProjectSchema,COLLECTION_NAME);

export {
    RedmineProjectSchema,
    RedmineProjectModel
}

export default RedmineProjectModel
