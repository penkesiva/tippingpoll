// Global variables
let pollResults = {
    yes: 0,
    no: 0,
    depends: 0
};

let currentPollIndex = 0;
let currentPollId = 1; // Default poll ID
let stateVoteData = {}; // Store state-specific vote data

// All tipping poll questions
const pollQuestions = [
    // Coffee & Cafés
    "Is a 20% tip justified for a simple drip coffee?",
    "Should you tip when there's no table service (counter pickup only)?",
    "Is it fair for cafés to prompt for tips before service?",
    "For a $5 latte, what feels right: $0 / $1 / $2 / 20%+?",
    "If a barista only pours brewed coffee, should the tip default be 0% / 10% / 15% / 20%?",
    
    // Restaurants & Dine-In
    "Should 20% be the standard tip for dine-in in 2025?",
    "If service is average, what do you leave: 10% / 15% / 18% / 20%+?",
    "Is auto-gratuity for large parties (18–22%) fair?",
    "Should tips be lower at lunch than dinner for similar service?",
    "Should restaurants replace tipping with higher menu prices (no tipping)?",
    
    // Takeout & Counter Service
    "Do you tip on takeout orders picked up at the counter?",
    "For curbside pickup, do you tip? Never / Sometimes / Always",
    "For fast-casual (you bus your table), do you tip?",
    "Should the POS tip prompt appear for takeout?",
    "For family-size takeout prepared carefully, do you tip $0 / $2 / $5 / 10%+?",
    
    // Delivery & Apps
    "Do you pre-tip food delivery?",
    "For delivery, what matters most: distance / speed / order size / weather?",
    "What's your typical delivery tip: $2 / $5 / 10% / 20%+?",
    "In bad weather, should tips be higher?",
    "If the order arrives late but complete, do you still tip the same?",
    
    // Bars & Nightlife
    "For cocktails, do you tip $1 / $2 / 20% / more per drink?",
    "Is $1 per beer still the norm?",
    "For a tasting flight, do you tip like table service?",
    "Should happy-hour discounts change your tip %?",
    "For bottle service, is auto-gratuity enough?",
    
    // Rideshare & Transport
    "Do you tip rideshare drivers every trip?",
    "What's your common rideshare tip: $0 / $1–2 / $3–5 / 15%+?",
    "Should airport runs get a higher tip?",
    "If the driver helps with bags, do you increase the tip?",
    "Do you tip scooter/bike unlock/assist staff if prompted?",
    
    // Hotels & Travel
    "Do you tip housekeeping per night?",
    "Do you tip valet both drop-off and pick-up, or once?",
    "For bellhop service, what's right per bag: $1 / $2 / $5?",
    "Should resort fees reduce the need to tip?",
    "Do you tip on room service if a service charge is already included?",
    
    // Personal Services
    "For haircuts, what's your norm: 10% / 15% / 20% / 25%+?",
    "Do you tip for barber quick trims (neck/edge)?",
    "For spa/massage, is 20% standard?",
    "Do you tip for chiropractic or PT sessions?",
    "Do you tip at nail salons per tech or on the total?",
    
    // Retail & "Non-Traditional" Tipping
    "Should tipping prompts appear at retail checkouts (no service added)?",
    "Do you tip at bakeries/ice-cream counters?",
    "Should grocery pickup workers be tipped?",
    "For pet grooming, what's your norm: $0 / $5 / 10% / 20%?",
    "Do you tip task apps/handyman beyond the quoted price?",
    
    // Ethics & Policy
    "Would you support abolishing tipping if wages rise accordingly?",
    "Is tipping more about service or social pressure?",
    "Should tips be pooled among staff?",
    "If staff are paid a living wage, should tipping be optional 0–10% max?",
    "Should service charges be clearly labeled and replace tips?",
    
    // Tech & UX of Tip Prompts
    "Should default POS buttons be lower (e.g., 10/15/18 instead of 18/20/25)?",
    "Do spin-iPad tip screens make you tip more than you planned?",
    "Should apps hide tip prompts until after service is delivered?",
    "Do you prefer flat $ or % tip options?",
    "Is suggested tip anchoring (high defaults) manipulative?",
    
    // Regional & Cultural
    "Should tip norms differ by state/city cost of living?",
    "Do you tip more when traveling to tourist areas?",
    "Should businesses post their tipping policy at the door?",
    "Do you adjust tips based on local minimum wage differences?",
    "Should U.S. tipping move closer to non-tipping countries' models?"
];

// Detailed facts for the "Did you know?" section
const tippingFacts = {
    "Tipping Culture Origins": [
        "The practice of tipping in the United States became widespread after the Civil War, influenced by European customs.",
        "In 17th-century England, \"to tip\" meant to give a small gift of money.",
        "Tipping in restaurants became common in the U.S. during the late 1800s, partly to avoid paying full wages to workers.",
        "The term \"tip\" is believed to have originated from the phrase \"To Insure Promptness.\""
    ],
    "Wage Laws by State": [
        "In the U.S., the federal tipped minimum wage is $2.13 per hour, unchanged since 1991.",
        "Some states, like California, require employers to pay tipped workers the full state minimum wage before tips.",
        "Seven U.S. states mandate the same minimum wage for tipped and non-tipped workers.",
        "States like Texas follow the federal tipped minimum wage of $2.13 per hour."
    ],
    "Global Perspective": [
        "In Japan, tipping is often considered rude and unnecessary.",
        "In many European countries, a service charge is included in the bill, making tipping optional.",
        "In Australia, tipping is not a major part of the culture due to higher wages for service workers.",
        "In Canada, tipping 15–20% at restaurants is customary.",
        "In some Middle Eastern countries, tipping is expected but often at lower percentages than in North America."
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Randomize the initial poll question
    randomizePollQuestion();
    
    initializePoll();
    // initializeMap(); // No longer needed - using React component
    initializeComments();
    initializeStoryModal();
    initializeFacts();
    loadCurrentPollResults(); // Load real data from Supabase
    
    // Initialize tipping calculator
    initializeTippingCalculator();
    
    // Initialize AI tipping advisor
    initializeAITippingAdvisor();

    // Initialize client-side routing
    initializeRouting();
    addRouteAttributes();
});

