// components/ProtectedRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../redux/selectors/authSelectors";
import { useRouter } from "expo-router";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(auth)/welcome");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return children;
};

export default ProtectedRoute;
