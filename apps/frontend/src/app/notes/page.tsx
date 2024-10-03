import { createClient } from "@/utils/supabase/server";

export default async function Notes() {
  const supabase = createClient();
  const query = await supabase.from("series").select();
  const series = query.data;
  console.log("query", query);

  return <pre>{JSON.stringify(series, null, 2)}</pre>;
}
