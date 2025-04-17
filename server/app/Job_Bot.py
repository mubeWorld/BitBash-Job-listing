from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from models.Job import Job
options = Options()
options.add_argument("--headless")  
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome( options=options)
driver.implicitly_wait(10)


def scrape_jobs():

    url = "https://www.actuarylist.com/"
    driver.get(url)

    jobs = []

    try:
        WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, "Job_job-card__YgDAV"))
        )
        job_cards = driver.find_elements(By.CLASS_NAME, "Job_job-card__YgDAV")

        for card in job_cards:
            try:
               
                title = card.find_element(By.CLASS_NAME, "Job_job-card__position__ic1rc").text

               
                company = card.find_element(By.CLASS_NAME, "Job_job-card__company__7T9qY").text
                badgeList= card.find_element(By.CLASS_NAME, "Job_job-card__locations__x1exr")
                
                country = badgeList.find_element(By.CLASS_NAME, "Job_job-card__country__GRVhK").text
               
                badges = badgeList.find_elements(By.CLASS_NAME, "Job_job-card__location__bq7jX")
                cities = [badge.text for badge in badges]

                salary = badgeList.find_elements(By.CLASS_NAME, "Job_job-card__salary__QZswp")
       
                tag_elements = card.find_elements(By.CLASS_NAME, "Job_job-card__location__bq7jX")[2:]
                tags = [tag.text for tag in tag_elements]

                posted = card.find_element(By.CLASS_NAME, "Job_job-card__posted-on__NCZaJ").text


                logo_img = card.find_element(By.CSS_SELECTOR, "div.Job_job-card__logo__cdF2_ img").get_attribute("src")

                job_link = card.find_element(By.CLASS_NAME, "Job_job-page-link__a5I5g").get_attribute("href")
                

                jobs.append(Job(
                                title=title,
                                company=company,
                                country=country,
                                cities=cities,
                                tags=tags,
                                posted=posted,
                                logo=logo_img,
                                job_link=job_link
                            )
                 )

            except Exception as e:
                logging.error(f"Error processing a job card: {e}")

    except Exception as e:
        logging.error(f"Error waiting for job cards: {e}")
    finally:
        driver.quit()

    return jobs
