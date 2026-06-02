import { useState, useEffect } from 'react'
import styles from './Toast.module.css'

let toastFn = null

export function showToast(message, type = 'success') {
  if (toastFn) toastFn(message, type)
}

export default function Toast() {
  const [toast, setToast] = useState(null)

  useEffect(() => {
    toastFn = (message, type) => {
      setToast({ message, type })
      setTimeout(() => setToast(null), 3000)
    }
    return () => { toastFn = null }
  }, [])

  if (!toast) return null

  return (
    <div className={`${styles.toast} ${styles[toast.type]}`}>
      <i className={`ti ${toast.type === 'success' ? 'ti-check' : 'ti-alert-circle'}`} />
      {toast.message}
    </div>
  )
}
