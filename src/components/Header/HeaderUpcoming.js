import React from 'react';
import ArrowLeftIcon from '../../assets/arrowLeftIcon.svg';
import BellIcon from '../../assets/bell.svg';
import '../Header/headerUpcoming.css';


export const HeaderUpcoming = ({title}) => {
  return (
    <header>
      <a href='/order'><img src={ArrowLeftIcon} className='icono-flecha' alt='Icono de regresar'/></a>
      <h3 className='header-title'>{title}</h3>
      <a><img src={BellIcon} className='icono-notificacion' alt='Icono de notificacion'/></a>
    </header>
  );
};



