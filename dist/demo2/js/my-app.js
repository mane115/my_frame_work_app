// Let's register Template7 helper so we can pass json string in links
Template7.registerHelper('json_stringify', function (context) {
    return JSON.stringify(context);
});
var $$ = Dom7;
// Initialize your app
var myApp = new Framework7({
    animateNavBackIcon: true,
    // Enable templates auto precompilation
    precompileTemplates: true,
    // Enabled pages rendering using Template7
    template7Pages: true,
    // Specify Template7 data for pages
    init:false,
    preprocess: function (content, url, next) {
        var template = Template7.compile(content);
        var req = '';
        if (url === 'cars.html') {
            req = 'http://192.168.1.101:3001/test/test1.json';
        } else if (url === 'projects.html') {
            req = 'http://192.168.1.101:3001/test/test2.json';
        } else if (url === 'car.html') {
            req = 'http://192.168.1.101:3001/test/test1.json';
        } else if (url === 'contacts.html') {
            req = 'http://192.168.1.101:3001/test/test3.json';
        }
        $$.getJSON(req, function (data) {
            console.log(data);
            var resultContent = template(data);
            next(resultContent)
        });
    },
    template7Data: {
        // Will be applied for page with "projects.html" url
        'url:projects.html': {
            firstname: 'John',
            lastname: 'Doe',
            age: 32,
            position: 'CEO',
            company: 'Google',
            interests: ['swimming', 'music', 'JavaScript', 'iMac', 'iOS apps', 'sport'],
            projects: [
                {
                    title: 'Google',
                    description: 'Nice search engine'
                },
                {
                    title: 'YouTube',
                    description: 'Online video service'
                },
                {
                    title: 'Android',
                    description: 'Mobile operating system'
                }
            ]
        },

        // Will be applied for page with data-page="contacts"
        'page:contacts': {
            tel: '+1 (222) 333-44-55',
            email: 'john@doe.com',
            country: 'USA',
            city: 'San Francisco',
            zip: '12345',
            street: 'Awesome st'
        },
        // Another plain data object, used in "about" link in data-contextName object
        about: {
            name: 'John Doe',
            age: 32,
            position: 'CEO',
            company: 'Google',
            interests: ['swimming', 'music', 'JavaScript', 'iMac', 'iOS apps', 'sport']
        }
    }
});
myApp.onPageInit('index', function (page) {
    var date = new Date();
    date.setHours = 10;
    var clock = function () {
        var date = new Date();
        var time = date.toLocaleString();
        $$('.content-block-title a').text(time)
    };
    var initTimeStatus = function(){
        var hours = date.getHours();
        var status;
        //hours = 10; test
        if(hours>8 && hours<= 10) status ='上班途中';
        else if(hours>10 &&hours <=18) status = '上班！';
        else if(hours>18 &&hours<=22) status ='下班！';
        else status = '没车啦！';
        console.log(hours,status);
        $$('.time-status').text(status)
    };
    clock();
    initTimeStatus();
    setInterval(clock, 500);

});
// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: true
});


myApp.init();
