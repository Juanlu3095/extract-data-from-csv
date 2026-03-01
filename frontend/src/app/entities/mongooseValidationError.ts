export interface MongooseValidationError {
    kind: string,
    message: string,
    name: string,
    path: string,
    properties: {
        message: string,
        path: string,
        type: string
    }
}