# -*- coding: utf-8 -*-

"""#Data Extraction

All libraries used:
"""
import sys
import copy
import string
import os
import pydotplus
from io import StringIO
from sklearn.tree import export_graphviz
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from numpy import loadtxt
import seaborn as sns
import matplotlib.pyplot as plot
import pandas as pd
import matplotlib.pyplot as plt
from pandas.plotting import scatter_matrix
from pylab import savefig
sys.path.insert(1, './data/')
import decisionTree


"""#Deleting previous Files"""
if os.path.exists("./public/graphs/bar_chart.png"):
    os.remove("./public/graphs/bar_chart.png")
if os.path.exists("./public/graphs/Correlation-Matrix-Plot.png"):
    os.remove("./public/graphs/Correlation-Matrix-Plot.png")
if os.path.exists("./public/graphs/tree1.png"):
    os.remove("./public/graphs/tree1.png")
if os.path.exists("tree3.png"):
    os.remove("tree3.png")
if os.path.exists("./public/results/Difficulty_metric.csv"):
    os.remove("./public/results/Difficulty_metric.csv")
if os.path.exists("./public/results/mapping_mark_fdbk.csv"):
    os.remove("./public/results/mapping_mark_fdbk.csv")
if os.path.exists("./public/results/Student_understanding.csv"):
    os.remove("./public/results/Student_understanding.csv")

"""Importing Data"""
cie_data = pd.read_csv('./data/cie1.csv')
s_fd = pd.read_csv('./data/StudentFeedback2.csv')
t_fd = pd.read_csv('./data/TeacherFeedback2.csv')
key = pd.read_csv('./data/key.csv')
# print(cie_data)

cie1_key = list(key.loc[0])
topics_of_questions = list(key.loc[1])
no_of_students = len(cie_data)
no_of_questions = len(cie1_key)
no_of_topics = max(topics_of_questions)


"""#Feedback Summarization

All functions used in bayes.py
"""

# strip punctuation, make all lowercase


def undress_string(line):
    new = ""
    for c in line.lower():
        if c in (string.digits + string.ascii_lowercase + " "):
            new += c
    return new


def wordcount(source):
    try:
        count = 0
        for line in source:
            line = undress_string(line)
            for word in line.split(" "):
                if word != "":
                    count += 1
        return count
    except UnicodeDecodeError:
        # print("UnicodeDecodeError")
        return 0

# returns dict of word/count pairs for top-frequency words.
# max is limit of dict size, or 0 if full count should be included


def tally(source, max_count, top_words=None):
    try:
        counts = {}
        if top_words:
            for word in top_words:
                counts[word] = 1    # avoid 0 probabilities

        for line in source:
            line = undress_string(line)
            for word in line.split(" "):
                if word != "":
                    if word in (counts if not top_words else top_words):
                        counts[word] += 1
                    elif not top_words:
                        counts[word] = 1

        words = list(counts.items())
        return slice_top(words, max_count)
    except UnicodeDecodeError:
        #print("UnicodeDecodeError in", source)
        return {}


def slice_top(items, max_count):
    items.sort(key=lambda item: item[1])

    length = len(items) if max_count == 0 else min(len(items), max_count)
    return dict(items[-length:])


def merge_tallies(source, new, max_count):
    for word, count in new.items():
        if word in source:
            source[word] += count
        else:
            source[word] = count
    items = list(source.items())
    return slice_top(items, max_count)


"""bayes.py (For predicting which catogory the sentence belongs to)"""

# bayes code
NUM_WORDS = 25

# classifies testWords based on the model in modelData


def bayes(testWords, modelData):
    # totalWords = 0
    # totalFiles = 0
    # for category, (words, numWords, numFiles) in modelData.items():
    #     totalWords += numWords
    #     totalFiles += numFiles
    # print(totalWords)
    # print(totalFiles)
    # prob = {}
    # totalProb = 0.0
    # for category, (words, numWords, numFiles) in modelData.items():
    #     p = 1.0
    #     for word in testWords:
    #         count = words[word] if word in words else 1
    #         p *= count / (numWords if numWords > 0 else 1)
    #     p *= numFiles / totalFiles
    #     prob[category] = p
    #     totalProb += p

    # predictions = {}
    # for category in modelData:
    #     predictions[category] = prob[category] / totalProb

    # return predictions
    maxcount = {"good": 0, "average": 0, "bad": 0}
    for key in modelData.keys():
        for keyword in testWords.keys():
            # print(modelData[key][0].keys())
            if(keyword in modelData[key][0].keys()):
                maxcount[key] += 1
    # print(maxcount)
    return maxcount


