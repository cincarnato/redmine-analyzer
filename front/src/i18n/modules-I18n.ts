import merge from 'deepmerge'
import {LocaleMessages} from "vue-i18n";
import baseI18n from '../modules/base/i18n/index'
import redmineI18n from '../modules/redmine/i18n/index'

const modulesI18n = merge.all([
  baseI18n,
  redmineI18n,
]) as LocaleMessages<never>

export default modulesI18n

export {
  modulesI18n
}
