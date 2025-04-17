import React, { useState, Suspense, useEffect } from 'react';
import './App.css'
import Button from './components/buttons/Button.jsx'
import Checklist from './components/checklist/Checklist.jsx'
import JobCard from './components/JobCard.jsx'
import Navbar from './components/navbar/Navbar.jsx'
import JobPostModal from './components/modal/JobPostModal.jsx';
import useAxiosFetch from './hooks/useAxiosFetch.jsx';
import axios from 'axios';
import { backendurl } from './url.js';
import Spinner from './components/spinner/Spinner.jsx';
import Timer from './components/timer/timer.jsx';
function App() {
  const [selectedDataC, setSelectedDataC] = useState([]);
  const [selectedDataCi, setSelectedDataCi] = useState([]);
  const [selectedDataT, setSelectedDataT] = useState([]);
  const [params, setParams] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData, loading, error, refetch] = useAxiosFetch(`http://localhost:5000/jobs`, {

  });

  useEffect(() => {
    const params = {};

    if (selectedDataC.length > 0) {
      params.country = selectedDataC.join(',');
    }

    if (selectedDataCi.length > 0) {
      params.cities = selectedDataCi.join(',');
    }
    if (selectedDataT.length > 0) {
      params.tags = selectedDataT.join(',');
    }
    setParams({ ...params })
    refetch("http://localhost:5000/jobs", {
      params: params,
    })
  }, [selectedDataC, selectedDataCi, selectedDataT])
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const deleteJob = async (id) => {
    try {
      const response = await axios.delete(`${backendurl}/jobs/${id}`);
      if (response?.status == 200) {
        // setData(data.filter((item) => item.id !== id));
        // setData((prev) => prev.filter((item) => item.id !== id));
        refetch("http://localhost:5000/jobs", {
          params: params,
        })
      }
      console.log('Item deleted:', response.data);
      console.log('Item deleted:', response);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (error) return (
    <div>
      <p>Error: {error.message}</p>
      {/* <button onClick={refetch}>Retry</button> */}
    </div>
  );

  return (
    <div className='container'>
      <Navbar />
      <div className='action-Bar'>
        <Button label={"Add Job"} handler={openModal} />
        <Timer onTimeout={() => refetch("http://localhost:5000/jobs")} />
      </div>
      <div className='flex-center '>

        <div className='filters'>

          <Checklist label={"Country"} url={"http://localhost:5000/country_count"} field={"country"} selectedData={selectedDataC} setSelectedData={setSelectedDataC} />

          <Checklist label={"City"} url={"http://localhost:5000/city_count"} field={"city"} selectedData={selectedDataCi} setSelectedData={setSelectedDataCi} />
          <Checklist label={"Tags"} url={"http://localhost:5000/tag_count"} field={"tag"} selectedData={selectedDataT} setSelectedData={setSelectedDataT} />
        </div>


        <div className='job-list'>
          {loading ? <Spinner size={50} /> : (
            data?.jobs?.map((job) => (<JobCard key={job.id} title={job.title} company={job.company} country={job.country} cities={job.cities} image={job.logo} tags={job.tags?.filter((tag) => tag !== "")} deleteJobHandler={() => {
              deleteJob(job.id)
            }} />))
          )}
        </div>
      </div>
      {isModalOpen && <JobPostModal onClose={closeModal} />}
    </div>

  )
}

export default App
