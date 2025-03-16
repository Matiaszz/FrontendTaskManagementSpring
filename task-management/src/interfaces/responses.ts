export interface User {
    id: string;
    username: string;
    role: string;
    name: string;
    lastName: string;
    email: string;
    description: string | null;
    profileImageURL: string;
    enabled: boolean;
    authorities: {
        authority: string;
    }[];
}

export default interface LoginResponse {
    token: string;
    user: User;
}
