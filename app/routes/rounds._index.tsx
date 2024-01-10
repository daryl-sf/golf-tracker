import { LoaderFunctionArgs, json } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";

import { getRoundListItems } from "~/models/round.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const rounds = await getRoundListItems({ userId });
  return json({ rounds });
};

export default function RoundsPage() {
  const { rounds } = useLoaderData<typeof loader>();

  return (
    <div className="h-full min-h-screen flex flex-col">
      <div className="h-full w-full">
        {rounds.length === 0 ? (
          <p className="p-4">No rounds yet</p>
        ) : (
          <ol>
            {rounds.map((round) => (
              <li key={round.id}>
                <NavLink
                  className={({ isActive }) =>
                    `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                  }
                  to={round.id}
                >
                  📝 {round.course} - {round.date}
                </NavLink>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
