import { Outlet } from "@remix-run/react";

export default function RoundsPage() {
  return (
    <div className="h-full min-h-screen flex flex-col">
      <Outlet />
    </div>
  );
}
