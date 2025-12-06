import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../../lib/auth";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { routesLinks } from "../../routes/index";
import SideBarLayout from "../sidebar/SideBarLayout";
import Spinner from "../wrappers/Spinner";
import { useCurrentUser } from "../../hooks/useCurerentUser";

const RequireAuth = () => {
  const location = useLocation();
  const role = useSelector((state: RootState) => state.auth.role) ?? "";
  const { freelancerProfile, clientProfile, loading } = useCurrentUser();
  const user = role === "Client" ? clientProfile : freelancerProfile;

  if (loading) {
    return <Spinner />;
  }

  if (!isAuthenticated()) {
    return (
      <Navigate to={routesLinks.login} replace state={{ from: location }} />
    );
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
