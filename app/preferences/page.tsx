import { ModeToggle } from "@/components/mode-toggle";

export default async function PreferencesPage() {
  return (
    <div className="h-screen w-full flex flex-col items-center p-4 gap-4">
      <ModeToggle />
    </div>
  );
}
