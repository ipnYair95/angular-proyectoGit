
export interface AuthResponse{

    ok?: boolean;
    uid?: string;
    nombre?: string;
    token?: string;
    roles?: string[];
    msg?: string;

}

export interface Usuario{
    uid: string;
    nombre: string,
    roles?: string[];
}