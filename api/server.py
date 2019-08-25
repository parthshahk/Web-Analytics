import hug
import json
import pandas as pd
import pymongo
from pymongo import MongoClient
from marshmallow import fields
import dateutil.parser as parser
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori,association_rules
from datetime import datetime
connection = MongoClient("localhost",27017)
db = connection.wanalytics

api = hug.API(__name__)
api.http.add_middleware(hug.middleware.CORSMiddleware(api, max_age=10))


#Unique Users
@hug.get('/data/unique_users', versions=1)
def unique_users(date_start,date_end,asset_id):
	date_start = parser.parse(date_start,dayfirst=True)
	date_start = date_start.isoformat().replace("-0", "-")
	date_end = parser.parse(date_end,dayfirst=True)
	date_end = date_end.isoformat().replace("-0", "-")
	data = db.reports
	lists = data.find({'date': {'$gt': date_start,'$lt':date_end}, 'assetId': asset_id})
	lists = list(lists)
	if(len(lists)!=0):
		
		df = pd.DataFrame(lists) 
		user = len(df.user)
		lst = []
		lst.append(user)
		return lst
	else:
		return "No Data"


#Total Users
@hug.get('/data/total_users', versions=1)
def total_users(date_start,date_end,asset_id):
	date_start = parser.parse(date_start,dayfirst=True)
	date_start = date_start.isoformat().replace("-0", "-")
	date_end = parser.parse(date_end,dayfirst=True)
	date_end = date_end.isoformat().replace("-0", "-")
	data = db.reports
	lists = data.find({'date': {'$gt': date_start,'$lt':date_end}, 'assetId': asset_id})
	lists = list(lists)
	if(len(lists)!=0):
		df = pd.DataFrame(lists) 
		elements = []
		for i in range(0,len(df.visits)):
		    for j in range(0,len(df.visits[i])):
			    elements.append(df.visits)
		user = len(elements)
		lst = []
		lst.append(user)
		return lst
	else:
		return "No Data"


#Avg. Time Spend		
@hug.get('/data/time_spend', versions=1)
def time_spend(date_start,date_end,asset_id):
		
	date_start = parser.parse(date_start,dayfirst=True)
	date_start = date_start.isoformat().replace("-0", "-")
	date_end = parser.parse(date_end,dayfirst=True)
	date_end = date_end.isoformat().replace("-0", "-")
	
	data = db.reports
	lists = data.find({'date': {'$gt': date_start,'$lt':date_end}, 'assetId': asset_id})
	lists = list(lists)
	
	if(len(lists)!=0):
		
		df = pd.DataFrame(lists) 
		time_lst = []
		for i in range(0,len(df.elements)):
			a = len(df.elements[i])*5
			time_lst.append(a)
		average = (sum(time_lst)/len(time_lst))/60
		average = round(average,1)
		average_lst = []
		average_lst.append(average)
		return average_lst
	else:
		return "No Data"
		

#Time Month
@hug.get('/data/time_month', versions=1)
def time_month(date_start, date_end, asset_id):

	date_start = parser.parse(date_start,dayfirst=True)
	date_start = date_start.isoformat().replace("-0", "-")
	date_end = parser.parse(date_end,dayfirst=True)
	date_end = date_end.isoformat().replace("-0", "-")

	data = db.reports
	lists = data.find({'date': {'$gt': date_start,'$lt':date_end}, 'assetId': asset_id})
	lists = list(lists)
	
	if(len(lists) != 0):
	
		df = pd.DataFrame(lists) 
		data_date = []
		for i in range(0,len(df.user)):
			data_date.append(df.date[i])
			
		data_day = []
		for i in range(0,len(data_date)):
			time = data_date[i]
			time = datetime.strptime(time,"%Y-%m-%dT%H:%M:%S")
			time = time.strftime("%m")
			data_day.append(time)

		df_day = pd.DataFrame(data_day,columns=["Count"])
		count = df_day['Count'].value_counts()
		count = count.to_frame().reset_index()
		count['percentage'] = round(((count['Count']/count['Count'].sum())*100),2)
		# count = count.drop(columns="Count")
		count.columns = ['Month', 'Count', 'Percentage']
		return count.to_json(orient='records')
		
	else:
		return "No Data"


