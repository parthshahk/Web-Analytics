var cookie;

if(!getCookie("wa")){

    cookie = makeid(10);
    setCookie("wa", cookie, 30);
    
    // Get User Information
    const client = new ClientJS();
    var userData = {
        browser: client.getBrowser(),
        os: client.getOS(),
        device: client.getDevice(),
        deviceType: client.getDeviceType(),
        deviceVendor: client.getDeviceVendor(),
        cpu: client.getCPU(),
        mobile: client.isMobile(),
        colorDepth: client.getColorDepth(),
        resolution: client.getAvailableResolution(),
        java: client.isJava(),
        flash: client.isFlash(),
        localStorage: client.isLocalStorage(),
        sessionStorage: client.isSessionStorage(),
        cookie: client.isCookie(),
        time_zone: client.getTimeZone(),
        language: client.getLanguage(),
        location: {
            href: window.location.href,
            path: window.location.pathname
        },
        referrer: document.referrer,
        history_length: history.length,
        geolocation: {
            latitude: null,
            longitude: null,
            address: null
        },
    }

    navigator.geolocation.getCurrentPosition(success, failure, options);
    function failure(){}
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    function success(position){
        userData.geolocation.latitude = position.coords.latitude;
        userData.geolocation.longitude = position.coords.longitude;
        fetch("https://us1.locationiq.com/v1/reverse.php?key=a308c42ebe7da5&lat="+userData.geolocation.latitude+"&lon="+userData.geolocation.longitude+"&format=json")
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            userData.geolocation.address = myJson.address;
                
            fetch('http://localhost:5000/collectStatic', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({data: userData, cookie: cookie, asset: anid})
            });
                
        });
    }
}else{
    cookie = getCookie("wa");
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

var activity = {
    currentElement: null
};

inView('.track')
    .on('enter', (el) => {
        activity.currentElement = el.id;
    })
    .on('exit', el => {});
inView.offset(400);

setInterval(() => {
    fetch('http://localhost:5000/collectElements', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({data: activity, cookie: cookie, asset: anid})
    });
}, 6000);

setTimeout(() => {
    
    var location = {
        href: window.location.href,
        path: window.location.pathname
    }

    var referrer = document.referrer;

    fetch('http://localhost:5000/collectVisits', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({cookie: cookie, asset: anid, location: location, referrer: referrer})
    });

}, 8000);