
import './JobCard.css'
import axios from 'axios';
function JobCard({
    key,
    title,
    company,
    country,
    cities,
    tags,
    image,
    deleteJobHandler
}) {

  
    return (
        <div key={key} className='job-li flex-row-spaced'>
            <div className='left flex-row'>
                <div className='logo flex-center'>
                <img alt="logo" src={image} width="64" height="64" decoding="async" data-nimg="1" loading="lazy" style={{color:'transparent'}}/>
                </div>
                <div className='flex-column-evenly data'>

                    <p className='job-title'>{title}</p>
                    <p className='job-company'>{company}</p>
                    <div className='badges-container'>
                    <span className='badge country'> {country}</span>
                        {cities && cities.map((city)=>(
                            <span className='badge country'> {city}</span>
                        )

                        )
                            }
                        <span className='badge location'>Remote</span>
                        {/* <span className='badge salary'>$700-$1000</span> */}
                    </div>
                </div>
            </div>

            <div className='right flex-row'>

                <div className='flex-row tags-container'>
                    {
                        tags && tags.map((tag)=>(<div className='tag'>{tag}</div>))
                    }

                </div>
                <div className='flex-column'>
                <button onClick={deleteJobHandler} style={{
                    backgroundColor:'transparent',
                    border:'0px',
                    marginBottom:'5px',
                    fontWeight:'900',
                    fontSize:'18px',
                    cursor:'pointer'

                }}>X</button>
                6h ago
                </div>
                
            </div>



        </div>
    )
}

export default JobCard
