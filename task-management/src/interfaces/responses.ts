export default interface IUser {
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

