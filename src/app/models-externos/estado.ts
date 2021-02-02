export class Estado {
    error:         boolean;
    code_error:    number;
    error_message: null;
    response:      Response = new Response();
}

export class Response {
    estado: string[] = [];
}
