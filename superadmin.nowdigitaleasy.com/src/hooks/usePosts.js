import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = "https://jsonplaceholder.typicode.com";

 const fetchPosts = async ({queryKey}) => {
  const {page,limit} = queryKey[1]
  const { data } = await axios.get(`${API_BASE}/posts`, {
    params: { _page: page, _limit: limit }
  });
  return data;
};

export const usePosts = (page, limit) => {
  return useQuery({
    queryKey: ["posts",{page,limit}],
    queryFn:fetchPosts,
    keepPreviousData: true, 
  });
};
