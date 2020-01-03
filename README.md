# Habit league

A Quasar Framework app automatically deployed to https://habit-run.netlify.com

## Install the dependencies
```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
npm run lint
```

### Publishing to Google play store
You need to have Android studio installed and and then import the android app there (src-cordova/platforms/android).

1. In package.json bump the version number and then run:
```bash
npm run buildForPlayStore
```
2. Open Android studio (with the app still imported)
3. Build -> Generate signed build / APK
4. Choose "Android App Bundle"
5. Enter keystore details (alias and password)
6. Choose "release" as build variant
7. Locate the resulting file: `src-cordova/platforms/android/app/release/app.aab`
8. Log into google play store  console and create a release and upload the .aab file

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
