type Database = {
    public: {
        Tables: Record<string, unknown>;
        Views: Record<string, unknown>;
        Functions: Record<string, unknown>;
        Enums: Record<string, unknown>;
    };
};
export declare const supabase: import("@supabase/supabase-js").SupabaseClient<Database, "public", "public", never, {
    PostgrestVersion: "12";
}>;
export {};
