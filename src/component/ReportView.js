import React from "react";
import wineData from '../helper/master-data.json';
import './ReportView.css';
//import wineData from '../helper/sample-data.json';

/**
 * This component contains statistical funtions to generate the stat report of data.
 * @param {*} props.dimension // [Flavanoids,Gamma]
 * @returns Stat Report
 */
const ReportView = (props) => {

  /**
   * This utility function prepares the data required to calculate the stats.
   * @param {*} data 
   * @returns 
   */
  function prepareData(data) {
    return data.reduce((acc, curr) => {

      const alcohol = curr.Alcohol;
      if(props?.dimension === "Gamma"){
        var Gamma = (curr?.Ash * curr?.Hue) / curr?.Magnesium
      }
      if (!acc[alcohol]) {
        acc[alcohol] = { count: 0, sum: 0, dimension: [] };
      }
      const dimensionValue = parseFloat (props?.dimension === "Gamma" ? Gamma : curr.Flavanoids);
      acc[alcohol].count++;
      acc[alcohol].sum += dimensionValue;
      acc[alcohol].dimension.push(dimensionValue);
      return acc;
    }, {});
  }
  
  /**
   * This Utility function calculates the mode of the provided data in the array.
   * @param {*} arr 
   * @returns 
   */
  function calculateMode(arr) {
    const counts = {};
    arr.forEach(num => {
      counts[num] = (counts[num] || 0) + 1;
    });
    const mode = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    return parseFloat(mode);
  }
  
  // Preparing Data set for Calculation
  const structuredDataSet = prepareData(wineData);
  
  // Prepare data for HTML table skeleton
  var tableData  = [];
  for (const alcohol in structuredDataSet) {
    const { count, sum,  dimension } = structuredDataSet[alcohol];
    const mean = sum / count;
    const sortedFlavanoids = dimension.sort((a, b) => a - b);
    const median = sortedFlavanoids[Math.floor(sortedFlavanoids.length / 2)];
    const mode = calculateMode(dimension);
    
    //Setting the headers.
    tableData.push({
      Alcohol: alcohol,
      [props?.dimension + " Mean"]: mean,
      [props?.dimension + " Median"]: median,
      [props?.dimension + " Mode"]: mode
    });
  }

  //Transposing the 2-D array to create the required table format.
  const transposeData = () => {
    const transposed = {};
    tableData.forEach((row) => {
      for (const key in row) {
        if (key !== 'Alcohol') {
          if (!transposed[key]) {
            transposed[key] = {};
          }
          transposed[key][row['Alcohol']] = row[key];
        }
      }
    });
    return transposed;
  };


  const renderTableRows = () => {
    const transposedData = transposeData();
    const rows = [];
    for (const key in transposedData) {
      rows.push(
        <tr key={key}>
          <td>{key}</td>
          {Object.keys(transposedData[key]).map((alcohol) => (
            <td key={alcohol}>{transposedData[key][alcohol].toFixed(2)}</td>
          ))}
        </tr>
      );
    }
    return rows;
  };
  
  return (
    <table>
      <thead>
      <div className="heading">{props?.dimension}</div>
        <tr>
          <th>Measure</th>
          {tableData.map((row) => (
            <th key={row.Alcohol}>Class {row.Alcohol}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {renderTableRows()}
      </tbody>
    </table>
  );

} 
export default ReportView