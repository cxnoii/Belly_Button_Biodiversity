
var url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

function main() {
d3.json(url).then(function(data) {
    populateSelector(data);
})
}


function populateSelector(data) {
    console.log('data passed into testSubject', data)
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
        demographicInfo(data, current_id);
        topTenOTUs(data, current_id);
        bubble(data, current_id);
        gauge(data, current_id)
    })
}

function gauge(data, current_id) {
    var metadata = data.metadata;
    var result = metadata.filter(obj => {
        return parseInt(obj.id) === parseInt(current_id)
    })

    var washFreq = result[0].wfreq;

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

function bubble(data, current_id) { 
    var samples = data.samples
    var result = samples.filter(obj => {
        return parseInt(obj.id) === parseInt(current_id);
    })

    var sampleValues = result[0].sample_values.slice(0,10);
    var otuId = result[0].otu_ids.slice(0,10); 

    var hover_labels = result[0].otu_labels.slice(0,10);

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

    console.log("Object passed into bubble", data);
}

function topTenOTUs(data, current_id) { 
    var samples = data.samples

    var result = samples.filter(obj => {
        return parseInt(obj.id) === parseInt(current_id);
    })

    var sampleValues = result[0].sample_values.slice(0,10);
    var otuId = result[0].otu_ids.slice(0,10); 

    var bar_labels = otuId.map( function(id) {
        return `OTU ${id}`;
    })

    let hover_labels = result[0].otu_labels.slice(0,10);

    
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
    console.log("Object in topTenOTUs", result[0])
}

function demographicInfo(data, current_id) {
    let demographic = d3.select("#sample-metadata")
    demographic.html(null);
    let metadata = data.metadata

    var result = metadata.filter(obj => {
        return obj.id === parseInt(current_id);
    })

    for (const [key,value] of Object.entries(result[0])) {
        demographic.append("h5").text(`${key}: ${value}`);
        // demographic.append("h4").text(`id: ${result.ethnicity}`)

    }

    console.log('Object in demographicInfo', result[0])
}



main();





