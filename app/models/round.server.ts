import arc from "@architect/functions";
import { createId } from "@paralleldrive/cuid2";

import type { User } from "./user.server";

export interface Shot {
  id: ReturnType<typeof createId>;
  userId: User["id"];
  hole: number;
  putt: boolean;
  fairway?: boolean | "left" | "right" | "short";
  green: boolean;
  sand: boolean;
  water: boolean;
  ob: boolean;
  notes: string;
}

export interface hole {
  id: ReturnType<typeof createId>;
  par: number;
  handicap: number;
  yardage: number;
  shots: Shot[];
}

export interface Round {
  id: ReturnType<typeof createId>;
  userId: User["id"];
  course: string;
  date: string;
  tee: string;
  holes: hole[];
}

interface RoundItem {
  pk: User["id"];
  sk: `round#${Round["id"]}`;
}

const skToId = (sk: RoundItem["sk"]): Round["id"] => sk.replace(/^round#/, "");
const idToSk = (id: Round["id"]): RoundItem["sk"] => `round#${id}`;

export async function getRound({
  id,
  userId,
}: Pick<Round, "id" | "userId">): Promise<Round | null> {
  const db = await arc.tables();

  const result = await db.round.get({ pk: userId, sk: idToSk(id) });

  if (result) {
    return {
      userId: result.pk,
      id: result.sk,
      course: result.course,
      date: result.date,
      tee: result.tee,
      holes: result.holes,
    };
  }
  return null;
}

export async function getRoundListItems({
  userId,
}: Pick<Round, "userId">): Promise<Pick<Round, "id" | "course" | "date">[]> {
  const db = await arc.tables();

  const result = await db.round.query({
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: { ":pk": userId },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return result.Items.map((n: any) => ({
    course: n.course,
    date: n.date,
    id: skToId(n.sk),
  }));
}

export async function createRound({
  course,
  date,
  tee,
  userId,
}: Pick<Round, "course" | "date" | "tee" | "userId">): Promise<Round> {
  const db = await arc.tables();

  const result = await db.round.put({
    pk: userId,
    sk: idToSk(createId()),
    course,
    date,
    tee,
    holes: [],
  });

  return {
    userId,
    id: skToId(result.sk),
    course,
    date,
    tee,
    holes: [],
  };
}

export async function deleteRound({
  id,
  userId,
}: Pick<Round, "id" | "userId">) {
  const db = await arc.tables();
  await db.round.delete({ pk: userId, sk: idToSk(id) });
}
