import React from 'react'
import './Tab.scss';
const Tab = ({activeTab, setActiveTab, tabs }) => {
  return (
    <div className='tab'>

      <ul className='tab__nav'>
            {tabs.map((tab) => {
                return(
                    <button key={tab.label} 
                    className = {`tab__button ${activeTab === tab.name ? 'active' : ''}`} onClick = {() => setActiveTab(tab.name)}>
                        {tab.name}
                    </button>
                )
            })}
      </ul>
    </div>
  )
}

export default Tab
