// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GovernanceContract {
    struct Candidate {
        string altcoinName;
        uint voteCount;
    }

    struct Voter {
        bool voted;
        uint weight;
        uint[] preferences;
    }

    address public owner;
    Candidate[] public candidates;
    mapping(address => Voter) public voters;
    uint public totalVotes;
    uint public numCandidates;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    event NewCandidate(string altcoinName);
    event VoteCast(address voter, uint[] preferences);
    event ElectionResult(string winner);

    constructor(string[] memory altcoinNames) {
        owner = msg.sender;
        numCandidates = altcoinNames.length;
        for (uint i = 0; i < numCandidates; i++) {
            candidates.push(Candidate({
                altcoinName: altcoinNames[i],
                voteCount: 0
            }));
        }
    }

    function registerVoter(address voterAddress) public onlyOwner {
        require(!voters[voterAddress].voted, "Voter is already registered");
        voters[voterAddress].weight = 1;
    }

    function vote(uint[] memory preferences) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "Already voted");
        require(preferences.length == numCandidates, "Invalid number of preferences");

        sender.voted = true;
        sender.preferences = preferences;

        for (uint i = 0; i < preferences.length; i++) {
            candidates[preferences[i]].voteCount += sender.weight / (i + 1);
        }

        totalVotes++;
        emit VoteCast(msg.sender, preferences);

        if (totalVotes == numCandidates) {
            tallyVotes();
        }
    }

    function tallyVotes() private {
        uint winningVoteCount = 0;
        string memory winner;

        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winner = candidates[i].altcoinName;
            }
        }

        emit ElectionResult(winner);
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getVoterPreferences(address voterAddress) public view returns (uint[] memory) {
        require(voters[voterAddress].voted, "Voter has not voted");
        return voters[voterAddress].preferences;
    }
}