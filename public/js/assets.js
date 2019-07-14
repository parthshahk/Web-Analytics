fetch('/getAssets')
                .then(function(response) {
                    return response.json();
                })
                .then(function(myJson) {
                    var string = '';
                    myJson.forEach(x => {
                        string += `<tr><td>${x.name}</td></tr>`;
                    });
                    document.getElementById("assetContent").innerHTML = string;
                });