def print_percents(dict, total):
    items = list(dict.items())
    items = slice_top(items, 0)

    percents = []
    for word, count in items.items():
        percents.append((word, round(count / total, 3)))

    print(sorted(percents, key=lambda x: x[1], reverse=True))


# train model using feedbacks found in categories.txt
file = open("./data/categories.txt", "r")
categories = []
for line in file:
    line = line.strip().lower()
    if line:
        categories.append(line)

model = {}
for category in categories:
    subdir = "./data/" + category + "/"
    filenames = os.listdir(subdir)

    topWords = {}
    totalWords = 0
    totalFiles = len(filenames)
    for filename in filenames:
        file = open(subdir + filename, "r", encoding="utf-8")
        topWords = merge_tallies(topWords, tally(file, NUM_WORDS), NUM_WORDS)
        file.seek(0)
        totalWords += wordcount(file)

    #print("Probability model for", category, end=": ")
    #print_percents(topWords, totalWords)
    model[category] = topWords, totalWords, totalFiles

# print(model)
# for summarizing student feedback
for i in range(no_of_topics):
    for j in range(no_of_students):
        current_feedback = s_fd[str(i+1)][j]
        with open('./data/test.txt', "w") as myfile:
            myfile.write(current_feedback)
        file = open("./data/test.txt", "r", encoding="utf-8")
        words = tally(file, NUM_WORDS)
        # print(words)
        if len(words) > 0:
            file.seek(0)
            total = wordcount(file)
            # use the Bayes model to predict which category the file is in
            predictions = bayes(words, model)
            # decide which prediction to go with (the one with highest probability)
            max_probability = 0
            cur_prediction = ""
            for prediction in predictions:
                probability = predictions[prediction]
                if probability > max_probability:
                    max_probability = probability
                    cur_prediction = prediction
            # print(cur_prediction)
            s_fd[str(i+1)][j] = cur_prediction
# for summarizing teacher feedback
for i in range(no_of_topics):
    current_feedback = t_fd[str(i+1)][0]
    with open('./data/test.txt', "w") as myfile:
        myfile.write(current_feedback)
    file = open("./data/test.txt", "r", encoding="utf-8")
    words = tally(file, NUM_WORDS)
    if len(words) > 0:
        file.seek(0)
        total = wordcount(file)
        # use the Bayes model to predict which category the file is in
        predictions = bayes(words, model)
        # decide which prediction to go with (the one with highest probability)
        # print(predictions)
        max_probability = 0
        cur_prediction = ""
        for prediction in predictions:
            probability = predictions[prediction]
            if probability > max_probability:
                max_probability = probability
                cur_prediction = prediction
        t_fd[str(i+1)][0] = cur_prediction

"""#Feedback summarization (class wise) """

# Creating new dataset by replacing bad,average and good to 1,2 and 3.


def feedback_summarization_class_wise(ss_fd):
    for i in range(1, len(ss_fd.columns)+1):
        ss_fd[str(i)].replace(to_replace=['bad', 'average', 'good'],
                              value=[1, 2, 3], inplace=True)
    #global s_fd
    avg_list = []
    for i in range(no_of_topics):
        s = 0
        for j in range(no_of_students):
            # print(ss_fd[str(i+1)][j])
            # print(j)
            s += ss_fd[str(i+1)][j]
        avg_list.append(s/no_of_students)
    #avg_list = ss_fd.mean(axis=0)
    # print(avg_list)
    return avg_list
    # for i in range(len(avg_list)):
    #   avg_list[i]=round(avg_list[i])
    # avg_list.replace(to_replace=[1.0, 2.0, 3.0], value=['bad', 'average', 'good'], inplace=True)
    # return avg_list

# Drawing bar graph to show average rating of topics


def draw_graph(avg_list):
    x_axis = ["topic "+str(i+1) for i in range(len(avg_list))]
    y_axis = [avg_list[i] for i in range(len(avg_list))]
    fig = plot.figure(figsize=(15, 10))
    plot.bar(x_axis, y_axis, color='royalblue', alpha=0.7)
    plot.grid(color='#95a5a6', linestyle='--',
              linewidth=2, axis='y', alpha=0.7)
    plot.ylim((2.0, 3.0))
    plot.xlabel("Topics of a Subject")
    plot.ylabel("Average Feedback Rating")
    plot.title("Class Feedback Rating Topic Wise")
    # plot.show()
    plot.savefig('./public/graphs/bar_chart.png', dpi=400)


