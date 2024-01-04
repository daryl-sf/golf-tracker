import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getShotsByRound } from "~/models/shot.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.roundId, "roundId not found");
  const shots = await getShotsByRound({
    userId,
    round: params.roundId as `round#${string}`,
  });
  return json({ shots });
};

export default function RoundPage() {
  const { shots } = useLoaderData<typeof loader>();

  return (
    <div className="h-full w-full">
      {shots.length === 0 ? (
        <p className="p-4">No shots yet</p>
      ) : (
        <ol>
          {shots.map((shot) => (
            <li key={shot.id}>
              {shot.id} - {shot.round} - {shot.hole} - {shot.direction}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
