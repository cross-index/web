// Fetch altcoin candidates from the backend
async function loadAltcoinCandidates() {
    try {
        const response = await fetch('/api/altcoins');
        const candidates = await response.json();
        const candidatesList = document.getElementById('candidates');
        const preferencesDiv = document.getElementById('preferences');

        candidates.forEach((candidate, index) => {
            // Display candidate names
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${candidate.altcoinName}`;
            candidatesList.appendChild(listItem);

            // Generate voting preference inputs
            const label = document.createElement('label');
            label.textContent = `Preference ${index + 1}: `;
            const input = document.createElement('input');
            input.type = 'number';
            input.name = 'preference';
            input.min = 1;
            input.max = candidates.length;
            input.dataset.index = index;
            label.appendChild(input);
            preferencesDiv.appendChild(label);
            preferencesDiv.appendChild(document.createElement('br'));
        });
    } catch (error) {
        console.error('Error loading altcoin candidates:', error);
    }
}

// Register an investor
async function registerInvestor() {
    const investorAddress = document.getElementById('investorAddress').value;
    const registerMessage = document.getElementById('register-message');

    if (!investorAddress) {
        registerMessage.textContent = 'Please enter a valid Ethereum address.';
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ investorAddress }),
        });
        const result = await response.json();
        registerMessage.textContent = result.message;
    } catch (error) {
        console.error('Error registering investor:', error);
        registerMessage.textContent = 'Failed to register investor.';
    }
}

// Cast a vote
async function castVote(event) {
    event.preventDefault();

    const investorAddress = document.getElementById('investorAddress').value;
    const voteMessage = document.getElementById('vote-message');
    const preferenceInputs = document.querySelectorAll('input[name="preference"]');
    const preferences = Array.from(preferenceInputs).map(input => parseInt(input.value) - 1);

    if (!investorAddress) {
        voteMessage.textContent = 'Please enter your Ethereum address to vote.';
        return;
    }

    try {
        const response = await fetch('/api/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ investorAddress, preferences }),
        });
        const result = await response.json();
        voteMessage.textContent = result.message;
    } catch (error) {
        console.error('Error casting vote:', error);
        voteMessage.textContent = 'Failed to cast vote.';
    }
}

// Tally votes and show the result
async function tallyVotes() {
    const resultMessage = document.getElementById('result-message');

    try {
        const response = await fetch('/api/tally');
        const result = await response.json();
        resultMessage.textContent = result.message;
    } catch (error) {
        console.error('Error fetching election result:', error);
        resultMessage.textContent = 'Failed to fetch election result.';
    }
}

// Event listener for vote form submission
document.getElementById('vote-form').addEventListener('submit', castVote);

// Load altcoin candidates on page load
window.onload = loadAltcoinCandidates;