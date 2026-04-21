
import merge from "deepmerge";
import RedmineIssueAnalysisMessages from "./RedmineIssueAnalysis-i18n"
import RedmineIssueMessages from "./RedmineIssue-i18n"
import RedmineProjectMessages from "./RedmineProject-i18n"

const messages = merge.all([
    RedmineIssueAnalysisMessages,
    RedmineIssueMessages,
    RedmineProjectMessages
])

export default messages
