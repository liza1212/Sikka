class Expense:
    '''
    To represent the expense of individual
    '''
    def __init__(self, description, amount, contributor):
        self.description = description
        self.amount = amount
        self.contributor = contributor
        self.isPaid = False


class Group:
    def __init__(self, name, members):
        self.name = name
        self.members = members
        self.isMember = {member: True for member in members}
        self.expenses = []
        self.expenseCount = 0
        self.contributors = {}
        self.nonpaid = []
        self.topay = {}

    def add_expense(self, expense):
        self.expenses.append(expense)
        self.expenseCount += 1

    def calculate_avg(self):
        sum = 0
        for expense in self.expenses:
            sum += expense.amount
        return sum/len(self.members)

    def initialize_topay(self):
        for member in self.members:
            self.topay[member] = []
            for recipient in self.members:
                self.topay[member].append([recipient, 0])

    def sep_contributor(self):
        avg = self.calculate_avg()
        for i in range(self.expenseCount):
            if (self.expenses[i].contributor in self.members):
                self.contributors[self.expenses[i].contributor] = self.expenses[i].amount
                for j in self.topay[self.expenses[i].contributor]:
                    if j[0] == self.expenses[i].contributor:
                        j[1] = self.expenses[i].amount
        print(self.contributors)
        self.nonpaid = [x for x in self.members if x not in self.contributors or self.contributors[x] < avg]

    def calculate_debts(self):
        pass

    def splitwise(self):
        avg = self.calculate_avg()
        self.initialize_topay()
        self.sep_contributor()
        print(self.nonpaid)
        payable = 0
        while (len(self.nonpaid) > 0):
            for member in self.members:
                print("Value being checked for", member)
                for mem in self.topay[member]:
                    if mem[1] > avg:
                        print(mem[0])
                        j = self.nonpaid[0]
                        if (mem[1] - avg > avg):
                            for k in self.topay[j]:
                                if k[0] == mem[0]:
                                    mem[1] -= payable
                                    k[1] = payable
                                if k[0] == j:
                                    payable = avg - k[1]
                                    k[1] += payable
                                    self.nonpaid.remove(j)
                        else:
                            print("Reached here")
                            amt = mem[1] - avg
                            for k in self.topay[j]:
                                if k[0] == mem[0]:
                                    k[1] = amt
                                    mem[1] -= amt
                                if k[0] == j:
                                    k[1] += amt
                                    self.nonpaid.remove(j)
                print(self.nonpaid)
                print(self.topay)


# create a new Expense object
e1 = Expense("Lunch", 500, "A")
e2 = Expense("Dinner", 1000, "B")
e3 = Expense("ChawChaw", 100, "C")
# add the expense to the group
new_group = Group("Liza", ["A", "B", "C", "D"])
new_group.add_expense(e1)
new_group.add_expense(e2)


print(new_group.members)


# new_group.initialize_topay()
# new_group.sep_contributor()
new_group.splitwise()

# for i in new_group.expenses:
#     print(i.description,i.amount,i.contributor,i.isPaid)```
