import { submitVote } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { pollId, stateCode, voteType } = req.body

    // Validate input
    if (!pollId || !stateCode || !voteType) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (!['yes', 'no', 'depends'].includes(voteType)) {
      return res.status(400).json({ error: 'Invalid vote type' })
    }

    // Get user data
    const userData = {
      ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    }

    // Submit vote to Supabase
    const result = await submitVote(pollId, stateCode, voteType, userData)

    if (result.error) {
      return res.status(500).json({ error: result.error.message })
    }

    return res.status(200).json({
      success: true,
      message: 'Vote submitted successfully',
      newStateResults: result.newStateResults
    })

  } catch (error) {
    console.error('Error in vote API:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
