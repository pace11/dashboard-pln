import Cookies from 'js-cookie'
import { useState } from 'react'
import useSWR from 'swr'

const fetcher = (...args) =>
  fetch(...args, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token_db_pln')}`,
    },
  }).then((res) => res.json())

export const HookSwr = ({ path, query }) => {
  const [params, setParams] = useState(query || '')

  const { data, error, mutate, isValidating } = useSWR(
    `${process.env.NEXT_PUBLIC_API}${path || `/user/me`}${params}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  const reloadData = (queryParams = '') => {
    setParams(queryParams)
    mutate()
  }

  return {
    data: data || null,
    isLoading: isValidating,
    isError: error,
    reloadData,
  }
}
