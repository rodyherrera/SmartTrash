import React from 'react';
import { useSelector } from 'react-redux';
import { 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './DeviceAverageUsage.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
);

const DeviceAverageUsage = () => {
    const { isAnalyticsLoading, analytics } = useSelector((state) => state.device);

    return !isAnalyticsLoading && (
        <div className='Device-Average-Usage-Container'>
            <Line
                options={{
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            type: 'linear',
                            ticks: {
                                color: '#FFF',
                                font: {
                                    size: 11
                                },
                                callback: (value) => `${value}%`,
                            },
                            grid: {
                                display: false
                            }
                        },
                        x: {
                            ticks: {
                                color: '#FFF',
                                font: {
                                    size: 11
                                }
                            },
                            grid: {
                                color: '#FFF'
                            }
                        }
                    },
                    elements: {
                        line: {
                            tension: 0.4,
                            fill: true,
                            backgroundColor: 'rgba(255, 255, 255, 0.5)'
                        },
                        point: {
                            radius: 7,
                            hitRadius: 10,
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            borderColor: 'white'   
                        }
                    }
                }}
                data={{
                    labels: ['Hourly', 'Daily', 'Weekly', 'Monthly'],
                    datasets: [{
                        label: 'Average Usage',
                        data: [analytics.averageUsage.hourly, analytics.averageUsage.daily, analytics.averageUsage.weekly, analytics.averageUsage.monthly],
                        backgroundColor: 'rgba(255, 255, 255)',
                        borderColor: 'rgba(255, 255, 255)',
                        borderWidth: 1,
                    }]
                }}
                height={110}
            />
        </div>
    )
};

export default DeviceAverageUsage;