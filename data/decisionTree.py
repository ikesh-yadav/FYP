def decision_tree(ans,feedback):
	ran_list=[]
	for i in range(len(ans)):
		if(ans[i]=="right" and feedback[i]=="good"):
			ran_list.append(6)
		elif(ans[i]=="right" and feedback[i]=="average"):
			ran_list.append(5)
		elif(ans[i]=="right" and feedback[i]=="bad"):
			ran_list.append(4)
		elif(ans[i]=="wrong" and feedback[i]=="good"):
			ran_list.append(3)
		elif(ans[i]=="wrong" and feedback[i]=="average"):
			ran_list.append(2)
		else:
			ran_list.append(1)
	return ran_list
def decision_tree1(ans,feedback_st,feedback_t):
    ran_list=[]
    for i in range(len(ans)):
        if(ans[i]=="right" and feedback_st[i]=="good" and feedback_t[i]=="good"):
            ran_list.append(18)
        elif(ans[i]=="right" and feedback_st[i]=="good" and feedback_t[i]=="average"):
            ran_list.append(17)
        elif(ans[i]=="right" and feedback_st[i]=="good" and feedback_t[i]=="bad"):
            ran_list.append(16)
        elif(ans[i]=="right" and feedback_st[i]=="average" and feedback_t[i]=="good"):
            ran_list.append(15)
        elif(ans[i]=="right" and feedback_st[i]=="average" and feedback_t[i]=="average"):
            ran_list.append(14)
        elif(ans[i]=="right" and feedback_st[i]=="average" and feedback_t[i]=="bad"):
            ran_list.append(13)
        elif(ans[i]=="right" and feedback_st[i]=="bad" and feedback_t[i]=="good"):
            ran_list.append(12)
        elif(ans[i]=="right" and feedback_st[i]=="bad" and feedback_t[i]=="average"):
            ran_list.append(11)
        elif(ans[i]=="right" and feedback_st[i]=="bad" and feedback_t[i]=="bad"):
            ran_list.append(10)
        elif(ans[i]=="wrong" and feedback_st[i]=="good" and feedback_t[i]=="good"):
            ran_list.append(9)
        elif(ans[i]=="wrong" and feedback_st[i]=="good" and feedback_t[i]=="average"):
            ran_list.append(8)
        elif(ans[i]=="wrong" and feedback_st[i]=="good" and feedback_t[i]=="bad"):
            ran_list.append(7)
        elif(ans[i]=="wrong" and feedback_st[i]=="average" and feedback_t[i]=="good"):
            ran_list.append(6)
        elif(ans[i]=="wrong" and feedback_st[i]=="average" and feedback_t[i]=="average"):
            ran_list.append(5)
        elif(ans[i]=="wrong" and feedback_st[i]=="average" and feedback_t[i]=="bad"):
            ran_list.append(4)
        elif(ans[i]=="wrong" and feedback_st[i]=="bad" and feedback_t=="good"):
            ran_list.append(3)
        elif(ans[i]=="wrong" and feedback_st[i]=="bad" and feedback_t[i]=="average"):
            ran_list.append(2)
        else:
            ran_list.append(1)
    return ran_list