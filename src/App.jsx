import { Route, Routes } from "react-router-dom";
import GuestRoutes from "./components/routes/GuestRoutes";
import SADRoutes from "./components/routes/SADRoutes";
import AuthRoutes from "./components/routes/AuthRoutes";
import NotFoundPage from "./pages/notFound/NotFoundPage";
import HomePage from "./pages/home/HomePage";
import RegisterPage from "./pages/auth/register/RegisterPage";
import UserRoutes from "./components/routes/UserRoutes";
import UserDashboardPage from "./pages/user/dashboard/UserDashboardPage";
import UserCreateApplicationPage from "./pages/user/dashboard/create/UserCreateApplicationPage";
import ContactUsPage from "./pages/contactUs/ContactUsPage";
import UserProfilePage from "./pages/user/profile/UserProfilePage";
import ApplicationDetailsPage from "./pages/user/dashboard/details/ApplicationDetailsPage";
import CHRoutes from "./components/routes/CHRoutes";
import CHDashboardPage from "./pages/ch/dashboard/CHDashboardPage";
import WaitingListPage from "./pages/ch/waitingList/WaitingListPage";
import QuartersPage from "./pages/ch/quarters/QuartersPage";
import CHAllApplications from "./pages/ch/allApplications/CHAllApplications";
import ESTRoutes from "./components/routes/ESTRoutes";
import ESTInboxPage from "./pages/est/inbox/ESTInboxPage";
import AllotmentsPage from "./pages/ch/allotments/AllotmentsPage";
import OccupantsPage from "./pages/est/occupants/OccupantsPage";
import EstQuartersPage from "./pages/est/quarters/EstQuartersPage";
import ESTManagePage from "./pages/est/manage/ESTManagePage";
import VacateRequestPage from "./pages/user/vacate/VacateRequestPage";
import VacatedPage from "./pages/est/vacated/VacatedPage";
import ESTVacateRequestPage from "./pages/est/vacateRequest/ESTVacateRequestPage";
import PublishedListsPage from "./pages/ch/publishedLists/PublishedListsPage";
import ArchivedPublishedListPage from "./pages/ch/publishedLists/archived/ArchivedPublishedListPage";
import ManualPage from "./pages/manual/ManualPage";
import PrivacyPolicyPage from "./pages/privacyPolicy/PrivacyPolicyPage";
import LegacyWaitingListPage from "./pages/waitingList/LegacyWaitingListPage";
import VerifyOtpPage from "./pages/auth/verifyOtp/VerifyOtpPage";
import AdminRoutes from "./components/routes/AdminRoutes";
import AdminManageUsersPage from "./pages/admin/manageUsers/AdminManageUsersPage";
import AdminLogsPage from "./pages/admin/adminLogs/AdminLogsPage";
import CreateQuartersPage from "./pages/est/quarters/CreateQuartersPage";
import UpdateQuartersPage from "./pages/est/quarters/UpdateQuartersPage";
import ForgotPasswordPage from "./pages/auth/forgotPassword/ForgotPasswordPage";
import VerifyFPOtpPage from "./pages/auth/forgotPassword/verify-otp/VerifyFPOtpPage";
import YearRangePage from "./pages/sad/YearRangePage";
import ItemsPage from "./pages/sad/items/ItemsPage";
import FirmsPage from "./pages/sad/firms/FirmsPage";
import CreateFirmsPage from "./pages/sad/firms/CreateFirmsPage";
import CreateItemsPage from "./pages/sad/items/CreateItemsPage";
import RatesPage from "./pages/sad/rates/RatesPage";
import CreateRatesPage from "./pages/sad/rates/CreateRatesPage";
import AddApprovedFirmsPage from "./pages/sad/firms/AddApprovedFirmsPage";
import PurchasePage from "./pages/sad/purchase/PurchasePage";
import CreatePurchasePage from "./pages/sad/purchase/CreatePurchasePage";
import IssuePage from "./pages/sad/issue/IssuePage";
import CreateIssuePage from "./pages/sad/issue/CreateIssuePage";
import DashboardPage from "./pages/sad/DashboardPage";
import CategoryPage from "./pages/sad/category/CategoryPage";
import LedgerPage from "./pages/sad/ledger/LedgerPage";

