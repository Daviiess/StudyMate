import React, {memo} from 'react'
import './Modal.scss';
const Modal = ({data, deleteModal, deleteDocument,deleting}) => {
  return (
    <div className='delete-modal'>
      <div className='delete-modal__overlay'>
         <h3>Confirm delete</h3>
         <p>Are you sure you want to delete {data.title} </p>
        <div className='delete-modal__actions'> 
      <button className='delete-modal__actions--cancel-btn' onClick={deleteModal}>Cancel</button>
      <button className='delete-modal__actions--delete-btn' onClick={deleteDocument} disabled = {deleting}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default memo(Modal)
