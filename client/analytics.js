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
        });
}

console.log(userData);