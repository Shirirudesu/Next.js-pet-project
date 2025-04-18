import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const PetPage = () => {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const handleDelete = async () => {
    const petID = router.query.id

    try {
      await fetch(`/api/pets/${petID}`, {
        method: 'Delete',
      })
      router.push('/')
    } catch (error) {
      setMessage('Failed to delete the pet.')
    }
  }

  return (
    <div>
    </div>
  )
}

export default PetPage
