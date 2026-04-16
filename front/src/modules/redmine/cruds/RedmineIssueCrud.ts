
import {EntityCrud} from "@drax/crud-vue";
import type{
  IDraxCrudProvider,
  IEntityCrud,
  IEntityCrudField,
  IEntityCrudFilter,
  IEntityCrudHeader,
  IEntityCrudPermissions,
  IEntityCrudRefs,
  IEntityCrudRules
} from "@drax/crud-share";
import RedmineIssueProvider from "../providers/RedmineIssueProvider";

//Import EntityCrud Refs


class RedmineIssueCrud extends EntityCrud implements IEntityCrud {

  static singleton: RedmineIssueCrud

  constructor() {
    super();
    this.name = 'RedmineIssue'
  }

  static get instance(): RedmineIssueCrud {
    if(!RedmineIssueCrud.singleton){
      RedmineIssueCrud.singleton = new RedmineIssueCrud()
    }
    return RedmineIssueCrud.singleton
  }

  get permissions(): IEntityCrudPermissions{
    return {
      manage: 'redmineissue:manage',
      view: 'redmineissue:view',
      create: 'redmineissue:create',
      update: 'redmineissue:update',
      delete: 'redmineissue:delete'
    }
  }

  get headers(): IEntityCrudHeader[] {
    return [
        {title: 'redmineId',key:'redmineId', align: 'start'},
{title: 'subject',key:'subject', align: 'start'},
{title: 'doneRatio',key:'doneRatio', align: 'start'},
{title: 'isPrivate',key:'isPrivate', align: 'start'},
{title: 'spentHours',key:'spentHours', align: 'start'},
{title: 'startDate',key:'startDate', align: 'start'},
{title: 'dueDate',key:'dueDate', align: 'start'},
{title: 'createdOn',key:'createdOn', align: 'start'},
{title: 'updatedOn',key:'updatedOn', align: 'start'},
{title: 'closedOn',key:'closedOn', align: 'start'},
{title: 'project',key:'project.name', align: 'start'},
{title: 'tracker',key:'tracker.name', align: 'start'},
{title: 'status',key:'status.name', align: 'start'},
{title: 'priority',key:'priority.name', align: 'start'},
{title: 'author',key:'author.name', align: 'start'},
{title: 'fixedVersion',key:'fixedVersion', align: 'start'}
    ]
  }

  get selectedHeaders(): string[] {
    return this.headers.map(header => header.key)
  }

  get actionHeaders():IEntityCrudHeader[]{
    return [
      {
        title: 'action.actions',
        key: 'actions',
        sortable: false,
        align: 'center',
        minWidth: '190px',
        fixed: 'end'
      },
    ]
  }

  get provider(): IDraxCrudProvider<any, any, any>{
    return RedmineIssueProvider.instance
  }

  get refs(): IEntityCrudRefs{
    return {

    }
  }

  get rules():IEntityCrudRules{
    return {
      redmineId: [(v: any) => !!v || 'validation.required'],
subject: [(v: any) => !!v || 'validation.required'],
createdOn: [(v: any) => !!v || 'validation.required'],
updatedOn: [(v: any) => !!v || 'validation.required'],
project: [(v: any) => !!v || 'validation.required'],
tracker: [(v: any) => !!v || 'validation.required'],
status: [(v: any) => !!v || 'validation.required'],
priority: [(v: any) => !!v || 'validation.required'],
author: [(v: any) => !!v || 'validation.required'],
fixedVersion: [],
journals: [],
customFields: []
    }
  }

