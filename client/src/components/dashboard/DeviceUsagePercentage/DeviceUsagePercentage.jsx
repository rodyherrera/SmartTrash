import React from 'react';
import { GaugeContainer, GaugeReferenceArc, GaugeValueArc, GaugeValueText } from '@mui/x-charts/Gauge';
import './DeviceUsagePercentage.css';

const DeviceUsagePercentage = ({ usagePercentage }) => {
    return (
        <article className='Device-Usage-Percentage-Container'>
            <GaugeContainer 
                width={500} 
                height={110} 
                value={usagePercentage}
                outerRadius={100}
                innerRadius={98}
                startAngle={-90} 
                endAngle={90}
            >
                <GaugeReferenceArc />
                <GaugeValueArc />
                <GaugeValueText className='Device-Usage-Percentage-Value' text={usagePercentage + '%'} />
            </GaugeContainer>
        </article>  
    );
};

export default DeviceUsagePercentage;