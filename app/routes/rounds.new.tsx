import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { createRound } from "~/models/round.server";
import { requireUserId } from "~/session.server";

const defaultError = {
  course: null,
  date: null,
  tee: null,
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const course = formData.get("course");
  const date = formData.get("date");
  const tee = formData.get("tee");

  if (typeof course !== "string" || course.length === 0) {
    return json(
      { errors: { ...defaultError, course: "Course is required" } },
      { status: 400 },
    );
  }
  if (typeof date !== "string" || date.length === 0) {
    return json(
      { errors: { ...defaultError, date: "Date is required" } },
      { status: 400 },
    );
  }
  if (typeof tee !== "string" || tee.length === 0) {
    return json(
      { errors: { ...defaultError, tee: "Tee is required" } },
      { status: 400 },
    );
  }

  const round = await createRound({
    course,
    date,
    tee,
    userId,
  });

  return redirect(`/rounds/${round.id}`);
};

export default function NewShotPage() {
  const actionData = useActionData<typeof action>();
  return (
    <Form method="post">
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Course: </span>
          <input
            type="string"
            name="course"
            className="rounded border border-gray-300"
          />
        </label>
        {actionData?.errors?.course ? (
          <p className="text-red-500">{actionData.errors.course}</p>
        ) : null}
      </div>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Date: </span>
          <input
            type="date"
            name="date"
            className="rounded border border-gray-300"
          />
        </label>
        {actionData?.errors?.date ? (
          <p className="text-red-500">{actionData.errors.date}</p>
        ) : null}
      </div>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Tees: </span>
          <input
            type="string"
            name="tee"
            className="rounded border border-gray-300"
          />
        </label>
        {actionData?.errors?.tee ? (
          <p className="text-red-500">{actionData.errors.tee}</p>
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