// Randomize the poll question
function randomizePollQuestion() {
    currentPollIndex = Math.floor(Math.random() * pollQuestions.length);
    const randomQuestion = pollQuestions[currentPollIndex];
    
    // Update the question display
    const pollQuestionElement = document.getElementById('pollQuestion');
    if (pollQuestionElement) {
        pollQuestionElement.textContent = randomQuestion;
    }
    
    console.log(`Randomized to question ${currentPollIndex + 1}: ${randomQuestion}`);
}

// Load current poll results from Supabase
async function loadCurrentPollResults() {
    try {
        const response = await fetch('/api/poll-results');
        if (!response.ok) {
            throw new Error('Failed to fetch poll results');
        }
        
        const data = await response.json();
        
        // Update current poll question (but keep our randomized question)
        if (data.poll) {
            // Don't override the randomized question from Supabase
            // currentPollId = data.poll.id;
        }
        
        // Update state vote data
        if (data.stateResults) {
            stateVoteData = {};
            data.stateResults.forEach(state => {
                stateVoteData[state.state_code] = {
                    yes: state.yes_votes,
                    no: state.no_votes,
                    depends: state.depends_votes,
                    total: state.total_votes
                };
            });
            
            // Update map colors based on real data
            // updateMapColorsFromRealData(); // REMOVED
            
            // Update global poll results
            updateGlobalPollResults();
        }
        
    } catch (error) {
        console.error('Error loading poll results:', error);
        // Fall back to default data if API fails
    }
}

// Update global poll results from state data
function updateGlobalPollResults() {
    let totalYes = 0, totalNo = 0, totalDepends = 0;
    
    Object.values(stateVoteData).forEach(state => {
        totalYes += state.yes;
        totalNo += state.no;
        totalDepends += state.depends;
    });
    
    pollResults = {
        yes: totalYes,
        no: totalNo,
        depends: totalDepends
    };
    
    updatePollResults();
}

// Initialize poll functionality
function initializePoll() {
    const pollButtons = document.querySelectorAll('.poll-btn');
    
    pollButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all buttons
            pollButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Add selected class to clicked button
            this.classList.add('selected');
            
            // Get vote type from button class
            const voteType = this.classList.contains('yes-btn') ? 'yes' : 
                           this.classList.contains('no-btn') ? 'no' : 'depends';
            
            // Submit vote to Supabase
            submitVoteToSupabase(voteType);
        });
    });
}

// Submit vote to Supabase via API
async function submitVoteToSupabase(voteType) {
    try {
        // Get user's state (you can implement IP geolocation or ask user)
        const userState = await getUserState();
        
        const response = await fetch('/api/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pollId: currentPollId,
                stateCode: userState,
                voteType: voteType
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to submit vote');
        }
        
        const result = await response.json();
        
        if (result.success) {
            // Update local state data
            if (stateVoteData[userState]) {
                stateVoteData[userState][voteType]++;
                stateVoteData[userState].total++;
                
                // Update the specific state on the map
                // updateStateOnMap(userState); // REMOVED
                
                // Update global results
                pollResults[voteType]++;
                updatePollResults();
            }
            
            showVoteSuccess();
        }
        
    } catch (error) {
        console.error('Error submitting vote:', error);
        showVoteError();
    }
}

// Get user's state (simplified - you can enhance this with IP geolocation)
async function getUserState() {
    // For now, return a default state. In production, you could:
    // 1. Use IP geolocation service
    // 2. Ask user to select their state
    // 3. Use browser location API (with permission)
    return 'CA'; // Default to California
}

// Show vote success message
function showVoteSuccess() {
    // You can implement a toast notification here
    console.log('Vote submitted successfully!');
}

// Show vote error message
function showVoteError() {
    // You can implement an error notification here
    console.error('Failed to submit vote');
}

// Poll functionality
function updatePollResults() {
    const total = pollResults.yes + pollResults.no + pollResults.depends;
    const yesPercent = Math.round((pollResults.yes / total) * 100);
    const noPercent = Math.round((pollResults.no / total) * 100);
    const dependsPercent = Math.round((pollResults.depends / total) * 100);
    
    // Update the single horizontal bar with split colors
    const yesFill = document.querySelector('.yes-fill');
    const noFill = document.querySelector('.no-fill');
    const dependsFill = document.querySelector('.depends-fill');
    
    // Position the fills to create a single bar
    yesFill.style.width = yesPercent + '%';
    yesFill.style.left = '0%';
    
    noFill.style.width = noPercent + '%';
    noFill.style.left = yesPercent + '%';
    
    dependsFill.style.width = dependsPercent + '%';
    dependsFill.style.left = (yesPercent + noPercent) + '%';
    
    // Update percentage displays
    document.querySelectorAll('.result-percentage')[0].textContent = yesPercent + '%';
    document.querySelectorAll('.result-percentage')[1].textContent = noPercent + '%';
    document.querySelectorAll('.result-percentage')[2].textContent = dependsPercent + '%';
}

// Facts functionality
function initializeFacts() {
    updateRandomFacts();
}

function updateRandomFacts() {
    const categories = Object.keys(tippingFacts);
    
    categories.forEach((category, index) => {
        const facts = tippingFacts[category];
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        
        // Update the content
        document.getElementById(`fact${index + 1}-content`).textContent = randomFact;
    });
}

function simulateOtherVotes() {
    // Simulate random votes from other users
    const options = ['yes', 'no', 'depends'];
    const randomOption = options[Math.floor(Math.random() * options.length)];
    pollResults[randomOption]++;
    updatePollResults();
}

