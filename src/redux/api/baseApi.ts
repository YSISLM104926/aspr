import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://aspr-b.vercel.app',
    }),
    tagTypes: ['CDatas', 'ADatas'],
    endpoints: (builder) => ({
        getCategory: builder.query({
            query: () => `/categories`,
            providesTags: ['CDatas'],
        }),
        addCategory: builder.mutation({
            query: (payload) => ({
                url: `/categories`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['CDatas'],
        }),

        getAnimal: builder.query({
            query: ({ name }) => {
                console.log("Name parameter:", name); // Print the name parameter to the console
                return `/animal?selectedName=${name}`;
            },
            providesTags: ['ADatas'],
        }),
        addAnimal: builder.mutation({
            query: (payload) => ({
                url: `/animal`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['ADatas'],
        }),
    }),
});

export const {
    useGetCategoryQuery,
    useAddCategoryMutation,
    useGetAnimalQuery,
    useAddAnimalMutation,
} = baseApi;