# Day of Week
@hug.get('/data/time_week', versions=1)
def time_week(date_start, date_end, asset_id):
	date_start = parser.parse(date_start,dayfirst=True)
	date_start = date_start.isoformat().replace("-0", "-")
	date_end = parser.parse(date_end,dayfirst=True)
	date_end = date_end.isoformat().replace("-0", "-")
	
	data = db.reports
	lists = data.find({'date': {'$gt': date_start,'$lt':date_end}, 'assetId': asset_id})
	lists = list(lists)
	
	if(len(lists) != 0):
	
		df = pd.DataFrame(lists) 
		data_date = []
		for i in range(0,len(df.user)):
			data_date.append(df.date[i])
			
		data_day = []
		for i in range(0,len(data_date)):
			time = data_date[i]
			time = datetime.strptime(time,"%Y-%m-%dT%H:%M:%S")
			time = time.strftime("%a")
			data_day.append(time)

		df_day = pd.DataFrame(data_day,columns=["Count"])
		count = df_day['Count'].value_counts()
		count = count.to_frame().reset_index()
		count['percentage'] = round(((count['Count']/count['Count'].sum())*100),2)
		# count = count.drop(columns="Count")
		count.columns = ['Day', 'Count', 'Percentage']
		return count.to_json(orient='records')
		
	else:
		return "No Data"


# Time of Day
@hug.get('/data/time_day', versions=1)
def time_day(date_start, date_end, asset_id):
	
	date_start = parser.parse(date_start,dayfirst=True)
	date_start = date_start.isoformat().replace("-0", "-")
	date_end = parser.parse(date_end,dayfirst=True)
	date_end = date_end.isoformat().replace("-0", "-")
	
	data = db.reports
	lists = data.find({'date': {'$gt': date_start,'$lt':date_end}, 'assetId': asset_id})
	lists = list(lists)
	
	if(len(lists) != 0):
	
		df = pd.DataFrame(lists) 
		data_date = []
		a,b,c,d = 0,0,0,0
		for i in range(0,len(df.user)):
			data_date.append(df.date[i])
			
		data_day = []
		for i in range(0,len(data_date)):
			time = data_date[i]
			time = datetime.strptime(time,"%Y-%m-%dT%H:%M:%S")
			time = time.strftime("%H")
			data_day.append(time)
		for x in data_day:
			x = int(x)
			if x >= 5 and x<= 11:
				a+=1
			elif x>=12 and x<=16:
				b+=1
			elif x>=17 and x<=20:
				c+=1
			else:
				d+=1
		data = [['Morning', a],['Afternoon',b],['Evening',c],['Night',d]]

		df_slot = pd.DataFrame(data, columns = ['Time', 'Count']) 

		count = df_slot['Count'].sum()
		df_slot

		df_slot['Percentage'] = round(((df_slot['Count']/count)*100),2)
		# df_slot = df_slot.drop(columns="Count")
		df_slot.columns = ['Time', 'Count', 'Percentage']
		return df_slot.to_json(orient='records')
		
	else:
		return "No Data"


# URL View Counts
@hug.get('/data/url_count', versions=1)
def url_count(date_start, date_end, asset_id):
	
	date_start = parser.parse(date_start,dayfirst=True)
	date_start = date_start.isoformat().replace("-0", "-")
	date_end = parser.parse(date_end,dayfirst=True)
	date_end = date_end.isoformat().replace("-0", "-")
	
	data = db.reports
	lists = data.find({'date': {'$gt': date_start,'$lt':date_end}, 'assetId': asset_id})
	lists = list(lists)
	
	if(len(lists) != 0):
	
		df = pd.DataFrame(lists) 
		data = []
		for i in range(0,len(df.visits)):
			for j in range(0,len(df.visits[i])):
				data.append(df.visits[i][j]['location']['href'])
		df_url = pd.DataFrame(data,columns=["Count"])
		count = df_url['Count'].value_counts()
		count = count.to_frame().reset_index()
		return count.to_json(orient='records')
		
	else:
		return "No Data"


