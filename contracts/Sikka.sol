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
        mapping(address=>mapping(address=>uint256))  topay;
    }
    
    mapping(address => Group) public groups;
    address[] public groupOwners; // Keep track of group owners

    function createGroup(string memory _groupName) public {
        Group storage group = groups[msg.sender];
        require(!isGroupExist(msg.sender), "Group already exists");
        group.name = _groupName;
        group.members.push(msg.sender);
        group.isMember[msg.sender] = true;
        groupOwners.push(msg.sender); // Add the group owner to the groupOwners array
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

    function getContributors(address _groupOwner) public view returns(address[] memory ){
        Group storage group = groups[_groupOwner];
        address [] memory contributorList=new address[](group.expenseCount);
        uint index = 0;
        for(uint i = 0;i<group.expenseCount;i++ ){
            Expense storage expense = group.expenses[i];
            contributorList[index]=expense.contributor;
            index ++;
        }  
        return contributorList;
    }


   //calculate average
   function calculateAvg(address _groupOwner) public view returns(uint256){
       require(isGroupExist(_groupOwner), "Group does not exist");
       Group storage group = groups[_groupOwner];
       uint256 sum = 0;
       for(uint256 i = 0; i<group.expenseCount;i++){
           sum += group.expenses[i].amount; 
       }
       return (sum/group.members.length);
   }

    //initialize topay as {A:{A:9}
   function initializeTopay(address _groupOwner) internal {
       Group storage group = groups[_groupOwner];
        for (uint256 i=0; i<group.members.length; i++) {
            for (uint256 j=0; j<group.members.length; j++) {
                group.topay[group.members[i]][group.members[j]] = 0;
            }
        }
    }

   function markContributor(address _groupOwner) internal {
        uint256 avg = calculateAvg(_groupOwner);
        Group storage group = groups[_groupOwner];
        initializeTopay(_groupOwner);
        for (uint256 i=0; i<group.expenseCount; i++) {
            Expense storage expense = group.expenses[i];
            require(group.isMember[expense.contributor], "Not a member of the group");
            
                group.contributors[expense.contributor] = expense.amount;
                for (uint256 j=0; j<group.members.length; j++) {
                        if (group.members[j] == expense.contributor) {
                            group.topay[expense.contributor][expense.contributor] = expense.amount;
                        }
                }
            
        }
        for (uint256 i=0; i<group.members.length; i++) {
            if (!group.isMember[group.members[i]] || group.contributors[group.members[i]] < avg) {
                group.nonpaid.push(group.members[i]);
            }
        }
    
    }

    function splitwise(address _groupOwner) public {
        uint256 avg = calculateAvg(_groupOwner);
        markContributor( _groupOwner);
        Group storage group = groups[_groupOwner];
        while(group.nonpaid.length > 0) {
            for(uint256 i = 0; i < group.members.length; i++) {
                address member = group.members[i];
                if(group.topay[member][member] > avg) {
                    address j = group.nonpaid[0];
                    if(group.topay[member][member] - avg > avg) {
                        uint256 pay = avg - group.topay[j][j];
                        group.topay[member][member] -= pay;
                        group.topay[j][member] = pay;
                        group.topay[j][j] += pay;
                    }
                    else {
                        uint256 amt = group.topay[member][member] - avg;
                        group.topay[j][member] = amt;
                        group.topay[j][j] += amt;
                        group.topay[member][member] -= amt;
                    }
                    if(group.topay[j][j] == avg) {
                        for(uint256 k = 0; k < group.nonpaid.length; k++) {
                            if(group.nonpaid[k] == j) {
                                group.nonpaid[k] = group.nonpaid[group.nonpaid.length-1];
                                group.nonpaid.pop();
                            }
                        }
                    }
                }
            }
        }
    }

    function getTopay(address from, address to, address _groupOwner) public view returns(uint256) {
        Group storage group = groups[_groupOwner];
        return group.topay[from][to];
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
        return (groupList,groupNameList);
    }
}