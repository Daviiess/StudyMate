import React from 'react';
import './PageHeader.scss';
const PageHeader = ({title}) => {
  return (
    <div className='page-header'>
      {title}
    </div>
  )
}

export default PageHeader
