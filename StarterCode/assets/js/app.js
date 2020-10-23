d3.csv('/assets/data/data.csv').then(data => {
    console.log(data)

    const svgWidth = 960
    const svgHeight = 500

    const margin = {
        top: 20,
        right: 40,
        bottom: 80,
        left: 100
    }

    const width = svgWidth - margin.left - margin.right
    const height = svgHeight - margin.top - margin.bottom

    const chart = d3
        .select('#scatter')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)

    const chartGroup = chart
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const xAxis = 'State'
    const yAxis = 'Poverty'

    const povertyData = data.map(entry => entry.poverty)
    const stateAbbr = data.map(entry => entry.abbr)

    console.log(povertyData)
    console.log(stateAbbr)

    const x = d3.scaleLinear()
        .domain([0, stateAbbr.length])
        .range([0, width])

    const y = d3.scaleLinear()
        .domain([0, d3.max(povertyData)])
        .range([height, 0])

    chartGroup.append('g')
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', abbr)
            .attr('cy', povertyData)
            .attr('r', 2.0)
            .style('fill', '#000000')
            
}).catch(err => console.log(err))