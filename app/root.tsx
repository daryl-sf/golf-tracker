import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";

import { useOptionalUser } from "./utils";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ user: await getUser(request) });
};

export default function App() {
  const user = useOptionalUser();
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="/_static/favicon.ico" />
        <Meta />
        <Links />
      </head>
      <body className="h-screen w-screen">
        <nav className="flex items-center justify-evenly bg-lime-600 min-h-16 px-4">
          <Link
            to="/"
            className="text-lime-100 font-sans font-bold text-4xl grow text-center"
          >
            <h1>Fore!</h1>
          </Link>
          <Link to="/login" className="h-full w-8 text-4xl grow-0">
            {user ? "🏌️‍♂️" : "🚪"}
          </Link>
        </nav>
        <main className="min-h-screen bg-white py-6 px-4">
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
