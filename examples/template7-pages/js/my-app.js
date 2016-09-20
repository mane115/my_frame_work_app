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
    preprocess: function (content, url, next) {
        if (url === 'cars.html') {
            myApp.alert('test');
            var template = Template7.compile(content);
            var renderData = [{
                vendor: 'Volkswagen',
                model: 'Passat',
                power: 152,
                speed: 280,
                weight: 1400,
                color: 'black',
                year: 2012,
                description: ''
            }, {
                vendor: 'Skoda',
                model: 'Superb',
                power: 152,
                peed: 260,
                weight: 1600,
                color: 'white',
                year: 2013,
                description: ''
            }, {
                vendor: 'Ford',
                model: 'Mustang',
                power: 480,
                speed: 320,
                weight: 1200,
                color: 'red',
                year: 2014,
                description: ''
            }];
            $$.get('http://192.168.1.101:3001/user', function (data) {
                console.log(data);
                renderData.push({
                    vendor: 'Skoda',
                    model: 'Superb',
                    power: 152,
                    peed: 260,
                    weight: 1600,
                    color: 'white',
                    year: 2013,
                    description: ''
                });
                var resultContent = template(renderData);
                next(resultContent)
            });
        }
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
var clock = function () {
    var date = new Date();
    var time = date.toLocaleString();
    $$('.content-block-title a').text(time)
};
clock();
setInterval(clock,500);
// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: true,
});
