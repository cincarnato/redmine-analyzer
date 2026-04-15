import {ArchGenerator} from '@drax/arch';
import PersonSchema from './schemas/PersonSchema';
import CountrySchema from './schemas/CountrySchema';
import LanguageSchema from './schemas/LanguageSchema';
import RedmineIssueSchema from '../src/schemas/RedmineIssueSchema';

const schemas = [PersonSchema, CountrySchema, LanguageSchema, RedmineIssueSchema];

const generator = new ArchGenerator(schemas);
generator.build()
