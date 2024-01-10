import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getRound } from "~/models/round.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.roundId, "roundId not found");

  const round = await getRound({
    userId,
    id: params.roundId,
  });

  if (!round) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ round });
};

export default function RoundPage() {
  const { round } = useLoaderData<typeof loader>();

  return (
    <div className="h-full w-full">
      <h3 className="text-2xl font-bold">{round.course}</h3>
      <p className="py-6">{round.date}</p>
      <p className="py-6">{round.tee}</p>

      <hr className="my-4" />

      <div className="flex justify-between">
        <a href={`/rounds/${round.id}/edit`}>
          <button
            type="button"
            className="rounded bg-lime-900 text-gray-100 py-2 px-4 w-full drop-shadow-md text-center"
          >
            Edit
          </button>
        </a>
        <a href={`/rounds/${round.id}/delete`}>
          <button
            type="button"
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:bg-red-400"
          >
            Delete
          </button>
        </a>
      </div>
    </div>
  );
}
