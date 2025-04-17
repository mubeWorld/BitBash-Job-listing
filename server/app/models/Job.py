from models import db
from sqlalchemy.dialects.postgresql import JSONB
class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    company = db.Column(db.String(100))
    country = db.Column(db.String(50))
    salary = db.Column(db.String(50))
    cities = db.Column(JSONB)        # for list of strings
    tags = db.Column(JSONB)        # for list of strings
    posted = db.Column(db.String(50))
    logo = db.Column(db.String(255))
    job_link = db.Column(db.String(255), default="https://www.actuarylist.com")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "company": self.company,
            "country": self.country,
            # "experience": self.experience,
            "cities":self.cities,
            "salary":self.salary,
            "tags": self.tags,
            "posted": self.posted if self.posted else None,
            "logo": self.logo,
            "job_link": self.job_link
        }
# self.posted.isoformat() if self.posted else None