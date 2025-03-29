import {Nonogram} from "@/components/nonogram/nonogram";

export default async function NonogramPage({params}: {
    params: Promise<{ slug: string }>
}) {
    const {slug} = await params
    return (
        <div className="h-screen w-full flex flex-col items-center p-4 gap-4">
            <Nonogram/>
            <h1 className="text-3xl">Leaderboard</h1>
        </div>
    );
}
