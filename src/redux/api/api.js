import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../components/constants/config"
import Chat from "../../pages/Chat";
const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
    endpoints: (builder) => ({
        myChats: builder.query({
            query: () => ({
                url: "chat/my",
                credentials: "include",
            }),
            providedTags: ["Chat"],
        }),
        searchUser: builder.query({
            query: (name) => ({
                url: `user/searchUser/?name=${name}`,
                credentials: "include",
            }),
            providedTags:["User"],
        }),
        sendFriendRequest: builder.mutation({
            query: (data) =>({
                url: `user/sendrequest/`,
                method: "PUT",
                credentials:"include",
                body:data,
            }),
            invalidatesTags: ["User"],
        }),
        getNotifications: builder.query({
            query: () =>({
                url: `user/notifications`,
                credentials:"include",
            }),
            keepUnusedDataFor: 0,
        }),
        acceptFriendRequest: builder.mutation({
            query: (data) =>({
                url: `user/acceptrequest`,
                method: "PUT",
                credentials:"include",
                body:data,
            }),
            invalidatesTags: ["Chat"],
        }),
        chatDetails: builder.query({
            query: ({chatId, populate = false}) => {
                let url = `chat/${chatId}`;
                if(populate) url+="?populate=true";
                return{
                    url,
                    credentials: "include",
                };
            },
            providesTags:["Chat"],
        }),

    }),

});

export default api;
export const { useMyChatsQuery, useLazySearchUserQuery, useSendFriendRequestMutation, useGetNotificationsQuery, useAcceptFriendRequestMutation, useChatDetailsQuery} = api; 