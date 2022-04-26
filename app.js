var express = require("express");
var app = express();
var Fontmin = require("fontmin");
var fs = require("fs");
var bodyParser = require("body-parser");

app.use(bodyParser.json());

app.post("/getFontBase64", function(req, res) {
  const { logoFont, sloganFont, logo, slogan } = req.body
  if (logoFont && sloganFont && logo && slogan) {
    var logoFontPath = `fonts/${logoFont}`;
    var sloganFontPath = `fonts/${sloganFont}`;
    var destPath = 'build';    // 字体输出路径
    let logoBase64, sloganBase64;
    // 初始化
    var fontmin = new Fontmin()
        .src(logoFontPath)           
        .use(Fontmin.glyph({ 
            text: logo        
        }))
        .use(Fontmin.css({
          base64: true
        }))
        .dest(destPath);
    var fontmin2 = new Fontmin()
        .src(sloganFontPath)           
        .use(Fontmin.glyph({ 
            text: slogan        
        }))
        .use(Fontmin.css({
          base64: true
        }))
        .dest(destPath);
        
    // 执行
    fontmin.run(function (err, files, stream) {
      if (err) {                  // 异常捕捉
          console.error(err);
      }
      let data = fs.readFileSync(`build/${logoFont}`);
      logoBase64 = new Buffer(data).toString('base64');
      console.log('done');        // 成功
       // 执行
      fontmin2.run(function (err2, files2, stream2) {

        if (err2) {                  // 异常捕捉
            console.error(err2);
        }

        let data2 = fs.readFileSync(`build/${sloganFont}`);
        sloganBase64 = new Buffer(data2).toString('base64');
        console.log('done2');        // 成功
        if (logoBase64 && sloganBase64) {
          res.json({
            code: 0,
            data: {
              "logo": logoBase64,
              "slogan": sloganBase64
            }
          })
        } 
      });
    });   
  
    
  } else {
    res.json(
      {
        code: 1,
        msg: "参数错误"
      }
    )
  }
   
})

var server = app.listen(3400, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("访问地址 http://%s:%s", host, port);
})