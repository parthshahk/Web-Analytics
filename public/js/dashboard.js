var vue = new Vue({
    el: "#app",
    data: {
        asset_id: "",
        total_users: "",
        unique_users: "",
        time_spend: "",
        revisitors: "",
        bounce_rate: "",
        lost_leads: "",
        url_count: "",
        element_count: "",
        browser: "",
        resolution: "",
        apriori_href: "",
        apriori_elements: "",
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
            '#858F98',
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
            '#858F98',
            '#858F98',
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
            time_day: false,
            assoc_url: false,
            assoc_components: false,
            count_url: false,
            count_element: false,
            browser: false,
            resolution: false,
            os: false,
            mobile: false,
            time_zone: false,
            language: false
        }
    },

    computed: {
        compute_start: function(){
            var date = new Date();
            date.setDate(date.getDate() - 150);     // Number of Days to Go Back
            dateString = `${date.getDay()+1}-${date.getMonth()+1}-${date.getFullYear()}`
            return dateString
        },

        compute_today: function(){
            var date = new Date();
            date.setDate(date.getDate() + 3);
            dateString = `${date.getDay()+1}-${date.getMonth()+1}-${date.getFullYear()}`
            return dateString
        }
    },

    mounted: function(){

        var self = this
        
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

            if(ddl.options.length > 1){
                self.asset_id = ddl.options[1].value
            }

            self.getData()
            
        })
    },

    methods: {

        assetChanged: function(){
            this.getData()
        },

        getData: function(){
            
            var self = this

            axios.get(`http://localhost:8000/v1/data/unique_users?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(response => {
                    if(response.data != "No Data"){
                        self.unique_users = response.data[0]
                    }else{
                        self.unique_users = "-"
                    }
                })
    
            axios.get(`http://localhost:8000/v1/data/total_users?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(response => {
                    if(response.data != "No Data"){
                        self.total_users = response.data[0]
                    }else{
                        self.total_users = "-"
                    }
                })

            axios.get(`http://localhost:8000/v1/data/time_spend?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(response => {
                    if(response.data != "No Data"){
                        self.time_spend = response.data[0] + '<small>min</small>'
                    }else{
                        self.time_spend = "-"
                    }
                })

            axios.get(`http://localhost:8000/v1/data/revisitors?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(response => {
                    if(response.data != "No Data"){
                        var data = JSON.parse(response.data)
                        self.revisitors = data + "<small>%</small>"
                    }else{
                        self.revisitors = "-"
                    }
                })

            axios.get(`http://localhost:8000/v1/data/bounce_rate?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(response => {
                    if(response.data != "No Data"){
                        var data = JSON.parse(response.data)
                        self.bounce_rate = data + "<small>%</small>"
                    }else{
                        self.bounce_rate = "-"
                    }
                })
            
            axios.get(`http://localhost:8000/v1/data/lost_purchases?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(response => {
                    if(response.data != "No Data"){
                        var data = JSON.parse(response.data)
                        var per = 100 - Math.round((data[0].Count / data[1].Count)*100)
                        self.lost_leads = per + "<small>%</small>"
                    }else{
                        self.lost_leads = "-"
                    }
                })

            axios.get(`http://localhost:8000/v1/data/time_month?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
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


            axios.get(`http://localhost:8000/v1/data/time_week?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
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

            axios.get(`http://localhost:8000/v1/data/time_day?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
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


            axios.get(`http://localhost:8000/v1/data/url_count?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(response => {

                    if(response.data != "No Data"){

                        var data = JSON.parse(response.data)
                        
                        for(var i=0; i<10; i++){
                            self.url_count += `<tr>
                                <td>${data[i].index}</td>
                                <td>${data[i].Count}</td>
                            </tr>`
                        }
                        self.noData.count_url = false
                    }else{
                        self.noData.count_url = true
                    }
                })

            axios.get(`http://localhost:8000/v1/data/element_count?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(response => {

                    if(response.data != "No Data"){

                        var data = JSON.parse(response.data)
                        
                        for(var i=0; i<10; i++){
                            self.element_count += `<tr>
                                <td>${data[i].index}</td>
                                <td>${data[i].Counts}</td>
                            </tr>`
                        }

                        self.noData.count_element = false
                    }else{
                        self.noData.count_element = true
                    }
                })


            axios.get(`http://localhost:8000/v1/data/browser?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(response => {

                    if(response.data != "No Data"){
                        
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

                        self.noData.browser = false
                    }else{
                        self.noData.browser = true
                    }   


                })


                axios.get(`http://localhost:8000/v1/data/resolution?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(response => {

                    if(response.data != "No Data"){

                        var data = JSON.parse(response.data)
                        
                        for(var i=0; i<6; i++){
                            self.resolution += `<tr>
                                <td>${data[i].Resolution}</td>
                                <td>${data[i].Percentage}%</td>
                            </tr>`
                        }

                        self.noData.resolution = false
                    }else{
                        self.noData.resolution = true
                    }
                })


            axios.get(`http://localhost:8000/v1/data/os?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(response => {

                    if(response.data != "No Data"){

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

                        self.noData.os = false
                    }else{
                        self.noData.os = true
                    }

                })

            axios.get(`http://localhost:8000/v1/data/mobile?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(response => {

                    if(response.data != "No Data"){

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
                        self.noData.mobile = false
                    }else{
                        self.noData.mobile = true
                    }

                })


            axios.get(`http://localhost:8000/v1/data/time_zone?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(response => {

                    if(response.data != "No Data"){

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
                        self.noData.time_zone = false
                    }else{
                        self.noData.time_zone = true
                    }
                })

            axios.get(`http://localhost:8000/v1/data/language?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}`)
                .then(response => {

                    if(response.data != "No Data"){

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
                        self.noData.language = false
                    }else{
                        self.noData.language = true
                    }
                })

            axios.get(`http://localhost:8000/v1/data/apriori_href?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}&support=0.05`)
                .then(response => {

                    if(response.data != "No Data"){

                        var data = JSON.parse(response.data)
                        
                        data.forEach(element => {
    
                            var antecedents = ""
                            element.antecedents.forEach(url => {
                                antecedents += url + "<br>"
                            })
    
                            var consequents = ""
                            element.consequents.forEach(url => {
                                consequents += url + "<br>"
                            })
    
                            self.apriori_href += `<tr>
                            <td>${antecedents}</td>
                            <td>${consequents}</td>
                            <td>${Math.round(element.confidence*100)}%</td>
                            </tr>`
                        })

                        self.noData.assoc_url = false
                    }else{
                        self.noData.assoc_url = true
                    }
                    
                })

            axios.get(`http://localhost:8000/v1/data/apriori_elements?date_start=${self.compute_start}&date_end=${self.compute_today}&asset_id=${self.asset_id}&support=0.12`)
                .then(response => {

                    if(response.data != "No Data"){

                        var data = JSON.parse(response.data)
                        
                        data.forEach(element => {
    
                            var antecedents = ""
                            element.antecedents.forEach(url => {
                                antecedents += url + "<br>"
                            })
    
                            var consequents = ""
                            element.consequents.forEach(url => {
                                consequents += url + "<br>"
                            })
    
                            self.apriori_elements += `<tr>
                            <td>${antecedents}</td>
                            <td>${consequents}</td>
                            <td>${Math.round(element.confidence*100)}%</td>
                            </tr>`
                        })

                        self.noData.assoc_components = false
                    }else{
                        self.noData.assoc_components = true
                    }
                    
                })
        }
    }


})

