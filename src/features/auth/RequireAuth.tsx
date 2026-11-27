import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";

import SideBarLayout from "../../components/sidebar/SideBarLayout";
import Spinner from "../../components/ui/Spinner";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { isAuthenticated } from "../../lib/auth";
import { routesLinks } from "../../routes/index";
import type { RootState } from "../../store";

const RequireAuth = () => {
  const location = useLocation();
  const role = useSelector((state: RootState) => state.auth.role) ?? "";
  const { freelancerProfile, clientProfile, loading } = useCurrentUser();
  const user = role === "Client" ? clientProfile : freelancerProfile;

  if (!isAuthenticated()) {
    return (
      <Navigate to={routesLinks.login} replace state={{ from: location }} />
    );
  }

  if (loading) {
    return <Spinner />;
  }

  const shouldRenderSidebar = role && user;

  return shouldRenderSidebar ? (
    <SideBarLayout role={role}>
      <Outlet />
    </SideBarLayout>
  ) : (
    <Outlet />
  );
};

export default RequireAuth;
