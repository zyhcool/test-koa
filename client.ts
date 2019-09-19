var http = require('http');

var querystring = require('querystring');

var data = {
    id: 0,
};//这是需要提交的数据  


var content = querystring.stringify(data);

var options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/syncEvent?eventName=test',
    method: 'GET',
    data: content,
    type:"text",
};

for (let i = 0; i < 1; i++) {
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();
}