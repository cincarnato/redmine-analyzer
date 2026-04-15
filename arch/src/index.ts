import { ArchGenerator } from '@drax/arch';

//Import schemas
import redmine from './schemas/RedmineIssueSchema'
import redmineIssueAnalysis from './schemas/RedmineIssueAnalysisSchema'

const schemas = [
    //add schemas
    redmine,
    redmineIssueAnalysis
];

const generator = new ArchGenerator(schemas);
generator.build()
