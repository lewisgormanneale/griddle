import { Game } from "@/components/game/game";

export default async function Play() {
    return (
    <div className="h-screen w-full flex flex-col items-center p-4">
        <Game />
    </div>
  );
}
