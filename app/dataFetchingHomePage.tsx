import { createSupabaseServerClient } from "./supabase.server";

export const fetchUrlDetails = async (request: Request) => {
    const { supabaseClient } = createSupabaseServerClient(request);
    const { data, error } = await supabaseClient.from('url_details').select('*').single();
  
    if (error) {
      console.error('Error fetching URL details:', error);
      throw new Error('Error fetching URL details');
    }
  
    return data;
  };
  
  export interface Product {
  id: number;
  service_name: string;
  service_price: string;
  service_logo: string;
  url_id: string;
  created_at: string;
}
  // Function to fetch data from products table
  export const fetchProducts = async (request: Request): Promise<Product[]> => {
    const { supabaseClient } = createSupabaseServerClient(request);
    const { data, error } = await supabaseClient.from('products').select('*');
  
    if (error) {
      console.error('Error fetching products:', error);
      throw new Error('Error fetching products');
    }
  
    if (!data) {
      return [];
    }
  
    return data;
  };