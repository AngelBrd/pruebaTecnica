import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SearchBar } from '../SearchBar/SearchBar';
import { Link } from 'react-router-dom';
import FreightIcon from '../../assets/container-truck.svg';
import ContainerIcon from '../../assets/freight.svg';
import TruckIcon from '../../assets/truck.svg';
import BoatIcon from '../../assets/boat.svg';
import MarkerIcon from '../../assets/marker.svg';
import EyeIcon from '../../assets/eye.svg';
import './order.css';

export const Order = ({ setPageTitle }) => {
  const [orders, setOrders] = useState([]);
  const [isPickupTime, setIsPickupTime] = useState(false);

  useEffect(() => {
    setPageTitle("Upcoming"); // Actualizar el título al montar el componente
    axios.get('https://129bc152-6319-4e38-b755-534a4ee46195.mock.pstmn.io/orders/upcoming')
      .then(response => {
        setOrders(response.data.result);
      })
      .catch(error => {
        console.error('Error fetching order data:', error);
      });
  }, [setPageTitle]);


  const getFreightIcon = (type) => {
    switch (type) {
      case 'FCL':
        return FreightIcon; // La imagen predeterminada para FCL
      case 'LTL':
        return ContainerIcon; // Ícono de camión para LTL
      case 'SEA':
        return BoatIcon; // Ícono de barco para SEA
      default:
        return FreightIcon;
    }
  };

  const getStatusCircleColor = (status) => {
    if (status === 1 || status === 3) {
      return 'grey-dot-bg'; // Gris para Orden Asignada y Recolección completada
    } else if (status === 2) {
      return 'blue-dot-bg'; // Azul para En tránsito
    } else {
      return '';
    }
  };

  const getDestinationInfo = (destinations) => {
    const destination = destinations[0];
    if (destination) {
      const addressParts = destination.address.split(',');
      let city = '';
      let location = '';
      if (addressParts.length > 1) {
        city = addressParts[addressParts.length - 2].trim(); // La ciudad es el penúltimo elemento después de dividir por comas
        location = addressParts.slice(0, addressParts.length - 2).join(',').trim(); // La ubicación específica es todo antes de la ciudad
      }
      return {
        title: city, // Cambiamos para que el título sea la ciudad
        location: location
      };
    }
    return { title: '', location: '' };
  };
  
  const getDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString(); // Obtiene la fecha en formato legible
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Obtiene la hora sin segundos
    return { date: formattedDate, time: formattedTime };
  }
  
  const getDropoffInfo = (destinations) => {
    const dropoff = destinations.find(destination => destination.nickname === 'Entrega');
    if (dropoff) {
      const addressParts = dropoff.address.split(',');
      let city = '';
      if (addressParts.length > 1) {
        city = addressParts[addressParts.length - 2].trim(); // La ciudad es el penúltimo elemento después de dividir por comas
      }
      return {
        title: city, // Cambiamos para que el título sea la ciudad
        location: dropoff.address // Usamos la dirección completa como ubicación
      };
    }
    return { title: '', location: '' };
  };

  const getDropoffDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { formattedDate, formattedTime };
  };

  const getTimeDifference = (startTime) => {
    const currentTime = new Date().getTime();
    const difference = Math.abs(startTime - currentTime); // Calcular la diferencia absoluta
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Verificar si el tiempo de recogida ha pasado
      const currentTime = new Date().getTime();
      const pickupTime = orders[0]?.destinations[0]?.start_date;
      if (pickupTime && currentTime > pickupTime) {
        setIsPickupTime(true);
        console.log('Navigate'); // Mensaje en consola
        clearInterval(interval); // Detener el intervalo
      }
    }, 1000);

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar
  }, [orders]);


  return (
    <>
    <SearchBar></SearchBar>
      {orders.map(order => (
        <div key={order._id}>
          <h3>Order <strong>#{order.order_number}</strong></h3>
          <div className='tracking-principal-div'>
        
            <div className='tracking-title-div'>
                <div className='tracking-subtitle-div'>
                    <img src={getFreightIcon(order.type)} className='freight-icono' alt='Icono de contenedor'/>
                    <h4>{order.type}</h4>
                </div>
                <div className='tracking-state-div'>
                    <div className={`circulo ${getStatusCircleColor(order.status)}`}></div>
                    <p>{order.status_string}</p>
                </div>
            </div>
            <div className='tracking-flex-div'>
              <div className='icon-div'>
                  <img src={TruckIcon} alt='Icono de trailer'/>
                  <div className='linea-vertical'></div>
                  <img src={MarkerIcon} className='marker-icon' alt='Icono de marcador'/>
              </div>
              <div className='tracking-div'>
                <div className='info-div'>
                    <h5>Pickup</h5>
                    <h4>{getDestinationInfo(order.destinations).title}</h4>
                    <p>{getDestinationInfo(order.destinations).location}</p>
                </div>
                <div className='time-date-div'>
                    <h5>{getDateTime(order.destinations[0].start_date).date}</h5>
                    <h4>{getDateTime(order.destinations[0].start_date).time}</h4>
                </div>
                <div className='info-div'>
                    <h5>Dropoff</h5>
                    <h4>{getDropoffInfo(order.destinations).title}</h4>
                    <p>{getDropoffInfo(order.destinations).location}</p>
                </div>
                <div className='time-date-div'>
                    <h5>{getDropoffDateTime(order.destinations[1].start_date).formattedDate}</h5>
                    <h4>{getDropoffDateTime(order.destinations[1].start_date).formattedTime}</h4>
                </div>
              </div>
            </div>

            <div className='pickup-div'>
              <div className='pickup-time-div'>
              <a href='/' className='pickup-button' style={{ backgroundColor: isPickupTime ? '#FFFF00' : '#080c0f' }} disabled={!isPickupTime}>
              <p>
                Start pickup in <strong>{`${getTimeDifference(order.destinations[0].start_date).hours}:${getTimeDifference(order.destinations[0].start_date).minutes}:${getTimeDifference(order.destinations[0].start_date).seconds}`}</strong>
              </p>
            </a>
              </div>
                  <Link to='/cargo' className='resume-button'><span>Resume <img src={EyeIcon} alt='Icono de ojo'/></span></Link>
              </div>
          </div>
        </div>
      ))}
    </>
  );
}
