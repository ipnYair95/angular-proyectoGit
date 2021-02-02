export class Colonia {
    error:         boolean;
    code_error:    number;
    error_message: null;
    response:      Response = new Response();;
}

export class Response {
    colonia: string[] = [];
}