# print(s_fd)
ss_fd = copy.deepcopy(s_fd)
avg_list = feedback_summarization_class_wise(ss_fd)
draw_graph(avg_list)

"""#Students Understanding Rating (topic wise)

"""
# Finding

# creating new dataset with student feedback and student answers mapped


def mapping_marks_fdbk():
    s_fd1 = copy.deepcopy(s_fd)
    global no_of_students
    global no_of_questions
    global cie1_key
    global topics_of_questions
    global cie_data
    ans = []
    feedback = []
    student_understanding = []
    for j in range(no_of_students):
        temp = []
        temp.append(cie_data["student name"][j])
        for i in range(no_of_questions):
            # print(s_fd[str(i+1)][j])
            output = ""
            if(cie1_key[i] == cie_data[str(i+1)][j]):
                ans.append("right")
                output = "right"
            else:
                ans.append("wrong")
                output = "wrong"

            topic_related = topics_of_questions[i]
            rating = s_fd1[str(topic_related)][j]
            feedback.append(rating)

            #print(output, rating)
            understanding = decisionTree.decision_tree([output], [rating])[0]
            temp.append(understanding)
        student_understanding.append(temp)
    mapping_mark_fdbk = pd.DataFrame(student_understanding)
    mapping_mark_fdbk.to_csv(
        './public/results/Student_understanding.csv', index=False)

    # for i in range(no_of_questions):
    #   for j in range(no_of_students):
    #     #print(s_fd[str(i+1)][j])
    #     topic_related = topics_of_questions[i]
    #     rating = s_fd1[str(topic_related)][j]
    #     feedback.append(rating)
    #     if(cie1_key[i]==cie_data[str(i+1)][j]):
    #       ans.append("right")
    #     else:
    #       ans.append("wrong")
    ran_list = decisionTree.decision_tree(ans, feedback)
    mapping_mark_fdbk = pd.DataFrame(list(zip(ans, feedback, ran_list)), columns=[
                                     'answer', 'feedback', 'target'])
    mapping_mark_fdbk.to_csv(
        './public/results/mapping_mark_fdbk.csv', index=False)
    return mapping_mark_fdbk

# building decision tree for the above dataset made


def create_decision_tree(mapping_mark_fdbk):
    mapping_mark_fdbk["answer"].replace(
        to_replace=['right', 'wrong'], value=[1, 0], inplace=True)
    mapping_mark_fdbk["feedback"].replace(
        to_replace=['bad', 'average', 'good'], value=[1, 2, 3], inplace=True)
    X, y = mapping_mark_fdbk.iloc[:, :-1], mapping_mark_fdbk.iloc[:, -1]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=123)
    dtree = DecisionTreeClassifier(
        criterion='gini', max_depth=10, min_samples_split=2, min_samples_leaf=5)
    dtree.fit(X_train, y_train)  # train parameters: features and target
    pred = dtree.predict(X_test)
    #print("Accuracy: ",accuracy_score(y_test, pred))
    #clas_names = [1,2,3,4,5,6]
    feat_names = list(mapping_mark_fdbk.columns)
    feat_names = feat_names[:-1]
    dot_data = StringIO()
    export_graphviz(dtree, out_file=dot_data, feature_names=feat_names,
                    class_names=True,  filled=True, rounded=True, special_characters=True)
    graph = pydotplus.graph_from_dot_data(dot_data.getvalue())
    # graph.write_png('/tree.png')
    # Image(graph.create_png())
    # graph.write_pdf("./public/graphs/tree1.pdf")
    # Create PNG
    graph.write_png("./public/graphs/tree1.png")


"""#Per Topic Analysis (difficulty metrics)

Wrong
"""

# def mapping_marks_fdbk2():
#   s_fd2 = copy.deepcopy(s_fd)
#   t_fd1 = copy.deepcopy(t_fd)
#   s_fd = pd.read_csv('/data/StudentFeedback.csv')
#   no_of_students = 100
#   no_of_questions = 20
#   no_of_topics = 15
#   cie1_key = [1, 3, 2, 1, 4, 3, 2, 3, 1, 4, 4, 2, 4, 3, 3, 2, 4, 1, 1, 2]
#   topics_of_questions = [1, 1, 2, 3, 4, 4, 5, 6, 7, 8, 8, 9, 10, 10, 11, 12, 13, 13, 14, 15]
#   global cie_data
#   ans=[]
#   feedback_st=[]
#   feedback_t=[]
#   for i in range(no_of_questions):
#     for j in range(no_of_students):
#       topic_related = topics_of_questions[i]
#       rating = s_fd2[str(topic_related)][j]
#       feedback_st.append(rating)
#       feedback_t.append(t_fd1[str(topic_related)][0])
#       if(cie1_key[i]==cie_data[str(i+1)][j]):
#         ans.append("right")
#       else:
#         ans.append("wrong")
#   mapping_mark_fdbk2 = pd.DataFrame(list(zip(feedback_st,feedback_t,ans)),columns =['feedback_student','feedback_teacher','target'])
#   #mapping_mark_fdbk2 = pd.DataFrame(list(zip(feedback_t,ans,feedback_st)),columns =['feedback_teacher','answer','target'])
#   return mapping_mark_fdbk2

