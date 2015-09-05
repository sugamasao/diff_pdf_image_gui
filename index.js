
/** documentにドラッグされた場合 / ドロップされた場合 */
document.ondragover = document.ondrop = function(e) {
  e.preventDefault(); // イベントの伝搬を止めて、アプリケーションのHTMLとファイルが差し替わらないようにする
  return false;
}

var pdfHolder = document.getElementById('pdf-holder');
/** hoverエリアにドラッグされた場合 */
pdfHolder.ondragover = function (e) {
  return false;
}

/** hoverエリアから外れた or ドラッグが終了した */
pdfHolder.ondragleave = pdfHolder.ondragend = function () {
  return false;
}

/** hoverエリアにドロップされた */
pdfHolder.ondrop = function (e) {
  e.preventDefault(); // イベントの伝搬を止めて、アプリケーションのHTMLとファイルが差し替わらないようにする
  var files = e.dataTransfer.files;

  if(!validateFiles(files)) {
    return false;
  }
  e.target.innerHTML = "ちょっとまってね"
  execCommand(showErorr, showResult, files);

  var resultDirectory = findResultDirectory();
  showResult(resultDirectory);

  e.target.innerHTML = "ここにドラッグしてね"
  return false;
}

var showErorr = function(message) {
  alert(message);
}

var execCommand = function(err, success, files) {
  var exec = require('child_process').execSync;
  var command = 'ruby ' + findExecuteScript() + ' ' + files[0].path + ' ' + files[1].path;
  exec(command);
}

var showResult = function(directory) {
  var files = collectFile(directory);
  var resultHolder = document.getElementById('result-holder');

  for(var i = 0; i < files.length; i++) {
    var img = document.createElement('img');
    console.log(files[i]);
    img.src = files[i];
    resultHolder.appendChild(img);
  }
}

var collectFile = function(directory) {
  var path = require('path');
  var glob = require('glob');
  return glob.sync(path.join(directory, '/*.png'), { nocase:true });
}

var findExecuteScript = function() {
  return require('path').join(__dirname, 'diff_pdf_image.rb');
}

var findResultDirectory = function() {
  var exec = require('child_process').execSync;
  var path = require('path');
  var glob = require('glob');

  var command = "ls -Flt | egrep diff_images\.\*/ | head -1 | awk '{print $9}'"
  return require('path').join(__dirname, "" + exec(command)).trim();
}

var validateFiles = function(files) {
  var fs = require('fs');

  if(files.length != 2) { return false; }
  for(var i = 0; i < files.length; i++) {
    if(!files[i].type == "application/pdf") { return false }
  }
  return true;
}
