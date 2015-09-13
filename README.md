# diff_pdf_image_gui
diff_pdf_image_gui

## How To Build

### install npm

```shell
$ brew install node
```

### install electron and build tools

```shell
$ npm -g install electron-prebuilt
$ npm install -g asar
$ npm install -g electron-packager
```

### install npm modules

```shell
$ npm install
```

### development execute

```shell
$ electron .
```

### packaging

```shell
$ electron-packager . diff_pdf_image_gui --platform=darwin,win32 --arch=x64 --version=0.31.2 --out=build --ignore=diff_images_\*
```