function nextPoll() {
    // Randomize to a different question (avoid repeating the current one)
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * pollQuestions.length);
    } while (newIndex === currentPollIndex && pollQuestions.length > 1);
    
    currentPollIndex = newIndex;
    
    // Update the question
    document.getElementById('pollQuestion').textContent = pollQuestions[currentPollIndex];
    
    // Reset poll results to random values
    pollResults = {
        yes: Math.floor(Math.random() * 30) + 20,
        no: Math.floor(Math.random() * 30) + 30,
        depends: Math.floor(Math.random() * 20) + 10
    };
    
    // Update results display
    updatePollResults();
    
    // Reset button selections
    document.querySelectorAll('.poll-btn').forEach(btn => btn.classList.remove('selected'));
    
    // Update map colors based on new results
    // updateMapColors(); // REMOVED
    
    // Update facts with new random selections
    updateRandomFacts();
    
    console.log(`Randomized to question ${currentPollIndex + 1}: ${pollQuestions[currentPollIndex]}`);
}

// Comments functionality
function initializeComments() {
    initializeCommentActions();
    initializeCommentFilters();
    initializeCommentSystem(); // Initialize the new comment system
}

function initializeCommentFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the filter type
            const filterType = this.dataset.filter;
            filterComments(filterType);
        });
    });
}

function filterComments(filterType) {
    const comments = Array.from(document.querySelectorAll('.comment'));
    
    switch(filterType) {
        case 'recent':
            // Sort by timestamp (newest first)
            comments.sort((a, b) => {
                const timeA = new Date(a.dataset.timestamp);
                const timeB = new Date(b.dataset.timestamp);
                return timeB - timeA;
            });
            break;
            
        case 'liked':
            // Sort by likes (highest first)
            comments.sort((a, b) => {
                const likesA = parseInt(a.dataset.likes);
                const likesB = parseInt(b.dataset.likes);
                return likesB - likesA;
            });
            break;
            
        case 'discussed':
            // Sort by total engagement (likes + dislikes, highest first)
            comments.sort((a, b) => {
                const engagementA = parseInt(a.dataset.likes) + parseInt(a.dataset.dislikes);
                const engagementB = parseInt(b.dataset.likes) + parseInt(b.dataset.dislikes);
                return engagementB - engagementA;
            });
            break;
    }
    
    // Reorder comments in the DOM
    const commentsContainer = document.querySelector('.comments-container');
    comments.forEach(comment => {
        commentsContainer.appendChild(comment);
    });
}

function initializeCommentActions() {
    const likeButtons = document.querySelectorAll('.like-btn');
    const dislikeButtons = document.querySelectorAll('.dislike-btn');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const count = this.querySelector('span');
            const newCount = parseInt(count.textContent) + 1;
            count.textContent = newCount;
            
            // Update the data attribute for filtering
            const comment = this.closest('.comment');
            comment.dataset.likes = newCount;
        });
    });
    
    dislikeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const count = this.querySelector('span');
            const newCount = parseInt(count.textContent) + 1;
            count.textContent = newCount;
            
            // Update the data attribute for filtering
            const comment = this.closest('.comment');
            comment.dataset.dislikes = newCount;
        });
    });
}

// Comment system functionality
function initializeCommentSystem() {
    console.log('🔧 Initializing comment system...');
    
    const commentTextarea = document.getElementById('newComment');
    const charCount = document.querySelector('.char-count');
    
    if (!commentTextarea || !charCount) {
        console.error('❌ Comment elements not found:', { commentTextarea, charCount });
        return;
    }
    
    console.log('✅ Comment elements found, setting up event listeners...');
    
    // Character counter
    commentTextarea.addEventListener('input', function() {
        const length = this.value.length;
        charCount.textContent = `${length} character${length !== 1 ? 's' : ''}`;
        
        // Change color based on length
        if (length > 500) {
            charCount.style.color = '#dc2626'; // Red for long comments
        } else if (length > 300) {
            charCount.style.color = '#f59e0b'; // Orange for medium comments
        } else {
            charCount.style.color = '#6b7280'; // Default gray
        }
    });
    
    // Enter key to submit (Shift+Enter for new line)
    commentTextarea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addComment();
        }
    });
    
    console.log('✅ Event listeners set up, initializing sample comments...');
    
    // Initialize with sample comments
    initializeSampleComments();
}

// Initialize sample comments
function initializeSampleComments() {
    console.log('📝 Initializing sample comments...');
    
    const sampleComments = [
        {
            name: 'Elizabeth',
            text: 'Tips should be earned, not expected. Great service deserves great tips!',
            likes: 35,
            dislikes: 18,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
            name: 'Marcus',
            text: 'I always tip 20% for good service. It\'s part of the dining experience.',
            likes: 28,
            dislikes: 12,
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
        },
        {
            name: 'Sarah',
            text: 'The tipping culture is getting out of hand. Everywhere asks for tips now.',
            likes: 42,
            dislikes: 8,
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
        },
        {
            name: 'David',
            text: 'I tip based on service quality, not percentage. Sometimes 15%, sometimes 25%.',
            likes: 31,
            dislikes: 15,
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
        },
        {
            name: 'Jennifer',
            text: 'Counter service shouldn\'t expect tips. I only tip for table service.',
            likes: 19,
            dislikes: 22,
            timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000) // 10 hours ago
        },
        {
            name: 'Robert',
            text: 'Tipping is a way to show appreciation. I always leave something.',
            likes: 26,
            dislikes: 9,
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
        },
        {
            name: 'Amanda',
            text: 'The suggested tip percentages keep going up. 18% used to be standard.',
            likes: 38,
            dislikes: 11,
            timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000) // 14 hours ago
        },
        {
            name: 'Michael',
            text: 'I tip delivery drivers extra in bad weather. They\'re taking risks.',
            likes: 33,
            dislikes: 7,
            timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000) // 16 hours ago
        },
        {
            name: 'Lisa',
            text: 'Should we abolish tipping and just pay fair wages?',
            likes: 45,
            dislikes: 20,
            timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000) // 18 hours ago
        },
        {
            name: 'Thomas',
            text: 'I tip my barber well. Good haircuts are worth it.',
            likes: 22,
            dislikes: 6,
            timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000) // 20 hours ago
        }
    ];
    
    console.log('✅ Sample comments created:', sampleComments.length);
    
    // Store all comments globally
    window.allComments = sampleComments;
    
    console.log('✅ Comments stored globally, displaying first 3...');
    
    // Show only first 3 comments initially
    displayComments(0, 3);
    
    // Show load more button if there are more comments
    if (sampleComments.length > 3) {
        document.getElementById('loadMoreSection').style.display = 'block';
        console.log('✅ Load more button shown');
    }
    
    console.log('✅ Sample comments initialization complete');
}

