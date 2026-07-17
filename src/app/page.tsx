import { SpreadReading } from "@/components/SpreadReading";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-gradient-to-b from-black via-indigo-950 to-black min-h-screen py-16 px-6">
      <header className="flex flex-col items-center gap-2 mb-12 text-center">
        <h1 className="text-4xl font-semibold text-violet-100 tracking-tight">Таро</h1>
        <p className="text-violet-400 max-w-md">
          Выберите расклад и вытяните карты — колода Райдера-Уэйта-Смит, 78 карт.
        </p>
      </header>
      <main className="flex-1 w-full flex justify-center">
        <SpreadReading />
      </main>
    </div>
  );
}
