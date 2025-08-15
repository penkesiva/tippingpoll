import { getCurrentPollResults } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const results = await getCurrentPollResults()

    if (!results) {
      return res.status(500).json({ error: 'Failed to fetch poll results' })
    }

    return res.status(200).json(results)

  } catch (error) {
    console.error('Error in poll-results API:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
