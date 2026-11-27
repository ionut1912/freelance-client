import { Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";

import Spinner from "../../components/ui/Spinner";
import { useCurrentProfile } from "../../hooks/useCurrentProfile";
import { isAuthenticated } from "../../lib/auth";
import { routesLinks } from "../../routes/index";
import type { RootState } from "../../store";
import SideBarLayout from "../navigation/SideBarLayout";

const RequireAuth = () => {
  const location = useLocation();
  const role = useSelector((state: RootState) => state.auth.role) ?? "";
  const { profile: user, loading } = useCurrentProfile();

  if (!isAuthenticated()) {
    return (
      <Navigate to={routesLinks.login} replace state={{ from: location }} />
    );
  }

  if (loading) {
    return <Spinner />;
  }

  const shouldRenderSidebar = role && user;
  // Keeps the sidebar in place while a page waits for its data.
  const page = (
    <Suspense fallback={<Spinner />}>
      <Outlet />
    </Suspense>
  );

  return shouldRenderSidebar ? (
    <SideBarLayout role={role}>{page}</SideBarLayout>
  ) : (
    page
  );
};

export default RequireAuth;