# Element View Counts
@hug.get('/data/element_count', versions=1)
def element_count(date_start,date_end,asset_id):
	
	date_start = parser.parse(date_start,dayfirst=True)
	date_start = date_start.isoformat().replace("-0", "-")
	date_end = parser.parse(date_end,dayfirst=True)
	date_end = date_end.isoformat().replace("-0", "-")
	
	data = db.reports
	lists = data.find({'date': {'$gt': date_start,'$lt':date_end}, 'assetId': asset_id})
	lists = list(lists)
	
	if(len(lists)!=0):
	
		df = pd.DataFrame(lists) 
		data = []
		data_item = []
		for i in range(0,len(df.elements)):
			data.append(df.elements[i])
		def removenesting(l): 
			for i in l: 
				if type(i) == list: 
					removenesting(i) 
				else: 
					data_item.append(i)
		removenesting(data)
		df_item = pd.DataFrame(data_item,columns = ['Counts'])

		indexNames = df_item[ (df_item['Counts'] == 'search_form') ].index
		df_item.drop(indexNames , inplace=True) 
		count = df_item['Counts'].value_counts()
		count = count.to_frame().reset_index()
		return count.to_json(orient = 'records')
	else:
		return "No Data"


# Browser
@hug.get('/data/browser', versions=1)
def browser(date_start,date_end,asset_id):
		
	date_start = parser.parse(date_start,dayfirst=True)
	date_start = date_start.isoformat().replace("-0", "-")
	date_end = parser.parse(date_end,dayfirst=True)
	date_end = date_end.isoformat().replace("-0", "-")
	
	data = db.reports
	lists = data.find({'date': {'$gt': date_start,'$lt':date_end}, 'assetId': asset_id})
	lists = list(lists)
	
	if(len(lists)!=0):
		
		df = pd.DataFrame(lists) 
		data_brow = []
		for i in range(0,len(df.user)):
					data_brow.append(df.user[i]['browser'])
				
		print(len(data_brow))

		df_brow = pd.DataFrame(data_brow,columns=["Count"])

		count = df_brow['Count'].value_counts()
		count = count.to_frame().reset_index()
		count['percentage'] = round(((count['Count']/count['Count'].sum())*100),2)
		count = count.drop(columns="Count")
		count.columns = ['Browser','Percentage']
		return count.to_json(orient = "records")
	else:
		return "No Data"


# Screen Resolution
@hug.get('/data/resolution', versions=1)
def resolution(date_start,date_end,asset_id):
	
	
	date_start = parser.parse(date_start,dayfirst=True)
	date_start = date_start.isoformat().replace("-0", "-")
	date_end = parser.parse(date_end,dayfirst=True)
	date_end = date_end.isoformat().replace("-0", "-")
	
	data = db.reports
	lists = data.find({'date': {'$gt': date_start,'$lt':date_end}, 'assetId': asset_id})
	lists = list(lists)
	
	if(len(lists)!=0):
	
		df = pd.DataFrame(lists) 
		data_res = []
		for i in range(0,len(df.user)):
					data_res.append(df.user[i]['resolution'])
				


		df_res = pd.DataFrame(data_res,columns=["Count"])

		count = df_res['Count'].value_counts()
		count = count.to_frame().reset_index()
		count['percentage'] = round(((count['Count']/count['Count'].sum())*100),2)
		count = count.drop(columns="Count")
		count.columns = ['Resolution','Percentage']

		return count.to_json(orient = 'records')
	else:
		return "No Data"


