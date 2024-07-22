/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react'

import { useQueriesMutation } from './useQueriesMutation'

export const useDownloadFile = () => {
  const [data, setData] = useState({
    data: [],
    fileName: '',
  })
  const { useMutate, isLoadingSubmit } = useQueriesMutation({})

  const downloadFile = async ({
    prefixUrl = '',
    method = 'GET',
    fileName = '',
    mappingData = [],
    exportDownload,
    params = {},
  }) => {
    let normalizeData = []

    const response = await useMutate({
      prefixUrl,
      method,
      params,
    })

    if (response?.success) {
      const download = await exportDownload(response?.data)

      if (mappingData.length > 0) {
        mappingData.forEach((element, idx) => {
          normalizeData = normalizeData.concat({
            columns: element?.columns,
            data:
              idx === mappingData.length - 1 ? download?.reports : [],
          })
        })
      }

      setData({
        ...data,
        data: normalizeData,
        fileName,
      })

      setTimeout(() => {
        setData({
          ...data,
          data: [],
          fileName: '',
        })
      }, 500)
    }
  }

  return { downloadFile, ...data, isLoading: isLoadingSubmit }
}
