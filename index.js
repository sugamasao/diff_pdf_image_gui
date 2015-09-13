var path = require('path');
var glob = require('glob');
var child_process = require('child_process');

/** documentにドラッグされた場合 / ドロップされた場合 */
document.ondragover = document.ondrop = function(e) {
  e.preventDefault(); // イベントの伝搬を止めて、アプリケーションのHTMLとファイルが差し替わらないようにする
  return false;
}

var pdfHolder = document.getElementById('pdf-holder');
pdfHolder.ondragover = function (e) {
  e.dataTransfer.dropEffect = 'copy';
  return false;
}

/** hoverエリアから外れた or ドラッグが終了した */
pdfHolder.ondragleave = pdfHolder.ondragend = function (e) {
//  e.preventDefault(); // イベントの伝搬を止めて、アプリケーションのHTMLとファイルが差し替わらないようにする
//  e.originalEvent.dataTransfer.dropEffect = 'copy';
  return false;
}

/** hoverエリアにドロップされた */
pdfHolder.ondrop = function (e) {
  e.preventDefault(); // イベントの伝搬を止めて、アプリケーションのHTMLとファイルが差し替わらないようにする
  var files = e.dataTransfer.files;
  var pageNumberData = document.getElementById('page-numbers').value;
  var pageNumbers = parsePageNumbers(pageNumberData);
  if(!validateFiles(files)) {
    return false;
  }
  var div = document.getElementById("pdf-holder-announce");
  var text = "<p>ちょっとまってね</p><ul>";
  for(var i = 0; i < files.length; i++) {
    text += "<li>" + files[i].name + '</li>';
  }
  text += "</ul>";
  div.innerHTML = text;

  // TODO 非同期処理
  execCommand(showErorr, showResult, files, pageNumbers);
  var resultDirectory = findResultDirectory();
  showResult(resultDirectory);

  div.innerHTML = "<p>ここにドラッグしてね</p>"
  return false;
}

var showErorr = function(message) {
  alert(message);
}

var execCommand = function(err, success, files, pageNumbers) {
  var command = 'ruby ' + findExecuteScript() + ' ' + files[0].path + ' ' + files[1].path + ' ' + pageNumbers.join(' ');
  console.log("command:" + command);
  child_process.execSync(command);
}

var showResult = function(directory) {
  var files = collectFile(directory);
  var resultHolder = document.getElementById('result-holder');

  for(var i = 0; i < files.length; i++) {
//    var div = document.createElement('div');
//    div.className = "col-xs-12 col-md-1";
    var img = document.createElement('img');
    console.log(files[i]);
    img.width = '200';
//    img.height = '150';
    img.src = files[i];
//    div.appendChild(img);
    resultHolder.appendChild(img);
  }
}

var collectFile = function(directory) {

  return glob.sync(path.join(directory, '/*.png'), { nocase:true });
}

var findExecuteScript = function() {
  return path.join(__dirname, 'diff_pdf_image', 'diff_pdf_image.rb');
}

var findResultDirectory = function() {
  var command = "ls -Flt | egrep diff_images\.\*/ | head -1 | awk '{print $9}'"
  return path.join(__dirname, "" + child_process.execSync(command)).trim();
}

var validateFiles = function(files) {
  if(files.length != 2) { return false; }
  for(var i = 0; i < files.length; i++) {
    if(!files[i].type == "application/pdf") { return false }
  }
  return true;
}

var parsePageNumbers = function(pageNumberData) {
  return pageNumberData.split(' ').filter(function(val){
    return isFinite(val)
  })
}
