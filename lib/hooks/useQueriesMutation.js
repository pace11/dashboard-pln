/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import { notification } from 'antd'
import Axios from 'axios'
import Cookies from 'js-cookie'
import { useCallback, useEffect, useState } from 'react'

/**
 *
 * @param {Boolean} param.enabled
 * @param {String} param.prefixUrl
 * @param {Boolean} param.isShowPopupSuccess
 * @param {Function} callback
 */
export const useQueriesMutation = ({
  enabled = true,
  prefixUrl = '',
  isShowPopupSuccess = false,
} = {}) => {
  const [data, setData] = useState({
    data: null,
    isLoading: false,
  })
  const [isLoadingSubmit, setLoadingSubmit] = useState(false)

  /**
   *
   * @param {String} param.url
   */
  const fetchingData = useCallback(
    async ({ prefixUrl = '' } = {}) => {
      setData({ ...data, isLoading: true })
      try {
        const response = await Axios({
          method: 'GET',
          url: `${process.env.NEXT_PUBLIC_API}${prefixUrl}`,
          headers: {
            Authorization: `Bearer ${Cookies.get('token_db_pln')}`,
          },
        })

        if (isShowPopupSuccess) {
          notification.success({
            message: 'Info',
            description: response?.data?.message,
            duration: 1,
          })
        }

        setData({
          ...data,
          data: response?.data,
          isLoading: false,
        })
      } catch (error) {
        setData({ ...data, isLoading: false })

        if ([404].includes(err?.response?.status)) {
          notification.warning({
            message: err?.response?.data?.message,
            description: err?.response?.statusText,
            duration: 1,
          })
        }

        if ([500].includes(err?.response?.status)) {
          notification.error({
            message: 'Error',
            description: err?.response?.statusText,
            duration: 1,
          })
        }
      }
    },
    [],
  )

  /**
   *
   * @param {String} param.url
   * @param {String} param.method
   * @param {Object} param.payload
   */
  const useMutate = useCallback(
    async ({
      prefixUrl = '',
      method = 'POST',
      payload = {},
      isFormData = false,
      durationPopupError = 1,
    } = {}) => {
      setLoadingSubmit(true)
      try {
        const response = await Axios({
          method,
          url: `${process.env.NEXT_PUBLIC_API}${prefixUrl}`,
          data: payload,
          headers: {
            Authorization: `Bearer ${Cookies.get('token_db_pln')}`,
            ...(isFormData && {
              'Content-Type': 'multipart/form-data',
            }),
          },
        })
        setLoadingSubmit(false)

        notification.success({
          message: 'Info',
          description: response?.data?.message,
          duration: 1,
        })

        return { ...response?.data }
      } catch (error) {
        setLoadingSubmit(false)
        const errorResponse = error?.response?.data || {}

        if ([400].includes(error?.response?.status)) {
          notification.warning({
            message: error?.response?.data?.message,
            description: JSON.stringify(error?.response?.data?.data),
            duration: durationPopupError,
          })
        }

        if ([500].includes(error?.response?.status)) {
          notification.error({
            message: 'Error',
            description: error?.response?.statusText,
            duration: durationPopupError,
          })
        }

        return { ...errorResponse }
      }
    },
    [],
  )

  useEffect(() => {
    if (enabled && !!prefixUrl) {
      fetchingData({ prefixUrl })
    }
  }, [enabled, prefixUrl])

  return { ...data, fetchingData, isLoadingSubmit, useMutate }
}
