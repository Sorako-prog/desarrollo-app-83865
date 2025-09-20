import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.EXPO_PUBLIC_RTDB_URL

export const ordersApi = createApi({
    reducerPath: 'ordersApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: 'orders.json',
                method: 'POST',
                body: order
            })
        }),
        getOrdersByUser: builder.query({
            query: (localId) => `orders.json?orderBy="user/localId"&equalTo="${localId}"`,
            transformResponse: (response) => {
                if (!response) return []
                const list = Object.entries(response).map(([id, data]) => ({ id, ...data }))
                return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            }
        })
    })
})

export const { useCreateOrderMutation, useGetOrdersByUserQuery } = ordersApi


