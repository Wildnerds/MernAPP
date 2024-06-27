// custom.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
        JWT_SECRET: string;
        VERIFICATION_LINK: string;
        PASSWORD_RESET_LINK: string;
        MAIL_TRAP_USER: string;
        MAIL_TRAP_PASSWORD: string;
        // Add other variables as needed
    }
}
