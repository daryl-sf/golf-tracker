import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => [
  { title: "Fore!" },
  { name: "description", content: "A golfing stat tracker" },
];

export default function Index() {
  return (
    <div className="flex flex-col gap-8 items-center">
      <section className="w-full drop-shadow-md rounded p-3 bg-white">
        <h1 className="text-3xl font-bold">Fore!</h1>
        <p className="text-lg">A golfing stat tracker</p>
      </section>

      <section className="w-full flex gap-4 justify-between">
        <section className="w-full h-36 drop-shadow-md rounded p-3 bg-white">
          <h1 className="text-3xl font-bold">Fore!</h1>
          <p className="text-lg">A golfing stat tracker</p>
        </section>
        <section className="w-full h-36 drop-shadow-md rounded p-3 bg-white">
          <h1 className="text-3xl font-bold">Fore!</h1>
          <p className="text-lg">A golfing stat tracker</p>
        </section>
      </section>

      <Link
        to="/notes"
        className="rounded bg-lime-900 text-gray-100 py-4 px-6 w-full drop-shadow-md text-center font-extrabold text-2xl"
      >
        Lets Golf
      </Link>
      <Link
        to="/notes"
        className="rounded text-lime-900 bg-gray-100 py-4 px-6 w-full drop-shadow-md text-center text-xl font-extrabold"
      >
        Rounds in the Book
      </Link>
    </div>
  );
}
