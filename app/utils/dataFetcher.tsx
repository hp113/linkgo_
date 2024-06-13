
import { json } from "@remix-run/node";
import { createSupabaseServerClient } from "../supabase.server";
import { Database } from "../types/supabase";

export const fetchUrlDetails = async (request: Request, url_id?: string) => {
    const { supabaseClient } = createSupabaseServerClient(request);
    let query = supabaseClient.from('url_details').select('*');

  // Conditionally modify the query based on the presence of url_id
  if (typeof url_id === 'string') {
    query = query.eq('url_id', url_id);
  }

  // Execute the modified query
  const { data, error } = await query;
  
  
    if (error) {
      console.error('Error fetching URL details:', error);
      throw new Error('Error fetching URL details');
    }
  
    return data;
  };
  
  type ProductRow = Database['public']['Tables']['products']['Row'];
  // Function to fetch data from products table
  export const fetchProducts = async (request: Request): Promise<ProductRow[]> => {
    const { supabaseClient } = createSupabaseServerClient(request);
    const { data, error } = await supabaseClient.from('products').select('*');
  
    if (error) {
      console.error('Error fetching products:', error);
      throw new Error('Error fetching products');
    }
  
    if (!data) {
      return [];
    }
    const dataWithPublicUrl = data.map((item) => {
      const { data: publicUrlData } = supabaseClient.storage
        .from("services")
        .getPublicUrl(item.service_logo);
  
      if (!publicUrlData) {
        console.error('Error fetching public URL for', item.service_logo);
        throw new Error('Error fetching public URL');
      }
  
      return {
        ...item,
        service_logo: publicUrlData.publicUrl,
      };
    });
  
    return dataWithPublicUrl;
  };