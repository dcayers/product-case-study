import { getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

export async function createContext(props: {
  request: NextApiRequest;
  res: NextApiResponse;
}) {
  // return {};
  const session = await getSession();
  // console.log("***", session, { props });
  // if the user is not logged in, return an empty object
  if (!session || typeof session === "undefined") return {};

  const { user, accessToken } = session;

  return {
    user,
    accessToken,
  };
}