# OS
@hug.get('/data/os', versions=1)
def os(date_start,date_end,asset_id):		
		
	date_start = parser.parse(date_start,dayfirst=True)
	date_start = date_start.isoformat().replace("-0", "-")
	date_end = parser.parse(date_end,dayfirst=True)
	date_end = date_end.isoformat().replace("-0", "-")
	
	data = db.reports
	lists = data.find({'date': {'$gt': date_start,'$lt':date_end}, 'assetId': asset_id})
	lists = list(lists)
	
	if(len(lists)!=0):
		
		df = pd.DataFrame(lists) 
		
		data_os = []
		for i in range(0,len(df.user)):
			if 'os' in df.user[i]:
				data_os.append(df.user[i]['os'])

		df_os = pd.DataFrame(data_os,columns=["Count"])
		count = df_os['Count'].value_counts()
		count = count.to_frame().reset_index()
		count['percentage'] = round(((count['Count']/count['Count'].sum())*100),2)
		count = count.drop(columns="Count")
		count.columns = ['OS','Percentage']
		return count.to_json(orient = "records")
	else:
		return "No Data"


# Mobile
@hug.get('/data/mobile', versions=1)
def mobile(date_start,date_end,asset_id):
		
		
	date_start = parser.parse(date_start,dayfirst=True)
	date_start = date_start.isoformat().replace("-0", "-")
	date_end = parser.parse(date_end,dayfirst=True)
	date_end = date_end.isoformat().replace("-0", "-")
	
	data = db.reports
	lists = data.find({'date': {'$gt': date_start,'$lt':date_end}, 'assetId': asset_id})
	lists = list(lists)
	
	if(len(lists)!=0):
		
		df = pd.DataFrame(lists) 
		
		data_mob = []
		for i in range(0,len(df.user)):
					data_mob.append(df.user[i]['mobile'])

		df_mob = pd.DataFrame(data_mob,columns=["Mobile"])
		count = df_mob['Mobile'].value_counts()
		count  = count.to_frame().reset_index()
		count.columns = ['User','Count']
		count = count.replace(True,"Mobile")
		count = count.replace(False,"Desktop")
		count['percentage'] = round(((count['Count']/count['Count'].sum())*100),2)
		count = count.drop(columns="Count")
		count.columns = ['User','Percentage']
		return count.to_json(orient = "records")
	else:
		return "No data"
	

#Time Zone
@hug.get('/data/time_zone', versions=1)
def time_zone(date_start, date_end, asset_id):

	
	date_start = parser.parse(date_start,dayfirst=True)
	date_start = date_start.isoformat().replace("-0", "-")
	date_end = parser.parse(date_end,dayfirst=True)
	date_end = date_end.isoformat().replace("-0", "-")
	
	data = db.reports
	lists = data.find({'date': {'$gt': date_start,'$lt':date_end}, 'assetId': asset_id})
	lists = list(lists)
	
	if(len(lists) != 0):
	
		df = pd.DataFrame(lists) 
		data_zone = []
		for i in range(0,len(df.user)):
					data_zone.append(df.user[i]['time_zone'])
				


		df_zone = pd.DataFrame(data_zone,columns=["Count"])

		count = df_zone['Count'].value_counts()
		count = count.to_frame().reset_index()
		count['percentage'] = round(((count['Count']/count['Count'].sum())*100),2)
		# count = count.drop(columns="Count")
		count.columns = ['TimeZone','Count', 'Percentage']

		return count.to_json(orient='records')
		
	else:
		return "No Data"

		
#Language
@hug.get('/data/language', versions=1)
def language(date_start, date_end, asset_id):

	
	date_start = parser.parse(date_start,dayfirst=True)
	date_start = date_start.isoformat().replace("-0", "-")
	date_end = parser.parse(date_end,dayfirst=True)
	date_end = date_end.isoformat().replace("-0", "-")
	
	data = db.reports
	lists = data.find({'date': {'$gt': date_start,'$lt':date_end}, 'assetId': asset_id})
	lists = list(lists)
	
	if(len(lists) != 0):
	
		df = pd.DataFrame(lists) 
		data_lan = []
		for i in range(0,len(df.user)):
					data_lan.append(df.user[i]['language'])
				


		df_lan = pd.DataFrame(data_lan,columns=["Count"])

		count = df_lan['Count'].value_counts()
		count = count.to_frame().reset_index()
		count['percentage'] = round(((count['Count']/count['Count'].sum())*100),2)
		# count = count.drop(columns="Count")
		count.columns = ['Language','Count', 'Percentage']

		return count.to_json(orient='records')
		
	else:
		return "No Data"
		