// Display comments with pagination
function displayComments(startIndex, count) {
    console.log(`🔄 Displaying comments from ${startIndex} to ${startIndex + count - 1}`);
    
    const commentsContainer = document.getElementById('commentsContainer');
    
    if (!commentsContainer) {
        console.error('❌ Comments container not found');
        return;
    }
    
    console.log('✅ Comments container found:', commentsContainer);
    
    const endIndex = Math.min(startIndex + count, window.allComments.length);
    console.log(`📊 Total comments available: ${window.allComments.length}, showing ${startIndex} to ${endIndex - 1}`);
    
    // Clear existing comments
    commentsContainer.innerHTML = '';
    console.log('🧹 Cleared existing comments');
    
    // Add comments in range
    for (let i = startIndex; i < endIndex; i++) {
        const comment = window.allComments[i];
        console.log(`➕ Adding comment ${i + 1}:`, comment.name, comment.text.substring(0, 30) + '...');
        const commentElement = createCommentElement(comment);
        commentsContainer.appendChild(commentElement);
    }
    
    console.log(`✅ Added ${endIndex - startIndex} comments to container`);
    
    // Update load more button
    updateLoadMoreButton(endIndex);
}

// Create comment element
function createCommentElement(comment) {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.dataset.likes = comment.likes;
    commentElement.dataset.dislikes = comment.dislikes;
    commentElement.dataset.timestamp = comment.timestamp.toISOString();
    
    commentElement.innerHTML = `
        <div class="comment-header">
            <div class="comment-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="comment-info">
                <div class="comment-author">${comment.name}</div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-time">${formatTimeAgo(comment.timestamp)}</div>
            </div>
        </div>
        <div class="comment-actions">
            <button class="action-btn like-btn">
                <i class="fas fa-thumbs-up"></i>
                <span>${comment.likes}</span>
            </button>
            <button class="action-btn dislike-btn">
                <i class="fas fa-thumbs-down"></i>
                <span>${comment.dislikes}</span>
            </button>
        </div>
    `;
    
    // Initialize actions for comment
    const likeBtn = commentElement.querySelector('.like-btn');
    const dislikeBtn = commentElement.querySelector('.dislike-btn');
    
    likeBtn.addEventListener('click', function() {
        const count = this.querySelector('span');
        const newCount = parseInt(count.textContent) + 1;
        count.textContent = newCount;
        
        // Update the data attribute for filtering
        commentElement.dataset.likes = newCount;
    });
    
    dislikeBtn.addEventListener('click', function() {
        const count = this.querySelector('span');
        const newCount = parseInt(count.textContent) + 1;
        count.textContent = newCount;
        
        // Update the data attribute for filtering
        commentElement.dataset.dislikes = newCount;
    });
    
    return commentElement;
}

// Update load more button
function updateLoadMoreButton(currentIndex) {
    const loadMoreSection = document.getElementById('loadMoreSection');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (currentIndex >= window.allComments.length) {
        // All comments loaded
        loadMoreSection.style.display = 'none';
    } else {
        // More comments available
        loadMoreSection.style.display = 'block';
        const remaining = window.allComments.length - currentIndex;
        const nextBatch = Math.min(3, remaining);
        loadMoreBtn.innerHTML = `
            <i class="fas fa-chevron-down"></i>
            Load ${nextBatch} More Comment${nextBatch !== 1 ? 's' : ''}
        `;
    }
}

// Load more comments
function loadMoreComments() {
    const currentCount = document.querySelectorAll('#commentsContainer .comment').length;
    const nextBatch = Math.min(3, window.allComments.length - currentCount);
    
    if (nextBatch > 0) {
        displayComments(currentCount, currentCount + nextBatch);
    }
}

// Set anonymous name
function setAnonymous() {
    const nameInput = document.getElementById('commenterName');
    const anonymousBtn = document.querySelector('.anonymous-btn');
    
    if (nameInput.value.trim() === '') {
        nameInput.value = 'Anonymous';
        anonymousBtn.classList.add('active');
    } else {
        nameInput.value = '';
        anonymousBtn.classList.remove('active');
    }
}

