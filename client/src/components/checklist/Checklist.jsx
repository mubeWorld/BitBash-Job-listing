import React, { useState } from 'react';
import './Checklist.css';
import Spinner from '../spinner/Spinner';
import useAxiosFetch from '../../hooks/useAxiosFetch';
function Checklist({label,field,selectedData,setSelectedData ,url}) {
  const [selectedCountries, setSelectedCountries] = useState([]);

  const [data, setData, isloading, iserror, refetch] = useAxiosFetch(url);


  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedData((prevSelected) =>
      checked
        ? [...prevSelected, value]
        : prevSelected.filter((dataElem) => dataElem !== value)
    );
  };

  return (
    <div className='checkboxes-container'>
      <label><h4>{label}</h4></label>
      <ul>
        {isloading && <Spinner size={30}/>}
        {data?.map((element) => (
          <li key={element[field]} style={{position:"relative"}} >
            <input
              type="checkbox"
              className='checkbox'
              value={element[field]}
              checked={selectedData.includes(element[field])}
              onChange={handleCheckboxChange}
            />
            <label>{element[field]}</label>
            <label className='count'>{element.count}</label>
          </li>
        ))}
        
      </ul>
      {/* <div style={{ marginTop: '10px' }}>
        <strong>Selected Countries:</strong> {selectedData.join(', ')}
      </div> */}
    </div>
  );
}

export default Checklist;
