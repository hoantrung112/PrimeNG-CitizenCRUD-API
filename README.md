# Usage

PrimeNG Issue Template is an Angular CLI project used to provide a sample test case to demonstrate a defect to help PrimeNG Team.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Notes

In case of some errore getting the code up and runnning, you may want to try this command

```sh
ng update @angular-devkit/build-angular 
```

If the above command works, it is because your packages are in need of being updated to latest version.

In case of CORS-related issues, please download Google Chrome as browser for demonstration.
Open terminal and run the following command (Window) & navigate to `http://localhost:4200/` on newly opened Chrome window.

```sh
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --disable-web-security  --user-data-dir=~/chromeTemp
```