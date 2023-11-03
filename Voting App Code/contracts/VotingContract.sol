// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract VotingContract {
    uint256 public _voterId;
    uint256 public _candidateId;

    address public votingOrganizer;

    struct Candidate {
        uint256 candidateId;
        string age;
        string name;
        string image;
        uint256 voterCount;
        address _address;
        string ipfs;
    }

    modifier validAge(string memory _age) {
        // Convert the string age to a uint256 value
        uint256 ageNumeric = parseAge(_age);
        
        require(ageNumeric >= 18 && ageNumeric <= 70, "Age must be between 18 and 70");
        _;
    }

   function parseAge(string memory _age) internal pure returns (uint256) {
    bytes memory ageBytes = bytes(_age);
        uint256 ageValue = 0;

        require(ageBytes.length > 0, "Invalid age format");

        for (uint256 i = 0; i < ageBytes.length; i++) {
            // Convert the character to its corresponding numeric value
            uint256 charValue = uint256(uint8(ageBytes[i]));

            // Ensure the character represents a valid digit (ASCII range 0-9)
            require(charValue >= 48 && charValue <= 57, "Invalid age format");

            // Calculate the age value by accumulating each digit
            ageValue = ageValue * 10 + (charValue - 48);
        }

        return ageValue;
    }

    event CandidateCreated(
        uint256 indexed candidateId,
        string age,
        string name,
        string image,
        uint256 voterCount,
        address _address,
        string ipfs
    );

    address[] public candidateAddress;

    mapping(address => Candidate) public candidates;

    //////////// End Of Candidate Data
    //----------- Voter Data

    address[] public votedVoters;
    address[] public votersAddress;

    mapping(address => Voter) public voters;

    struct Voter {
        uint256 voter_voterId;
        string voter_name;
        string voter_image;
        address _address;
        uint256 voter_allowed;
        bool voter_voted;
        uint256 voter_vote;
        string voter_ipfs;
    }

    event VoterCreated(
        uint256 indexed voter_voterId,
        string voter_name,
        string voter_image,
        address _address,
        uint256 voter_allowed,
        bool voter_voted,
        uint256 voter_vote,
        string voter_ipfs
    );

    //------ End OF Voter Data

    constructor() {
        votingOrganizer = msg.sender;
    }

    function setCandidate(
        address _address,
        string memory _age,
        string memory _name,
        string memory _image,
        string memory _ipfs
    ) public validAge(_age) {
        require(votingOrganizer == msg.sender, "Only organizer can allow");

        _candidateId++;

        uint256 idNumber = _candidateId;
        Candidate storage candidate = candidates[_address];

        candidate.age = _age;
        candidate.name = _name;
        candidate.image = _image;
        candidate.ipfs = _ipfs;
        candidate.candidateId = idNumber;
        candidate.voterCount = 0;
        candidate._address = _address;

        candidateAddress.push(_address);

        emit CandidateCreated(
            idNumber,
            _age,
            _name,
            _image,
            candidate.voterCount,
            _address,
            _ipfs
        );
    }

    function getCandidate() public view returns (address[] memory) {
        return candidateAddress;
    }

    function getCandidateLength() public view returns (uint256) {
        return candidateAddress.length;
    }

    function getCandidatedata(address _address)
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            string memory,
            uint256,
            string memory,
            address
        )
    {
        return (
            candidates[_address].age,
            candidates[_address].name,
            candidates[_address].candidateId,
            candidates[_address].image,
            candidates[_address].voterCount,
            candidates[_address].ipfs,
            candidates[_address]._address
        );
    }

    ///--------------------- Voter Section ----------------------
    function voterRight(
        address _address,
        string memory _name,
        string memory _image,
        string memory _ipfs
    ) public {
        require(
            votingOrganizer == msg.sender,
            "Only the organizer can create voters."
        );

        _voterId++;
        uint256 idNumber = _voterId;

        Voter storage voter = voters[_address];
        require(voter.voter_allowed == 0);

        voter.voter_allowed = 1;
        voter.voter_name = _name;
        voter.voter_image = _image;
        voter._address = _address;
        voter.voter_voterId = idNumber;
        voter.voter_vote = 1000;
        voter.voter_voted = false;
        voter.voter_ipfs = _ipfs;

        votersAddress.push(_address);

        emit VoterCreated(
            idNumber,
            _name,
            _image,
            _address,
            voter.voter_allowed,
            voter.voter_voted,
            voter.voter_vote,
            _ipfs
        );
    }

    function vote(address _candidateAddress, uint256 _candidateVoteId)
        external
    {
        Voter storage voter = voters[msg.sender];

        require(!voter.voter_voted, "You have already voted");
        require(voter.voter_allowed != 0, "You have no right to vote");

        voter.voter_voted = true;
        voter.voter_vote = _candidateVoteId;

        votedVoters.push(msg.sender);
        candidates[_candidateAddress].voterCount += voter.voter_allowed;
    }

    function getVoterLength() public view returns (uint256) {
        return votersAddress.length;
    }

    function getVoterdata(address _address)
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            address,
            uint256,
            bool,
            uint256,
            string memory
        )
    {
        Voter storage voter = voters[_address];
        return (
            voter.voter_voterId,
            voter.voter_name,
            voter.voter_image,
            voter._address,
            voter.voter_allowed,
            voter.voter_voted,
            voter.voter_vote,
            voter.voter_ipfs
        );
    }

    function getVotedVoterList() public view returns (address[] memory) {
        return votersAddress;
    }

    function getVoterList() public view returns (address[] memory) {
        return votersAddress;
    }
}
