export interface KaleidoscopeMessage {
    // tokenError hints at an expired or invalid token and should be handled by the UI by logging out the user
    messageType: "update" | "error" | "tokenError";
    error?: string;
    health?: "good" | "error";
    data?: any;
};