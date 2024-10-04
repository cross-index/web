const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { registerInvestor, castVote, getAltcoinCandidates, getInvestorPreferences, tallyVotes } = require('./VotingBackend');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up static file serving for the frontend
app.use(express.static(path.join(__dirname, 'public')));

// Route to get the list of altcoin candidates
app.get('/api/altcoins', async (req, res) => {
  try {
    const candidates = await getAltcoinCandidates();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch altcoin candidates' });
  }
});

// Route to register an investor
app.post('/api/register', async (req, res) => {
  const { investorAddress } = req.body;
  try {
    await registerInvestor(investorAddress);
    res.json({ message: `Investor ${investorAddress} registered successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register investor' });
  }
});

// Route to cast a vote
app.post('/api/vote', async (req, res) => {
  const { investorAddress, preferences } = req.body;
  try {
    await castVote(investorAddress, preferences);
    res.json({ message: 'Vote cast successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cast vote' });
  }
});

// Route to get an investor's voting preferences
app.get('/api/preferences/:investorAddress', async (req, res) => {
  const { investorAddress } = req.params;
  try {
    const preferences = await getInvestorPreferences(investorAddress);
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch investor preferences' });
  }
});

// Route to tally votes (only accessible by the owner)
app.get('/api/tally', async (req, res) => {
  try {
    const result = await tallyVotes();
    res.json({ message: `Election result: ${result}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to tally votes' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Altcoin fund governance app listening at http://localhost:${port}`);
});