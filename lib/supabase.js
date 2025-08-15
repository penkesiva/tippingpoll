import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to get current poll results by state
export async function getCurrentPollResults() {
  const { data: currentPoll, error: pollError } = await supabase
    .from('polls')
    .select('*')
    .eq('is_active', true)
    .single()

  if (pollError) {
    console.error('Error fetching current poll:', pollError)
    return null
  }

  const { data: stateResults, error: stateError } = await supabase
    .from('state_votes')
    .select('*')
    .eq('poll_id', currentPoll.id)

  if (stateError) {
    console.error('Error fetching state results:', stateError)
    return null
  }

  return {
    poll: currentPoll,
    stateResults: stateResults
  }
}

// Helper function to submit a vote
export async function submitVote(pollId, stateCode, voteType, userData = {}) {
  // First, update the state_votes table
  const { data: stateVote, error: stateError } = await supabase
    .from('state_votes')
    .select('*')
    .eq('poll_id', pollId)
    .eq('state_code', stateCode)
    .single()

  if (stateError) {
    console.error('Error fetching state vote:', stateError)
    return { error: stateError }
  }

  // Calculate new vote counts
  const newYesVotes = stateVote.yes_votes + (voteType === 'yes' ? 1 : 0)
  const newNoVotes = stateVote.no_votes + (voteType === 'no' ? 1 : 0)
  const newDependsVotes = stateVote.depends_votes + (voteType === 'depends' ? 1 : 0)
  const newTotalVotes = newYesVotes + newNoVotes + newDependsVotes

  // Update state_votes table
  const { error: updateError } = await supabase
    .from('state_votes')
    .update({
      yes_votes: newYesVotes,
      no_votes: newNoVotes,
      depends_votes: newDependsVotes,
      total_votes: newTotalVotes,
      updated_at: new Date().toISOString()
    })
    .eq('poll_id', pollId)
    .eq('state_code', stateCode)

  if (updateError) {
    console.error('Error updating state votes:', updateError)
    return { error: updateError }
  }

  // Insert user vote record
  const { error: userVoteError } = await supabase
    .from('user_votes')
    .insert({
      poll_id: pollId,
      state_code: stateCode,
      vote_type: voteType,
      ip_address: userData.ipAddress,
      user_agent: userData.userAgent
    })

  if (userVoteError) {
    console.error('Error inserting user vote:', userVoteError)
    // Don't fail the whole operation if user vote tracking fails
  }

  // Update total votes in polls table
  const { error: pollUpdateError } = await supabase
    .from('polls')
    .update({ total_votes: currentPoll.total_votes + 1 })
    .eq('id', pollId)

  if (pollUpdateError) {
    console.error('Error updating poll total:', pollUpdateError)
    // Don't fail the whole operation if poll update fails
  }

  return {
    success: true,
    newStateResults: {
      yes_votes: newYesVotes,
      no_votes: newNoVotes,
      depends_votes: newDependsVotes,
      total_votes: newTotalVotes
    }
  }
}
