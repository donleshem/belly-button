function buildMetadata(sample) {

    var metadata_URL = `/metadata/${sample}`;
  // Use `d3.json` to fetch the metadata for a sample
    d3.json(metadata_URL).then(function(sample){
  // Use d3 to select the panel with id of `#sample-metadata
      var sampleData = d3.select(`#sample-metadata`);
    // Use `.html("") to clear any existing metadata
      sampleData.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      Object.entries(sample).forEach(function([key,value]){
        var row = sampleData.append("p");
        row.text(`${key}:${value}`)
      })
    });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
    var plotData = `/samples/${sample}`;
  //Bubble Chart 
  d3.json(plotData).then(function(data){
    console.log(data);
    var x = data.otu_ids;
    var y = data.sample_values;
    var size = data.sample_values;
    var color = data.otu_ids;
    var texts = data.otu_labels;
  
    var trace1 = {
      x: x,
      y: y,
      text: texts,
      mode: `markers`,
      marker: {
        size: size,
        color: color
      }
    };

    var data = [trace1];
    var layout = {
      title: "Belly Button Bacteria",
      xaxis: {title: "OTU ID"}
    };
    Plotly.newPlot("bubble", data, layout);

    //Pie Chart
    d3.json(plotData).then(function(data){
      console.log(data);
      var sample_values = data.sample_values.slice(0,10);
      var sample_labels = data.otu_ids.slice(0,10);
      var sample_names = data.otu_labels.slice(0,10);

      var trace2 = [{
        values: sample_values,
        labels: sample_labels,
        hovertext: sample_names,
        type: "pie"
      }];


      Plotly.newPlot('pie',trace2);
    });
  });
};


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