function addComment() {
    const commentText = document.getElementById('newComment').value.trim();
    const commenterName = document.getElementById('commenterName').value.trim();
    
    if (!commentText) {
        // Show error message
        showCommentError('Please enter a comment before posting.');
        return;
    }
    
    if (commentText.length > 1000) {
        showCommentError('Comment is too long. Please keep it under 1000 characters.');
        return;
    }
    
    // Use provided name or generate random name
    let displayName;
    if (commenterName && commenterName !== 'Anonymous') {
        displayName = commenterName;
    } else if (commenterName === 'Anonymous') {
        displayName = 'Anonymous';
    } else {
        // Generate random name if none provided
        const randomNames = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Quinn', 'Avery', 'Morgan', 'Drew', 'Blake', 'Sam', 'Parker', 'Emery', 'Rowan', 'Sage'];
        displayName = randomNames[Math.floor(Math.random() * randomNames.length)];
    }
    
    // Create new comment object
    const newComment = {
        name: displayName,
        text: commentText,
        likes: 0,
        dislikes: 0,
        timestamp: new Date()
    };
    
    // Add to global comments array at the beginning (most recent first)
    window.allComments.unshift(newComment);
    
    // Limit total comments to 10
    if (window.allComments.length > 10) {
        window.allComments = window.allComments.slice(0, 10);
    }
    
    // Refresh display to show only first 3 comments
    displayComments(0, 3);
    
    // Show load more button if there are more than 3 comments
    if (window.allComments.length > 3) {
        document.getElementById('loadMoreSection').style.display = 'block';
    }
    
    // Clear form
    document.getElementById('newComment').value = '';
    document.getElementById('commenterName').value = '';
    document.querySelector('.char-count').textContent = '0 characters';
    document.querySelector('.anonymous-btn').classList.remove('active');
    
    // Show success message
    showCommentSuccess('Comment posted successfully!');
}

// Show comment error message
function showCommentError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'comment-error';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    const addCommentSection = document.querySelector('.add-comment');
    addCommentSection.insertBefore(errorDiv, addCommentSection.firstChild);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Show comment success message
function showCommentSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'comment-success';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    const addCommentSection = document.querySelector('.add-comment');
    addCommentSection.insertBefore(successDiv, addCommentSection.firstChild);
    
    // Remove success after 3 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Format time ago
function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
}

// Story modal functionality
function initializeStoryModal() {
    const textarea = document.getElementById('storyText');
    const charCount = document.getElementById('charCount');
    
    textarea.addEventListener('input', function() {
        charCount.textContent = this.value.length;
    });
    
    const form = document.querySelector('.story-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitStory();
    });
}

function openStoryModal() {
    document.getElementById('storyModal').style.display = 'block';
}

function closeStoryModal() {
    document.getElementById('storyModal').style.display = 'none';
    document.getElementById('storyText').value = '';
    document.getElementById('charCount').textContent = '0';
}

function submitStory() {
    const storyText = document.getElementById('storyText').value.trim();
    if (!storyText) return;
    
    addStoryToGrid(storyText);
    closeStoryModal();
}

function addStoryToGrid(storyText) {
    const storiesGrid = document.querySelector('.stories-grid');
    const newStory = document.createElement('div');
    newStory.className = 'story-card';
    
    const icons = ['fas fa-coffee', 'fas fa-hand-holding-usd', 'fas fa-sandwich', 'fas fa-utensils', 'fas fa-car', 'fas fa-home'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    
    newStory.innerHTML = `
        <div class="story-icon">
            <i class="${randomIcon}"></i>
        </div>
        <p>${storyText}</p>
    `;
    
    // Add hover effect
    newStory.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    });
    
    newStory.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)';
    });
    
    storiesGrid.appendChild(newStory);
    
    // Remove oldest story if we have more than 3
    if (storiesGrid.children.length > 3) {
        storiesGrid.removeChild(storiesGrid.firstChild);
    }
}

// Social sharing
function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this tipping poll! What do you think?');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareOnReddit() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Tipping Poll: Should large tips be expected for coffee?');
    window.open(`https://reddit.com/submit?url=${url}&title=${title}`, '_blank');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('storyModal');
    if (event.target === modal) {
        closeStoryModal();
    }
}

// Add function to get full state names
function getFullStateName(stateCode) {
    const stateNames = {
        'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
        'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
        'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
        'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
        'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
        'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
        'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
        'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
        'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
        'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
    };
    return stateNames[stateCode] || stateCode;
}

// Add some CSS for state stats
const style = document.createElement('style');
style.textContent = `
    .state-stats {
        display: flex;
        justify-content: space-around;
        margin: 1rem 0;
        flex-wrap: wrap;
        gap: 1rem;
    }
    
    .stat {
        text-align: center;
        min-width: 80px;
    }
    
    .stat-label {
        display: block;
        font-weight: 600;
        color: #666;
        font-size: 0.9rem;
    }
    
    .stat-value {
        display: block;
        font-size: 1.5rem;
        font-weight: 700;
        color: #333;
    }
    
    .state-comment {
        font-style: italic;
        color: #666;
        margin-top: 1rem;
        padding: 1rem;
        background: white;
        border-radius: 8px;
        border-left: 4px solid #667eea;
    }
    
    .notification {
        font-family: 'Inter', sans-serif;
    }
`;
document.head.appendChild(style);

