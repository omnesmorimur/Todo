import { useEffect, useState } from 'react'
import Button2 from '@/shared/ui/Button'
import styles from './KotletanPage.module.scss'

const SECRET_PATHS = ['kotletan']

const KotletanPage = () => {
  const [showSecret, setShowSecret] = useState(false)

  useEffect(() => {
    const path = window.location.pathname.split('/').pop()?.toLowerCase()

    if (path && SECRET_PATHS.includes(path)) {
      setShowSecret(true)
      window.history.replaceState({}, '', '/Todo/')
    }
  }, [])

  if (!showSecret) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Лёша сбрей усы и пойми гдеты))0)0</h1>



        <Button2
          variant="primary"
          size="medium"
          onClick={() => window.history.back()}
        >
          ← Смирись
        </Button2>
      </div>
    </div>
  )
}

export default KotletanPage