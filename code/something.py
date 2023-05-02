apple={"A":{"Paid": 500}, "B":{"Paid":1000},"C":{"Paid":0},"D":{"Paid":0} }
not_paid=[]
total=0

def calc_ind(apple):
    for k in apple:
        total += apple[k]["Paid"]
    ind = total/len(apple)
    return ind

for k in apple:
    total+=apple[k]["Paid"]
ind=total/len(apple)


for k in apple:
    if (apple[k]["Paid"]<ind):
        not_paid.append(k)
#         continue
#     total+=apple[k]["Paid"]
# ind=total/len(apple)

print("The list of users who have not paid: ", not_paid)
while(len(not_paid)>0):
    for i in apple:
        print("The current value being checked: ",i)
        if (apple[i]["Paid"]>ind):
            # for j in not_paid:
            j=not_paid[0]
            if(apple[i]["Paid"]-ind>ind):
                # if (apple[j]["Paid"]<ind):
                #     print("apple s sss")
                #     apple[i]["Paid"] = apple[i]["Paid"]-ind
                #     apple[j][i]=ind 
                #     apple[j]["Paid"]+=ind
                #     if (apple[j]["Paid"] == ind):
                #         not_paid.remove(j)
                # else:
                payable=ind-apple[j]["Paid"]
                apple[i]["Paid"] = apple[i]["Paid"]-payable
                apple[j][i]=payable
                apple[j]["Paid"]+=payable
                if (apple[j]["Paid"] == ind):
                    not_paid.remove(j)

            else:
                print("Reached here!!")
                amt=apple[i]["Paid"]-ind
                apple[j][i]=amt
                apple[j]["Paid"]+=amt
                apple[i]["Paid"]-=amt
                if(apple[j]["Paid"]==ind):
                    not_paid.remove(j)
        print(not_paid)
        print(apple)





# print(not_paid)
# print(ind)
# print(total)
# print(apple)
