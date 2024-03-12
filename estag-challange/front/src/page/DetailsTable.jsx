import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { postData } from '../utils/apiUtils';

function DetailsTable() {

  const navigate = useNavigate();
  const location = useLocation();
  const columns = ['Code', 'Product', 'Amount', 'Unit Price', 'Tax', 'Category', 'Total']
  const [allOrderItemData, setAllOrderItemData] = useState([]);
  const retrievedRole = Cookies.get('userRole');
  const token = sessionStorage.getItem('token');
  const { id } = useParams();

  useEffect(() => {

    const detailsView = async () => {
      try {
        const url = 'order/allOrderItem';

        const headers = { 
          'Content-Type': 'application/json',
          'Authorization': token
         };
  
         const requestBody = {
          orderId: id
      };
  
        await postData(url, requestBody, headers, handleApiResponse, navigate, location);
  
      } catch (error) {
        console.error('Error in API call:', error.message);
      }
    };
  
    const handleApiResponse = (response) => {
      if (response.status === 200 && response.message) {
        setAllOrderItemData(response.message);
      } 
    };
    detailsView();
  }, [id]);

 
  return (
    <div>
      <Header userRole={retrievedRole} />
      <div className='data-table' id="historyTable">
        <table id="tableDetails">
        <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
          {allOrderItemData?.map((row, rowIndex) => {
            const valorTax = (+row.unit_price / 100) * row.tax;
            const valorTotal = (+row.order_item_amount  * +row.unit_price) +  +valorTax
              return (
                <tr key={rowIndex}>
                  <td>{rowIndex + 1}</td>
                  <td>{row.product_name}</td>
                  <td>{parseInt(row.order_item_amount)}</td>
                  <td>{`$${row.unit_price}`}</td>
                  <td>{`$${valorTax.toFixed(2)}`}</td>
                  <td>{row.category_name}</td>
                  <td>{`$${valorTotal.toFixed(2)}`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
      </div>
    </div>
  );
}

export default DetailsTable;