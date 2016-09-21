// Let's register Template7 helper so we can pass json string in links
Template7.registerHelper('json_stringify', function (context) {
    return JSON.stringify(context);
});
//var baseUrl = 'http://192.168.1.101:3001';
//var baseUrl = 'http://127.0.0.1:3001';
var baseUrl = 'http://10.0.1.106:3002';

var $$ = Dom7;
// Initialize your app
var myApp = new Framework7({
    animateNavBackIcon: true,
    // Enable templates auto precompilation
    precompileTemplates: true,
    // Enabled pages rendering using Template7
    template7Pages: true,
    // Specify Template7 data for pages
    init: false,
    preprocess: function (content, url, next) {
        var template = Template7.compile(content);
        var req = '';
        if (url === 'cars.html') {
            req = baseUrl + '/test/test1.json';
        } else if (url === 'projects.html') {
            req = baseUrl + '/test/test2.json';
        } else if (url === 'car.html') {
            req = baseUrl + '/test/test1.json';
        } else if (url === 'contacts.html') {
            req = baseUrl + '/test/test3.json';
        } else if (url === 'bus.html') {
            req = baseUrl + '/bus';
        }
        $$.get(req, function (data) {
            if (typeof data === 'string') data = JSON.parse(data);
            var resultContent = template(data);
            next(resultContent)
        });
    },
    template7Data: {
        // Will be applied for page with "projects.html" url

    }
});
myApp.onPageInit('index', function (page) {
    var date = new Date();
    date.setHours = 10;
    var clock = function () {
        var date = new Date();
        var time = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        $$('.content-block-title a').text(time)
    };
    var initTimeStatus = function () {
        var hours = date.getHours();
        var status;
        //hours = 10; test
        if (hours > 8 && hours <= 10) status = '上班途中';
        else if (hours > 10 && hours <= 18) status = '上班！';
        else if (hours > 18 && hours <= 22) status = '下班！';
        else status = '没车啦！';
        console.log(hours, status);
        $$('.time-status').text(status);
    };
    var initBusStation = function () {
        $$.get(baseUrl + '/work', function (data) {
            if (data && data.toString() === 'none') return $('.index-bus-station').text('无');
            if (typeof data === 'string') data = JSON.parse(data);
            $$('.index-bus-station').text(data.CurrentStation);
            $$('.index-bus-distance').text(data.distance + '个站');
            $$('.index-bus-no').text(data.BusNumber)
        });
    };
    clock();
    initTimeStatus();
    initBusStation();
    setInterval(clock, 500);
    var stationClock = setInterval(initBusStation, 10000);
});
// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: true
});


myApp.init();
