var vue = new Vue({
    el: "#app",
    data: {
        event_id: '',
        colors: [
            '#08415C',
            '#DB504A',
            '#FFD166',
            '#8B5A8C',
            '#F2A35E',
            '#F2DC9B',
            '#26303D',
            '#23AD7B',
            '#65A603',
            '#F40080',
            '#858F98'
        ],
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        },
        noData: {
            time_month: false,
            time_week: false,
            time_day: false
        }
    },

    mounted: function(){

        this.event_id = (window.location.search).substring(4)
        this.getData()   
    },

    methods: {

        getData: function(){

            var self = this

            axios.get(`http://localhost:8000/v1/data/event_time_month?event_id=${self.event_id}`)
                .then(response => {

                    if(response.data != "No Data"){

                        var data = JSON.parse(response.data)
                        var percent = []
                        var monthFull = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                        var months = []
                        data.forEach(element =>{
                            months.push(monthFull[parseInt(element.Month)-1])
                            percent.push(element.Count)
                        })
    
                        var ctx = document.getElementById('time_month');
                        var myChart = new Chart(ctx, {
                            type: 'bar',
                            data: {
                                labels: months,
                                datasets: [{
                                    label: 'Month',
                                    data: percent,
                                    backgroundColor: self.colors,
                                    borderWidth: 1
                                }]
                            },
                            options: self.options
                        });

                        self.noData.time_month = false
                        
                    }else{
                        self.noData.time_month = true
                    }
                    
                })


            axios.get(`http://localhost:8000/v1/data/event_time_week?event_id=${self.event_id}`)
                .then(response => {

                    if(response.data != "No Data"){

                        var data = JSON.parse(response.data)
                        var percent = []
                        var days = []
                        data.forEach(element =>{
                            days.push(element.Day)
                            percent.push(element.Count)
                        })
    
                        var ctx = document.getElementById('time_week');
                        var myChart = new Chart(ctx, {
                            type: 'bar',
                            data: {
                                labels: days,
                                datasets: [{
                                    label: 'Week Days',
                                    data: percent,
                                    backgroundColor: self.colors,
                                    borderWidth: 1
                                }]
                            },
                            options: self.options
                        });

                        self.noData.time_week = false
                    }else{
                        self.noData.time_week = true
                    }
                })
            
            axios.get(`http://localhost:8000/v1/data/event_time_day?event_id=${self.event_id}`)
                .then(response => {

                    if(response.data != "No Data"){

                        var data = JSON.parse(response.data)
                        var percent = []
                        var days = []
                        data.forEach(element =>{
                            days.push(element.Time)
                            percent.push(element.Count)
                        })
                        var ctx = document.getElementById('time_day');
                        var myChart = new Chart(ctx, {
                            type: 'bar',
                            data: {
                                labels: days,
                                datasets: [{
                                    label: 'Time of Day',
                                    data: percent,
                                    backgroundColor: self.colors,
                                    borderWidth: 1
                                }]
                            },
                            options: self.options
                        });

                        self.noData.time_day = false
                    }else{
                        self.noData.time_day = true
                    }
                })
        }
    }
})