# def create_decision_tree2(mapping_mark_fdbk2):
#   mapping_mark_fdbk2["target"].replace(to_replace=['wrong', 'right'], value=[0,1], inplace=True)
#   #mapping_mark_fdbk2["answer"].replace(to_replace=['wrong', 'right'], value=[0,1], inplace=True)
#   mapping_mark_fdbk2["feedback_student"].replace(to_replace=['bad', 'average', 'good'], value=[1, 2, 3], inplace=True)
#   mapping_mark_fdbk2["feedback_teacher"].replace(to_replace=['bad', 'average', 'good'], value=[1, 2, 3], inplace=True)
#   X, y = mapping_mark_fdbk2.iloc[:,:-1],mapping_mark_fdbk2.iloc[:,-1]
#   #print(mapping_mark_fdbk2)
#   #print(y.value_counts())
#   X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=123)
#   dtree = DecisionTreeClassifier(criterion='gini', max_depth=20, min_samples_split=2, min_samples_leaf=5)
#   dtree.fit(X_train, y_train)  #train parameters: features and target
#   pred = dtree.predict(X_test)
#   print("Accuracy :",accuracy_score(y_test, pred))
#   clas_names = [0,1]
#   feat_names = list(mapping_mark_fdbk2.columns)
#   feat_names = feat_names[:-1]
#   dot_data = StringIO()
#   export_graphviz(dtree, out_file=dot_data ,feature_names = feat_names, class_names= True,  filled=True, rounded=True, special_characters=True)
#   graph = pydotplus.graph_from_dot_data(dot_data.getvalue())
#   Image(graph.create_png())
#   graph.write_pdf("tree2.pdf")
#   graph.write_png("tree2.png")

# mapping_mark_fdbk2=mapping_marks_fdbk2()
# create_decision_tree2(mapping_mark_fdbk2)

"""Correct"""


def mapping_marks_fdbk3():
    s_fd3 = copy.deepcopy(s_fd)
    t_fd2 = copy.deepcopy(t_fd)
    global no_of_students
    global no_of_questions
    global cie1_key
    global topics_of_questions
    global cie_data
    ans = []
    feedback_st = []
    feedback_t = []
    for i in range(no_of_questions):
        for j in range(no_of_students):
            topic_related = topics_of_questions[i]
            rating = s_fd3[str(topic_related)][j]
            feedback_st.append(rating)
            feedback_t.append(t_fd2[str(topic_related)][0])
            if(cie1_key[i] == cie_data[str(i+1)][j]):
                ans.append("right")
            else:
                ans.append("wrong")

    ran_list = decisionTree.decision_tree1(ans, feedback_st, feedback_t)
    # print(ran_list)
    mapping_mark_fdbk3 = pd.DataFrame(list(zip(feedback_st, feedback_t, ans, ran_list)), columns=['feedback_student',
                                                                                                  'feedback_teacher', 'answer', 'target'])
    return mapping_mark_fdbk3

# creating new dataset with student feedback, teacher feedback and student answers mapped


def find_topic_difficulty():
    s_fd3 = copy.deepcopy(s_fd)
    t_fd2 = copy.deepcopy(t_fd)
    global cie_data
    feedback_st = []
    feedback_t = []
    topic_difficulty_sum = [0 for i in range(no_of_topics)]
    topic_no_questions = [0 for i in range(no_of_topics)]

    for i in range(no_of_questions):
        for j in range(no_of_students):
            topic_related = topics_of_questions[i]
            topic_no_questions[topic_related-1] += 1
            st_rating = s_fd3[str(topic_related)][j]
            t_rating = t_fd2[str(topic_related)][0]
            if(cie1_key[i] == cie_data[str(i+1)][j]):
                ans = "right"
            else:
                ans = "wrong"
            difficulty = decisionTree.decision_tree1(
                [ans], [st_rating], [t_rating])[0]
            topic_difficulty_sum[topic_related-1] += difficulty
    difficulty = [round(topic_difficulty_sum[i]/(3*topic_no_questions[i]), 2)
                  for i in range(no_of_topics)]
    # print(ran_list)
    mapping_mark_fdbk3 = pd.DataFrame(
        list(zip(list(range(1, 16)), difficulty)), columns=['Topic', 'Difficulty'])
    print("Difficulty metric")
    print(difficulty)
    mapping_mark_fdbk3.to_csv(
        './public/results/Difficulty_metric.csv', index=False)
    return mapping_mark_fdbk3


