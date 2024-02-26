import React, { useEffect, useState } from 'react';
import './cargo.css';
import YellowTruckIcon from '../../assets/yellowTruck.svg';
import Avatar from '../../assets/Driver.png';
import Check from '../../assets/check.png';

const Cargo = ({ setPageTitle }) => {
  const [orderData, setOrderData] = useState(null); // Estado para almacenar los datos de la orden

  useEffect(() => {
    setPageTitle("Cargo Details");
    fetchOrderData(); // Llamada a la función para obtener los datos de la orden
  }, [setPageTitle]);

  // Función para obtener los datos de la orden de la API
  const fetchOrderData = async () => {
    try {
      const response = await fetch('https://129bc152-6319-4e38-b755-534a4ee46195.mock.pstmn.io/orders');
      const data = await response.json();
      setOrderData(data.result);
    } catch (error) {
      console.error('Error fetching order data:', error);
    }
  };

  const getDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString(); // Obtiene la fecha en formato legible
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Obtiene la hora sin segundos
    return { date: formattedDate, time: formattedTime };
  }

  const [mostrarInformacion, setMostrarInformacion] = useState(false);
  const [icono, setIcono] = useState('v');

  const toggleInformacion = () => {
    setMostrarInformacion(!mostrarInformacion);
    setIcono(mostrarInformacion ? 'v' : '∧');
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div>
      <div className='cargo-details-div'>
        <h4>Referencia {orderData ? <strong>{orderData.reference_number}</strong> : null}</h4>
        <h3>Order <strong>{orderData?.order_number}</strong></h3>
        <div className='cargo-details-flex'>
          <div className='icon-cargo-div'>
            <img src={YellowTruckIcon} className='yellow-truck' alt="Yellow truck"></img>
            <div className='linea'></div>
            <div className='path'></div>
          </div>
          <div className='cargo-info-div'>
            <div className='cargo-pickup-div'>
              <h5>Pickup</h5>
              <h4>{orderData?.route?.pickup}</h4>
              <p>{orderData?.destinations[0]?.address}</p>
              <div className='div-status'>
                <div className='circle'></div>
                <p>{orderData?.status_list?.pickup.find(status => status.active)?.status}</p>
              </div>
            </div>
            <div className='cargo-dropoff-div'>
              <h5>Dropoff</h5>
              <h4>{orderData?.route?.dropoff}</h4>
              <p>{orderData?.destinations[1]?.address}</p>
              <div className='div-status'>
                <div className='circle-on-hold'></div>
                <p>{orderData?.status_list?.dropoff?.find(status => status.active)?.status}Orden Recogida</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='cargo-status-div'>
        <img src={Avatar} className='avatar' alt="Avatar"></img>
        <h3>{orderData && orderData.created ? getDateTime(orderData.created).time : null}</h3>
        <div className='check-status-div'>
          <div className='cargo-check-div'>
            <div className='check-bar'>
            {/* PARA LA BARRA DE PROGRESO PENSABA UTILIZAR ESTE RECURSO: https://codesandbox.io/p/sandbox/vertical-progress-bar-stepper-rtkfo?file=%2Fsrc%2Findex.tsx */}
              <img src={Check} alt="Check icon"></img>
              <img src={Check} alt="Check icon"></img>
            </div>
            <div className='check-status'>
              <p>Created Order</p>
              <p>Accepted Order</p>
              <p>Pickup set up by William</p>
              <p>Pickup Completed</p>
            </div>
          </div>
        </div>
        <button className='track-button' disabled>Track Order</button>
      </div>

      <div>
        <button className={`detalles-button ${mostrarInformacion ? 'active' : ''}`} onClick={toggleInformacion}>
          <span className="button-text">{mostrarInformacion ? 'Ocultar Detalles' : 'Ver Detalles'}</span>
          <span className='button-icon'>{icono}</span>
        </button>
        {mostrarInformacion && orderData && orderData.destinations.length > 0 && (
          <div className='detalles-div'>
            <p>{orderData.destinations[0].address}</p>
            <p>{new Date(orderData.created).getDate()} de {capitalizeFirstLetter(new Date(orderData.created).toLocaleDateString('es-MX', { month: 'long' }))} de {new Date(orderData.created).getFullYear()} - {new Date(orderData.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p>{orderData.destinations[0].contact_info.telephone}</p>
            <p>{orderData.destinations[0].contact_info.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cargo;
