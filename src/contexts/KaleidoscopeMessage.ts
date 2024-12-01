export type KaleidoscopeMessage = {
    messageType: "update";
    health: "good" | "error";
    data: any;
} | {
    // tokenError hints at an expired or invalid token and should be handled by the UI by logging out the user
    messageType: "error" | "tokenError";
    // should be set if message type is error or tokenError. It is a human-readable error message
    error: string;
};