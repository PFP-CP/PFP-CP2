import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { sendVerificationEmail } from '@/app/(main_page)/actions/profile'
import VerifyEmail from './VerifyEmail'

export default async function VerifyPage() {
    const cookieStore = await cookies()
    const email = cookieStore.get('user_email')?.value
    if (!email) redirect('/authentication')

    const result = await sendVerificationEmail(email)
    if (result.alreadyVerified) redirect('/home')

    return <VerifyEmail email={email} initialCodeSent={result.success} initialError={result.error} />
}