const App = () => {
  return (
    <Routes>
      {/* GUEST ROUTES **********************************************************/}
      <Route path="/" element={<GuestRoutes />}>
        <Route index element={<HomePage />} />
        <Route path="contact-us" element={<ContactUsPage />} />
        <Route path="manual" element={<ManualPage />} />
        <Route path="waiting-list" element={<LegacyWaitingListPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
      </Route>

      {/* AUTH ROUTES ***********************************************************/}
      <Route path="/auth" element={<AuthRoutes />}>
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify-otp" element={<VerifyOtpPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="forgot-password/verify-otp"
          element={<VerifyFPOtpPage />}
        />
      </Route>

      {/* USER ROUTES ***********************************************************/}
      <Route path="/user" element={<UserRoutes />}>
        {/* Dashboard */}
        <Route path="dashboard" element={<UserDashboardPage />} />
        <Route path="vacate" element={<VacateRequestPage />} />
        <Route
          path="dashboard/create"
          element={<UserCreateApplicationPage />}
        />
        <Route
          path="dashboard/details"
          element={<ApplicationDetailsPage role="USER" />}
        />

        {/* Profile */}
        <Route path="profile" element={<UserProfilePage />} />
      </Route>

      {/* SAD ROUTES *******************************************************/}
      <Route path="/sad" element={<SADRoutes />}>
        {/* Dashboard */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="year-range" element={<YearRangePage />} />
        <Route path="items" element={<ItemsPage />} />
        <Route path="firms" element={<FirmsPage />} />
        <Route path="firms/create" element={<CreateFirmsPage />} />
        <Route path="items/create" element={<CreateItemsPage />} />
        <Route path="rates" element={<RatesPage />} />
        <Route path="rates/create" element={<CreateRatesPage />} />
        <Route path="purchase" element={<PurchasePage />} />
        <Route path="purchase/create" element={<CreatePurchasePage />} />
        <Route path="issue" element={<IssuePage />} />
        <Route path="issue/create" element={<CreateIssuePage />} />
        <Route path="category" element={<CategoryPage />} />
        <Route path="ledger" element={<LedgerPage />} />
        <Route
          path="firms/add-approved-firm"
          element={<AddApprovedFirmsPage />}
        />
        <Route
          path="dashboard/details"
          element={<ApplicationDetailsPage role="CH" />}
        />

        {/* Waiting list */}
        <Route path="waiting-lists" element={<WaitingListPage />} />
        <Route
          path="waiting-lists/details"
          element={
            <ApplicationDetailsPage role="CH" withAllotmentDetails={false} />
          }
        />

        {/* published-lists */}
        <Route path="published-lists" element={<PublishedListsPage />} />
        <Route
          path="published-lists/details"
          element={<ApplicationDetailsPage role="CH" />}
        />
        <Route
          path="published-lists/archived"
          element={<ArchivedPublishedListPage />}
        />

        {/* Pending Allotments */}
        <Route path="pending-allotments" element={<AllotmentsPage />} />

        {/* All Applications */}
        <Route path="applications" element={<CHAllApplications />} />
        <Route
          path="applications/details"
          element={<ApplicationDetailsPage role="CH" />}
        />

        {/* Quarters */}
        <Route path="quarters" element={<QuartersPage />} />

        {/* Profile */}
        <Route path="profile" element={<UserProfilePage />} />
      </Route>

      {/* CHAIRMAN ROUTES *******************************************************/}
      <Route path="/ch" element={<CHRoutes />}>
        {/* Dashboard */}
        <Route path="dashboard" element={<CHDashboardPage />} />
        <Route
          path="dashboard/details"
          element={<ApplicationDetailsPage role="CH" />}
        />

        {/* Waiting list */}
        <Route path="waiting-lists" element={<WaitingListPage />} />
        <Route
          path="waiting-lists/details"
          element={
            <ApplicationDetailsPage role="CH" withAllotmentDetails={false} />
          }
        />

        {/* published-lists */}
        <Route path="published-lists" element={<PublishedListsPage />} />
        <Route
          path="published-lists/details"
          element={<ApplicationDetailsPage role="CH" />}
        />
        <Route
          path="published-lists/archived"
          element={<ArchivedPublishedListPage />}
        />

        {/* Pending Allotments */}
        <Route path="pending-allotments" element={<AllotmentsPage />} />

        {/* All Applications */}
        <Route path="applications" element={<CHAllApplications />} />
        <Route
          path="applications/details"
          element={<ApplicationDetailsPage role="CH" />}
        />

        {/* Quarters */}
        <Route path="quarters" element={<QuartersPage />} />

        {/* Profile */}
        <Route path="profile" element={<UserProfilePage />} />
      </Route>

      {/* ESTATE OFFICER ROUTES *************************************************/}
      <Route path="/est" element={<ESTRoutes />}>
        {/* Dashboard */}
        <Route path="dashboard" element={<ESTInboxPage />} />
        <Route
          path="dashboard/details"
          element={<ApplicationDetailsPage role="EST" />}
        />

        {/* Vacate Request */}
        <Route path="vacate-requests" element={<ESTVacateRequestPage />} />

        {/* Quarters */}
        <Route path="quarters" element={<EstQuartersPage />} />
        <Route path="quarters/create" element={<CreateQuartersPage />} />
        <Route path="quarters/update" element={<UpdateQuartersPage />} />

        {/* Occupants */}
        <Route path="occupants" element={<OccupantsPage />} />

        {/* Vacated */}
        <Route path="vacated" element={<VacatedPage />} />

        {/* Manage Occupants */}
        <Route path="manage" element={<ESTManagePage />} />

        {/* Profile */}
        <Route path="profile" element={<UserProfilePage />} />
      </Route>

      {/* ADMIN ROUTES ******************************************************** */}
      <Route path="/admin" element={<AdminRoutes />}>
        {/* Dashboard */}
        <Route path="logs" element={<AdminLogsPage />} />

        {/* Manage Users */}
        <Route path="users" element={<AdminManageUsersPage />} />

        {/* Profile */}
        <Route path="profile" element={<UserProfilePage />} />
      </Route>

      {/* NOT FOUND *************************************************************/}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
