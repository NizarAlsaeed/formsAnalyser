//  To do:
// add custom chart type
// deal with empty cells (the next cell shifts to it)
// deal with checkboxes (multible answers in the same cell)
// remove unrequired files
// enhance the style
// optimize the code
// publish online or in an app


var oFileIn;
let chartType = 'pie';

    oFileIn = document.getElementById('my_file_input');
    oFileIn.addEventListener('change', filePicked);
    


function filePicked(oEvent) {
    // Get The File From The Input
    var oFile = oEvent.target.files[0];
    var sFilename = oFile.name;
    // Create A File Reader HTML5
    var reader = new FileReader();

    // Ready The Event For When A File Gets Selected
    reader.onload = function(e) {
        var data = e.target.result;
         var cfb = XLSX.read(data, {type: 'binary'});
         
       var wb = cfb;//XLSX.parse_xlscfb(cfb);
      // console.log(wb)
        // Loop Over Each Sheet
        wb.SheetNames.forEach(function(sheetName) {
            // Obtain The Current Row As CSV
            var sCSV = XLSX.utils.make_csv(wb.Sheets[sheetName]);   
            var oJS = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);   
            console.log(oJS);
            
            startManiupulation(oJS);
        }); 
    };

    // Tell JS To Start Reading The File.. You could delay this if desired
    reader.readAsBinaryString(oFile);

}

function startManiupulation(dataObject){
  //-------------convert to cloumns
  let cloumnHeadersArr=Object.keys(dataObject[0])
  for (let index = 0; index < cloumnHeadersArr.length; index++) {
    let columnValues =[];
    for (let i = 0; i < dataObject.length; i++) {
      columName = cloumnHeadersArr[index];
      //all code goes here
      let row = Object.values(dataObject[i])

      columnValues.push(row[index]);
    }
    console.table(columnValues);

    //-----------take data labels----------
    let labelArr=[];
    for(let j=0; j<columnValues.length;j++){
      if(labelArr.indexOf(columnValues[j]) === -1 && columnValues[j] != undefined){//if value doe not exist
        labelArr.push(columnValues[j]);
      }
    }
    console.log(labelArr);
    //----------------count value duplication
    let dataArr= new Array(columnValues.length).fill(0);
    for (let j = 0; j < columnValues.length; j++) {
      for(let k=0;k<labelArr.length;k++){
      if(labelArr[k]===columnValues[j]){
        dataArr[k]++;
      }
    }
    
  }
  console.log(dataArr);
  //------------------prepare  data array by taking zeros out
  let splitingIndex = dataArr.indexOf(0);
  dataArr=dataArr.splice(0, splitingIndex)
  console.log(dataArr);
  //-----------converting data array values to percentages
  let sumOfValues =0;
  for (let z = 0; z < dataArr.length; z++) {
    sumOfValues+=dataArr[z];
  }
  for (let z = 0; z < dataArr.length; z++) {
    dataArr[z]=Math.round((dataArr[z]/sumOfValues)*100);
  }

  //-------------create chart------
  let minDuplicationCondition=(columnValues.length-dataArr.length)>=(columnValues.length*0.30);
  if((columnValues.length-dataArr.length)<=(columnValues.length*0.8)){
    chartType ='bar';}else{  chartType ='pie';}
    console.log(minDuplicationCondition);
    if(minDuplicationCondition && columName!='Timestamp' ){
    const chartSection = document.getElementById('chartSection');
   const canvas = document.createElement('canvas');
   canvas.id='canvasId';
   chartSection.appendChild(canvas);
   const ctx = canvas.getContext('2d');  
    let chart = new Chart(ctx,{
      type: chartType,
       data: {
        datasets: [{
          data: dataArr,
          backgroundColor: ['rgb(54, 162, 235)','rgb(255,143,0)','rgb(54, 162, 90)','rgb(255,207,0)','rgb(54, 16, 235)','rgb(143,20,82)','rgb(64,35,0)','rgb(54,20,82)','rgb(160,255,0)','rgb(255,0,0)','rgb(255,100,161)','rgb(94,91,30)'],
        }],
        labels: labelArr,
      },
      options: {
        responsive: true,
         legend: {
          display: true,
          position:'bottom',
          labels:{
            padding:30,
            color:'#fff',
          }, 
      },
      
        title: {
            display: true,
            text: columName,
            fontSize: 20,
            padding:30,
        },
         tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              var dataset = data.datasets[tooltipItem.datasetIndex];
              var meta = dataset._meta[Object.keys(dataset._meta)[0]];
              var total = meta.total;
              var currentValue = dataset.data[tooltipItem.index];
              var percentage = parseFloat((currentValue/total*100).toFixed(1));
              return currentValue + ' (' + percentage + '%)';
            },
            title: function(tooltipItem, data) {
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

}



//--------------------------------------------------------
/* 
const FORM = document.getElementById('form');
FORM.addEventListener('submit',chooseChartType);


function chooseChartType(event){
  event.preventDefault();
  chartType = event.target.selectChart.value;
  console.log('chartType =: '+chartType);
    if(document.getElementById('canvasId')){
        document.getElementById('canvasId').remove();
    }
  showResults();
}

function showResults(){ 

  const chartSection = document.getElementById('chartSection');
  const canvas = document.createElement('canvas');
  canvas.id='canvasId';
  chartSection.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if(chartType===undefined){chartType='bar';}
  
  
    let chart = new Chart(ctx,{
      type: chartType,
       data: {

        datasets: [{
          label: Headers[1],
          data: [1,2,3,4],
          backgroundColor: 'rgba(54, 162, 235, 0.4)',
        }],
      }
    

      
    });
  
}
 */

