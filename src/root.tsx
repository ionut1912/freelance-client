import { Suspense } from "react";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div>
      <main>
        <Suspense fallback={<p className="p-4">Loading…</p>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

export default RootLayout;