// Tipping Calculator Functionality
function initializeTippingCalculator() {
    console.log('🚀 Initializing Tipping Calculator...');
    
    const billInput = document.getElementById('bill-amount');
    const customTipInput = document.getElementById('custom-tip');
    const splitCountInput = document.getElementById('split-count');
    const splitMinusBtn = document.getElementById('split-minus');
    const splitPlusBtn = document.getElementById('split-plus');
    const tipButtons = document.querySelectorAll('.tip-btn');
    
    console.log('📊 Calculator elements found:', {
        billInput: !!billInput,
        customTipInput: !!customTipInput,
        splitCountInput: !!splitCountInput,
        splitMinusBtn: !!splitMinusBtn,
        splitPlusBtn: !!splitPlusBtn,
        tipButtons: tipButtons.length
    });
    
    if (!billInput || !customTipInput || !splitCountInput || !splitMinusBtn || !splitPlusBtn || tipButtons.length === 0) {
        console.error('❌ Some calculator elements are missing!');
        return;
    }
    
    let currentTipPercent = 20;
    console.log('✅ Calculator initialized successfully with tip percentage:', currentTipPercent);
    
    // Tip percentage buttons
    tipButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tipButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            // Set current tip percentage
            currentTipPercent = parseInt(btn.dataset.tip);
            // Clear custom tip input
            customTipInput.value = '';
            // Calculate results
            calculateTip();
        });
    });
    
    // Custom tip input
    customTipInput.addEventListener('input', () => {
        if (customTipInput.value) {
            // Remove active class from preset buttons
            tipButtons.forEach(b => b.classList.remove('active'));
            // Set current tip percentage
            currentTipPercent = parseFloat(customTipInput.value) || 0;
            // Calculate results
            calculateTip();
        }
    });
    
    // Bill amount input - add multiple event listeners for better responsiveness
    billInput.addEventListener('input', calculateTip);
    billInput.addEventListener('keyup', calculateTip);
    billInput.addEventListener('change', calculateTip);
    
    // Split bill buttons
    splitMinusBtn.addEventListener('click', () => {
        const currentValue = parseInt(splitCountInput.value);
        if (currentValue > 1) {
            splitCountInput.value = currentValue - 1;
            calculateTip();
        }
    });
    
    splitPlusBtn.addEventListener('click', () => {
        const currentValue = parseInt(splitCountInput.value);
        if (currentValue < 20) {
            splitCountInput.value = currentValue + 1;
            calculateTip();
        }
    });
    
    // Split count input - add multiple event listeners
    splitCountInput.addEventListener('input', calculateTip);
    splitCountInput.addEventListener('change', calculateTip);
    splitCountInput.addEventListener('keyup', calculateTip);
    
    // Calculate tip function
    function calculateTip() {
        const billAmount = parseFloat(billInput.value) || 0;
        const tipPercent = currentTipPercent;
        const splitCount = parseInt(splitCountInput.value) || 1;
        
        // Validate inputs
        if (billAmount < 0) billInput.value = 0;
        if (splitCount < 1) splitCountInput.value = 1;
        if (splitCount > 20) splitCountInput.value = 20;
        
        const tipAmount = (billAmount * tipPercent) / 100;
        const totalBill = billAmount + tipAmount;
        const perPerson = totalBill / splitCount;
        
        // Update display with animation
        updateDisplayWithAnimation('tip-amount', `$${tipAmount.toFixed(2)}`);
        updateDisplayWithAnimation('total-bill', `$${totalBill.toFixed(2)}`);
        updateDisplayWithAnimation('per-person', `$${perPerson.toFixed(2)}`);
        
        // Add visual feedback for changes
        if (billAmount > 0) {
            billInput.style.borderColor = '#10b981';
            setTimeout(() => {
                billInput.style.borderColor = '';
            }, 500);
        }
    }
    
    // Update display with smooth animation
    function updateDisplayWithAnimation(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (element) {
            // Add a subtle animation class
            element.style.transform = 'scale(1.05)';
            element.style.color = '#10b981';
            
            // Update the value
            element.textContent = newValue;
            
            // Reset animation
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                element.style.color = '';
            }, 200);
        }
    }
    
    // Initialize with default values and trigger calculation
    calculateTip();
    
    // Test the calculator
    console.log('🧮 Testing calculator with $50 bill...');
    billInput.value = '50';
    calculateTip();
    
    // Add some visual enhancements
    billInput.addEventListener('focus', () => {
        billInput.parentElement.style.transform = 'scale(1.02)';
    });
    
    billInput.addEventListener('blur', () => {
        billInput.parentElement.style.transform = 'scale(1)';
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target === billInput) {
            if (e.key === 'Enter') {
                customTipInput.focus();
            }
        }
    });
    
    // Auto-format bill input for better UX
    billInput.addEventListener('blur', () => {
        if (billInput.value && !isNaN(billInput.value)) {
            const formatted = parseFloat(billInput.value).toFixed(2);
            if (formatted !== billInput.value) {
                billInput.value = formatted;
                calculateTip();
            }
        }
    });
}

