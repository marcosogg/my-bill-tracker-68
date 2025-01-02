import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Map common file extensions to MIME types
const getMimeType = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const mimeTypes: { [key: string]: string } = {
    'pdf': 'application/pdf',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'txt': 'text/plain'
  };
  return mimeTypes[ext] || 'application/octet-stream';
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get bill ID from URL
    const url = new URL(req.url)
    const billId = url.searchParams.get('billId')

    if (!billId) {
      return new Response(
        JSON.stringify({ error: 'Bill ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get the user ID from the request
    const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1]
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Verify the user and get their ID
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader)
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Get bill details
    const { data: bill, error: billError } = await supabaseClient
      .from('bills')
      .select('attachment')
      .eq('id', billId)
      .eq('user_id', user.id)
      .single()

    if (billError || !bill?.attachment) {
      return new Response(
        JSON.stringify({ error: 'Bill not found or no attachment' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Extract original filename from the attachment path
    const originalFilename = bill.attachment.split('/').pop() || 'attachment'

    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabaseClient
      .storage
      .from('bill-attachments')
      .download(bill.attachment)

    if (downloadError) {
      console.error('Download error:', downloadError)
      return new Response(
        JSON.stringify({ error: 'Failed to download file' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Determine content type based on filename
    const contentType = getMimeType(originalFilename);

    // Create response headers with proper content type and disposition
    const responseHeaders = {
      ...corsHeaders,
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${originalFilename}"`,
    }

    // Return the file as a stream with proper headers
    return new Response(fileData.stream(), { headers: responseHeaders })
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})