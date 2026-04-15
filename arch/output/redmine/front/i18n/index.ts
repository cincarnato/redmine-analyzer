
import merge from "deepmerge";
import RedmineIssueMessages from "./RedmineIssue-i18n"
import RedmineIssueAnalysisMessages from "./RedmineIssueAnalysis-i18n"

const messages = merge.all([
    RedmineIssueMessages,
    RedmineIssueAnalysisMessages
])

export default messages
