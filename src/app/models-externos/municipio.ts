export class Municipio {
    error:         boolean;
    code_error:    number;
    error_message: null;
    response:      Response = new Response();
}

export class Response {
    municipios: string[] = [];
}
