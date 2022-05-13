# Web Scraper For Instagram Post

## Installations Instructions

* Open The Project Folder From Terminal
* Run The Command "npm install"
* Create a "credentials.json" File In Root With username,password Properties...
    Ex:
        {
            "username": "example@gmail.com",
            "password": "ExamplePassword"
        }
* Login Will Only Be Required In The First Run
  
## How To Use 
### Scrape Post 

* Run The Command "npm run scrape-post 'output_file_name' 'post_url'"
    Ex: npm run scrape-post elena https://www.instagram.com/p/B-icgvQD9SD/
  
* After Running The Above Command, The Scraping Will Be Started.

* Scraped data will be saved to Scraped Data folder

### Scrape Number Of Comments For A Post

* Run The Command "npm run scrape-comment-count 'output_file_name' 'post_url'"
    Ex: npm run scrape-comment-count elena https://www.instagram.com/p/B-icgvQD9SD/
  
* After Running The Above Command, The Scraping Will Be Started.

* Scraped data will be saved to Scraped Data folder
### Scrape Profile

* Run The Command "npm run scrape-profile 'output_file_name' 'profile_url'"
    Ex: npm run scrape-profile joe https://www.instagram.com/joe.fod/
  
* After Running The Above Command, The Scraping Will Be Started.

* Scraped data will be saved to Scraped Data folder


