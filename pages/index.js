import { signIn, signOut, useSession } from 'next-auth/client'
import { useEffect } from 'react'
export default function Home() {
  const [session, loading] = useSession()

 

  return (
    <div>
      {!session && (
        <div>
          Not signed in <br />
          <button onClick={signIn}>Sign In with Google</button>
        </div>
      )}
      {session && (
        <div>
          Signed in as {session.user.email} <br />
          <button onClick={signOut}>Sign Out</button>
        </div>
      )}
    </div>
  )
}
