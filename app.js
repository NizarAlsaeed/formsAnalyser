//  To do:
// add custom chart type >>> Noura 
// enhance the style  Mahmoud 
// dynamic background colors to fit the segments length
// publish online or in an app




// deal with empty cells (the next cell shifts to it)
// deal with checkboxes (multible answers in the same cell)
// optimize the code

let totalsArr = [];

let oFileIn = document.getElementById('my_file_input');
oFileIn.addEventListener('change', filePicked);

function filePicked(oEvent) {
  // Get The File From The Input
  let oFile = oEvent.target.files[0];
  let sFilename = oFile.name;
  // Create A File Reader HTML5
  let reader = new FileReader();

  // Ready The Event For When A File Gets Selected
  reader.onload = function (e) {
    let data = e.target.result;
    let cfb = XLSX.read(data, { type: 'binary' });

    let wb = cfb;//XLSX.parse_xlscfb(cfb);
    // console.log(wb)
    // Loop Over Each Sheet
    wb.SheetNames.forEach(function (sheetName) {
      // Obtain The Current Row As CSV
      let oJS = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
      console.log(`${sheetName}: `, oJS);
      main(oJS);
    });
  };

  // Tell JS To Start Reading The File.. You could delay this if desired
  reader.readAsBinaryString(oFile);

}

function convertToCloumns(dataObject) {
  //-------------convert to cloumns
  /*as forms are filled in by columns we should take a coulmn of values
   with the same type or i mean values that belong to the same question*/
  let columnValues;
  let allCols = [];
  let colNames = [];
  let cloumnHeadersArr = Object.keys(dataObject[0])
  console.log(`The file has ${cloumnHeadersArr.length} columns: `, cloumnHeadersArr)
  for (let index = 0; index < cloumnHeadersArr.length; index++) {
    columnValues = [];
    colNames.push(cloumnHeadersArr[index]);
    for (let i = 0; i < dataObject.length; i++) {
      let row = Object.values(dataObject[i])
      columnValues.push(row[index]);
    }
    allCols.push(columnValues)
    console.log(`${cloumnHeadersArr[index]} column in a table:`)
    console.table(columnValues);
  }
  return [colNames, allCols]

}

function takeDataLabels(columnValues) {
  //-----------take data labels----------
  /*data labels are those things below the chart the shows each group of value are referenced by the same label.
  so here we check for unique values from the array to take from each column all the types of values let's say */
  let labelArr = [];
  for (let j = 0; j < columnValues.length; j++) {
    if (labelArr.indexOf(columnValues[j]) === -1 && columnValues[j] != undefined) {//if value doe not exist in the label array
      labelArr.push(columnValues[j]);
    }
  }
  return labelArr
}

function countValueDuplication(columnValues, labelArr) {
  //----------------count value duplication
  /*creates an array of the number of dublication for each value. the logic is that i check if the value is the same as the label
  add one so at the end we have an array of dublication values corresponding to the label aray */
  let dataArr = new Array(columnValues.length).fill(0);
  for (let j = 0; j < columnValues.length; j++) {
    for (let k = 0; k < labelArr.length; k++) {
      if (labelArr[k] === columnValues[j]) {
        dataArr[k]++;
      }
    }

  }
  return dataArr
}

function takeArrZerosOut(dataArr) {
  //------------------prepare  data array by taking zeros out
  let splitingIndex = dataArr.indexOf(0);
  dataArr = dataArr.splice(0, splitingIndex)
  return dataArr
}

function calcTotal(dataArr) {
  //-----------calculating the total and assigning it to array
  let sumOfValues = 0;
  for (let z = 0; z < dataArr.length; z++) {
    sumOfValues += dataArr[z];
  }
  totalsArr.push(sumOfValues);
  return sumOfValues
}

function toPercent(dataArr) {
  //-----------converting data array values to percentages
  for (let z = 0; z < dataArr.length; z++) {
    dataArr[z] = Math.round((dataArr[z] / sumOfValues) * 100);
  }
  return dataArr
}

