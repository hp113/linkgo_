
import { json } from "@remix-run/node";
import { createSupabaseServerClient } from "../supabase.server";
import { Database } from "../types/supabase";

export const fetchUrlDetails = async (request: Request, username: string) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const {data, error}  = await supabaseClient.from('url_details').select('*').eq('username', username).single();

  // Conditionally modify the query based on the presence of url_id
  // if (typeof url_id === 'string') {
  //   query = query.eq('url_id', url_id);
  // }

  // // Execute the modified query
  // const { data, error } = await query;

  if (error) {
    console.error('Error fetching URL details:', error);
    throw new Error('Error fetching URL details');
  }

  if (!data) {
    return null;
  }

  const coverImgPublicUrl = supabaseClient.storage
    .from("services")
    .getPublicUrl(data.homepage_coverimg);

  const logoPublicUrl = supabaseClient.storage
    .from("services")
    .getPublicUrl(data.homepage_logo);

  if (!coverImgPublicUrl.data || !logoPublicUrl.data) {
    console.error('Error fetching public URL for', data.homepage_coverimg, data.homepage_logo);
    throw new Error('Error fetching public URL');
  }

  // Return the modified data object
  return {
    ...data,
    homepage_coverimg: coverImgPublicUrl.data.publicUrl,
    homepage_logo: logoPublicUrl.data.publicUrl,
  };

  // return dataWithPublicUrl;
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