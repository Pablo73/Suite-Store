import React, { useContext } from 'react';
import Header from '../components/Header/Header';
import Cookies from 'js-cookie';
import SuiteStoreContext from '../context/SuiteStoreContext';
import { useNavigate } from 'react-router-dom';

function History() {

  const navigate = useNavigate();
  const columns = ['Code', 'Tax', 'Total']
  const { allOrderData } = useContext(SuiteStoreContext) ?? { allOrderData: [] };
  const retrievedRole = Cookies.get('userRole');

  const viewButtonHistory = (order_id) => {
    navigate(`/detailsTable/${order_id}`);
  }

  return (
    <div>
      <Header userRole={retrievedRole} />
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
              return (
                <tr key={rowIndex}>
                  <td>{rowIndex + 1}</td>
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