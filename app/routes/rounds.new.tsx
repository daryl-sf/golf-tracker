import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { createShot } from "~/models/shot.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const hole = formData.get("hole");
  const direction = formData.get("direction");
  const round = formData.get("round");

  if (typeof hole !== "string" || hole.length === 0) {
    return json(
      { errors: { hole: "Hole is required", direction: null, round: null } },
      { status: 400 },
    );
  }

  if (
    typeof direction !== "string" ||
    direction.length === 0 ||
    ["left", "right", "center"].indexOf(direction) === -1
  ) {
    return json(
      {
        errors: { hole: null, direction: "Direction is required", round: null },
      },
      { status: 400 },
    );
  }

  if (typeof round !== "string" || round.length === 0) {
    return json(
      { errors: { hole: null, direction: null, round: "Round is required" } },
      { status: 400 },
    );
  }

  await createShot({
    hole: parseInt(hole, 10),
    direction: direction as "left" | "right" | "center",
    round,
    userId,
  });

  return redirect(`/rounds`);
};

export default function NewShotPage() {
  const actionData = useActionData<typeof action>();
  return (
    <Form method="post">
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Round: </span>
          <input
            type="string"
            name="round"
            className="rounded border border-gray-300"
          />
        </label>
        {actionData?.errors?.round ? (
          <p className="text-red-500">{actionData.errors.round}</p>
        ) : null}
      </div>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Hole: </span>
          <input
            type="number"
            name="hole"
            className="rounded border border-gray-300"
          />
        </label>
        {actionData?.errors?.hole ? (
          <p className="text-red-500">{actionData.errors.hole}</p>
        ) : null}
      </div>
      <div>
        <span>Direction: </span>
        <label className="flex w-full flex-row gap-4">
          <label>
            <input type="radio" name="direction" value="left" />
            Left
          </label>
          <label>
            <input type="radio" name="direction" value="center" />
            Center
          </label>
          <label>
            <input type="radio" name="direction" value="right" />
            Right
          </label>
        </label>

        {actionData?.errors?.direction ? (
          <p className="text-red-500">{actionData.errors.direction}</p>
        ) : null}
      </div>

      <button
        type="submit"
        className="rounded bg-lime-900 text-gray-100 py-4 px-6 w-full drop-shadow-md text-center font-extrabold text-2xl"
      >
        Submit
      </button>
    </Form>
  );
}
