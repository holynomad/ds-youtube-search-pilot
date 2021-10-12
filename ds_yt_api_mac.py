#!/usr/bin/python
# ds_yt_api_mac.py @ 2020.09.17 Macgyver

#from apiclient.discovery import build
import datetime
from datetime import date, timedelta
import pandas as pd
import numpy as np
import csv
from apiclient.discovery import build
from apiclient.errors import HttpError
from oauth2client.tools import argparser

# Set DEVELOPER_KEY to the API key value from the APIs & auth > Registered apps
# tab of
#   https://cloud.google.com/console
# Please ensure that you have enabled the YouTube Data API for your project.

DEVELOPER_KEY = ""
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"

# Youtube search DB 관련 dict() @ 2020.10.20
global_yt_dict = {}
global_yt_dict_db = {}

def youtube_search(options):

  youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=DEVELOPER_KEY)

  # Call the search.list method to retrieve results matching the specified
  # query term.
  search_response = youtube.search().list(
                                            q=options.q,
                                            part="snippet",
                                            type = "video",
                                            order = "viewCount",
                                            #videoDefinition = "high",
                                            #videoDuration = "short",
                                            maxResults=options.max_results,
                                            pageToken=options.pageToken # added @ 2020.10.26
                                         ).execute()

  videos = []
  channels = []
  playlists = []
  elses = []

  # Add each result to the appropriate list, and then display the lists of
  # matching videos, channels, and playlists.

  # add "Crawling Info summary" @ 2020.10.26
  print('crawling Keyword : ', options.q)
  print('pageInfo : ', search_response.get("pageInfo", []))
  print('nextPageToken : ', search_response.get("nextPageToken", []))
  
  print('\n')
  print('==============')
  print('\n')

  for search_result in search_response.get("items", []):
    
    if search_result["id"]["kind"] == "youtube#video":
      '''  
      videos.append("%s (%s) %s %s" % (search_result["snippet"]["title"],
                                 #search_result["id"]["videoId"]))
                                 search_result["snippet"]["thumbnails"]["default"],
                                 search_result["snippet"]["description"],
                                 "www.youtube.com/embed/" + search_result["id"]["videoId"]))
      '''
      global_yt_dict_db.update({ "https://www.youtube.com/embed/" + search_result["id"]["videoId"] : search_result["snippet"]["title"] + ' : ' + search_result["snippet"]["description"] })
      
      output_file.write('\n')
      output_file.write("https://www.youtube.com/embed/" + search_result["id"]["videoId"])
      output_file.write('\n')
      output_file.write(search_result["snippet"]["title"])
      output_file.write('\n')
      output_file.write(search_result["snippet"]["description"])

    elif search_result["id"]["kind"] == "youtube#channel":
      channels.append("%s (%s)" % (search_result["snippet"]["title"],
                                   search_result["id"]["channelId"]))
    elif search_result["id"]["kind"] == "youtube#playlist":
      playlists.append("%s (%s)" % (search_result["snippet"]["title"],
                                    search_result["id"]["playlistId"]))
    else:
      elses.append("%s (%s)" % search_result['id']['title'])
      elses.append("%s (%s)" % search_result['id']['description'])
      output_file.write('\n')
      output_file.write(search_result["id"]["title"])
      output_file.write('\n')
      output_file.write(search_result["id"]["description"])

    output_file.write('\n' )

  #print("Videos:\n")
  #print("\n".join(videos), "\n")
  #print("Channels:\n", "\n".join(channels), "\n")
  #print("Playlists:\n", "\n".join(playlists), "\n")
  
  print(global_yt_dict_db.items())

  '''
  if check_search_db_exists_yn(li.find('a', {'class': 'title raw-link raw-topic-link'}).text) != 'Y':

      output_file.write('\n')
      output_file.write(url_ohdsi_forum_latest + str(li.find('a', {'class': 'title raw-link raw-topic-link'})['href']))
      output_file.write('\n')
      output_file.write(str(li.find('a', {'class': 'title raw-link raw-topic-link'}).text))
      output_file.write('\n')

      global_ohdsi_dict_db.update({url_ohdsi_forum_latest + str(li.find('a', {'class': 'title raw-link raw-topic-link'})['href']) : li.find('a', {'class': 'title raw-link raw-topic-link'}).text})
  else:
      global_ohdsi_dict_db.update({url_ohdsi_forum_latest + str(li.find('a', {'class': 'title raw-link raw-topic-link'})['href']) : li.find('a', {'class': 'title raw-link raw-topic-link'}).text})
  '''


# 전날(어제) 뉴스 searching 결과(db) 뒤져서 기 검색내역 있으면, skip 
def check_search_db_exists_yn(compareString):

  be_continued = False
  tmp_result = 'N'

  try:
      searched_df = pd.read_csv(today.strftime('%Y%m%d') + '_youtube_db.csv', encoding = "utf-8-sig")
      be_continued = True
  except FileNotFoundError:
      #print('This should execute.')
      # 오늘 첫 searching인 경우, 어제 뉴스 크롤링+searching 했던 DB (CSV) 읽어오기
      try:
          searched_df = pd.read_csv(yesterday.strftime('%Y%m%d') + '_youtube_db.csv', encoding = "utf-8-sig")
          be_continued = True
      except FileNotFoundError:
          #print('Go 3-Days-Ago !')
          # 오늘이 월요일이고 첫 searching인 경우, 지난주 금요일(3일전) 뉴스 크롤링+searching 했던 DB (CSV) 읽어오기
          try:
              searched_df = pd.read_csv(threedaysago.strftime('%Y%m%d') + '_youtube_db.csv', encoding = "utf-8-sig")
              be_continued = True
          except FileNotFoundError:
              be_continued = False

  if (be_continued):
      # 컬럼 naming
      searched_df.columns = ['link', "title"]

      # NA 필드는 제외
      searched_df = searched_df.dropna()

      # "타이틀" 컬럼만 dataframe에서 읽어와서
      for row in searched_df['title']:
          # 비교하려는 string이 포함되어 있으면 Y 체크후 break
          if compareString in row:
              tmp_result = 'Y'
              break
          # 비교하려는 string이 포함되어 있지 않으면 N 체크후 계속 looping
          else:
              tmp_result = 'N'

      return tmp_result

  else:
      return tmp_result


if __name__ == "__main__":

  now = datetime.datetime.now()
  today = date.today()
  yesterday = date.today() - timedelta(1)
  threedaysago = date.today() - timedelta(3)

  #print("==== start ====")

  OUTPUT_FILENAME = now.strftime('%Y%m%d') + '_youtube_list.txt';

  output_file = open(OUTPUT_FILENAME, 'w+', encoding='utf-8-sig')  


  argparser.add_argument("--q", help="Search term", default="Google")
  argparser.add_argument("--max-results", help="Max results", default=10)
  argparser.add_argument("--pageToken", help="pageToken string", default="") # added @ 2020.10.26
  args = argparser.parse_args()

  try:
    youtube_search(args)
  except HttpError as e:
    print("An HTTP error %d occurred:\n%s" % (e.resp.status, e.content))

  #print("==== yt_search completed ====")

  # 현 시점 유튜브 크롤링 + searching 했던 결과(dictionary)를 dataframe에 담고 
  yt_df = pd.DataFrame.from_dict(global_yt_dict_db, orient='index')
  yt_df.to_csv(now.strftime('%Y%m%d') + '_youtube_db.csv', encoding='utf-8-sig')
  
  output_file.close()


