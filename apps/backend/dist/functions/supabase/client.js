"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseClient = supabaseClient;
const supabase_js_1 = require("@supabase/supabase-js");
function supabaseClient() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE;
    const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    return supabase;
}
