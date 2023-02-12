var url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

function main() {
    d3.json(url).then(function(data) {
        populateSelector(data);
    })

    changeData(940);
}

function populateSelector(data) {
    var dropdown = d3.select("#selDataset")

    for (let i =0; i<data.metadata.length; i++) {
        let id = data.metadata[i].id
        dropdown.append("option").text(id)
    }
}

function optionChanged(current_id) {
    changeData(current_id);
}

function changeData(current_id) {
    d3.json(url).then(function (data) {
        var metadata = data.metadata;
        var samples = data.samples

        var metadataObject = metadata.filter(obj => {
            return parseInt(obj.id) === parseInt(current_id);
        })

        var samplesObject = samples.filter(obj => {
            return parseInt(obj.id) === parseInt(current_id);
        })

        demographicInfo(metadataObject);
        gauge(metadataObject);
        bubble(samplesObject);
        topTenOTUs(samplesObject);

        console.log("metadataObject being passed", metadataObject);
        console.log("samplesObject being passed", samplesObject);
    })
}

function demographicInfo(data) {
    let demographic = d3.select("#sample-metadata")
    demographic.html(null);

    for (const [key,value] of Object.entries(data[0])) {
        demographic.append("h5").text(`${key}: ${value}`);
    }
}


function topTenOTUs(data) { 
    var sampleValues = data[0].sample_values.slice(0,10);
    var otuId = data[0].otu_ids.slice(0,10); 

    var bar_labels = otuId.map( function(id) {
        return `OTU ${id}`;
    })

    let hover_labels = data[0].otu_labels.slice(0,10);

    
    let bar = [{
        x: sampleValues,
        y: bar_labels,
        type: 'bar',
        orientation: 'h',
        text: hover_labels,
    }]

    let layout = {
        title: "Top Ten Most Prevalent OTUs",
        font : {family: "Arial"},
        yaxis: {tickangle: -15}

    }
    
    Plotly.newPlot("bar", bar, layout)
}

function bubble(data) { 
    var sampleValues = data[0].sample_values.slice(0,10);
    var otuId = data[0].otu_ids.slice(0,10); 

    var hover_labels = data[0].otu_labels.slice(0,10);

    let bubble = [{
        x: otuId,
        y: sampleValues,
        mode: "markers",
        text: hover_labels,
        marker : {
            size:sampleValues,
            color:otuId,
            sizeref: 2.0 * Math.max(sampleValues) / (100**2),
        }
    }]

    layout = {
        title: "All OTUs in Subject"
    }

   Plotly.newPlot("bubble", bubble,layout)
}

function gauge(data) {
    var washFreq = data[0].wfreq;

    var data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: washFreq,
            title: {text: "<b>Belly Button Wash Frequency</b><br>Scrubs per Week"},
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {range: [null, 9]},
                steps: [
                    {range: [0,1], color:"#D0E4D8"},
                    {range: [1,2], color:"#B0D2BE"},
                    {range: [2,3], color:"#91C0A6"},
                    {range: [3,4], color:"#73AD8E"},
                    {range: [4,5], color:"#549977"},
                    {range: [5,6], color:"#368661"},
                    {range: [6,7], color:"#2C7345"},
                    {range: [7,8], color:"#235F2D"},
                    {range: [8,9], color:"#1A4B1A"}
                ]
                ,bar: {color: "#32cd32"}
            }
        }
    ];
    
    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };

    Plotly.newPlot('gauge', data, layout);
}

main();





