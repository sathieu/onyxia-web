export declare type Secret = { [key: string]: Secret.Value };

export declare namespace Secret {
    export type Value =
        | string
        | boolean
        | number
        | null
        | Value[]
        | { [key: string]: Value };
}

export type SecretWithMetadata = {
    secret: Secret;
    metadata: {
        created_time: string;
        deletion_time: string | "";
        destroyed: boolean;
        version: number;
    };
};

export type SecretsManagerClient = {
    list: (params: { path: string }) => Promise<{
        directories: string[];
        secrets: string[];
    }>;

    get: (params: { path: string }) => Promise<SecretWithMetadata>;

    put: (params: { path: string; secret: Secret }) => Promise<void>;

    delete: (params: { path: string }) => Promise<void>;

    getToken: () => Promise<{
        token: string;
        expirationTime: number;
    }>;
};
