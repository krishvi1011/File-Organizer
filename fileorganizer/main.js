#!/usr/bin/env node
let inputArr = process.argv.slice(2);
let path = require("path");
let fs = require("fs");

let types = {
  media: ["mp4", "mkv"],
  archives: ["zip", "rar", "tar", "gz", "ar", "iso", "xz"],
  documents: [
    "docx",
    "doc",
    "pdf",
    "xlsx",
    "xls",
    "odt",
    "odp",
    "odg",
    "odf",
    "txt",
    "ps",
    "tex",
  ],
  app: ["exe", "dog", "pkg", "deb"],
};
//console.log(inputArr);
//node main.js tree "directoryPath"
//node main.js organize "directoryPath"
//node main.js help
//$ node main.js help
let command = inputArr[0];
switch (command) {
  case "tree":
    treeFn(inputArr[1]);
    break;
  case "organize":
    organizeFn(inputArr[1]);
    break;
  case "help":
    helpFn();
    break;
  default:
    console.log("🤷‍♂️Input right command");
    break;
}

function treeFn(dirPath) {
  //let destPath;
  if (dirPath == undefined) {
    treeHelper(process.cwd(), " ");
    return;
  } else {
    let doesExist = fs.existsSync(dirPath);
    if (doesExist) {
      treeHelper(dirPath);
    } else {
      console.log("enter the path");
      return;
    }
  }

  treeHelper(dirPath, destPath);

  //4. copy/cut files to that organized dir inside of any categorie folder
}

function treeHelper(dirPath, indent) {
  //is file or folder
  let isFile = fs.lstatSync(dirPath).isFile();
  if (isFile == true) {
    let filename = path.basename(dirPath);
    console.log(indent + "|---" + filename);
  } else {
    let dirname = path.basename(dirPath);
    console.log(indent + "---" + dirname);
    let childrens = fs.readdirSync(dirPath);
    for (let i = 0; i < childrens.length; i++) {
      let childPath = path.join(dirPath, childrens[i]);
      treeHelper(childPath, indent + "\t");
    }
  }
}

function organizeHelper(src, dest) {
  //3.identify categories of all the files present in dir
  let childname = fs.readdirSync(src);
  //console.log(childname);
  for (let i = 0; i < childname.length; i++) {
    let childaddress = path.join(src, childname[i]);
    let isFile = fs.lstatSync(childaddress).isFile();
    if (isFile) {
      // console.log(childname[i]);
      let category = getCategory(childname[i]);
      console.log(childname[i], "belongs to-->", category);

      //4. copy/cut files to that organized dir inside of any categorie folder
      sendFiles(childaddress, dest, category);
    }
  }
}

function organizeFn(dirPath) {
  //console.log("Organize command implemented for", dirPath);
  //1.input -> directory path given
  let destPath;
  if (dirPath == undefined) {
    destPath = process.cwd();
    return;
  } else {
    let doesExist = fs.existsSync(dirPath);
    if (doesExist) {
      destPath = path.join(dirPath, "organized_files");
      if (fs.existsSync(destPath) == false) {
        fs.mkdirSync(destPath);
        //2.create -> organized_files -> directory
      }
    } else {
      console.log("enter the path");
      return;
    }
  }

  organizeHelper(dirPath, destPath);

  //4. copy/cut files to that organized dir inside of any categorie folder
}

function organizeHelper(src, dest) {
  //3.identify categories of all the files present in dir
  let childname = fs.readdirSync(src);
  //console.log(childname);
  for (let i = 0; i < childname.length; i++) {
    let childaddress = path.join(src, childname[i]);
    let isFile = fs.lstatSync(childaddress).isFile();
    if (isFile) {
      // console.log(childname[i]);
      let category = getCategory(childname[i]);
      console.log(childname[i], "belongs to-->", category);

      //4. copy/cut files to that organized dir inside of any categorie folder
      sendFiles(childaddress, dest, category);
    }
  }
}

function sendFiles(srcFilePath, dest, category) {
  //
  let categorypath = path.join(dest, category);
  if (fs.existsSync(categorypath) == false) {
    fs.mkdirSync(categorypath);
  }
  let filename = path.basename(srcFilePath);
  let destFilePath = path.join(categorypath, filename);
  fs.copyFileSync(srcFilePath, destFilePath);
  fs.unlinkSync(srcFilePath);
  console.log(filename, "copied to----> ", category);
}

function getCategory(name) {
  let ext = path.extname(name);
  ext = ext.slice(1);
  for (let type in types) {
    let cTypeArray = types[type];
    for (let i = 0; i < cTypeArray.length; i++) {
      if (ext == cTypeArray[i]) {
        return type;
      }
    }
    return "others";
  }
}

function helpFn() {
  console.log(`
    All the commands are :
        tree : to get the structure
        organize : to organize the directory
        help : to get list of the commands
                `);
}
