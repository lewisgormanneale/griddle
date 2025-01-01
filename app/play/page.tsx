import { Game } from "@/components/game/game";
import { Card } from "@/components/ui/card";

export default function Play() {
  return (
    <div className="h-screen w-full flex flex-col items-center p-4">
        <Game />
    </div>
  );
}
