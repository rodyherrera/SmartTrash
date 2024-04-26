import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import './DeviceAverageUsage.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const DeviceUsage = () => {
    const { isAnalyticsLoading, analytics } = useSelector((state) => state.device);

    if(isAnalyticsLoading){
        return <React.Fragment />
    };

    const chartOptions = {
        indexAxis: 'y',
        responsive: true,
        scales: {
            x: {
                beginAtZero: true,
                type: 'linear',
                ticks: {
                    color: '#FFF',
                    font: 11,
                    callback: (value) => `${value}%`
                },
                grid: {
                    display: false
                }
            },
            y: {
                ticks: {
                    color: '#FFF',
                    font: {
                        size: 11
                    }
                },
                grid: {
                    display: false
                }
            }
        },
    };

    const chartData = {
        labels: ['Hourly', 'Daily', 'Weekly', 'Monthly'],
        datasets: [{
            //data: [analytics.averageUsage.hourly, analytics.averageUsage.daily, analytics.averageUsage.weekly, analytics.averageUsage.monthly],
            data: [19, 37, 47, 99],
            borderRadius: 50,
            backgroundColor: '#F5F5F5'
        }]
    };

    return (
        <div className='Device-Average-Usage-Container'>
            <div className='Device-Average-Usage-Header-Container'>
                <h3 className='Device-Average-Usage-Header-Title'>Average Usage</h3>
                <i className='Device-Average-Usage-Icon-Container'>
                    <HiOutlineArrowRight />
                </i>
            </div>
            <Bar options={chartOptions} data={chartData} height={115} />
        </div>
    );
};

export default DeviceUsage;