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
    initializeMap();
    initializeComments();
    initializeStoryModal();
    initializeFacts();
    loadCurrentPollResults(); // Load real data from Supabase
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
            updateMapColorsFromRealData();
            
            // Update global poll results
            updateGlobalPollResults();
        }
        
    } catch (error) {
        console.error('Error loading poll results:', error);
        // Fall back to default data if API fails
    }
}

// Update map colors based on real data from Supabase
function updateMapColorsFromRealData() {
    const states = document.querySelectorAll('.state');
    states.forEach(state => {
        const stateCode = state.dataset.state;
        const stateData = stateVoteData[stateCode];
        
        if (stateData) {
            // Update the state's data attributes with real values
            state.dataset.yes = stateData.yes;
            state.dataset.no = stateData.no;
            state.dataset.depends = stateData.depends;
            
            // Update the state color
            updateStateColor(state);
        }
    });
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
                updateStateOnMap(userState);
                
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

// Update specific state on the map
function updateStateOnMap(stateCode) {
    const state = document.querySelector(`[data-state="${stateCode}"]`);
    if (state) {
        const stateData = stateVoteData[stateCode];
        if (stateData) {
            state.dataset.yes = stateData.yes;
            state.dataset.no = stateData.no;
            state.dataset.depends = stateData.depends;
            updateStateColor(state);
        }
    }
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
    updateMapColors();
    
    // Update facts with new random selections
    updateRandomFacts();
    
    console.log(`Randomized to question ${currentPollIndex + 1}: ${pollQuestions[currentPollIndex]}`);
}

// Map functionality
function initializeMap() {
    const states = document.querySelectorAll('.state');
    
    states.forEach(state => {
        // Remove click event listener - we only want hover
        state.addEventListener('mouseenter', function(e) {
            this.style.strokeWidth = '3';
            showStateTooltip(this, e);
        });
        
        state.addEventListener('mouseleave', function() {
            this.style.strokeWidth = '1';
            hideStateTooltip();
        });
    });
    
    // Don't call updateMapColors here - it will be called after loading real data
}

function updateStateColor(state) {
    const yes = parseInt(state.dataset.yes);
    const no = parseInt(state.dataset.no);
    const depends = parseInt(state.dataset.depends);
    
    // Remove existing classes
    state.classList.remove('yes-majority', 'no-majority', 'depends-majority');
    
    // Determine majority
    if (yes > no && yes > depends) {
        state.classList.add('yes-majority');
    } else if (no > yes && no > depends) {
        state.classList.add('no-majority');
    } else {
        state.classList.add('depends-majority');
    }
}

function showStateTooltip(state, event) {
    const stateCode = state.dataset.state;
    const yes = parseInt(state.dataset.yes);
    const no = parseInt(state.dataset.no);
    const depends = parseInt(state.dataset.depends);
    const comment = getStateComment(stateCode);
    
    // Get full state name
    const fullStateName = getFullStateName(stateCode);
    
    // Create or update tooltip
    let tooltip = document.querySelector('.state-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'state-tooltip';
        document.body.appendChild(tooltip);
    }
    
    tooltip.innerHTML = `
        <h4>${fullStateName}</h4>
        <div class="state-stats">
            <div class="stat">
                <span class="stat-label">Yes</span>
                <span class="stat-value">${yes}%</span>
            </div>
            <div class="stat">
                <span class="stat-label">No</span>
                <span class="stat-value">${no}%</span>
            </div>
            <div class="stat">
                <span class="stat-label">Dep</span>
                <span class="stat-value">${depends}%</span>
            </div>
        </div>
        <p class="state-comment">${comment}</p>
    `;
    
    // Position tooltip closer to mouse pointer and ensure it stays within viewport
    const tooltipWidth = 200; // Approximate tooltip width
    const tooltipHeight = 120; // Approximate tooltip height
    
    let left = event.clientX + 8;
    let top = event.clientY - 8;
    
    // Check if tooltip would go off the right edge
    if (left + tooltipWidth > window.innerWidth) {
        left = event.clientX - tooltipWidth - 8;
    }
    
    // Check if tooltip would go off the bottom edge
    if (top + tooltipHeight > window.innerHeight) {
        top = event.clientY - tooltipHeight - 8;
    }
    
    // Ensure tooltip doesn't go off the left or top edges
    left = Math.max(8, left);
    top = Math.max(8, top);
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    tooltip.style.display = 'block';
}

function hideStateTooltip() {
    const tooltip = document.querySelector('.state-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

function getStateComment(stateCode) {
    const comments = {
        'CA': 'We love our baristas here!',
        'NY': 'Everything is expensive, including tips.',
        'TX': 'Southern hospitality means generous tipping.',
        'FL': 'Tourist areas expect higher tips.',
        'WA': 'Tech money flows into coffee shops.',
        'OR': 'Portland is all about the coffee culture.',
        'CO': 'Mountain lifestyle, mountain tips.',
        'IL': 'Chicago knows good service.',
        'PA': 'Philly has strong opinions on everything.',
        'MA': 'Boston values quality service.',
        'MI': 'Great Lakes, great tipping habits.',
        'OH': 'Midwest hospitality at its finest.',
        'GA': 'Atlanta sets the standard for the South.',
        'NC': 'Research Triangle has diverse views.',
        'VA': 'DC area influences tipping culture.',
        'TN': 'Music City knows how to tip.',
        'MO': 'Gateway to the West, gateway to tipping.',
        'MN': 'Minnesota nice extends to tipping.',
        'WI': 'Cheese and tipping go hand in hand.',
        'IA': 'Corn fields and tipping traditions.',
        'NE': 'Cornhusker state, cornhusker tips.',
        'KS': 'Wheat state, wheat-sized tips.',
        'OK': 'Sooner state, sooner tipping.',
        'AR': 'Natural state, natural tipping habits.',
        'LA': 'Cajun culture, cajun tipping.',
        'MS': 'Magnolia state, magnolia-sized tips.',
        'AL': 'Heart of Dixie, heart of tipping.',
        'SC': 'Palmetto state, palmetto-sized tips.',
        'AK': 'Last frontier, frontier tipping.',
        'HI': 'Aloha spirit, aloha tips.',
        'NV': 'Sin City, sin-sized tips.',
        'ID': 'Gem state, gem-sized tips.',
        'UT': 'Beehive state, beehive tipping.',
        'AZ': 'Grand Canyon state, grand tipping.',
        'MT': 'Big Sky country, big sky tips.',
        'WY': 'Cowboy state, cowboy tipping.',
        'NM': 'Land of enchantment, enchanting tips.',
        'ND': 'Peace Garden state, peaceful tipping.',
        'SD': 'Mount Rushmore state, monumental tips.',
        'CT': 'Constitution state, constitutional tipping.',
        'RI': 'Ocean state, ocean-sized tips.',
        'VT': 'Green Mountain state, green tipping.',
        'NH': 'Granite state, granite-solid tips.',
        'ME': 'Pine Tree state, tree-sized tips.',
        'MD': 'Old Line state, old-line tipping.',
        'DE': 'First state, first-rate tipping.',
        'WV': 'Mountain state, mountain-sized tips.'
    };
    
    return comments[stateCode] || 'This state has interesting tipping perspectives.';
}

// Update map colors (now uses real data)
function updateMapColors() {
    const states = document.querySelectorAll('.state');
    states.forEach(state => {
        updateStateColor(state);
    });
}

// Comments functionality
function initializeComments() {
    initializeCommentActions();
    initializeCommentFilters();
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

function addComment() {
    const commentText = document.getElementById('newComment').value.trim();
    if (!commentText) return;
    
    const commentsContainer = document.querySelector('.comments-container');
    const newComment = document.createElement('div');
    newComment.className = 'comment';
    
    const randomNames = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Quinn', 'Avery', 'Morgan', 'Drew', 'Blake'];
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    
    // Set current timestamp for the new comment
    const now = new Date();
    const timestamp = now.toISOString();
    
    newComment.innerHTML = `
        <div class="comment-header">
            <div class="comment-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="comment-info">
                <div class="comment-author">${randomName}</div>
                <div class="comment-text">${commentText}</div>
            </div>
        </div>
        <div class="comment-actions">
            <button class="action-btn like-btn">
                <i class="fas fa-thumbs-up"></i>
                <span>0</span>
            </button>
            <button class="action-btn dislike-btn">
                <i class="fas fa-thumbs-down"></i>
                <span>0</span>
            </button>
        </div>
    `;
    
    // Add data attributes for filtering
    newComment.dataset.likes = '0';
    newComment.dataset.dislikes = '0';
    newComment.dataset.timestamp = timestamp;
    
    commentsContainer.appendChild(newComment);
    document.getElementById('newComment').value = '';
    
    // Initialize actions for new comment
    const newLikeBtn = newComment.querySelector('.like-btn');
    const newDislikeBtn = newComment.querySelector('.dislike-btn');
    
    newLikeBtn.addEventListener('click', function() {
        const count = this.querySelector('span');
        const newCount = parseInt(count.textContent) + 1;
        count.textContent = newCount;
        
        // Update the data attribute for filtering
        const comment = this.closest('.comment');
        comment.dataset.likes = newCount;
    });
    
    newDislikeBtn.addEventListener('click', function() {
        const count = this.querySelector('span');
        const newCount = parseInt(count.textContent) + 1;
        count.textContent = newCount;
        
        // Update the data attribute for filtering
        const comment = this.closest('.comment');
        comment.dataset.dislikes = newCount;
    });
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
