payable=ind-apple[j]["Paid"]
            apple[i]["Paid"] = apple[i]["Paid"]-payable
            apple[j][i]=payable
            apple[j]["Paid"]+=payable
            if (apple[j]["Paid"] == ind):
                not_paid.remove(j)