'''
#Showing decision tree for the above dataset made
def create_decision_tree3(mapping_mark_fdbk3):
  mapping_mark_fdbk3["answer"].replace(to_replace=['right', 'wrong'], value=[1,0], inplace=True)
  mapping_mark_fdbk3["feedback_student"].replace(to_replace=['bad', 'average', 'good'], value=[1, 2, 3], inplace=True)
  mapping_mark_fdbk3["feedback_teacher"].replace(to_replace=['bad', 'average', 'good'], value=[1, 2, 3], inplace=True)
  X, y = mapping_mark_fdbk3.iloc[:,:-1],mapping_mark_fdbk3.iloc[:,-1]
  X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=123)

  dtree = DecisionTreeClassifier(criterion='gini', max_depth=20, min_samples_split=2, min_samples_leaf=1)
  dtree.fit(X_train, y_train)  #train parameters: features and target
  pred = dtree.predict(X_test)
  #print("Accuracy: ",accuracy_score(y_test, pred))
  clas_names = [i for i in range(1,19)]
  feat_names = list(mapping_mark_fdbk3.columns)
  feat_names = feat_names[:-1]
  dot_data = StringIO()
  export_graphviz(dtree, out_file=dot_data ,feature_names = feat_names, class_names= True,  filled=True, rounded=True, special_characters=True)
  graph = pydotplus.graph_from_dot_data(dot_data.getvalue())
  #graph.write_png('/tree.png')
  #Image(graph.create_png())
  #graph.write_pdf("./public/graphs/tree3.pdf")
  graph.write_png("./public/graphs/tree3.png")

mapping_mark_fdbk3=mapping_marks_fdbk3()
create_decision_tree3(mapping_mark_fdbk3)

'''

"""try"""

data = mapping_marks_fdbk()
#data = a.iloc[:,:-1]
# print(data)
corr = data.corr()
flatui = ["#9b59b6", "#3498db", "#95a5a6", "#e74c3c", "#34495e", "#2ecc71"]
fig, ax = plt.subplots(figsize=(10, 10))
ax = sns.heatmap(
    corr,
    vmin=-1, vmax=1, center=0,
    square=True,
    annot=True,
    cmap=sns.cubehelix_palette(8),
)
ax.set_xticklabels(
    ax.get_xticklabels(),
    rotation=45,
    horizontalalignment='right'
)

ax.set_title('Correlation Matrix Plot')
# Uncomment for saving/downloading the Heatmap
figure = ax.get_figure()
figure.savefig('./public/graphs/Correlation-Matrix-Plot.png', dpi=400)

"""correlation matrix"""


def correlation_mat():
    data = mapping_marks_fdbk3()
    data["answer"].replace(to_replace=['right', 'wrong'],
                           value=[1, 0], inplace=True)
    data["feedback_student"].replace(
        to_replace=['bad', 'average', 'good'], value=[1, 2, 3], inplace=True)
    data["feedback_teacher"].replace(
        to_replace=['bad', 'average', 'good'], value=[1, 2, 3], inplace=True)
    corr = data.corr()
    # print(corr)
    flatui = ["#9b59b6", "#3498db", "#95a5a6", "#e74c3c", "#34495e", "#2ecc71"]
    fig, ax = plot.subplots(figsize=(10, 10))
    ax = sns.heatmap(
        corr,
        vmin=-1, vmax=1, center=0,
        square=True,
        annot=True,
        cmap=sns.cubehelix_palette(8),
    )
    # ax.set_xticklabels(
    #     ax.get_xticklabels(),
    #     rotation=45,
    #     horizontalalignment='right'
    # );

    ax.set_title('Correlation Matrix Plot')
    # Uncomment for saving/downloading the Heatmap
    figure = ax.get_figure()
    figure.savefig('./public/graphs/Correlation-Matrix-Plot.png', dpi=400)


mapping_mark_fdbk = mapping_marks_fdbk()
create_decision_tree(mapping_mark_fdbk)
correlation_mat()
find_topic_difficulty()