// AI Tipping Advisor Functionality
function initializeAITippingAdvisor() {
    console.log('🤖 Initializing AI Tipping Advisor...');
    
    const customScenarioText = document.getElementById('custom-scenario-text');
    const getAdviceBtn = document.getElementById('get-advice-btn');
    const aiRecommendation = document.getElementById('ai-recommendation');
    const regenerateBtn = document.getElementById('regenerate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const recommendationActions = document.getElementById('recommendation-actions');
    const scenarioChips = document.querySelectorAll('.scenario-chip');
    
    console.log('🤖 AI Advisor elements found:', {
        customScenarioText: !!customScenarioText,
        getAdviceBtn: !!getAdviceBtn,
        aiRecommendation: !!aiRecommendation,
        regenerateBtn: !!regenerateBtn,
        copyBtn: !!copyBtn,
        recommendationActions: !!recommendationActions,
        scenarioChips: scenarioChips.length
    });
    
    // AI advice database for different scenarios
    const aiAdviceDatabase = {
        restaurant: {
            title: "Restaurant Dining",
            advice: "For sit-down restaurant service, tipping is expected and important for staff wages.",
            tipAmount: "15-20% of pre-tax bill",
            reasoning: "Restaurant servers typically earn below minimum wage and rely heavily on tips. 15% is standard for good service, 20% for excellent service. Consider tipping more for exceptional service or if you're a regular customer.",
            examples: "• $50 bill = $7.50-$10 tip\n• $100 bill = $15-$20 tip\n• Always tip on the pre-tax amount"
        },
        delivery: {
            title: "Food Delivery",
            advice: "Delivery drivers use their own vehicles and often face challenging conditions.",
            tipAmount: "$3-5 minimum or 15-20%",
            reasoning: "Delivery drivers cover gas, vehicle maintenance, and often work in poor weather. Base your tip on distance, weather conditions, and order size. A minimum tip ensures drivers are fairly compensated.",
            examples: "• Short distance: $3-4 tip\n• Long distance/poor weather: $5-8 tip\n• Large orders: Consider 15-20%"
        },
        coffee: {
            title: "Coffee Shop",
            advice: "Tipping at coffee shops is appreciated but not always expected for simple orders.",
            tipAmount: "$1-2 or 10-15%",
            reasoning: "For simple coffee orders, $1-2 is generous. For complex drinks (lattes, cappuccinos), consider 10-15%. Baristas often work for minimum wage and appreciate tips for their skill and service.",
            examples: "• Simple coffee: $1 tip\n• Complex drink: $2 tip\n• Multiple drinks: $3-5 total tip"
        },
        barber: {
            title: "Barber/Hair Salon",
            advice: "Hair services are skilled work that typically warrants a tip.",
            tipAmount: "15-20% of service cost",
            reasoning: "Hair stylists and barbers are skilled professionals who often pay for their own tools and supplies. 15% is standard, 20% for exceptional work. Consider tipping more for complex services or if you're very satisfied.",
            examples: "• $30 haircut = $4.50-$6 tip\n• $80 color service = $12-$16 tip\n• $150 full service = $22.50-$30 tip"
        },
        hotel: {
            title: "Hotel Service",
            advice: "Hotel staff often work behind the scenes and appreciate recognition for their service.",
            tipAmount: "Varies by service type",
            reasoning: "Different hotel services have different tipping norms. Housekeeping, bellhops, and valet services are commonly tipped. Concierge services are typically tipped for special arrangements.",
            examples: "• Housekeeping: $2-5 per night\n• Bellhop: $2-5 per bag\n• Valet: $2-5 when retrieving car\n• Concierge: $5-20 for special services"
        },
        rideshare: {
            title: "Rideshare/Taxi",
            advice: "Tipping rideshare drivers is appreciated and helps support their income.",
            tipAmount: "$2-5 or 15-20%",
            reasoning: "Rideshare drivers often work long hours and face significant vehicle expenses. Base your tip on trip length, weather conditions, and service quality. Consider tipping more for airport runs or late-night rides.",
            examples: "• Short trip: $2-3 tip\n• Medium trip: $3-5 tip\n• Long trip/airport: $5-10 tip\n• Poor weather: Add $1-2"
        }
    };
    
    // Scenario chip click handlers
    scenarioChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const scenario = chip.dataset.scenario;
            const advice = aiAdviceDatabase[scenario];
            
            if (advice) {
                // Fill the textarea with a sample scenario
                const sampleText = getSampleScenarioText(scenario);
                customScenarioText.value = sampleText;
                
                // Show the advice
                showAIAdvice(advice);
                
                // Highlight the clicked chip
                scenarioChips.forEach(c => c.style.background = 'white');
                                            chip.style.background = '#e8f5e8';
                            chip.style.borderColor = '#8AA624';
                            chip.style.color = '#5a6b3a';
            }
        });
    });
    
    // Get advice button click handler
    getAdviceBtn.addEventListener('click', () => {
        const scenarioText = customScenarioText.value.trim();
        if (scenarioText) {
            showCustomScenarioAdvice(scenarioText);
        } else {
            // Show error message
            aiRecommendation.innerHTML = `
                <div class="default-message">
                    <div class="ai-illustration">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <p>Please describe your tipping situation to get personalized advice!</p>
                </div>
            `;
            recommendationActions.style.display = 'none';
        }
    });
    
    // Enter key handler for textarea
    customScenarioText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            getAdviceBtn.click();
        }
    });
    
    // Show AI advice for predefined scenarios
    function showAIAdvice(advice) {
        aiRecommendation.innerHTML = `
            <div class="ai-advice">
                <h4>${advice.title}</h4>
                <p>${advice.advice}</p>
                <div class="tip-amount">💡 ${advice.tipAmount}</div>
                <div class="reasoning">
                    <strong>Why this amount?</strong><br>
                    ${advice.reasoning}
                </div>
                <p><strong>Examples:</strong><br>
                ${advice.examples}</p>
            </div>
        `;
        
        showActionButtons();
    }
    
    // Show AI advice for custom scenarios
    function showCustomScenarioAdvice(scenarioText) {
        // Show loading state
        aiRecommendation.innerHTML = `
            <div class="default-message">
                <div class="loading-spinner"></div>
                <p>Analyzing your scenario...</p>
            </div>
        `;
        
        // Simulate AI processing (in a real app, this would call an AI API)
        setTimeout(() => {
            const customAdvice = generateCustomAdvice(scenarioText);
            aiRecommendation.innerHTML = `
                <div class="ai-advice">
                    <h4>Custom Scenario Analysis</h4>
                    <p>${customAdvice.advice}</p>
                    <div class="tip-amount">💡 ${customAdvice.tipAmount}</div>
                    <div class="reasoning">
                        <strong>AI Reasoning:</strong><br>
                        ${customAdvice.reasoning}
                    </div>
                    <p><strong>Key Factors:</strong><br>
                    ${customAdvice.factors}</p>
                </div>
            `;
            showActionButtons();
        }, 1500);
    }
    
    // Generate sample scenario text for chips
    function getSampleScenarioText(scenario) {
        const samples = {
            restaurant: "I'm dining at a nice restaurant, the service was excellent, and my bill is $85 before tax. The server was very attentive and made great recommendations.",
            delivery: "I ordered food delivery during bad weather, the driver had to drive 3 miles, and my order was $45. The food arrived hot and on time.",
            coffee: "I'm at a coffee shop, ordered a complex latte with custom milk and syrups. The barista was very skilled and the drink costs $6.50.",
            barber: "I got a haircut and beard trim at a barber shop. The service took 45 minutes and cost $35. The barber was very professional and did excellent work.",
            hotel: "I'm staying at a hotel for 3 nights. The housekeeping staff has been very thorough, and the bellhop helped with my luggage when I arrived.",
            rideshare: "I took a rideshare to the airport early in the morning. The driver was very helpful with my luggage and the trip was 12 miles long."
        };
        return samples[scenario] || "Describe your tipping situation here...";
    }
    
    // Generate custom advice based on scenario text
    function generateCustomAdvice(scenarioText) {
        const text = scenarioText.toLowerCase();
        
        // Simple keyword-based analysis (in a real app, this would use AI/ML)
        let tipAmount = "15-20%";
        let reasoning = "Based on your description, this appears to be a service that typically warrants tipping.";
        let factors = "• Service quality\n• Industry standards\n• Your satisfaction level";
        
        if (text.includes('massage') || text.includes('spa')) {
            tipAmount = "15-20% of service cost";
            reasoning = "Massage and spa services are skilled therapeutic work that typically warrant tipping. The amount depends on service quality and duration.";
            factors = "• Service duration\n• Therapist skill level\n• Facility quality\n• Your satisfaction";
        } else if (text.includes('pet') || text.includes('dog') || text.includes('cat')) {
            tipAmount = "$5-15 or 15-20%";
            reasoning = "Pet services like grooming, walking, or sitting are specialized services that often warrant tipping. Consider the complexity and duration of the service.";
            factors = "• Service complexity\n• Pet behavior\n• Service duration\n• Professional skill";
        } else if (text.includes('moving') || text.includes('furniture')) {
            tipAmount = "$20-50 per person";
            reasoning = "Moving services are physically demanding work that typically warrants tipping. The amount depends on the difficulty and duration of the move.";
            factors = "• Move complexity\n• Distance\n• Number of items\n• Weather conditions";
        }
        
        return {
            advice: "Based on your specific situation, here's my AI-powered tipping recommendation:",
            tipAmount: tipAmount,
            reasoning: reasoning,
            factors: factors
        };
    }
    
    // Show action buttons
    function showActionButtons() {
        recommendationActions.style.display = 'flex';
    }
    
    // Regenerate advice button
    regenerateBtn.addEventListener('click', () => {
        const scenarioText = customScenarioText.value.trim();
        if (scenarioText) {
            showCustomScenarioAdvice(scenarioText);
        }
    });
    
    // Copy advice button
    copyBtn.addEventListener('click', () => {
        const adviceText = aiRecommendation.textContent;
        navigator.clipboard.writeText(adviceText).then(() => {
            // Show temporary success message
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.style.color = '#10b981';
            copyBtn.style.borderColor = '#10b981';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.color = '';
                copyBtn.style.borderColor = '';
            }, 2000);
        });
    });
    
    console.log('✅ AI Tipping Advisor initialized successfully!');
}

