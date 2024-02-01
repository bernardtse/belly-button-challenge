// Set Data URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch JSON Data and console.log it
d3.json(url).then(function(json_data) {
  console.log("Data Fetched: ", json_data);
  let data = json_data;

  // Append Dropdown Menu
  const dropdown = d3.select("#selDataset");
  data.names.forEach((subject_id) => {
  dropdown.append("option").text(subject_id).property("value", subject_id);
  });

  // Add an Event Listener 
  dropdown.on("change", optionChanged);


  // Build Metadata Panel
  function build_metadata(metadata) {
    const metadata_panel = d3.select("#sample-metadata");
    metadata_panel.html("");
    
    Object.entries(metadata).forEach(([key, value]) => {
    metadata_panel.append("h6").text(`${key}: ${value}`);
    });
  }


  // Build Gauge Chart
  function build_gauge(metadata) {
    let gauge_data = [{
      type: "indicator",
      mode: "gauge+number",
      value: metadata.wfreq,
      title: {text: "Belly Button Washing Frequency<br />Scrubs per Week"},
              domain: { x: [0, 1], y: [0, 1] },
              gauge: {
                axis: { range: [null, 9] },
                bar: { color: "#FF0000" },
                steps: [
                  { range: [0, 1], color: "#E8F8E8" },
                  { range: [1, 2], color: "#CDE6C7" },
                  { range: [2, 3], color: "#A8D7A1" },
                  { range: [3, 4], color: "#8BC88A" },
                  { range: [4, 5], color: "#76B17A" },
                  { range: [5, 6], color: "#6B9F72" },
                  { range: [6, 7], color: "#658D6C" },
                  { range: [7, 8], color: "#5C7B66" },
                  { range: [8, 9], color: "#546A60" }
                ],
              }
    }];
    
    let gauge_layout = {autosize: true};
  
    Plotly.newPlot("gauge", gauge_data, gauge_layout);
  }


  // Building Bar Chart
  function build_bar(sample) {
    // Sort Indices Based on sample_values in Descending Order
    let indices = Array.from(Array(sample.sample_values.length).keys());
    indices.sort((a, b) => sample.sample_values[b] - sample.sample_values[a]);

    // Take the top 10 indices and then reverse for display purpose
    let top_indices = indices.slice(0, 10).reverse();

    // Bar Data
    let bar_data = [{
      type: "bar",
      x: top_indices.map(i => sample.sample_values[i]),
      y: top_indices.map(i => `OTU ${sample.otu_ids[i]}`),
      text: top_indices.map(i => sample.otu_labels[i]),
      orientation: "h"
    }];

    // Bar Layout
    let bar_layout = {
      title: "Top 10 OTUs",
      xaxis: {title: "sample_values"},
      yaxis: {title: "otu_ids"},
      autosize: true
    };
  
    // Plot Bar Chart
    Plotly.newPlot("bar", bar_data, bar_layout);
  }


  // Build Bubble Chart
  function build_bubble(sample) {
    
    // Bubble Data
    let bubble_data = [{
      x: sample.otu_ids,
      y: sample.sample_values,
      text:  sample.otu_labels,
      mode: "markers",
      marker: {color: sample.otu_ids, size: sample.sample_values}
    }];
  
    // Bubble Layout
    let bubble_layout = {
      title: "Sample Values of OTUs",
      showlegend: false,
      autosize: true,
      xaxis: {title: "otu_ids"},
      yaxis: {title: "sample_values"}
    };
      
    // Plot Bubble Chart
    Plotly.newPlot("bubble", bubble_data, bubble_layout);
  }


  // Initialise Dashboard
  function init() {
    build_metadata(data.metadata[0]);
    build_gauge(data.metadata[0]);
    build_bar(data.samples[0]);
    build_bubble(data.samples[0]);  
  }
  // Run Init
  init();


  // Update Charts When Dropdown Menu is Changed
  function optionChanged() {
    // Assign the Value of the Dropdown Menu Option to a Variable)
    let subject_id = dropdown.property("value").toString();
    
    // Narrow Down Data to One Subject ID
    let metadata = data.metadata.find(element => element.id.toString() === subject_id);
    let sample = data.samples.find(element => element.id.toString() === subject_id);
    
    // Rebuild All Charts
    build_metadata(metadata);
    build_gauge(metadata);
    build_bar(sample);
    build_bubble(sample);  
    // Plotly.newPlot may not run as efficiently as Plotly.restyle.
    // Yet, this method is chosen because it involves significantly fewer lines of code.
  }

});
