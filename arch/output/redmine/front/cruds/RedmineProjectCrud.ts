
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
import RedmineProjectProvider from "../providers/RedmineProjectProvider";

//Import EntityCrud Refs


class RedmineProjectCrud extends EntityCrud implements IEntityCrud {

  static singleton: RedmineProjectCrud

  constructor() {
    super();
    this.name = 'RedmineProject'
  }
  
  static get instance(): RedmineProjectCrud {
    if(!RedmineProjectCrud.singleton){
      RedmineProjectCrud.singleton = new RedmineProjectCrud()
    }
    return RedmineProjectCrud.singleton
  }

  get permissions(): IEntityCrudPermissions{
    return {
      manage: 'redmineproject:manage', 
      view: 'redmineproject:view', 
      create: 'redmineproject:create', 
      update: 'redmineproject:update', 
      delete: 'redmineproject:delete'
    }
  }

  get headers(): IEntityCrudHeader[] {
    return [
        {title: 'redmineId',key:'redmineId', align: 'start'},
{title: 'name',key:'name', align: 'start'}
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
    return RedmineProjectProvider.instance
  }
  
  get refs(): IEntityCrudRefs{
    return {
      
    }
  }

  get rules():IEntityCrudRules{
    return {
      redmineId: [(v: any) => !!v || 'validation.required'],
name: [(v: any) => !!v || 'validation.required'],
goals: []
    }
  }

  get fields(): IEntityCrudField[]{
    return [
        {name:'redmineId',type:'number',label:'redmineId',default:null,groupTab: 'General'},
{name:'name',type:'string',label:'name',default:'',groupTab: 'General'},
{name:'goals',type:'array.object',label:'goals',default:[],groupTab: 'Goals',objectFields: [{name:'name',type:'string',label:'name',default:''},
{name:'description',type:'longString',label:'description',default:''}]}
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
     'General', 'Goals'
    ]
  }
  
  get menus() {
    return [
     
    ]
  }
  
  get searchEnable() {
    return true
  }

   get filtersEnable(){
    return true
  }

  get dynamicFiltersEnable(){
    return true
  }


}

export default RedmineProjectCrud