#Apriori on href and referrer
@hug.get('/data/href_referrer', versions=1)
def href_referrer(date_start, date_end, asset_id,support):

	support = float(support)
	date_start = parser.parse(date_start,dayfirst=True)
	date_start = date_start.isoformat().replace("-0", "-")
	date_end = parser.parse(date_end,dayfirst=True)
	date_end = date_end.isoformat().replace("-0", "-")
	
	data = db.reports
	lists = data.find({'date': {'$gt': date_start,'$lt':date_end}, 'assetId': asset_id})
	lists = list(lists)
	
	if(len(lists) != 0):
	
		df = pd.DataFrame(lists) 
		data_href = []
		data_referrer = []
		for i in range(0,len(df.visits)):
			for j in range(0,len(df.visits[i])):
				data_href.append(df.visits[i][j]['location']['href'])
				data_referrer.append(df.visits[i][j]['referrer'])
				
		data_comman = []
		for m,n in zip(data_href,data_referrer):
			data_comman.append([m,n])
		te = TransactionEncoder()
		te_arry = te.fit_transform(data_comman)
		df1 = pd.DataFrame(te_arry,columns=te.columns_)
		frq_item = apriori(df1, min_support=support,use_colnames=True)
		rule = association_rules(frq_item,metric='confidence',min_threshold=0.5)
		return rule.to_json(orient='records')
		
	else:
		return "No Data"

#Apriori on HREF
@hug.get('/data/href', versions=1)
def href(date_start, date_end, asset_id,support):

	support = float(support)
	date_start = parser.parse(date_start,dayfirst=True)
	date_start = date_start.isoformat().replace("-0", "-")
	date_end = parser.parse(date_end,dayfirst=True)
	date_end = date_end.isoformat().replace("-0", "-")
	
	data = db.reports
	lists = data.find({'date': {'$gt': date_start,'$lt':date_end}, 'assetId': asset_id})
	lists = list(lists)
	
	if(len(lists) != 0):
	
		df = pd.DataFrame(lists) 
		data_href = []

		for i in range(0,len(df.visits)):
			data = []
			for j in range(0,len(df.visits[i])):
				data.append(df.visits[i][j]['location']['href'])
			data_href.append(data)
				
		te = TransactionEncoder()
		te_arry = te.fit_transform(data_href)
		df1 = pd.DataFrame(te_arry,columns=te.columns_)
		frq_item = apriori(df1, min_support=support,use_colnames=True)
		rule = association_rules(frq_item,metric='confidence',min_threshold=0.7)

		return rule.to_json(orient='records')
		
	else:
		return "No Data"
		
				
					
#Apriori on elements
@hug.get('/data/ele', versions=1)
def ele(date_start, date_end, asset_id,support):

	support = float(support)
	date_start = parser.parse(date_start,dayfirst=True)
	date_start = date_start.isoformat().replace("-0", "-")
	date_end = parser.parse(date_end,dayfirst=True)
	date_end = date_end.isoformat().replace("-0", "-")
	
	data = db.reports
	lists = data.find({'date': {'$gt': date_start,'$lt':date_end}, 'assetId': asset_id})
	lists = list(lists)
	
	if(len(lists) != 0):
	
		df = pd.DataFrame(lists) 
		data_ele = []

		for i in range(0,len(df.elements)):
			data_ele.append(df.elements[i]) 

		for i in range(0,len(data_ele)):
			for j in range(0,len(data_ele[i])):
				if data_ele[i][j] is None:
					data_ele[i][j] = "other"


		te = TransactionEncoder()

		te_arry = te.fit_transform(data_ele)
		df1 = pd.DataFrame(te_arry,columns=te.columns_)
		frq_item = apriori(df1, min_support=support,use_colnames=True)
		rule = association_rules(frq_item,metric='confidence',min_threshold=0.5)

		return rule.to_json(orient='records')
		
	else:
		return "No Data"