//function that populates meta data 
function demoInfo(sample)
{
    //console.log(sample);
    d3.json("samples.json").then((data)=>{
        let metaData = data.metadata;
        
        //filtering
        let result = metaData.filter(sampleResult => sampleResult.id == sample); 

        //grab index 0 
        let resultD = result[0];

        //clearing data for "fresh display"
        d3.select("#sample-metadata").html("");

        Object.entries(resultD).forEach(([key,value])=> {
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`); 
        });
    });
}

//function that builds the bar graph
function buildBarChart(sample){
    d3.json("samples.json").then((data)=>{
        let sampD = data.samples; 
        //filtering by ID 
        let result = sampD.filter(sampleResult =>sampleResult.id == sample); 
        let resultD = result[0]; 

        let otu_ids = resultD.otu_ids;
        let otu_labels = resultD.otu_labels;
        let sample_v = resultD.sample_values;
        
        let yt = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        let xv = sample_v.slice(0,10); 
        let txtlabels = otu_labels.slice(0,10); 

        let barChart = {
            y: yt.reverse(),
            x: xv.reverse(), 
            text: txtlabels.reverse(), 
            type: "bar", 
            orientation: "h"
        }; 

        let layout = {
            title: "Top 10 Belly Button Bacteria"
        }

        Plotly.newPlot("bar", [barChart], layout); 

    });
}

//bubble chart function 
function buildBubChart(sample){
    d3.json("samples.json").then((data)=>{
        let sampD = data.samples; 
        //filtering by ID 
        let result = sampD.filter(sampleResult =>sampleResult.id == sample); 
        let resultD = result[0]; 

        let otu_ids = resultD.otu_ids;
        let otu_labels = resultD.otu_labels;
        let sample_v = resultD.sample_values;
        

        let bubbleChart = {
            y: sample_v.reverse(),
            x: otu_ids.reverse(), 
            text: otu_labels.reverse(), 
            mode: "markers", 
            marker: {
                size: sample_v, 
                color: otu_ids, 
                colorscale: "Earth"
            }
        }; 

        let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest", 
            xaxis: {title: "OU ID"}
        }

        Plotly.newPlot("bubble", [bubbleChart], layout); 

    });
}


//function that initialize in the dashboard 
function initialize()
{

    //access the dropdown selector from the index.html files
    var select = d3.select("#selDataset"); 
    
    d3.json("samples.json").then((data)=>{
        let sampleNames = data.names; 

        //for each to create objects for each samples 
        sampleNames.forEach((sample) => {
            select.append("option") 
                .text(sample)
                .property("value", sample); 
        });
        let first_sample = sampleNames[0];

        // for metadata 
        demoInfo(first_sample); 
        buildBarChart(first_sample); 
        buildBubChart(first_sample); 
    });
};

//function that updates the dashboard 
function optionChanged(item)
{
    //call demoInfo function to change the item 
    demoInfo(item);  
    //call bar chart 
    buildBarChart(item); 
    //call bubble chart 
    buildBubChart(item); 
}

//call the initialize function 
initialize(); 