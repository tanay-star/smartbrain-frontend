import React, { Fragment } from 'react';

const Rank = ({name,entries}) => {
    
    console.log('Rank');

    return(
       <Fragment>
           <div className='white f3'>
             {`${name}, your current rank is...`}
           </div>
           <div className='white f1'>
               {entries}
           </div>
       </Fragment>
    )
}

export default Rank;