import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import VerifyEmail from './VerifyEmail'

export default async function VerifyPage() {
    const cookieStore = await cookies()
    const email = cookieStore.get('user_email')?.value
    if (!email) redirect('/authentication')

    return <VerifyEmail email={email} />
}
