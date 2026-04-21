
interface IRedmineProjectBase {
    redmineId: number
    name: string
    goals?: Array<{
    name: string
    description?: string
    }>
    modules?: Array<{
    name: string
    description?: string
    }>
    createdAt?: Date
    updatedAt?: Date
}

interface IRedmineProject {
    _id: string
    redmineId: number
    name: string
    goals?: Array<{
    name: string
    description?: string
    }>
    modules?: Array<{
    name: string
    description?: string
    }>
    createdAt?: Date
    updatedAt?: Date
}

export type {
IRedmineProjectBase, 
IRedmineProject
}
