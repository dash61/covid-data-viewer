import React from 'react';

import {
  CardContent,
  CardHeader,
  Card,
} from "@mui/material";

// import { Chart as ChartJs } from "react-chartjs-2";
import { Line } from "react-chartjs-2";

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js'

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
);


// Defined at: https://www.chartjs.org/docs/latest/configuration/tooltip.html#tooltip-item-interface
// interface TooltipItem {
//     datasetIndex: number; // index of the dataset, ie, which graph was clicked on; 0-based
//     index: number;        // index of this data item in dataset, ie, column of the data where mouse was clicked
//     label: string;        // label for the tooltip
//     value: string;        // value for the tooltip
//     x: number;            // x value of where mouse clicked, in pixels
//     xLabel: string;       // x-axis label; deprecated - use label instead
//     y: number;            // y value of where mouse clicked, in pixels
//     yLabel: number;       // y value; deprecated - use value instead
// }

interface IProps {
  title: string;
  data: any[];
  labels: string[];
  oneGraph: boolean;
}

/* TODO -
   - round off tooltip value to nearest integer
   - colorize bar with tooltip
   - add color to chart
*/

function ChartXY(props: IProps) {
  const datasets = props.data;
  // console.log("chartxy - datasets=", datasets);

  // Loop through the chartData and add additional static settings that will apply to all charts
  for(let i = 0; i < props.data.length; i++){
    const additionalSettings = {
      // pointBackgroundColor: ['FFF'],
      borderWidth: 1,
      pointRadius: 0.4,
      showLine: true,
      backgroundColor: i === 1 ? 'rgba(255, 99, 132, 0.5)' : 'rgba(53, 162, 235, 0.5)',
    };
    // const pointBG: string[] = [];
    // for(let j = 0; j < props.data[i].data.length; j++){
    //   pointBG.push('#FFF');
    // }
    // additionalSettings.pointBackgroundColor = pointBG;
    datasets[i] = {...datasets[i], ...additionalSettings};
  }

  // Determine which datasets to render in the table
  const data = {
    labels: props.labels,
    datasets
  };
  // console.log("chart.tsx - oneGraph=", props.oneGraph);

  const options: any = {
    maintainAspectRatio: false,
    hover: {
      intersect: true,
    },
    interaction: {
      mode: "nearest" as "nearest" // as ChartJs.defaults.interaction //"nearest" // InteractionModeMap.nearest
    },
    tooltips: {
        mode: "nearest",
        intersect: true,
    },
    responsive: true,
    plugins: {
      filler: {
        propagate: false,
      },
      legend: {
        display: !props.oneGraph,
        position: 'top' as const,
      }
    },
    title: {
      display: false,
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 10,
        },
        reverse: false,
        gridLines: {
          color: "rgba(0,0,0,0.05)",
        },
        bounds: "ticks",
      },
      y: {
        ticks: {
          beginAtZero: true,
        },
        display: true,
        gridLines: {
          color: "rgba(0,0,0,0)",
          fontColor: "#fff",
        },
      },      
    },
    elements: {
      point: {
        radius: 0
      }
    }
  };

  return (
    <Card>
      <CardHeader style={{textAlign: "start"}}
        title={props.title}
      />
      <CardContent>
        <div style={{height: "260px", paddingBottom: 20}}>
            <Line  data={data} options={options}/>
        </div>
      </CardContent>
    </Card>
  );
}

export default ChartXY;
