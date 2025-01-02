import {supabase} from '@/utils/supabase/client';
import {Tables} from "@/types/database.types";

export async function getNonogram(id: string): Promise<Tables<"nonograms">> {
    const {data, error} = await supabase.from('nonograms').select('*').eq('id', id).single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function getNonograms() {
    const {data, error} = await supabase.from('nonograms').select('*');

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
            headers: {'content-type': 'application/json'},
        });
    }

    const nonograms = await getNonograms();
    return new Response(JSON.stringify(nonograms), {
        headers: {'content-type': 'application/json'},
    });
}

export async function POST(request: Request) {
    const body = await request.json();
    const {data, error} = await supabase.from('nonograms').insert([body]);

    if (error) {
        throw new Error(error.message);
    }

    return new Response(JSON.stringify(data), {
        headers: {'content-type': 'application/json'},
    });
}