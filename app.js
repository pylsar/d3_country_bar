const DUMMY_DATA = [
    {id: 'd1', region: 'India', value: 10},
    {id: 'd2', region: 'Brazil', value: 12},
    {id: 'd3', region: 'China', value: 11},
    {id: 'd4', region: 'Indonezia', value: 6},
    {id: 'd5', region: 'Argentina', value: 8},
];


const MARGINS = {
    top: 20,
    bottom: 10,
}

const CHART_WIDTH = 600;
const CHART_HEIGHT = 400 - MARGINS.top - MARGINS.bottom;

let selectedData = DUMMY_DATA; // для ререндеринга

const x = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
const y = d3.scaleLinear().range([CHART_HEIGHT, 0]);

const chartContainer = d3.select('svg')
    .attr('width', CHART_WIDTH)
    .attr('height', CHART_HEIGHT + MARGINS.top + MARGINS.bottom);


    x.domain(DUMMY_DATA.map((d) => d.region));
    y.domain([0, d3.max(DUMMY_DATA, d => d.value) +3]); // чтобы верхняя граница была по наибольшему числу из массива (3 чтобы отступ был)

const chart = chartContainer.append('g');


chart
    .append('g')
    .call(d3.axisBottom(x).tickSizeOuter(0)) // tickSizeOuter(0) убирает загнутости в углах оси
    .attr('color', '#4f009e')
    .attr('transform', `translate(0, ${CHART_HEIGHT})`);

    function renderChart(){
        //добавляем
        chart
        .selectAll('.bar')
        .data(selectedData, data => data.id)
        .enter()
        .append('rect')
        .classed('bar', true)
        .attr('width', x.bandwidth())
        .attr('height',  data => CHART_HEIGHT - y(data.value))
        .attr('x', (data) => x(data.region))
        .attr('y', (data) => y(data.value));

        //убираем
        chart
        .selectAll('.bar')
        .data(selectedData, data => data.id)
        .exit()
        .remove();
    
        //добавляем
        chart
            .selectAll('.label')
            .data(selectedData, data => data.id)
            .enter()
            .append('text')
            .text(data => data.value) // добавлем label
            .attr('x', data => x(data.region) + x.bandwidth() / 2) //позиционируем label
            .attr('y', data => y(data.value) - 20)
            .attr('text-anchor' , 'middle') // чтобы до конца отцентровать
            .classed('label', true); 

        //убираем
        chart
        .selectAll('.label')
        .data(selectedData, data => data.id)
        .exit()
        .remove();
    
    }

renderChart();
// console.log(data);
// добавляем выборку

let unselectedIds = [];

const listItems = d3
    .select('#data')
    .select('ul')
    .selectAll('li')
    .data(DUMMY_DATA)
    .enter()
    .append('li');

listItems
    .append('span')
    .text(data => data.region);

listItems    
    .append('input')
    .attr('type', 'checkbox')
    .attr('checked', true)
    .on('change', (data) => {
        console.log(data);
        if(unselectedIds.indexOf(data.id) === -1){
            unselectedIds.push(data.id);
        }else{
            unselectedIds = unselectedIds.filter( id => id !== data.id);
        }
        selectedData = DUMMY_DATA.filter((d) =>  unselectedIds.indexOf(d.id) === -1);
        renderChart();
    });




  