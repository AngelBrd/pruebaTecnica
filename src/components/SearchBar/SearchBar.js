import React from 'react';
import SearchIcon from '../../assets/search.svg';
import './searchBar.css';

export const SearchBar = () => {
  return (
    <div className='search-div'>
        <div className='icon-container'>
            <img src={SearchIcon} className='search-icon' alt='Icono de busqueda'/>
        </div>
        <input placeholder='Search..'></input>
    </div>
  )
}