function createChart(columName, columnValues, labelArr, dataArr, sumOfValues, chartType = 'pie') {
  //-------------create chart------

  // switch to 'bar' chart if too many unique values (slices)
  if (dataArr.length >= 10) {
    chartType = 'bar';
  }

  // defines mimimum duplication criteria to ignore uplottable columns (such as timestamp or ID .. etc)
  let minDuplicationCondition = (columnValues.length - dataArr.length) >= (columnValues.length * 0.30);
  console.log('passed mimimum duplication criteria? ', minDuplicationCondition);

  if (minDuplicationCondition && columName != 'Timestamp') {

    const chartSection = document.getElementById('chartSection');
    const canvas = document.createElement('canvas');
    canvas.id = 'canvasId';
    canvas.classList = 'border'
    chartSection.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let chart = new Chart(ctx, {
      type: chartType,
      data: {
        datasets: [{
          data: dataArr,
          backgroundColor: ['rgb(54, 162, 235)', 'rgb(255,143,0)', 'rgb(54, 162, 90)', 'rgb(255,207,0)', 'rgb(54, 16, 235)', 'rgb(143,20,82)', 'rgb(64,35,0)', 'rgb(54,20,82)', 'rgb(160,255,0)', 'rgb(255,0,0)', 'rgb(255,100,161)', 'rgb(94,91,30)', 'rgb(0,143,29)'],
        }],
        labels: labelArr,
      },
      options: {
        responsive: true,
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            padding: 30,
            color: '#fff',
          },
        },

        title: {
          display: true,
          text: `${columName}`,
          fontSize: 20,
          padding: 30,
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              let dataset = data.datasets[tooltipItem.datasetIndex];
              let meta = dataset._meta[Object.keys(dataset._meta)[0]];
              let total = meta.total;
              let currentValue = dataset.data[tooltipItem.index];
              let percentage = parseFloat((currentValue / total * 100).toFixed(1));
              return currentValue + ' (' + percentage + '%)';
            },
            title: function (tooltipItem, data) {
              return data.labels[tooltipItem[0].index];
            }
          }
        },
        plugins: {
          datalabels: {
            color: '#fff',
            anchor: 'end',
            align: 'start',
            offset: -30,
            borderWidth: 2,
            borderColor: '#fff',
            borderRadius: 25,
            backgroundColor: (context) => {
              return context.dataset.backgroundColor;
            },
            font: {
              weight: 'bold',
              size: '12'
            },
            formatter: (value) => {
              return value + ' %';
            }
          },
        },
      },
    });
  }
}

function startManiupulation(dataObject) {

  let recieved = convertToCloumns(dataObject)
  let columName = recieved[0]
  let columnValues = recieved[1]
  console.log('Recieved this from convertToCloumns', recieved)
  for (colIndex in columnValues) {
    console.log('processing column values:', columnValues[colIndex])
    let labelArr = takeDataLabels(columnValues[colIndex])
    console.log('column labels:', labelArr)
    let dataArr = countValueDuplication(columnValues[colIndex], labelArr)
    dataArr = takeArrZerosOut(dataArr)
    console.log('counted values occurance: ', dataArr)
    sumOfValues = calcTotal(dataArr)
    console.log('Total coulmn values: ', sumOfValues)
    dataArr = toPercent(dataArr)
    createChart(columName[colIndex],columnValues[colIndex], labelArr, dataArr, sumOfValues)
  }
}

function clearWorkspace(){
  canvases = document.querySelectorAll('canvas')
  for (let i=0;i< canvases.length; i++){
    document.querySelector('canvas').remove()
  }
  document.querySelector('#my_file_input').value = ''
}
function main(data) {
  console.log(`loaded file sucsessfully`)
  //data = prepareData(data) // contribute here 
  startManiupulation(data)
  console.log('Finished Manipulation')
}
