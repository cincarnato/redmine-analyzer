import {mongoose} from '@drax/common-back';
import {PaginateModel} from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';
import mongoosePaginate from 'mongoose-paginate-v2'
import type {IRedmineIssue} from '../interfaces/IRedmineIssue'


const RedmineIssueSchema = new mongoose.Schema<IRedmineIssue>({
    redmineId: {type: Number, required: true, index: true, unique: true},
    subject: {type: String, required: false, index: true, unique: false},
    description: {type: String, required: false, index: false, unique: false},
    doneRatio: {type: Number, required: false, index: false, unique: false},
    isPrivate: {type: Boolean, required: false, index: false, unique: false},
    spentHours: {type: Number, required: false, index: false, unique: false},
    totalSpentHours: {type: Number, required: false, index: false, unique: false},
    estimatedHours: {type: Number, required: false, index: false, unique: false},
    totalEstimatedHours: {type: Number, required: false, index: false, unique: false},
    startDate: {type: Date, required: false, index: false, unique: false},
    dueDate: {type: Date, required: false, index: false, unique: false},
    createdOn: {type: Date, required: false, index: true, unique: false},
    updatedOn: {type: Date, required: false, index: true, unique: false},
    closedOn: {type: Date, required: false, index: false, unique: false},
    project: {
        id: {type: Number, required: false, index: true, unique: false},
        name: {type: String, required: false, index: false, unique: false}
    },
    tracker: {
        id: {type: Number, required: false, index: true, unique: false},
        name: {type: String, required: false, index: false, unique: false}
    },
    status: {
        id: {type: Number, required: false, index: true, unique: false},
        name: {type: String, required: false, index: false, unique: false},
        isClosed: {type: Boolean, required: false, index: false, unique: false}
    },
    priority: {
        id: {type: Number, required: false, index: true, unique: false},
        name: {type: String, required: false, index: false, unique: false}
    },
    author: {
        id: {type: Number, required: false, index: true, unique: false},
        name: {type: String, required: false, index: false, unique: false}
    },
    fixedVersion: {
        id: {type: Number, required: false, index: true, unique: false},
        name: {type: String, required: false, index: false, unique: false},
    },
    journals: [{
        id: {type: Number, required: true, index: true, unique: false},
        user: {
            id: {type: Number, required: false, index: true, unique: false},
            name: {type: String, required: false, index: false, unique: false}
        },
        notes: {type: String, required: false, index: false, unique: false},
        createdOn: {type: Date, required: false, index: false, unique: false},
        details: [{
            property: {type: String, required: false, index: false, unique: false},
            name: {type: String, required: false, index: false, unique: false},
            oldValue: {type: String, required: false, index: false, unique: false},
            newValue: {type: String, required: false, index: false, unique: false}
        }]
    }],
    relations: [{
        id: {type: Number, required: true, index: true, unique: false},
        issueId: {type: Number, required: true, index: true, unique: false},
        issueToId: {type: Number, required: true, index: true, unique: false},
        relationType: {type: String, required: false, index: false, unique: false},
        delay: {type: Number, required: false, index: false, unique: false}
    }],
    customFields: [{
        id: {type: Number, required: true, index: true, unique: false},
        name: {type: String, required: true, index: false, unique: false},
        value: {type: String, required: false, index: false, unique: false}
    }],
    syncSource: {type: String, required: false, index: false, unique: false},
    rawPayload: {type: mongoose.Schema.Types.Mixed, required: false, index: false, unique: false}
}, {timestamps: true});

RedmineIssueSchema.plugin(uniqueValidator, {message: 'validation.unique'});
RedmineIssueSchema.plugin(mongoosePaginate);

RedmineIssueSchema.virtual("id").get(function () {
    return this._id.toString();
});


RedmineIssueSchema.set('toJSON', {getters: true, virtuals: true});

RedmineIssueSchema.set('toObject', {getters: true, virtuals: true});

const MODEL_NAME = 'RedmineIssue';
const COLLECTION_NAME = 'redmineissues';
const RedmineIssueModel = mongoose.model<IRedmineIssue, PaginateModel<IRedmineIssue>>(MODEL_NAME, RedmineIssueSchema, COLLECTION_NAME);

export {
    RedmineIssueSchema,
    RedmineIssueModel
}

export default RedmineIssueModel
