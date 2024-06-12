
import { createSupabaseServerClient } from "./supabase.server";

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
  
  export interface Product {
    id: number;
    service_name: string;
    service_price: number;
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