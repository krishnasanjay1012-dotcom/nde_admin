import axios from "axios";
import toast from "react-hot-toast";

const  REACT_APP_LOGIN_URL = "https://api.nowdigitaleasy.com/auth/v1"

const useCurrentSteps = () => {
  const currentStep = async ({
    routeName,
    routePath,
    isCompleted,
    nextPath,
    isSetUpCompleted,
    selectedApplications
  }) => {
    const payload = {
      routeName,
      routePath,
      isCompleted,
      nextPath,
      currentRoute: nextPath,
      ...(isSetUpCompleted !== undefined && { isSetUpCompleted }),
      ...(selectedApplications?.length > 0 && { selectedApplications })
    };
    try {
      await axios.put(`${REACT_APP_LOGIN_URL}/setup`, payload);
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong");
      return false;
    }
  };

  return { currentStep };
};

export default useCurrentSteps;
