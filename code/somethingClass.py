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
        self.name=name
        self.members=members
        self.isMember ={member: True for member in members}
        self.expenses=[] #array of objects of expenses
        self.expenseCount=0
        self.contributors={}
        self.nonpaid=[]
        self.topay={}


    def add_expense(self, expense): 
        self.expenses.append(expense)
        self.expenseCount+=1
    
    def calculate_avg(self):
        sum=0
        for expense in self.expenses:
            sum+=expense.amount
        return sum/len(self.members)
    
    def initialize_topay(self):
        for member in self.members:
            self.topay[member]={}
            for recipient in self.members:
                self.topay[member][recipient]=0
    
    def mark_contributors(self):
        avg=self.calculate_avg()
        for i in range(self.expenseCount):
            if (self.expenses[i].contributor in self.members):
                self.contributors[self.expenses[i].contributor]= self.expenses[i].amount
                contributor_name=str(self.expenses[i].contributor)
                # print(type(contributor_name))
                # print(self.topay[contributor_name])
                for j in self.topay[self.expenses[i].contributor]:
                    if (j == self.expenses[i].contributor):
                        self.topay[self.expenses[i].contributor][j] = self.expenses[i].amount
                    # print (j)
                    # print(self.expenses[i].contributor)
                self.nonpaid = [
                    x for x in self.members if x not in self.contributors or self.contributors[x] < avg]
                # print("To pay: ", self.topay)
                # print("Contributors: ", self.contributors)
                # print("Not paid: ",self.nonpaid)
                # print()

    def add_members(self):
        '''
        To add new members after some time that the group has been created.
        '''
        pass

    # def display(self):
    #     self.initialize_topay()
    #     self.mark_contributors()
    #     print(self.topay)

    def splitwise(self):
        '''
        Calculates how much each person has to give to the other person.
        '''
        self.initialize_topay()
        self.mark_contributors()
        avg=self.calculate_avg()
        # print(self.expenses)

        # while(len(self.nonpaid)>0):
        for member in self.members:
            # if member not in self.nonpaid:
            #     member_contribution=self.expenses[self.expenses.index(member)].amount
            # else:
            #     member_contribution=0
            for ind in self.contributors:
                if(ind==member):
                    member_contribution=self.contributors[ind]
                else:
                    member_contribution=0
            print("For member: ", member)
            if(member_contribution>avg):
                j=self.nonpaid[0]
                print(j)
            # else:



            # for ind in self.topay[member]:
        # for
            print(member_contribution) 

                        



    # create a new Expense object
e1 = Expense("Lunch", 500, "A")
e2 = Expense("Dinner", 1000, "B")
e3 = Expense("ChawChaw", 100, "C")


# add the expense to the group
new_group = Group("Liza", ["A", "B", "C", "D"])
new_group.add_expense(e1)
new_group.add_expense(e2)

# new_group.display()
new_group.splitwise()