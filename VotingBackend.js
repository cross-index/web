const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const contractPath = path.resolve(__dirname, 'build', 'GovernanceContract.json');
const contractJSON = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
const contractABI = contractJSON.abi;
const contractAddress = '0xYourDeployedContractAddress';  // Replace with actual contract address

const governanceContract = new web3.eth.Contract(contractABI, contractAddress);

// Register a new investor (voter)
async function registerInvestor(investorAddress) {
  const accounts = await web3.eth.getAccounts();
  const owner = accounts[0];

  try {
    await governanceContract.methods.registerVoter(investorAddress).send({ from: owner });
    console.log(`Investor ${investorAddress} registered successfully.`);
  } catch (error) {
    console.error('Error registering investor:', error);
  }
}

// Cast a vote with preferences
async function castVote(investorAddress, preferences) {
  try {
    await governanceContract.methods.vote(preferences).send({ from: investorAddress });
    console.log(`Vote cast successfully by ${investorAddress}`);
  } catch (error) {
    console.error('Error casting vote:', error);
  }
}

// Get list of altcoin candidates
async function getAltcoinCandidates() {
  try {
    const candidates = await governanceContract.methods.getCandidates().call();
    console.log('Altcoin Candidates:', candidates);
    return candidates;
  } catch (error) {
    console.error('Error fetching candidates:', error);
  }
}

// Get investor's voting preferences
async function getInvestorPreferences(investorAddress) {
  try {
    const preferences = await governanceContract.methods.getVoterPreferences(investorAddress).call();
    console.log(`Preferences of investor ${investorAddress}:`, preferences);
    return preferences;
  } catch (error) {
    console.error('Error fetching preferences:', error);
  }
}

// Tally the votes (this is automatically done after all votes are cast on the smart contract side)
async function tallyVotes() {
  try {
    const result = await governanceContract.methods.tallyVotes().call();
    console.log('Election Result:', result);
    return result;
  } catch (error) {
    console.error('Error tallying votes:', error);
  }
}

module.exports = {
  registerInvestor,
  castVote,
  getAltcoinCandidates,
  getInvestorPreferences,
  tallyVotes
};