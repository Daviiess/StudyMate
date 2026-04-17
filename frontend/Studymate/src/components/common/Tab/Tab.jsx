import React from 'react'
import './Tab.scss';
const Tab = ({activeTab, setActiveTab, tabs }) => {
  return (
    <div className='tab'>

      <nav className='tab__nav'>
            {tabs?.map((tab) => {
                return(
                    <button key={tab.label} 
                    className = {`tab__button ${activeTab === tab.name ? 'active' : ''}`} 
                    onClick = {() => setActiveTab(tab.name)}
                    >
                        {tab.label}
                    </button>
                )
            })}
      </nav>
      <div className='tab__contents'>
            {tabs.map((tab) => {
              if(activeTab === tab.name){
                return( 
                  <div key={tab.label}> 
                    {tab.content}
                  </div>
                )
              }
            })}
      </div>
    </div>
  )
}

export default Tab
