import { LoaderFunctionArgs, json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { getRoundListItems } from "~/models/shot.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const shots = await getRoundListItems({ userId });
  return json({ shots });
};

export default function RoundsPage() {
  const { shots } = useLoaderData<typeof loader>();

  return (
    <div className="h-full min-h-screen flex flex-col">
      <div className="h-full w-full">
        {shots.length === 0 ? (
          <p className="p-4">No rounds yet</p>
        ) : (
          <ol>
            {shots.map((shot) => (
              <li key={shot.id}>
                <NavLink
                  className={({ isActive }) =>
                    `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                  }
                  to={shot.id}
                >
                  📝 {shot.round}
                </NavLink>
              </li>
            ))}
          </ol>
        )}
      </div>
      <Outlet />
    </div>
  );
}