// Client-side routing functionality
function initializeRouting() {
    console.log('🛣️ Initializing client-side routing...');
    
    // Handle initial route
    handleRoute();
    
    // Listen for browser back/forward
    window.addEventListener('popstate', handleRoute);
    
    // Handle internal navigation
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-route]')) {
            e.preventDefault();
            const route = e.target.getAttribute('data-route');
            navigateToRoute(route);
        }
    });
}

// Handle route changes
function handleRoute() {
    const path = window.location.pathname;
    console.log('📍 Current route:', path);
    
    // Remove trailing slash and get route
    const route = path.replace(/\/$/, '') || '/poll';
    
    // Scroll to appropriate section
    scrollToSection(route);
    
    // Update page title
    updatePageTitle(route);
}

// Navigate to a specific route
function navigateToRoute(route) {
    console.log('🚀 Navigating to:', route);
    
    // Update URL without page reload
    const url = route === '/poll' ? '/' : route;
    window.history.pushState({}, '', url);
    
    // Scroll to section
    scrollToSection(route);
    
    // Update page title
    updatePageTitle(route);
}

// Scroll to the appropriate section based on route
function scrollToSection(route) {
    let targetSection;
    
    switch(route) {
        case '/poll':
        case '/':
            targetSection = document.querySelector('.header');
            break;
        case '/calculator':
            targetSection = document.querySelector('.calculator-section');
            break;
        case '/advice':
            targetSection = document.querySelector('.ai-advisor-section');
            break;
        case '/funfacts':
            targetSection = document.querySelector('.awareness-section');
            break;
        case '/discussions':
            targetSection = document.querySelector('.comments-section');
            break;
        default:
            targetSection = document.querySelector('.header');
            break;
    }
    
    if (targetSection) {
        // Smooth scroll to section
        targetSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Add highlight effect
        highlightSection(targetSection);
        
        console.log('✅ Scrolled to section:', route);
    } else {
        console.warn('⚠️ Section not found for route:', route);
    }
}

// Update page title based on route
function updatePageTitle(route) {
    let title;
    
    switch(route) {
        case '/poll':
        case '/':
            title = 'TippingPoll - Vote on Tipping Culture';
            break;
        case '/calculator':
            title = 'Tipping Calculator - TippingPoll';
            break;
        case '/advice':
            title = 'AI Tipping Advice - TippingPoll';
            break;
        case '/funfacts':
            title = 'Tipping Fun Facts - TippingPoll';
            break;
        case '/discussions':
            title = 'Tipping Discussions - TippingPoll';
            break;
        default:
            title = 'TippingPoll - Vote on Tipping Culture';
            break;
    }
    
    document.title = title;
    console.log('📝 Updated page title:', title);
}

// Highlight the section briefly
function highlightSection(section) {
    // Remove existing highlights
    document.querySelectorAll('.section-highlight').forEach(el => {
        el.classList.remove('section-highlight');
    });
    
    // Add highlight class
    section.classList.add('section-highlight');
    
    // Remove highlight after animation
    setTimeout(() => {
        section.classList.remove('section-highlight');
    }, 2000);
}

// Add route attributes to existing buttons/links
function addRouteAttributes() {
    // Add route to "Submit Your Story" button
    const submitStoryBtn = document.querySelector('.btn.btn-secondary');
    if (submitStoryBtn) {
        submitStoryBtn.setAttribute('data-route', '/discussions');
    }
    
    // Add route to "Next Poll" link
    const nextPollLink = document.querySelector('.next-poll-link');
    if (nextPollLink) {
        nextPollLink.setAttribute('data-route', '/poll');
    }
    
    console.log('🔗 Added route attributes to buttons/links');
}
