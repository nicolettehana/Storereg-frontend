import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Center, Spinner, Stack, useDisclosure } from "@chakra-ui/react";
import ScrollToTop from "./ScrollToTop";
import LogoutForm from "../../forms/auth/LogoutForm";
import { useFetchUsersProfile } from "../../hooks/userQueries";
import UsersSidebarDrawer from "../navigations/users/UsersSidebarDrawer";
import UsersSidebar from "../navigations/users/UsersSidebar";
import UsersNavbar from "../navigations/users/UsersNavbar";
import { useAuthContext } from "../auth/authContext";

const IssueRoutes = () => {
  // Disclosures
  const logoutModal = useDisclosure();
  const drawer = useDisclosure();

  // Auth
  const { role, isAuthLoading, logout } = useAuthContext();

  // Controlled query
  const profileQuery = useFetchUsersProfile({
    enabled: !isAuthLoading && role === "ISS",
  });

  // 1. Wait for auth restore
  if (isAuthLoading) {
    return (
      <Center minH="100dvh">
        <Spinner thickness="4px" size="xl" color="brand.600" />
      </Center>
    );
  }

  // 2. Not logged in
  if (!role) {
    return <Navigate to="/" replace />;
  }

  // 3. Wrong role
  if (role !== "ISS") {
    return <Navigate to="/" replace />;
  }

  // 4. Profile loading
  if (profileQuery.isPending) {
    return (
      <Center minH="100dvh">
        <Spinner thickness="4px" size="xl" color="brand.600" />
      </Center>
    );
  }

  // 5. Profile error → logout
  if (profileQuery.isError) {
    logout();
    return <Navigate to="/" replace />;
  }

  const profile = profileQuery?.data?.data;

  return (
    <>
      <ScrollToTop />
      <UsersSidebarDrawer isOpen={drawer.isOpen} onClose={drawer.onClose} />
      <LogoutForm isOpen={logoutModal.isOpen} onClose={logoutModal.onClose} />

      <Stack minH="100dvh" justifyContent="space-between" spacing={8}>
        <Stack direction="row" spacing={0}>
          <UsersSidebar profile={profile} />
          <Stack spacing={4} w="full" ml={{ base: 0, lg: 64 }}>
            <UsersNavbar
              onOpen={drawer.onOpen}
              openLogout={logoutModal.onOpen}
              profile={profile}
            />
            <Outlet />
            <div />
          </Stack>
        </Stack>
        {/* Footer Here */}
      </Stack>
    </>
  );
};

export default IssueRoutes;
