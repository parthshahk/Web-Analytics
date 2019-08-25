new Vue({
    el: "#app",
    data: {
        asset_id: "",
        total_users: "",
        unique_users: "",
        colors: [
            '#08415C',
            '#858F98',
            '#DB504A',
            '#FFD166',
            '#8B5A8C',
            '#F2A35E',
            '#F2DC9B',
            '#26303D',
            '#23AD7B',
            '#65A603',
            '#F40080'
        ]
    },

    computed: {
        compute_start: function(){
            var date = new Date();
            date.setDate(date.getDate() - 100);     // 100 Days
            var dateString = date.toISOString().split('T')[0];
            return dateString
        },

        compute_today: function(){
            var date = new Date();
            date.setDate(date.getDate());
            var dateString = date.toISOString().split('T')[0];
            return dateString
        }
    },

    mounted: function(){

        var self = this
        //Get Assets
        axios.get('/getAssets')
        .then(function(response){
            var ddl = document.getElementById("assetList");
            response.data.forEach(element => {
                var option = document.createElement("OPTION");
                option.innerHTML = element.name
                option.value = element.id
                ddl.options.add(option)
            });
    
            ddl.options[1].selected = true
            self.asset_id = ddl.options[1].value

            axios.get(`http://localhost:8000/v1/data/unique_users?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(function(response){
                    if(response.data != "No Data"){
                        self.unique_users = response.data[0]
                    }else{
                        self.unique_users = 0
                    }
                })
    
            axios.get(`http://localhost:8000/v1/data/total_users?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
            .then(function(response){
                if(response.data != "No Data"){
                    self.total_users = response.data[0]
                }else{
                    self.total_users = 0
                }
            })


            axios.get(`http://localhost:8000/v1/data/time_month?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(function(response){
                    
                    var data = JSON.parse(response.data)
                    var percent = []
                    var monthFull = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                    var months = []
                    data.forEach(element =>{
                        months.push(monthFull[parseInt(element.Month)-1])
                        percent.push(element.Percentage)
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
                        }
                    });
                })


            axios.get(`http://localhost:8000/v1/data/time_week?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(function(response){
                    var data = JSON.parse(response.data)
                    var percent = []
                    var days = []
                    data.forEach(element =>{
                        days.push(element.Day)
                        percent.push(element.Percentage)
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
                        }
                    });
                })

            axios.get(`http://localhost:8000/v1/data/time_day?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(function(response){
                    var data = JSON.parse(response.data)
                    var percent = []
                    var days = []
                    data.forEach(element =>{
                        days.push(element.Time)
                        percent.push(element.Percentage)
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
                        }
                    });
                })



        })

    }


})