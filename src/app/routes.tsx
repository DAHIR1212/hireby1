import { createBrowserRouter } from "react-router";
import RootLayout from "./components/RootLayout.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import Splash from "./components/Splash.tsx";
import Landing from "./components/Landing.tsx";
import RoleSelection from "./components/RoleSelection.tsx";
import Login from "./components/Login.tsx";
import OTPVerification from "./components/OTPVerification.tsx";
import ProfileSetup from "./components/ProfileSetup.tsx";
import Home from "./components/Home.tsx";
import ServiceListing from "./components/ServiceListing.tsx";
import ServiceMap from "./components/ServiceMap.tsx";
import ServiceDetail from "./components/ServiceDetail.tsx";
import BookingConfirmation from "./components/BookingConfirmation.tsx";
import Payment from "./components/Payment.tsx";
import PaymentSuccess from "./components/PaymentSuccess.tsx";
import BookingTracking from "./components/BookingTracking.tsx";
import MyBookings from "./components/MyBookings.tsx";
import Profile from "./components/Profile.tsx";
import ProviderOnboarding from "./components/ProviderOnboarding.tsx";
import ProviderDashboard from "./components/ProviderDashboard.tsx";
import BookingRequest from "./components/BookingRequest.tsx";
import ActiveJob from "./components/ActiveJob.tsx";
import JobComplete from "./components/JobComplete.tsx";
import Chat from "./components/Chat.tsx";
import Notifications from "./components/Notifications.tsx";
import EditProfile from "./components/EditProfile.tsx";
import ManageAddresses from "./components/ManageAddresses.tsx";
import PrivacySecurity from "./components/PrivacySecurity.tsx";
import HelpSupport from "./components/HelpSupport.tsx";
import RateService from "./components/RateService.tsx";
import ProviderEarnings from "./components/ProviderEarnings.tsx";
import BookingDetail from "./components/BookingDetail.tsx";
import ProviderProfilePage from "./components/ProviderProfilePage.tsx"; // ✅ Real Firestore version
import Settings from "./components/Settings.tsx";
import Favorites from "./components/Favorites.tsx";
import SearchResults from "./components/SearchResults.tsx";
import Onboarding from "./components/Onboarding.tsx";
import About from "./components/About.tsx";
import Terms from "./components/Terms.tsx";
import PrivacyPolicy from "./components/PrivacyPolicy.tsx";
import QuickHelp from "./components/QuickHelp.tsx";
import ProviderJobs from "./components/ProviderJobs.tsx";
import ProviderSkillSelection from "./components/ProviderSkillSelection.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, Component: Splash },
      { path: "landing", Component: Landing },
      { path: "role-selection", Component: RoleSelection },
      { path: "login", Component: Login },
      { path: "otp-verification", Component: OTPVerification },
      { path: "profile-setup", Component: ProfileSetup },
      { path: "home", Component: Home },
      { path: "services", Component: ServiceListing },
      { path: "map", Component: ServiceMap },
      { path: "service/:id", Component: ServiceDetail },
      { path: "booking-confirmation", Component: BookingConfirmation },
      { path: "payment", Component: Payment },
      { path: "payment-success", Component: PaymentSuccess },
      { path: "booking-tracking", Component: BookingTracking },
      { path: "my-bookings", Component: MyBookings },
      { path: "profile", Component: Profile },
      { path: "provider-onboarding", Component: ProviderOnboarding },
      { path: "provider-dashboard", Component: ProviderDashboard },
      { path: "booking-request", Component: BookingRequest },
      { path: "active-job", Component: ActiveJob },
      { path: "job-complete", Component: JobComplete },
      { path: "chat", Component: Chat },
      { path: "notifications", Component: Notifications },
      { path: "edit-profile", Component: EditProfile },
      { path: "manage-addresses", Component: ManageAddresses },
      { path: "privacy-security", Component: PrivacySecurity },
      { path: "help-support", Component: HelpSupport },
      { path: "rate-service/:id", Component: RateService },
      { path: "provider-earnings", Component: ProviderEarnings },
      { path: "booking-detail/:id", Component: BookingDetail },
      { path: "provider-profile/:id", Component: ProviderProfilePage }, // ✅ Fixed! Now uses real Firestore data
      { path: "provider-profile-page", Component: Profile }, // Worker side profile
      { path: "settings", Component: Settings },
      { path: "favorites", Component: Favorites },
      { path: "search-results", Component: SearchResults },
      { path: "onboarding", Component: Onboarding },
      { path: "about", Component: About },
      { path: "terms", Component: Terms },
      { path: "privacy-policy", Component: PrivacyPolicy },
      { path: "quick-help/:topic", Component: QuickHelp },
      { path: "provider-jobs", Component: ProviderJobs },
      { path: "provider-skill-selection", Component: ProviderSkillSelection },
    ],
  },
]);