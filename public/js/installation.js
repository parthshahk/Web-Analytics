var website = "http://analytics52.herokuapp.com";
// var website = "http://localhost:5000";

            fetch('/getAssets')
                .then(function(response) {
                    return response.json();
                })
                .then(function(myJson) {
                    var string = '';
                    myJson.forEach(x => {
                        string += `
                        <div class="col s6 offset-s3">
                            <div class="card darken-1">
                                <div class="card-content">
                                    <span class="card-title">${x.name}</span>
                                    <pre class="code">
&lt;script&gt;
    const anid = "${x.id}";
&lt;/script&gt;                                       
&lt;script src="${website}/client.min.js"&gt;&lt;/script&gt;
&lt;script src="${website}/in-view.min.js"&gt;&lt;/script&gt;
&lt;script src="${website}/analytics.js"&gt;&lt;/script&gt; 
                                    </pre>
                                </div>
                            </div>
                        </div>
                        `;
                    });
                    document.getElementById("cardContent").innerHTML = string;
                });