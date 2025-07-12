import React from 'react';

// You can use the clasic way of call a property of object 
// like objec.property or the destructuring like we do here
// a good practice is to not change the value of the props
// in a child component, so we use the props as read only
// never mutex term

const Search = ({searchTerm, setSearchTerm}) => {
    return (  
        <div className='search'>
            <div>
                <img src="search.svg" alt="search" />
                <input type="text" 
                placeholder='search trough thousands of movies'
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                />
            </div>
        </div>
    );
}
 
export default Search ;