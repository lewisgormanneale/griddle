import { supabase } from '@/utils/supabase/client';

export async function getNonogram(id: string) {
    const { data, error } = await supabase.from('nonograms').select('*').eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function getNonograms() {
    const { data, error } = await supabase.from('nonograms').select('*');

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (id) {
        const nonogram = await getNonogram(id);
        return new Response(JSON.stringify(nonogram), {
            headers: { 'content-type': 'application/json' },
        });
    }

    const nonograms = await getNonograms();
    return new Response(JSON.stringify(nonograms), {
        headers: { 'content-type': 'application/json' },
    });
}