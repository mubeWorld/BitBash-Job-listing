import os
import psycopg2
import threading
import time
import schedule
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import and_,or_
from Job_Bot import scrape_jobs
from models import db
from models.Job import Job
from flask_cors import CORS
from sqlalchemy import func, text

app = Flask(__name__)
CORS(app,origins=["http://localhost:3000", "http://localhost:5173"]) 
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://flaskuser:flaskpass@db:5432/flaskdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)


with app.app_context():
        # db.drop_all()
        db.create_all()

@app.route('/jobsAll', methods=['GET'])
def get_jobs():
    jobs = Job.query.all()
    
    output = [{"id": job.id, "title": job.title, "country":job.country,"cities":job.cities,"posted":job.posted,"tags":job.tags,"company": job.company, "image":job.logo,"link":job.job_link} for job in jobs]
    return jsonify({'jobs': output})

@app.route('/jobs/<int:id>', methods=['GET'])
def get_job(id):
    try:
        job = Job.query.get(id)
        if not job:
             return jsonify("no job found")

        return jsonify({"id": job.id, "title": job.title, "company": job.company, "image":job.logo,"link":job.job_link})
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500

    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500
@app.route('/jobs', methods=['POST'])
def create_job():
    data = request.get_json()
    try:
        job = Job(
            title=data.get("title"),
            company=data.get("company"),
            country=data.get("country"),
            cities=data.get("cities"),
            tags=data.get("tags"),
            posted=data.get("posted"),
            logo=data.get("logo"),
            job_link=data.get("job_link")
        )

        db.session.add(job)
        db.session.commit()
        newly_added_job = Job.query.get(job.id)
    
        return jsonify({"title": newly_added_job.title, "id": newly_added_job.id}), 201
    except Exception as e:
        return jsonify(e)

@app.route('/jobs/<int:id>', methods=['PUT'])
def update_job(id):
    try:
        data = request.get_json()
        job = Job.query.get_or_404(id)
        job.title = data.get('title', job.title)
        job.company = data.get('company', job.company)
        job.country = data.get('country', job.country)
        job.cities = data.get('cities', job.cities)
        job.tags = data.get('tags', job.tags)
        job.posted = data.get('posted', job.posted)
        job.logo = data.get('logo', job.logo)
        job.job_link = data.get('job_link', job.job_link)
        db.session.commit()
        return jsonify({"message": "User updated"})
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500

    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500


@app.route('/jobs/<int:id>', methods=['DELETE'])
def delete_job(id):
    try:
        job = Job.query.get_or_404(id)
        db.session.delete(job)
        db.session.commit()
        return jsonify({"message": "User deleted"})
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500

    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500
    

@app.route('/jobs', methods=['GET'])
def search_jobs():
    country_param = request.args.get('country')
    city_param = request.args.get('cities')
    tag_param = request.args.get('tags')
    experience = request.args.get('experience')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)

    filters = []


    if country_param:
        country_list = [c.strip() for c in country_param.split(',')]
        filters.append(or_(*[Job.country.ilike(f"%{c}%") for c in country_list]))


    if city_param:
        city_list = [c.strip() for c in city_param.split(',')]
        filters.append(or_(*[Job.cities.contains([c]) for c in city_list]))


    if tag_param:
        tag_list = [t.strip() for t in tag_param.split(',')]
        filters.append(or_(*[Job.tags.contains([t]) for t in tag_list]))


    query = Job.query.filter(and_(*filters)) if filters else Job.query


    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    jobs = [job.to_dict() for job in pagination.items]

    return jsonify({
        "jobs": jobs,
        "total": pagination.total,
        "page": pagination.page,
        "pages": pagination.pages,
        "per_page": pagination.per_page
    })
@app.route('/country_count', methods=['GET'])
def get_country_counts():
    results = (
        Job.query
        .with_entities(Job.country, func.count(Job.id).label("count"))
        .group_by(Job.country)
        .all()
    )

    country_counts = [{"country": r.country, "count": r.count} for r in results]
    return country_counts
@app.route('/tag_count', methods=['GET'])
def get_tag_counts():
    sql = text("""
        SELECT tag, COUNT(*) as count
        FROM (
            SELECT jsonb_array_elements_text(tags::jsonb) as tag
            FROM job
        ) AS tag_table
        GROUP BY tag
        ORDER BY count DESC;
    """)
    result = db.session.execute(sql)
    tag_counts = [{'tag': row._mapping['tag'], 'count': row._mapping['count']} for row in result]
    return tag_counts
@app.route('/city_count', methods=['GET'])
def get_city_counts():
    sql = text("""
        SELECT city, COUNT(*) as count
        FROM (
            SELECT jsonb_array_elements_text(cities::jsonb) as city
            FROM job
        ) AS city_table
        GROUP BY city
        ORDER BY count DESC;
    """)
    result = db.session.execute(sql)
    city_counts = [{'city': row._mapping['city'], 'count': row._mapping['count']} for row in result]
    return city_counts

def run_scheduler():
    def saveToDb():
         with app.app_context():
            jobs = scrape_jobs()
            db.session.bulk_save_objects(jobs)
            db.session.commit()
    saveToDb()
    schedule.every(3).minutes.do(saveToDb)

    while True:
        schedule.run_pending()
        time.sleep(1)


def start_scheduler():
    scheduler_thread = threading.Thread(target=run_scheduler)
    scheduler_thread.daemon = True  
    scheduler_thread.start()

if __name__ == '__main__':
    start_scheduler()
    app.run(debug=True,host='0.0.0.0')
