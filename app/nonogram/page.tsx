import { Game } from "@/components/game/game";
import { Card } from "@/components/ui/card";

export default function Nonogram() {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center p-4">
      <Card className="p-4">
        <Game />
      </Card>
    </div>
  );
}
