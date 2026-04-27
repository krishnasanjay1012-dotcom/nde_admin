import { useQuery } from "@tanstack/react-query";
import { getFreeSwitchData } from "../../services/freeSwitch/freeSwitch-service";

export const useFreeSwitchData = () => {
  return useQuery({
    queryKey: ["freeSwitchData"],
    queryFn: () => getFreeSwitchData(),
  });
};
