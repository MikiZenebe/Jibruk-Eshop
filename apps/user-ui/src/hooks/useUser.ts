import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";

interface UserType {
  name: string;
}

// Fetch user data from API
const fetchUser = async () => {
  const res = await axiosInstance.get("/api/logged-in-user");
  return res.data.user;
};

const useUser = () => {
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery<UserType>({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return { user, isLoading, isError, refetch };
};

export default useUser;
