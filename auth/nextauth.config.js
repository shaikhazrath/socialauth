import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import connectDB from '../../db' // Path to the db.js file

connectDB()

const options = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Add other providers here
  ],
  callbacks: {
    async signIn(user, account, profile) {
      const newUser = {

        name: profile.name,
        email: profile.email,
        image: profile.image,
      }
      
      try {
        await User.findOneAndUpdate({ email: newUser.email }, newUser, {
          upsert: true,
          setDefaultsOnInsert: true,
        })
      } catch (error) {
        console.error('Error saving user:', error.message)
        return false
      }

      return true
    },
  },
}

export default (req, res) => NextAuth(req, res, options)
