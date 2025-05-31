import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { QueryResponse } from '../types';

interface VisualizationRendererProps {
  response: QueryResponse | null;
}

const VisualizationRenderer: React.FC<VisualizationRendererProps> = ({ response }) => {
  if (!response) return null;
  
  if (!response.visualization) {
    return (
      <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="body1">{response.text}</Typography>
      </Box>
    );
  }
  
  const { type, data } = response.visualization;
  
  // Handle different visualization types
  switch (type) {
    case 'pie':
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>{response.text}</Typography>
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              chart: {
                type: 'pie',
                height: 400
              },
              title: {
                text: ''
              },
              tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
              },
              accessibility: {
                point: {
                  valueSuffix: '%'
                }
              },
              plotOptions: {
                pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                  }
                }
              },
              series: [{
                name: 'Share',
                colorByPoint: true,
                data: data
              }]
            }}
          />
        </Box>
      );
      
    case 'bar':
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>{response.text}</Typography>
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              chart: {
                type: 'column',
                height: 400
              },
              title: {
                text: ''
              },
              xAxis: {
                categories: data.categories,
                title: {
                  text: data.xAxisTitle || ''
                }
              },
              yAxis: {
                min: 0,
                title: {
                  text: data.yAxisTitle || ''
                }
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              series: data.series
            }}
          />
        </Box>
      );
      
    case 'line':
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>{response.text}</Typography>
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              chart: {
                type: 'line',
                height: 400
              },
              title: {
                text: ''
              },
              xAxis: {
                categories: data.categories,
                title: {
                  text: data.xAxisTitle || ''
                }
              },
              yAxis: {
                title: {
                  text: data.yAxisTitle || ''
                }
              },
              plotOptions: {
                line: {
                  dataLabels: {
                    enabled: true
                  }
                }
              },
              series: data.series
            }}
          />
        </Box>
      );
      
    case 'table':
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>{response.text}</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {data.headers.map((header: string, index: number) => (
                    <TableCell key={index}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.rows.map((row: any[], rowIndex: number) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      );
      
    default:
      return (
        <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="body1">{response.text}</Typography>
        </Box>
      );
  }
};

export default VisualizationRenderer; 