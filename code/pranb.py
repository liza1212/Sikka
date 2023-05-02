class Expense:
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
        self.topay = {x: {y: 0 for y in self.members} for x in self.members}
#         print(self.topay)

    def sep_contributor(self):
        avg = self.calculate_avg()
        for i in range(self.expenseCount):
            if (self.expenses[i].contributor in self.members):
                self.contributors[self.expenses[i].contributor] = self.expenses[i].amount
                for j in self.topay[self.expenses[i].contributor]:
                    if (j == self.expenses[i].contributor):
                        self.topay[self.expenses[i].contributor][j] = self.expenses[i].amount

        print(self.contributors)
        print(self.topay)
        self.nonpaid = [
            x for x in self.members if x not in self.contributors or self.contributors[x] < avg]

    def calculate_debts(self):
        pass

    def splitwise(self):
        avg = self.calculate_avg()
        print(avg)
        self.initialize_topay()
        self.sep_contributor()
        print(self.nonpaid)
        while (len(self.nonpaid) > 0):
            for member in self.members:
                print("Value being checked for", member)
                if (self.topay[member][member] > avg):
                    print("Hello PRANAB", self.topay[member][member])
                    j = self.nonpaid[0]
                    print(j)
                    if (self.topay[member][member] - avg > avg):
                        payable = avg - self.topay[j][j]
                        print("Payable", payable)
                        self.topay[member][member] -= payable
                        self.topay[j][member] = payable
                        self.topay[j][j] += payable
                        if (self.topay[j][j] == avg):
                            self.nonpaid.remove(j)
                    else:
                        print("------------Reached here----------------")
                        amt = self.topay[member][member] - avg
                        self.topay[j][member] = amt
                        self.topay[j][j] += amt
                        self.topay[member][member] -= amt
                        if (self.topay[j][j] == avg):
                            self.nonpaid.remove(j)

                print(self.nonpaid)
                print(self.topay)
                print("--------------------------------------------------------")


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
#     print(i.description,i.amount,i.contributor,i.isPaid)
