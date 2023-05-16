//SPDX-License-Identifier:MIT
pragma solidity ^0.8.10;


contract Sikka{
    
    struct Expense {
        string description;
        uint256 amount;
        address contributor;
        // bool isPaid;
    }

    struct Group {
        string name;
        address [] members;
        mapping(address => bool) isMember;
        mapping(uint256=>Expense) expenses;
        uint256 expenseCount;
        mapping (address => uint256) contributors;
        address[] nonpaid;
        int256[][] expense2dArray;
        mapping(address=>mapping(address=>uint256))  topay;
    }
    
    mapping(address => Group) public groups;
    address[] public groupOwners; // Keep track of group owners

    function createGroup(string memory _groupName) public {
        Group storage group = groups[msg.sender];
        require(!isGroupExist(msg.sender), "Group already exists");
        group.name = _groupName;
        groupOwners.push(msg.sender); // Add the group owner to the groupOwners array
        addMembers(msg.sender,msg.sender);
    }

    function addExpense(
        address _groupOwner,
        string memory _expenseDescription,
        uint256 _expenseAmount,
        address _contributor
    ) public {
        require(isGroupExist(_groupOwner), "Group does not exist");
        Group storage group = groups[_groupOwner];
        require(group.isMember[msg.sender], "Not a member of the group");
        require(group.isMember[_contributor], "Not a member of the group");

        // Create Expense object
        Expense storage expense = group.expenses[group.expenseCount];
        expense.description = _expenseDescription;
        expense.amount = _expenseAmount;
        expense.contributor=_contributor ;
        // expense.isPaid = false;
        // Increment expense count
        group.expenseCount++;
        group.contributors[expense.contributor]+= expense.amount;
 
    }

    function addMembers(address _groupOwner,address  _member)
    public{
        require(isGroupExist(_groupOwner), "Group does not exist");
        Group storage group = groups[_groupOwner];
        require(!group.isMember[_member], "Member already exists");
        group.members.push(_member);
        group.isMember[_member] = true;
    }



    function getMembers(address _groupOwner) public view returns (address[] memory){
        Group storage group= groups[_groupOwner];
        return group.members;
    }

    function isGroupExist(address _groupOwner) public view returns (bool) {
        Group storage group = groups[_groupOwner];
        return bytes(group.name).length > 0;
    }

    //groupCount
     function getGroupCount() public view returns (uint256) {
        return groupOwners.length;
    }

     // Function to retrieve a specific group by index
    function getGroup(uint256 index) public view returns (string memory, address,address[] memory, string[] memory, uint256[] memory) {
        require(index < groupOwners.length, "Invalid group index");
        address groupOwner = groupOwners[index]; // Get the group owner at the given index
        Group storage group = groups[groupOwner]; // Retrieve the Group struct from the mapping
        address[] memory contributors = new address[](group.expenseCount);
        string[] memory descriptions = new string[](group.expenseCount);
        uint256[] memory amounts = new uint256[](group.expenseCount);
        // bool[] memory isPaid = new bool[](group.expenseCount);

        for (uint256 i = 0; i < group.expenseCount; i++) {
            Expense storage expense = group.expenses[i];
            contributors[i]=expense.contributor;
            descriptions[i] = expense.description;
            amounts[i] = expense.amount;
            // isPaid[i] = expense.isPaid;
        }
        return (group.name, groupOwner,group.members, descriptions, amounts);
    }


    function getContributors(address _groupOwner) public view returns (address[] memory) {
        Group storage group = groups[_groupOwner];
        address[] memory contributorList = new address[](group.expenseCount);
        uint256 index = 0;

        for (uint256 i = 0; i < group.expenseCount; i++) {
            Expense storage expense = group.expenses[i];
            bool isDuplicate = false;

            // Check if the current contributor already exists in the list
            for (uint256 j = 0; j < index; j++) {
                if (contributorList[j] == expense.contributor) {
                    isDuplicate = true;
                    break;
                }
            }

            // If the contributor is not a duplicate, add it to the list
            if (!isDuplicate) {
                contributorList[index] = expense.contributor;
                index++;
            }
        }

        // Trim the contributorList array to remove any unused slots
        address[] memory trimmedContributors = new address[](index);
        for (uint256 i = 0; i < index; i++) {
            trimmedContributors[i] = contributorList[i];
        }

        return trimmedContributors;
    }


    function getContributorAmount(address _groupOwner,address _contributor) public view returns (uint){
        Group storage group = groups[_groupOwner];
        return (group.contributors[_contributor]);
    }

    function getExpense(address _groupOwner, uint256 _expenseIndex) public view returns (string memory, uint256, address) {
        Group storage group = groups[_groupOwner];
        Expense storage expense = group.expenses[_expenseIndex];

        return (expense.description, expense.amount, expense.contributor);
    }


    function initializeExpense(address _groupOwner) internal {
        Group storage group = groups[_groupOwner];
        int256[][] memory expense2dArrayCopy = new int256[][](group.members.length);
        
        for (uint256 i = 0; i < group.members.length; i++) {
            expense2dArrayCopy[i] = new int256[](group.members.length);
            
            for (uint256 j = 0; j < group.members.length; j++) {
                expense2dArrayCopy[i][j] = 0;
            }
        }
        group.expense2dArray = expense2dArrayCopy;
    }
        
    function findMemberIndex(address[] memory members, address member) private pure returns (uint256) {
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == member) {
                return i;
            }
        }
        revert("Member not found in group");
    }

    function splitwise(address _groupOwner) public{
        Group storage group = groups[_groupOwner];
        initializeExpense(_groupOwner);
        int256[][] memory expense2dArrayCopy = group.expense2dArray;
        for(uint i = 0; i < group.expenseCount;i++){
            Expense memory expense = group.expenses[i];
            uint256 payerIndex = findMemberIndex(group.members,expense.contributor);
            int256 splitExpense = int(expense.amount/group.members.length);
            for(uint j = 0; j< group.members.length;j++){
                if (j == payerIndex) {
                    expense2dArrayCopy[payerIndex][j] = 0;
                } else {
                    expense2dArrayCopy[payerIndex][j] += splitExpense;
                }   
            }
        }
            group.expense2dArray = expense2dArrayCopy;
    }

    function getTopay(address from, address to, address _groupOwner) public view returns(int256) {
        Group storage group = groups[_groupOwner];
        uint indexOfFrom = findMemberIndex(group.members,from);
        uint indexOfTo = findMemberIndex(group.members,to);
        int settlementAmount = group.expense2dArray[indexOfTo][indexOfFrom] - group.expense2dArray[indexOfFrom][indexOfTo];
        if (settlementAmount > 0){
            return settlementAmount;
        }
        else{
            return 0;
        }
        
    }


    function getMemberedGroups(address _ownerAddress) public view returns (address[] memory, string[] memory){
        uint256 groupCount = getGroupCount();
        address[] memory groupList = new address[](groupCount);
        string[] memory groupNameList= new string[](groupCount);
        uint256 index = 0;
        while (groupCount > 0) {
            Group storage group = groups[groupOwners[groupCount - 1]];
            for (uint256 i = 0; i < group.members.length; i++) {
                if (_ownerAddress == group.members[i]){
                    groupList[index] = groupOwners[groupCount - 1];
                    groupNameList[index]=group.name;
                    index++;
                    break;
                }
            }
            groupCount--;
        }
        // Trim the contributorList array to remove any unused slots
        address[] memory trimmedgroupList = new address[](index);
        string[] memory trimmedgroupNameList = new string[](index);
        for (uint256 i = 0; i < index; i++) {
            trimmedgroupList[i]=groupList[i];
            trimmedgroupNameList[i]=groupNameList[i];
        }

        return (trimmedgroupList,trimmedgroupNameList);
    }

    function transfer( address _recieverAddress,address _groupAddress) public payable {
        Group storage group= groups[_groupAddress];
        address payable sender= payable(msg.sender);
        int256 amount= getTopay( sender, _recieverAddress, _groupAddress);
        // amount=msg.value;
        // amount= 1000000000000000;
        address payable reciever = payable(_recieverAddress);
        bool senderExists= false;
        bool recieverExists= false;

        // To check if the sender or reciever exists or not:
        for (uint i=0;i<group.members.length;i++)
        {
            if(sender == group.members[i]){
                senderExists=true;
                break;
            }
        }
        for (uint i=0;i<group.members.length;i++)
        {
            if(reciever== group.members[i]){
                recieverExists=true;
                break;
            }
        }
        require(msg.value == uint256(amount),"Amount mismatch, give exact amount");
        require(senderExists,"Sender does not exists");
        require(recieverExists,"Reciever does not exist.");
        require(sender!=reciever,"Sender and reciever cannot be same.");
        require(address(this).balance >= uint256(amount), "Insufficient balance");
        // require(amount>0 , "No amount to be transferred.");
        
        uint indexOfSender = findMemberIndex(group.members,sender);
        uint indexOfReceiver = findMemberIndex(group.members,_recieverAddress);
        reciever.transfer(uint256(amount));
        group.expense2dArray[indexOfSender][indexOfReceiver] -= amount;
        
    }

}