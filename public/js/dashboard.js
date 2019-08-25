new Vue({
    el: "#app",
    data: {
        asset_id: "",
        total_users: "",
        unique_users: "",
        time_spend: "",
        url_count: "",
        element_count: "",
        browser: "",
        resolution: "",
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

            axios.get(`http://localhost:8000/v1/data/time_spend?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
            .then(function(response){
                if(response.data != "No Data"){
                    self.time_spend = response.data[0] + '<small>min</small>'
                }else{
                    self.time_spend = 0
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
                        }
                    });
                })


            axios.get(`http://localhost:8000/v1/data/url_count?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(function(response){
                    var data = JSON.parse(response.data)
                    
                    for(var i=0; i<10; i++){
                        self.url_count += `<tr>
                            <td>${data[i].index}</td>
                            <td>${data[i].Count}</td>
                        </tr>`
                    }
                })

            axios.get(`http://localhost:8000/v1/data/element_count?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(function(response){
                    var data = JSON.parse(response.data)
                    
                    for(var i=0; i<10; i++){
                        self.element_count += `<tr>
                            <td>${data[i].index}</td>
                            <td>${data[i].Counts}</td>
                        </tr>`
                    }
                })


            axios.get(`http://localhost:8000/v1/data/browser?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(function(response){
                    var data = JSON.parse(response.data)
                    var percent = []
                    var browser = []
                    data.forEach(element =>{
                        browser.push(element.Browser)
                        percent.push(element.Percentage)
                    })
                    var ctx = document.getElementById('browser');
                    var myChart = new Chart(ctx, {
                        type: 'pie',
                        data: {
                            labels: browser,
                            datasets: [{
                                label: 'Browser',
                                data: percent,
                                backgroundColor: self.colors,
                                borderWidth: 1
                            }]
                        }
                    });

                })


                axios.get(`http://localhost:8000/v1/data/resolution?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(function(response){
                    var data = JSON.parse(response.data)
                    
                    for(var i=0; i<6; i++){
                        self.resolution += `<tr>
                            <td>${data[i].Resolution}</td>
                            <td>${data[i].Percentage}%</td>
                        </tr>`
                    }
                })


                axios.get(`http://localhost:8000/v1/data/os?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(function(response){
                    var data = JSON.parse(response.data)
                    
                    var percent = []
                    var os = []
                    data.forEach(element =>{
                        os.push(element.OS)
                        percent.push(element.Percentage)
                    })
                    var ctx = document.getElementById('os');
                    var myChart = new Chart(ctx, {
                        type: 'pie',
                        data: {
                            labels: os,
                            datasets: [{
                                label: 'OS',
                                data: percent,
                                backgroundColor: self.colors,
                                borderWidth: 1
                            }]
                        }
                    });

                })

                axios.get(`http://localhost:8000/v1/data/mobile?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(function(response){
                    var data = JSON.parse(response.data)
                    
                    var percent = []
                    var mobile = []
                    data.forEach(element =>{
                        mobile.push(element.User)
                        percent.push(element.Percentage)
                    })
                    var ctx = document.getElementById('mobile');
                    var myChart = new Chart(ctx, {
                        type: 'pie',
                        data: {
                            labels: mobile,
                            datasets: [{
                                label: 'Device Type',
                                data: percent,
                                backgroundColor: self.colors,
                                borderWidth: 1
                            }]
                        }
                    });

                })


                axios.get(`http://localhost:8000/v1/data/time_zone?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                    .then(function(response){
                        var data = JSON.parse(response.data)
                        
                        var percent = []
                        var tz = []
                        data.forEach(element =>{
                            tz.push(element.TimeZone)
                            percent.push(element.Percentage)
                        })
                        var ctx = document.getElementById('time_zone');
                        var myChart = new Chart(ctx, {
                            type: 'pie',
                            data: {
                                labels: tz,
                                datasets: [{
                                    label: 'Time Zone',
                                    data: percent,
                                    backgroundColor: self.colors,
                                    borderWidth: 1
                                }]
                            }
                        });                        
                    })

                axios.get(`http://localhost:8000/v1/data/language?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                    .then(function(response){
                        var data = JSON.parse(response.data)
                        
                        var percent = []
                        var language = []
                        data.forEach(element =>{
                            language.push(element.Language)
                            percent.push(element.Percentage)
                        })
                        var ctx = document.getElementById('language');
                        var myChart = new Chart(ctx, {
                            type: 'pie',
                            data: {
                                labels: language,
                                datasets: [{
                                    label: 'Language',
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