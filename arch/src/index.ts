import { ArchGenerator } from '@drax/arch';

//Import schemas
import redmine from './schemas/RedmineIssueSchema'
import redmineIssueAnalysis from './schemas/RedmineIssueAnalysisSchema'
import redmineProject from './schemas/RedmineProjectSchema'

const schemas = [
    //add schemas
    redmine,
    redmineIssueAnalysis,
    redmineProject
];

const generator = new ArchGenerator(schemas);
generator.build()
