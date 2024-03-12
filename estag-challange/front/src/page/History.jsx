import React, { useContext } from 'react';
import Header from '../components/Header/Header';
import SuiteStoreContext from '../context/SuiteStoreContext';
import { useNavigate } from 'react-router-dom';

function History() {

  const navigate = useNavigate();
  const columns = ['Code', 'Data', 'Tax', 'Total']
  const { allOrderData } = useContext(SuiteStoreContext) ?? { allOrderData: [] };

  const formatData = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const day = dateTime.getDate().toString().padStart(2, '0');
    const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
    const year = dateTime.getFullYear();
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  const viewButtonHistory = (order_id) => {
    navigate(`/detailsTable/${order_id}`);
  }

  return (
    <div>
      <Header/>
      <div className='data-table' id="historyTable">
        <table id="tableHistory">
        <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {allOrderData?.message?.map((row, rowIndex) => {
            const dataFormat = formatData(row.order_date);
              return (
                <tr key={rowIndex}>
                  <td>{rowIndex + 1}</td>
                  <td>{dataFormat}</td>
                  <td>{`$${row.tax_order}`}</td>
                  <td>{`$${row.total_order}`}</td>
                  <td>
                    <button onClick={() => viewButtonHistory(row.order_id)}>View</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
      </div>
    </div>
  );
}

export default History;