import arc from "@architect/functions";
import { createId } from "@paralleldrive/cuid2";

import type { User } from "./user.server";

export interface Shot {
  id: string;
  userId: User["id"];
  round: string;
  hole: number;
  direction: "left" | "right" | "center";
}

interface ShotItem {
  pk: User["id"];
  sk: `shot#${Shot["id"]}`;
}

const skToId = (sk: ShotItem["sk"]): Shot["id"] => sk.replace(/^shot#/, "");
const idToSk = (id: Shot["id"]): ShotItem["sk"] => `shot#${id}`;

export async function getShot({
  id,
  userId,
}: Pick<Shot, "id" | "userId">): Promise<Shot | null> {
  const db = await arc.tables();

  const result = await db.shot.get({ pk: userId, sk: idToSk(id) });

  if (result) {
    return {
      userId: result.pk,
      id: result.sk,
      round: result.round,
      hole: result.hole,
      direction: result.direction,
    };
  }
  return null;
}

export async function getRoundListItems({
  userId,
}: Pick<Shot, "userId">): Promise<Pick<Shot, "id" | "round">[]> {
  const db = await arc.tables();

  const result = await db.shot.query({
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: { ":pk": userId },
  });

  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return result.Items.reduce((acc: any[], shot: any) => {
    if (!acc.find((s) => s.round === shot.round)) {
      acc.push(shot);
    }
    return acc;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, []).map((n: any) => ({
    round: n.round,
    id: skToId(n.sk),
  }));
}

export async function createShot({
  direction,
  hole,
  round,
  userId,
}: Omit<Shot, "id">): Promise<Shot> {
  const db = await arc.tables();

  const result = await db.shot.put({
    pk: userId,
    sk: idToSk(createId()),
    round,
    hole,
    direction,
  });

  return {
    id: skToId(result.sk),
    userId: result.pk,
    round: result.round,
    hole: result.hole,
    direction: result.direction,
  };
}

export async function deleteShot({
  id,
  userId,
}: Pick<Shot, "id" | "userId">) {
  const db = await arc.tables();

  return await db.shot.delete({ pk: userId, sk: idToSk(id) });
}

// get shots by round using byRound index
export async function getShotsByRound({
  userId,
  round,
}: Pick<Shot, "userId" | "round">): Promise<Shot[]> {
  const db = await arc.tables();

  const result = await db.shot.query({
    IndexName: "byRound",
    KeyConditionExpression: "pk = :pk and sk = :sk",
    ExpressionAttributeValues: { ":pk": userId, ":sk": idToSk(round) },
  });  

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return result.Items.map((n: any) => ({
    userId: n.pk,
    id: n.sk,
    round: n.round,
    hole: n.hole,
    direction: n.direction,
  }));
}
