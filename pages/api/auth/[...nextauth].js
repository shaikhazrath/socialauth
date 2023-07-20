import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import connectDB from '@/db'
import User from '@/models/User'
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
      console.log(profile)
      try {
        const existingUser = await User.findOne({ email: profile.email })

        if (existingUser) {
          // Update user data if already exists
          existingUser.name = profile.name
          existingUser.image = profile.picture
          await existingUser.save()
        } else {
          // Create new user if not found
          const newUser = new User({
            name: profile.name,
            email: profile.email,
            image: profile.picture,
          })
          await newUser.save()
        }
      } catch (error) {
        console.error('Error saving user:', error.message)
        return false
      }

      return true
    },
  },
}

export default (req, res) => NextAuth(req, res, options)
