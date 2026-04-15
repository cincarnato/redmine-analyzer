
import merge from "deepmerge";
import RedmineIssueAnalysisMessages from "./RedmineIssueAnalysis-i18n"
import RedmineIssueMessages from "./RedmineIssue-i18n"

const messages = merge.all([
    RedmineIssueAnalysisMessages,
    RedmineIssueMessages
])

export default messages