  get fields(): IEntityCrudField[]{
    return [
        {name:'redmineId',type:'number',label:'redmineId',default:null,groupTab: 'General'},
{name:'subject',type:'string',label:'subject',default:'',groupTab: 'General'},
{name:'description',type:'longString',label:'description',default:'',groupTab: 'General'},
{name:'doneRatio',type:'number',label:'doneRatio',default:0,groupTab: 'General'},
{name:'isPrivate',type:'boolean',label:'isPrivate',default:false,groupTab: 'General'},
{name:'spentHours',type:'number',label:'spentHours',default:0,groupTab: 'General'},
{name:'totalSpentHours',type:'number',label:'totalSpentHours',default:0,groupTab: 'General'},
{name:'estimatedHours',type:'number',label:'estimatedHours',default:null,groupTab: 'General'},
{name:'totalEstimatedHours',type:'number',label:'totalEstimatedHours',default:null,groupTab: 'General'},
{name:'startDate',type:'date',label:'startDate',default:null,groupTab: 'Dates'},
{name:'dueDate',type:'date',label:'dueDate',default:null,groupTab: 'Dates'},
{name:'createdOn',type:'date',label:'createdOn',default:null,groupTab: 'Dates'},
{name:'updatedOn',type:'date',label:'updatedOn',default:null,groupTab: 'Dates'},
{name:'closedOn',type:'date',label:'closedOn',default:null,groupTab: 'Dates'},
{name:'project',type:'object',label:'project',default:{"id":null,"name":"''"},groupTab: 'Relations',objectFields: [{name:'id',type:'number',label:'id',default:null},
{name:'name',type:'string',label:'name',default:''}]},
{name:'tracker',type:'object',label:'tracker',default:{"id":null,"name":"''"},groupTab: 'Relations',objectFields: [{name:'id',type:'number',label:'id',default:null},
{name:'name',type:'string',label:'name',default:''}]},
{name:'status',type:'object',label:'status',default:{"id":null,"name":"''","isClosed":false},groupTab: 'Relations',objectFields: [{name:'id',type:'number',label:'id',default:null},
{name:'name',type:'string',label:'name',default:''},
{name:'isClosed',type:'boolean',label:'isClosed',default:false}]},
{name:'priority',type:'object',label:'priority',default:{"id":null,"name":"''"},groupTab: 'Relations',objectFields: [{name:'id',type:'number',label:'id',default:null},
{name:'name',type:'string',label:'name',default:''}]},
{name:'author',type:'object',label:'author',default:{"id":null,"name":"''"},groupTab: 'Relations',objectFields: [{name:'id',type:'number',label:'id',default:null},
{name:'name',type:'string',label:'name',default:''}]},
{name:'fixedVersion',type:'object',label:'fixedVersion',default:{"id":null,"name":"''"},groupTab: 'Relations',objectFields: [{name:'id',type:'number',label:'id',default:null},
{name:'name',type:'string',label:'name',default:''}]},
{name:'journals',type:'array.object',label:'journals',default:[],groupTab: 'History',objectFields: [{name:'id',type:'number',label:'id',default:null},
{name:'user',type:'object',label:'user',default:{"id":null,"name":"''"},objectFields: [{name:'id',type:'number',label:'id',default:null},
{name:'name',type:'string',label:'name',default:''}]},
{name:'notes',type:'longString',label:'notes',default:''},
{name:'createdOn',type:'date',label:'createdOn',default:null},
{name:'details',type:'array.object',label:'details',default:[],objectFields: [{name:'property',type:'string',label:'property',default:''},
{name:'name',type:'string',label:'name',default:''},
{name:'oldValue',type:'string',label:'oldValue',default:''},
{name:'newValue',type:'string',label:'newValue',default:''}]}]},
{name:'customFields',type:'array.object',label:'customFields',default:[],groupTab: 'Custom Fields',objectFields: [{name:'id',type:'number',label:'id',default:null},
{name:'name',type:'string',label:'name',default:''},
{name:'value',type:'string',label:'value',default:''}]},
{name:'syncSource',type:'string',label:'syncSource',default:'redmine',groupTab: 'Sync'},
{name:'rawPayload',type:'record',label:'rawPayload',default:null,groupTab: 'Sync'}
    ]
  }

  get filters():IEntityCrudFilter[]{
    return [
      //{name: '_id', type: 'string', label: 'ID', default: '', operator: 'eq' },
    ]
  }

  get isViewable(){
    return true
  }

  get isEditable(){
    return true
  }

  get isCreatable(){
    return true
  }

  get isDeletable(){
    return true
  }

  get isExportable(){
    return true
  }

  get exportFormats(){
    return ['CSV', 'JSON']
  }

  get exportHeaders(){
    return ['_id']
  }

  get isImportable(){
    return false
  }

  get isColumnSelectable() {
    return true
  }

  get isGroupable() {
    return true
  }

  get importFormats(){
    return ['CSV', 'JSON']
  }

  get dialogFullscreen(){
    return false
  }

  get tabs() {
     return [
     'General', 'Dates', 'Relations', 'History', 'Custom Fields', 'Sync'
    ]
  }

  get menus() {
    return [

    ]
  }

  get searchEnable() {
    return false
  }

   get filtersEnable(){
    return true
  }

  get dynamicFiltersEnable(){
    return true
  }


}

export default RedmineIssueCrud
