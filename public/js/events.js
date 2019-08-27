fetch('/getEvents')
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        var string = ""
        myJson.forEach(element => {
            if(element.type == "data"){
                var qstring = `<p>http://localhost:5000/triggerEvent?id=${element.id}&data=x,y,z</p>`
            }else if(element.type == "trigger"){
                var qstring = `<p>http://localhost:5000/triggerEvent?id=${element.id}</p>`
            }
                string += `
                <li class='collection-item'>
                    <h6>${element.name}</h6>
                    <h6 class="light">${element.type}</h6>
                    ${qstring}
                </li>
                `
        });
        document.getElementById("eventCollection").innerHTML = string
    });